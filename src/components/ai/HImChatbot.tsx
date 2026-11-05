"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Globe2,
  ExternalLink,
} from "lucide-react";

export type LanguageCode = "en" | "or" | "hi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS: Record<LanguageCode, string[]> = {
  en: [
    "What scholarship schemes does Mahavir Trust offer?",
    "How does the 100% Direct-to-College disbursal work?",
    "What are the eligibility criteria for students?",
    "How can I volunteer or mentor students in Odisha?",
  ],
  or: [
    "ମହାବୀର ଟ୍ରଷ୍ଟ କେଉଁ ଛାତ୍ରବୃତ୍ତି ପ୍ରଦାନ କରେ?",
    "କଲେଜକୁ ସିଧାସଳଖ ଫିସ୍ ପ୍ରଦାନ ନିୟମ କ’ଣ?",
    "ଛାତ୍ରବୃତ୍ତି ପାଇଁ ଯୋଗ୍ୟତା ସର୍ତ୍ତ କ’ଣ?",
    "ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲାରେ ଏହି ସୁବିଧା ମିଳିବ କି?",
  ],
  hi: [
    "महावीर ट्रस्ट कौन-सी छात्रवृत्तियां प्रदान करता है?",
    "कॉलेज को सीधे फीस भुगतान की नीति क्या है?",
    "छात्रवृत्ति के लिए क्या पात्रता शर्तें हैं?",
    "क्या ओडिशा के सभी जिलों के छात्र आवेदन कर सकते हैं?",
  ],
};

