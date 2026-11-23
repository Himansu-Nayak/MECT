import os
import re
import json
import subprocess
import sys

def scan_forbidden_strings():
    forbidden_terms = [
        'MAHAVIR TRUST',
        'pre-launch',
        'Odisha Educational Foundation',
        'secure online checkout',
        '80G Tax Exemption',
        'fiduciary',
        'hunger-relief',
        'pillars',
        'Loading unified',
        '+91 671',
        '[Permanent Physical Address'
    ]
    results = {term: [] for term in forbidden_terms}
    term_counts = {term: 0 for term in forbidden_terms}

    for root, dirs, files in os.walk('src'):
        if any(ignored in root for ignored in ['node_modules', '.next']):
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css')):
                p = os.path.join(root, file)
                try:
                    with open(p, 'r', encoding='utf-8') as f:
                        txt = f.read()
                        for term in forbidden_terms:
                            matches = list(re.finditer(re.escape(term), txt, re.IGNORECASE))
                            if matches:
                                results[term].append({
                                    'file': p.replace('\\', '/'),
                                    'count': len(matches)
                                })
                                term_counts[term] += len(matches)
                except Exception:
                    pass

    return results, term_counts

def crawl_links_and_anchors():
    known_routes = set()
    page_ids = {}

    for root, dirs, files in os.walk('src/app'):
        for f in files:
            if f in ['page.tsx', 'page.jsx']:
                rel = os.path.relpath(root, 'src/app').replace('\\', '/')
                route = '/' if rel == '.' else '/' + rel
                known_routes.add(route)
                
                p = os.path.join(root, f)
                try:
                    with open(p, 'r', encoding='utf-8') as fp:
                        txt = fp.read()
                        # Match literal id="..." and id='...'
                        ids = set(re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', txt))
                        # Match id: "..." in objects defined in the page (e.g. PROGRAMMES_DATA, FAQ sections)
                        obj_ids = set(re.findall(r'\bid:\s*["\']([a-zA-Z0-9_\-]+)["\']', txt))
                        page_ids[route] = ids | obj_ids
                except Exception:
                    pass

    component_ids = set()
    for root, dirs, files in os.walk('src/components'):
        for f in files:
            if f.endswith(('.tsx', '.jsx')):
                p = os.path.join(root, f)
                try:
                    with open(p, 'r', encoding='utf-8') as fp:
                        txt = fp.read()
                        ids = set(re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', txt))
                        obj_ids = set(re.findall(r'\bid:\s*["\']([a-zA-Z0-9_\-]+)["\']', txt))
                        component_ids.update(ids | obj_ids)
                except Exception:
                    pass

    all_hrefs = []
    for root, dirs, files in os.walk('src'):
        if any(ignored in root for ignored in ['node_modules', '.next']):
            continue
        for f in files:
            if f.endswith(('.tsx', '.jsx', '.ts')):
                p = os.path.join(root, f)
                try:
                    with open(p, 'r', encoding='utf-8') as fp:
                        txt = fp.read()
                        hrefs = re.findall(r'href=["\']([^"\'\s>]+)["\']', txt)
                        for h in hrefs:
                            all_hrefs.append((h, p.replace('\\', '/')))
                except Exception:
                    pass

    broken_links = []
    broken_anchors = []
    dead_links = []

    for h, f in all_hrefs:
        if h in ['#', '']:
            dead_links.append({'href': h, 'file': f})
        elif h.startswith('/'):
            parts = h.split('#', 1)
            r = parts[0]
            anchor = parts[1] if len(parts) > 1 else None
            r_clean = r.split('?', 1)[0]
            
            # Whitelist public assets, dynamic routes, and report docs
            is_static_file = os.path.exists(os.path.join('public', r_clean.lstrip('/')))
            if r_clean != '' and r_clean not in known_routes and not is_static_file and not r_clean.startswith('/images') and not r_clean.startswith('/api') and not r_clean.startswith('/reports/'):
                broken_links.append({'href': h, 'file': f, 'clean_route': r_clean})
            
            if anchor:
                target_route = r_clean if r_clean != '' else '/'
                target_ids = page_ids.get(target_route, set()) | component_ids
                if anchor not in target_ids:
                    broken_anchors.append({'href': h, 'file': f, 'anchor': anchor, 'target_route': target_route})
        elif h.startswith('#'):
            anchor = h[1:]
            # Check if this anchor exists in component_ids or any page
            all_known_ids = set().union(*page_ids.values(), component_ids)
            if anchor not in all_known_ids:
                broken_anchors.append({'href': h, 'file': f, 'anchor': anchor, 'target_route': 'local'})

    return {
        'total_hrefs': len(all_hrefs),
        'known_routes_count': len(known_routes),
        'broken_links': broken_links,
        'broken_anchors': broken_anchors,
        'dead_links': dead_links
    }

def run_typecheck():
    print("[AUDIT] Running typecheck (tsc --noEmit)...")
    res = subprocess.run(["npx", "tsc", "--noEmit"], capture_output=True, text=True, shell=True)
    return {
        'exit_code': res.returncode,
        'error_count': res.stdout.count('error TS') + res.stderr.count('error TS'),
        'output': res.stdout[:2000] if res.returncode != 0 else 'Clean typecheck'
    }

def run_lint():
    print("[AUDIT] Running linter (npm run lint)...")
    res = subprocess.run(["npm", "run", "lint"], capture_output=True, text=True, shell=True)
    return {
        'exit_code': res.returncode,
        'output': res.stdout[:2000] if res.returncode != 0 else 'Clean lint'
    }

def main():
    loop_num = sys.argv[1] if len(sys.argv) > 1 else "1"
    print(f"=== Starting Audit for Loop {loop_num} ===")
    
    # 1. Forbidden strings
    forbidden_results, forbidden_counts = scan_forbidden_strings()
    
    # 2. Links & anchors
    crawl_results = crawl_links_and_anchors()
    
    # 3. Typecheck
    typecheck_results = run_typecheck()
    
    # 4. Lint
    lint_results = run_lint()
    
    total_forbidden = sum(forbidden_counts.values())
    
    audit_data = {
        'loop': int(loop_num),
        'timestamp': subprocess.run(['powershell', '-Command', 'Get-Date -Format o'], capture_output=True, text=True).stdout.strip(),
        'forbidden_strings': {
            'total_occurrences': total_forbidden,
            'counts': forbidden_counts,
            'details': {k: v for k, v in forbidden_results.items() if v}
        },
        'links_and_anchors': {
            'total_hrefs': crawl_results['total_hrefs'],
            'broken_links_count': len(crawl_results['broken_links']),
            'broken_links': crawl_results['broken_links'],
            'broken_anchors_count': len(crawl_results['broken_anchors']),
            'broken_anchors': crawl_results['broken_anchors'],
            'dead_links_count': len(crawl_results['dead_links']),
            'dead_links': crawl_results['dead_links']
        },
        'typecheck': typecheck_results,
        'lint': lint_results,
        'summary': {
            'broken_links': len(crawl_results['broken_links']),
            'broken_anchors': len(crawl_results['broken_anchors']),
            'forbidden_strings': total_forbidden,
            'typecheck_clean': typecheck_results['exit_code'] == 0,
            'lint_clean': lint_results['exit_code'] == 0
        }
    }
    
    out_file = f"audit/loop-{loop_num}.json"
    os.makedirs('audit', exist_ok=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(audit_data, f, indent=2)
        
    print(f"\n=== Audit Loop {loop_num} Completed ===")
    print(f"Saved report to {out_file}")
    print(f"Summary:")
    print(f"  Broken Links: {len(crawl_results['broken_links'])}")
    print(f"  Broken Anchors: {len(crawl_results['broken_anchors'])}")
    print(f"  Forbidden Strings: {total_forbidden}")
    print(f"  Typecheck Errors: {typecheck_results['error_count']}")
    print(f"  Lint Clean: {lint_results['exit_code'] == 0}")

if __name__ == '__main__':
    main()
