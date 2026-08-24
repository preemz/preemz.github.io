// Blog bilingual switcher (EN/SV).
const BLOG_I18N = {
  'b.back': { en: '\u2190 primawan.github.io', sv: '\u2190 primawan.github.io' },
  'b.title': {
    en: 'An End-to-End AI Recruiting Pipeline in Production',
    sv: 'En AI-driven rekryteringspipeline i produktion, från start till mål'
  },
  'b.meta': { en: 'Primawan Satrio · August 2026 · ~10 min read', sv: 'Primawan Satrio · augusti 2026 · ca 10 min läsning' },
  'b.p1': {
    en: "Most AI demos die in the demo. The interesting question is not <em>can a model do this once</em>, but <em>can it run inside a live business every day, without a human babysitting every step</em>. I run a headhunting agency across the Indonesia\u2013Japan corridor, and instead of bolting AI onto the side, I rebuilt our recruiting pipeline around it: parsing resumes, scoring candidate fit, reformatting CVs into client templates, and engaging candidates automatically.",
    sv: "De flesta AI-demonstrationer dör i demonstrationsstadiet. Den intressanta fr\u00e5gan \u00e4r inte om <em>en modell kan g\u00f6ra detta en g\u00e5ng</em>, utan om <em>den kan k\u00f6ras inuti ett levande f\u00f6retag varje dag, utan att en m\u00e4nniska \u00f6vervakar varje steg</em>. Jag driver en rekryteringsbyr\u00e5 mellan Indonesien och Japan, och ist\u00e4llet f\u00f6r att skruva fast AI p\u00e5 sidan om byggde jag om v\u00e5r rekryteringspipeline runt den: tolka CV:n, po\u00e4ngs\u00e4tta kandidatmatchning, formatera om CV:n till klientmallar och f\u00f6lja upp kandidater automatiskt."
  },
  'b.p2': {
    en: "This post explains how the pipeline works, why each stage is designed the way it is, and what I learned deploying LLMs where mistakes cost real placements. It runs on Cloudflare Workers with D1 for data and R2 for document storage, with no origin server anywhere.",
    sv: "Detta inl\u00e4gg f\u00f6rklarar hur pipelinen fungerar, varf\u00f6r varje steg \u00e4r designat som det \u00e4r och vad jag l\u00e4rde mig av att drifts\u00e4tta LLM:ar d\u00e4r misstag kostar riktiga placeringar. Det k\u00f6rs p\u00e5 Cloudflare Workers med D1 f\u00f6r data och R2 f\u00f6r dokumentlagring, helt utan egen server."
  },
  'b.h2a': { en: 'The pipeline at a glance', sv: 'Pipelinen i korthet' },
  'b.p3': {
    en: "A candidate's journey through our system touches four AI-assisted stages before a recruiter ever picks up the phone:",
    sv: "En kandidats resa genom v\u00e5rt system passerar fyra AI-assisterade steg innan en rekryt\u00e6r n\u00e5gonsin plockar upp telefonen:"
  },
  'b.fig1': { en: 'Figure 1. The production pipeline. Stages 2 and 4 are fully automated; stage 3 is deliberately human.', sv: 'Figur 1. Produktionspipelinen. Steg 2 och 4 \u00e4r helt automatiserade; steg 3 \u00e4r medvetet m\u00e4nskligt.' },
  'b.h2b': { en: 'Stage 1: Reading any resume reliably', sv: 'Steg 1: Att l\u00e4sa valfri CV p\u00e5litligt' }
};

document.addEventListener('DOMContentLoaded', function(){
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  const btn = document.getElementById('lang-toggle');
  function apply(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const e = BLOG_I18N[el.dataset.i18n];
      if (e && e[l]) el.innerHTML = e[l];   // blog strings may contain <em>/<strong>
    });
    document.documentElement.lang = l;
    try { localStorage.setItem('lang', l); } catch(err){}
    if (btn) btn.textContent = (l === 'sv') ? 'EN' : 'SV';
  }
  apply(lang);
  if (btn) btn.addEventListener('click', function(){
    apply(document.documentElement.lang === 'sv' ? 'en' : 'sv');
  });
});
