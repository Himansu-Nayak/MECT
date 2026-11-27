import os
import re

controller_dir = "backend/src/main/java/org/mahavirtrust/backend/controller"
controllers = [os.path.join(controller_dir, f) for f in os.listdir(controller_dir) if f.endswith(".java")]

endpoints = []

for cpath in controllers:
    cname = os.path.basename(cpath)
    with open(cpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Class level RequestMapping
    class_rm_match = re.search(r'@RequestMapping\((?:value\s*=\s*)?\{?([^)]+)\}?\)', content)
    base_paths = [""]
    if class_rm_match:
        raw_base = class_rm_match.group(1).replace('"', '').replace(' ', '')
        base_paths = [b.strip() for b in raw_base.split(',')]
    
    # Methods
    method_pattern = re.compile(r'(@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping|RequestMapping)\((?:value\s*=\s*)?\{?([^)]*)\}?\))\s*(public[^{]+)\{', re.MULTILINE)
    for m in method_pattern.finditer(content):
        anno_full = m.group(1)
        http_method = m.group(2)
        raw_m_path = m.group(3).replace('"', '').replace(' ', '') if m.group(3) else ""
        method_sig = m.group(4).strip()
        
        m_paths = [p.strip() for p in raw_m_path.split(',')] if raw_m_path else [""]
        if http_method == "RequestMapping":
            # check method param
            if "POST" in anno_full: http_method = "POST"
            elif "GET" in anno_full: http_method = "GET"
            elif "PUT" in anno_full: http_method = "PUT"
            elif "DELETE" in anno_full: http_method = "DELETE"
        
        for bp in base_paths:
            for mp in m_paths:
                full_route = f"/api/v1{bp}{mp}".replace("//", "/")
                endpoints.append({
                    "controller": cname,
                    "method": http_method.replace("Mapping", ""),
                    "route": full_route,
                    "signature": method_sig.split("\n")[-1]
                })

print(f"Total Controller Endpoints Discovered: {len(endpoints)}")
for ep in endpoints:
    print(f"{ep['method']:<7} {ep['route']:<55} | {ep['controller']}")
