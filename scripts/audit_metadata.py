import os
import glob
import re

def main():
    pages = glob.glob('src/app/**/page.tsx', recursive=True)
    results = []

    for p in sorted(pages):
        folder = os.path.dirname(p)
        layout = os.path.join(folder, 'layout.tsx')
        target = p
        content = ''
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'createPageMetadata' not in content and os.path.exists(layout):
            with open(layout, 'r', encoding='utf-8') as f:
                l_content = f.read()
                if 'createPageMetadata' in l_content:
                    target = layout
                    content = l_content

        title_m = re.search(r'title:\s*["\']([^"\']+)["\']', content)
        desc_m = re.search(r'description:\s*["\']([^"\']+)["\']', content)
        path_m = re.search(r'path:\s*["\']([^"\']+)["\']', content)

        title = title_m.group(1) if title_m else 'NO_TITLE'
        desc = desc_m.group(1) if desc_m else 'NO_DESC'
        path = path_m.group(1) if path_m else 'NO_PATH'

        results.append({
            'page': p,
            'target': target,
            'title': title,
            'title_len': len(title),
            'desc': desc,
            'desc_len': len(desc),
            'path': path
        })

    for r in results:
        t_flag = ' [TITLE > 60]' if r['title_len'] > 60 else ''
        d_flag = ' [DESC > 155]' if r['desc_len'] > 155 else ''
        print(f"{r['page']} -> title ({r['title_len']}{t_flag}): '{r['title']}' | desc ({r['desc_len']}{d_flag}): '{r['desc']}' | path: {r['path']}")

if __name__ == '__main__':
    main()
