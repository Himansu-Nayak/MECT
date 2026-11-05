"""
MAHAVIR TRUST — HIm Model Fine-Tuning Script
Base Model: Qwen/Qwen2.5-3B-Instruct
Target Hardware: Free Google Colab / Kaggle GPU (1x NVIDIA Tesla T4 15GB VRAM)
Framework: Unsloth (Optimized QLoRA 4-bit) + Hugging Face TRL + GGUF Exporter

Output: qwen2.5-3b-mect-q4_k_m.gguf (~1.9 GB) ready for Hostinger KVM 4 VPS CPU deployment.
"""

import os
import torch

def main():
    print("==================================================================")
    print("MAHAVIR TRUST (MECT) — HIm Qwen2.5-3B-Instruct Fine-Tuning Engine")
    print("==================================================================")

    # 1. Check GPU Availability
    if not torch.cuda.is_available():
        raise SystemError("CUDA GPU is required for training! In Google Colab, select Runtime > Change runtime type > T4 GPU.")

    gpu_name = torch.cuda.get_device_name(0)
    gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    print(f"Detected GPU: {gpu_name} ({gpu_memory:.1f} GB VRAM)")

    # 2. Install dependencies if not already present
    print("\n[Step 1/6] Verifying Unsloth & PEFT dependencies...")
    from unsloth import FastLanguageModel
    from unsloth.chat_templates import get_chat_template
    from trl import SFTTrainer
    from transformers import TrainingArguments
    from datasets import load_dataset

    # 3. Model Configuration
    max_seq_length = 2048
    dtype = None # Auto detection (Float16 / Bfloat16)
    load_in_4bit = True

    model_name = "unsloth/Qwen2.5-3B-Instruct-bnb-4bit"
    print(f"\n[Step 2/6] Loading 4-bit pre-quantized base model: {model_name}...")

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        dtype=dtype,
        load_in_4bit=load_in_4bit,
    )

    # 4. Attach QLoRA Adapters
    print("\n[Step 3/6] Attaching QLoRA adapters (r=16, alpha=16)...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha=16,
        lora_dropout=0,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
        use_rslora=False,
        loftq_config=None,
    )

    # Apply Qwen-2.5 ChatML chat template
    tokenizer = get_chat_template(
        tokenizer,
        chat_template="qwen-2.5",
        mapping={"role": "role", "content": "content", "user": "user", "assistant": "assistant"},
    )

    def formatting_prompts_func(examples):
        convos = examples["messages"]
        texts = [tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False) for convo in convos]
        return {"text": texts}

    # 5. Load MECT Dataset
    print("\n[Step 4/6] Loading MECT institutional fine-tuning datasets...")
    train_path = "data/mect_him_train.jsonl"
    val_path = "data/mect_him_val.jsonl"

    if not os.path.exists(train_path):
        raise FileNotFoundError(f"Missing {train_path}. Please place mect_him_train.jsonl in the data/ folder.")

    dataset_train = load_dataset("json", data_files={"train": train_path})["train"]
    dataset_train = dataset_train.map(formatting_prompts_func, batched=True)

    dataset_val = None
    if os.path.exists(val_path):
        dataset_val = load_dataset("json", data_files={"val": val_path})["val"]
        dataset_val = dataset_val.map(formatting_prompts_func, batched=True)

    print(f"Loaded {len(dataset_train)} training instruction pairs.")
    if dataset_val:
        print(f"Loaded {len(dataset_val)} validation pairs.")

    # 6. SFT Trainer Setup
    print("\n[Step 5/6] Starting QLoRA fine-tuning...")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset_train,
        eval_dataset=dataset_val,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        dataset_num_proc=2,
        packing=False,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=10,
            max_steps=120, # ~2-3 epochs over 960 samples
            learning_rate=2e-4,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=10,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="cosine",
            seed=42,
            output_dir="outputs",
            report_to="none",
        ),
    )

    trainer_stats = trainer.train()
    print(f"\nTraining completed! Loss: {trainer_stats.training_loss:.4f}")

    # 7. Verification Generation (Trilingual Test)
    print("\n[Step 6/6] Verifying fine-tuned model inference...")
    FastLanguageModel.for_inference(model)

    test_queries = [
        {"lang": "English", "query": "Can a student from Koraput receive scholarship money in cash?"},
        {"lang": "Odia", "query": "ନମସ୍କାର, ମହାବୀର ଟ୍ରଷ୍ଟ କଲେଜ ଫିସ୍ କିପରି ପ୍ରଦାନ କରେ?"},
        {"lang": "Hindi", "query": "नमस्ते, क्या मुझे छात्रवृत्ति का पैसा सीधे मेरे बैंक खाते में मिल सकता है?"}
    ]

    for item in test_queries:
        messages = [
            {"role": "system", "content": "You are HIm, official digital assistant of Mahavir Trust (MECT)."},
            {"role": "user", "content": item["query"]}
        ]
        inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to("cuda")
        outputs = model.generate(input_ids=inputs, max_new_tokens=150, use_cache=True, temperature=0.3)
        response = tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)
        print(f"\n[{item['lang']}] Query: {item['query']}")
        print(f"[{item['lang']}] Output: {response.strip()}")

    # 8. Export to GGUF (Q4_K_M)
    output_gguf_name = "qwen2.5-3b-mect-q4_k_m.gguf"
    print(f"\nExporting fine-tuned model to GGUF format: {output_gguf_name}...")
    model.save_pretrained_gguf("mect_him_qwen2.5_3b", tokenizer, quantization_method="q4_k_m")

    print("\n==================================================================")
    print(f"SUCCESS: Model saved as GGUF Q4_K_M!")
    print(f"Location: mect_him_qwen2.5_3b/{output_gguf_name}")
    print("Download this file and deploy to Hostinger VPS: /opt/mect-ai-engine/models/")
    print("==================================================================")

if __name__ == "__main__":
    main()