const INITIAL_GREETINGS: Record<LanguageCode, string> = {
  en: "Hello! I am **HIm**, your Mahavir Trust Intelligent Assistant. I can guide you through our higher education tuition grants, the 100% direct-to-college disbursal standard, eligibility guidelines across all 30 districts of Odisha, and how to volunteer as a mentor. How may I assist you today?",
  or: "ନମସ୍କାର! ମୁଁ **HIm**, ମହାବୀର ଏଡ୍ୟୁକେସନାଲ ଆଣ୍ଡ ଚାରିଟେବୁଲ ଟ୍ରଷ୍ଟ (MECT) ର ଡିଜିଟାଲ୍ ସହାୟକ। ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲାର ମେଧାବୀ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଶିକ୍ଷାବୃତ୍ତି, କଲେଜକୁ ସିଧାସଳଖ ଫିସ୍ ପ୍ରଦାନ ନୀତି ଏବଂ ମେଣ୍ଟରସିପ୍ କାର୍ଯ୍ୟକ୍ରମ ସମ୍ପର୍କରେ ମୁଁ ଆପଣଙ୍କୁ ସହାୟତା କରିପାରିବି। ଆଜି ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିବି?",
  hi: "नमस्ते! मैं **HIm**, महावीर एजुकेशनल एंड चैरिटेबल ट्रस्ट (MECT) का डिजिटल सहायक हूं। मैं ओडिशा के सभी 30 जिलों के छात्रों के लिए उच्च शिक्षा अनुदान, सीधे कॉलेज फीस भुगतान नीति, पात्रता और मेंटरशिप के बारे में आपकी सहायता कर सकता हूं। आज मैं आपकी क्या सहायता कर सकता हूँ?",
};

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFormattedTime(): string {
  try {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function HImChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLang = sessionStorage.getItem("mect_him_lang") as LanguageCode | null;
        if (savedLang && ["en", "or", "hi"].includes(savedLang)) {
          return savedLang;
        }
      } catch {
        // ignore
      }
    }
    return "en";
  });

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("mect_him_chat_history");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content: INITIAL_GREETINGS.en,
        timestamp: "",
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamAccumulatorRef = useRef<string>("");

  // Sync state to sessionStorage
  const persistMessages = (msgs: Message[]) => {
    try {
      sessionStorage.setItem("mect_him_chat_history", JSON.stringify(msgs));
    } catch {
      // quota or blocked
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    try {
      sessionStorage.setItem("mect_him_lang", lang);
    } catch {
      // ignore
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Focus input on dialog open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const freshMessages: Message[] = [
      {
        id: generateId("welcome"),
        role: "assistant",
        content: INITIAL_GREETINGS[language],
        timestamp: getFormattedTime(),
      },
    ];
    setMessages(freshMessages);
    persistMessages(freshMessages);
    setIsLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput("");
    const userMessage: Message = {
      id: generateId("usr"),
      role: "user",
      content: query,
      timestamp: getFormattedTime(),
    };

    const updatedWithUser = [...messages, userMessage];
    const assistantId = generateId("ast");
    const initialAssistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: getFormattedTime(),
    };

    setMessages([...updatedWithUser, initialAssistantMsg]);
    setIsLoading(true);
    streamAccumulatorRef.current = "";

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedWithUser.map((m) => ({ role: m.role, content: m.content })),
          preferredLanguage: language,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                streamAccumulatorRef.current += parsed.text;
                const currentText = streamAccumulatorRef.current;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: currentText } : m
                  )
                );
              } else if (parsed.error) {
                streamAccumulatorRef.current += `\n\n*Notice: ${parsed.error}*`;
                const currentText = streamAccumulatorRef.current;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: currentText } : m
                  )
                );
              }
            } catch {
              // Non-JSON SSE payload
            }
          }
        }
      }

      // Persist finalized messages
      const finalAssistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: streamAccumulatorRef.current,
        timestamp: getFormattedTime(),
      };
      persistMessages([...updatedWithUser, finalAssistantMsg]);
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }
      console.error("[HIm Chat Client Error]:", err);
      const fallbackText =
        language === "or"
          ? "କ୍ଷମା କରିବେ, ଏହି ମୁହୂର୍ତ୍ତରେ ସର୍ଭର ସଂଯୋଗରେ ସମସ୍ୟା ହେଉଛି। ଦୟାକରି କିଛି ସମୟ ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ କିମ୍ବା contact@mahavirtrust.org ରେ ଯୋଗାଯୋଗ କରନ୍ତୁ।"
          : language === "hi"
          ? "क्षमा करें, सर्वर कनेक्शन में अस्थायी समस्या आ रही है। कृपया कुछ क्षण बाद पुनः प्रयास करें या contact@mahavirtrust.org पर संपर्क करें।"
          : "I apologize, but I am experiencing temporary connectivity difficulties. Please try again in a few moments or email the Secretariat at contact@mahavirtrust.org.";

      const errorAssistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: fallbackText,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? errorAssistantMsg : m))
      );
      persistMessages([...updatedWithUser, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          const formatText = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-semibold text-[#072617]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            });
          };

          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#C5A059] font-bold mt-1 text-xs">•</span>
                <span className="flex-1">{formatText(trimmed.slice(2))}</span>
              </div>
            );
          }

          const matchNum = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#C5A059] font-bold text-xs shrink-0 mt-0.5">
                  {matchNum[1]}.
                </span>
                <span className="flex-1">{formatText(matchNum[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{formatText(line)}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-22 right-5 xl:bottom-6 xl:right-6 z-50 print:hidden">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open HIm — Mahavir Trust AI Assistant"
            className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#072617] via-[#0B3B24] to-[#072617] text-[#E4C88A] border-2 border-[#C5A059] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]"
          >
            <span className="absolute inset-0 rounded-full bg-[#C5A059]/20 animate-ping pointer-events-none opacity-40" />

            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-[#E4C88A] group-hover:rotate-6 transition-transform" />
              <Sparkles className="w-3 h-3 text-[#C5A059] absolute -top-1 -right-1 animate-pulse" />
            </div>

            <span className="hidden lg:flex absolute right-16 px-3 py-1 bg-[#072617] text-[#E4C88A] border border-[#C5A059]/40 rounded-full text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none items-center gap-1.5">
              <span>Ask HIm</span>
              <span className="text-[10px] text-white/60 font-mono">(AI)</span>
            </span>
          </button>
        )}
      </div>

      {/* Chat dialog window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="HIm — Mahavir Trust Intelligent Assistant"
          aria-modal="true"
          className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[410px] md:w-[430px] z-50 h-[86vh] sm:h-[620px] max-h-[720px] flex flex-col bg-[#FDFBF7] border-2 border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden font-sans"
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-[#072617] via-[#0B3B24] to-[#072617] text-white px-4 py-3 border-b border-[#C5A059]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-[#0B3B24] border border-[#C5A059] flex items-center justify-center text-[#E4C88A] shrink-0 shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#072617]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-base text-[#E4C88A] tracking-wide">
                    HIm
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#C5A059]/20 text-[#E4C88A] rounded-xs font-mono font-medium">
                    MECT AI
                  </span>
                </div>
                <p className="text-[11px] text-white/70">
                  Mahavir Trust Institutional Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Clear and restart conversation"
                aria-label="Restart chat"
                className="p-1.5 text-white/70 hover:text-[#E4C88A] hover:bg-white/10 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize assistant"
                aria-label="Close chat window"
                className="p-1.5 text-white/70 hover:text-[#E4C88A] hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Language selector */}
          <div className="bg-[#072617]/95 px-4 py-1.5 border-b border-[#C5A059]/20 flex items-center justify-between text-xs text-white/80 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
              <Globe2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1">
              {(
                [
                  { code: "en", label: "English" },
                  { code: "or", label: "ଓଡ଼ିଆ" },
                  { code: "hi", label: "हिन्दी" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                    language === lang.code
                      ? "bg-[#C5A059] text-[#072617] font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#072617] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[84%] rounded-xl p-3 shadow-xs transition-colors ${
                    msg.role === "user"
                      ? "bg-[#072617] text-white rounded-br-xs border border-[#0B3B24]"
                      : "bg-[#F3EFE6] text-[#1C2421] rounded-bl-xs border border-[#C5A059]/30"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    msg.content ? (
                      renderFormattedContent(msg.content)
                    ) : (
                      <div className="flex items-center gap-1.5 py-1 text-xs text-[#072617]/70">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
                        <span>HIm is consulting MECT knowledge...</span>
                      </div>
                    )
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  )}

                  <div
                    className={`flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] ${
                      msg.role === "user"
                        ? "text-white/50 border-t border-white/10"
                        : "text-[#072617]/50 border-t border-[#C5A059]/20"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {msg.role === "assistant" && msg.content && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-[#072617]"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Copy
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#0B3B24] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Quick Starter Prompts */}
            {messages.length === 1 && (
              <div className="pt-2 pb-1 space-y-2 animate-in fade-in duration-300">
                <span className="text-[11px] font-semibold text-[#072617]/70 uppercase tracking-wider block">
                  Suggested Queries:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {STARTER_PROMPTS[language].map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs px-3 py-2 bg-white hover:bg-[#F3EFE6] text-[#072617] rounded-lg border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-2xs flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <footer className="p-3 bg-white border-t border-[#C5A059]/30 shrink-0 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={
                    language === "or"
                      ? "ଓଡ଼ିଆ, ଇଂରାଜୀ କିମ୍ବା ହିନ୍ଦୀରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ..."
                      : language === "hi"
                      ? "हिन्दी, अंग्रेजी या ओडिया में प्रश्न पूछें..."
                      : "Ask about scholarships, direct disbursals, eligibility..."
                  }
                  className="w-full resize-none max-h-24 px-3 py-2 text-xs sm:text-sm bg-[#FDFBF7] text-[#1C2421] placeholder:text-[#1C2421]/45 border border-[#C5A059]/40 rounded-xl focus:outline-none focus:border-[#072617] focus:ring-1 focus:ring-[#072617]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#072617] hover:bg-[#0B3B24] disabled:opacity-40 disabled:cursor-not-allowed text-[#E4C88A] border border-[#C5A059] flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 text-[#C5A059] animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Footer Micro-text */}
            <div className="flex items-center justify-between text-[10px] text-[#072617]/60 px-1 pt-0.5">
              <span>MECT AI • 100% Direct Disbursal Standard</span>
              <a
                href="/governance"
                className="underline hover:text-[#072617] flex items-center gap-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Charter</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
