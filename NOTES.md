# Portfolio working copy

IMPORTANT: The portfolio repo working copy is at /tmp/preemz-fresh (NOT /tmp/preemz.github.io — that one's .git got wiped and is unusable; stale files remain there).
All git operations for preemz.github.io: cd /tmp/preemz-fresh

Site structure as of 2026-08-25:
- index.html (EN/SV via i18n.js, toggle button)
- Sections: about, ventures, experience, blog (Writing — 3 post cards), speaking
- Blog posts (each with own i18n js file + SV toggle):
  - blog-ai-recruiting-pipeline.html (blog-i18n.js)
  - blog-csv-candidate-import.html (csv-import-i18n.js)
  - blog-workers-observability.html (obs-i18n.js)
- robots.txt, sitemap.xml (4 URLs)

i18n pattern learned: each blog post has its own I18N dict + DOMContentLoaded handler in its own js file. Never regenerate these files wholesale — extend them (a rewrite once dropped the handler and broke the toggle; another bug shifted tags by one position).
All i18n keys must exist in the js dict; verify with a key-extraction check before pushing.
