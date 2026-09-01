// Bilingual (EN/SV) language switcher for the portfolio.
// Elements carry data-i18n keys; translations live in I18N below.
// Choice persists in localStorage; defaults to browser language if Swedish, else English.

const I18N = {
  // ---- NAV ----
  'nav.about': { en: 'About', sv: 'Om mig' },
  'nav.ventures': { en: 'Ventures', sv: 'Projekt' },
  'nav.experience': { en: 'Experience', sv: 'Erfarenhet' },
  'nav.blog': { en: 'Writing', sv: 'Skriver' },
  'nav.contact': { en: 'Contact', sv: 'Kontakt' },

  // ---- HERO ----
  'hero.badge': { en: '● Founder · Engineer · Jakarta → Busan → Uppsala', sv: '● Grundare · Ingenjör · Jakarta → Busan → Uppsala' },
  'hero.title': { en: 'AI Forward Deployed Engineer|with a |business mindset|. ', sv: 'Forward Deployed Engineer inom AI|med ett |affärsfokus|. ' },
  'hero.lede': {
    en: "I build end-to-end AI systems that run real businesses. My recruiting agency runs on a pipeline I built myself: resumes parsed and reformatted by LLMs, candidates scored for fit with explainable reasoning, and engagement automated over WhatsApp from application to client submission, without recruiter busywork.",
    sv: "Jag bygger AI-system från start till mål som driver riktiga företag. Min rekryteringsbyrå drivs på en pipeline jag byggt själv: CV:n tolkas och formateras om av LLM:ar, kandidater poängsätts med förklarbar matchningslogik, och uppföljning sker automatiskt via WhatsApp, från ansökan till klientleverans, utan onödigt rekrytargnäll."
  },
  'hero.cta1': { en: "What I'm building", sv: 'Vad jag bygger' },
  'hero.cta2': { en: 'Get in touch', sv: 'Ta kontakt' },

  // ---- ABOUT ----
  'about.h2': { en: 'Track record', sv: 'Meriter' },
  'stat1.label': { en: '10+ yrs', sv: '10+ år' },
  'stat1.sub': { en: 'across engineering, product & recruitment', sv: 'inom utveckling, produkt & rekrytering' },
  'stat2.label': { en: '$0 → 7 figs', sv: '$0 → 7 siffror' },
  'stat2.sub': { en: 'revenue scaled as founder', sv: 'omsättning skalad som grundare' },
  'stat3.label': { en: '10+', sv: '10+' },
  'stat3.sub': { en: 'core team members built & led', sv: 'kärngruppsmedlemmar byggda & ledda' },
  'stat4.label': { en: '27k+', sv: '27k+' },
  'stat4.sub': { en: 'followers across LinkedIn & WhatsApp channel', sv: 'följare på LinkedIn & WhatsApp-kanal' },

  'about.p1': {
    en: "I'm Primawan Satrio. I started as a full-stack engineer, spent six years in software and product management including leading a squad as a PM at Bukalapak, then crossed to the business side and never stopped shipping.",
    sv: "Jag är Primawan Satrio. Jag började som fullstackutvecklare, tillbringade sex år med mjukvara och produktledning inklusive att leda ett squad som PM på Bukalapak, korsade sedan över till affärssidan och har aldrig slutat bygga."
  },
  'about.p2': {
    en: "Today I run a group of five ventures spanning contingency recruiting, employer-of-record services, Japanese-language training, and AI products. The through-line: I embed where the technology meets the customer, deploy fast, and measure everything in revenue. That is how I work as a forward deployed engineer: the model is only half the job; adoption, economics, and trust are the other half.",
    sv: "Idag driver jag fem bolag som spänner över rekrytering på provision, employer-of-record-tjänster, japanskutbildning och AI-produkter. Den röda tråden: jag går dit där tekniken möter kunden, levererar snabbt och mäter allt i intäkt. Så arbetar jag som forward deployed engineer: modellen är bara hälften av jobbet; införande, ekonomi och förtroende är den andra halvan."
  },
  'about.p3': {
    en: "What I do is what Forward Deployed Engineering means at places like Palantir and OpenAI: sit with the customer, ship with the engineers, close with the sale. The AI stack I built runs my own recruiting teams today: parsing CVs, formatting client submissions, and engaging candidates automatically.",
    sv: "Det jag gör är vad Forward Deployed Engineering betyder hos bolag som Palantir och OpenAI: sitt med kunden, koda med ingenjörerna, avsluta med försäljningen. AI-stacken jag byggt driver idag mina egna rekryteringsteam: tolkar CV:n, formaterar kundleveranser och följer upp kandidater automatiskt."
  },
  'fact1.b': { en: 'Ex-unicorn PM', sv: 'Ex-PM på enhörning' },
  'fact1.s': { en: "Bukalapak, Indonesia's top e-commerce", sv: "Bukalapak, Indonesiens största e-handel" },
  'fact2.b': { en: 'Telkom University', sv: 'Telkom University' },
  'fact2.s': { en: 'Computer Science, AI thesis', sv: 'Datavetenskap, examensarbete i AI' },
  'fact3.b': { en: 'Languages', sv: 'Språk' },
  'fact3.s': { en: 'Indonesian · English · Swedish', sv: 'Indonesiska · Engelska · Svenska' },
  'fact4.b': { en: 'Based in', sv: 'Baserad i' },
  'fact4.s': { en: 'Uppsala, Sweden (remote worldwide)', sv: 'Uppsala, Sverige (distans globalt)' },

  // ---- VENTURES ----
  'ventures.h2': { en: 'Ventures & projects', sv: 'Bolag & projekt' },
  'card.sc.t': { en: 'Satrio Consulting ↗', sv: 'Satrio Consulting ↗' },
  'card.sc.p': {
    en: "Contingency talent search that scaled from zero to seven figures in USD, winning clients across Japan, Korea, Singapore, Australia, Malaysia, and Indonesia. Includes an employer-of-record service letting foreign companies hire Indonesian talent locally or remotely without setting up a legal entity.",
    sv: "Rekrytering på provision som skalats från noll till sju-siffrig omsättning i USD, med kunder i Japan, Korea, Singapore, Australien, Malaysia och Indonesien. Inkluderar employer-of-record-tjänst som låter utländska företag anställa indonesisk talang lokalt eller på distans utan eget bolag."
  },
  'card.fit.t': { en: 'Explainable Candidate Fit Scoring (in production) 📖', sv: 'Förklarbar kandidatmatchning (i produktion) 📖' },
  'card.fit.p': {
    en: "Scoring engine that weighs each candidate's resume against a job order across skills, language, seniority, tenure, and stability, then tells recruiters fit-or-not with the reasons behind every point. Built with fairness guardrails: age, name, gender, and nationality never touch the score.",
    sv: "Poängmotor som väger varje kandidats CV mot ett joborder utifrån kompetens, språk, senioritet, anställningstid och stabilitet, och ger rekrytören svar om matchning med motiven bakom varje poäng. Byggd med rättvise-spärrar: ålder, namn, kön och nationalitet påverkar aldrig poängen."
  },
  'card.cv.t': { en: 'AI Resume Intelligence (in production)', sv: 'AI CV-analys (i produktion)' },
  'card.cv.p': {
    en: "LLM pipeline inside my agency's job board that reads any candidate CV, extracts structured data, and reformats it into each client's exact submission template for recruiter review turning hours of per-placement document work into minutes.",
    sv: "LLM-pipeline i min byrås jobbplattform som läser valfri kandidat-CV, extraherar strukturerad data och formaterar om den till varje kunds exakta leveransmall för rekrytörens granskning, vilket gör timmar av dokumentarbete per placering till minuter."
  },
  'card.wa.t': { en: 'LLM Candidate Engagement (in production)', sv: 'LLM-kandidatuppföljning (i produktion)' },
  'card.wa.p': {
    en: "Automated candidate engagement over WhatsApp: reaching out, qualifying, and scheduling inside the placement pipeline so recruiters spend time closing, not chasing.",
    sv: "Automatiserad kandidatuppföljning via WhatsApp: ta kontakt, kvalificera och boka tid inne i placeringsflödet så rekrytären lägger tiden på att avsluta, inte leta."
  },
  'card.gce.t': { en: 'Global Career Expo 2026 ↗', sv: 'Global Career Expo 2026 ↗' },
  'card.gce.p': {
    en: "A job fair I built connecting foreign-owned companies in Jakarta with Indonesian talent, extending the community into real hiring.",
    sv: "En jobbmässa jag byggde som knyter samman utländska företag i Jakarta med indonesisk talang och gör gemenskapen till verklig anställning."
  },
  'card.ok.t': { en: 'Okoshi Japanese Education ↗', sv: 'Okoshi japanskundervisning ↗' },
  'card.ok.p': {
    en: "JLPT N3–N2 training program for fresh graduates and young professionals heading into the Japanese market.",
    sv: "JLPT N3–N2-utbildningsprogram för nyexaminerade och unga yrkesverksamma på väg in på den japanska marknaden."
  },

  // ---- EXPERIENCE ----
  'exp.h2': { en: 'Experience', sv: 'Erfarenhet' },
  'exp1.w': { en: '2023 – Present · Uppsala, Sweden (remote)', sv: '2023 – nu · Uppsala, Sverige (distans)' },
  'exp1.t': { en: 'Founder & Executive Director Satrio Consulting (5 ventures)', sv: 'Grundare & VD Satrio Consulting (5 bolag)' },
  'exp1.p': {
    en: "Set strategy across five ventures and ran day-to-day operations. Scaled revenue from zero to seven figures USD, grew a core team of 10+, built an 11k+ follower WhatsApp jobs channel and a 16k+ LinkedIn following, and closed clients in six countries.",
    sv: "Satte strategi för fem bolag och ledde den dagliga driften. Skalade omsättningen från noll till sju siffror i USD, byggde upp en kärngrupp på 10+, startade en WhatsApp-kanal med 11k+ följare och 16k+ följare på LinkedIn, samt vann kunder i sex länder."
  },
  'exp2.w': { en: '2019 – 2022 · Tokyo, Japan (remote)', sv: '2019 – 2022 · Tokyo, Japan (distans)' },
  'exp2.t': { en: 'Lead Career Advisor INBOUND TECHNOLOGY, Inc.', sv: 'Lead Career Advisor INBOUND TECHNOLOGY, Inc.' },
  'exp2.p': {
    en: "Full-cycle tech recruitment for non-Japanese software engineers, paid on placements. Set the firm record for fastest first placement, one month after joining, then placed three candidates in a single month worth over ¥5M in revenue.",
    sv: "Rekrytering av icke-japanska mjukvaruingenjörer i hela flödet, betald per placering. Satte företagets rekord för snabbaste första placering, en månad efter inträdet, ochplacerade därefter tre kandidater på en månad värt över ¥5 miljoner."
  },
  'exp3.w': { en: '2017 – 2019 · Jakarta, Indonesia', sv: '2017 – 2019 · Jakarta, Indonesien' },
  'exp3.t': { en: 'Product Manager Bukalapak', sv: 'Produktchef Bukalapak' },
  'exp3.p': {
    en: "Led BukaPengadaan, a B2B procurement platform, with a 20-person squad of engineers, designers, and analysts. Represented Bukalapak speaking on product management at events across Indonesia.",
    sv: "Ledde BukaPengadaan, en B2B-plattform för upphandling, med ett squad på 20 personer: utvecklare, designer och analytiker. Representerade Bukalapak som talare om produktledning på event runtom i Indonesien."
  },
  'exp4.w': { en: '2014 – 2016 · Bandung, Indonesia', sv: '2014 – 2016 · Bandung, Indonesien' },
  'exp4.t': { en: 'Software Engineer & Product Manager Labtek Indie', sv: 'Mjukvaruutvecklare & Produktchef Labtek Indie' },
  'exp4.p': {
    en: "Managed web development projects end-to-end, coded full-stack in React and Node.js, and closed new business onboarding a client worth ~200M IDR in the first six months. Introduced Scrum across concurrent projects. Handled ads and partnerships for media products including liputan6.com and vidio.com.",
    sv: "Drev webbutvecklingsprojekt från start till mål, kodade fullstack i React och Node.js samt vann ny affär med en kund värd ca 200M IDR under de första sex månaderna. Införde Scrum över parallella projekt. Ansvarade annonser och partnerskap för mediaprodukter som liputan6.com och vidio.com."
  },
  'exp5.w': { en: '2012 – 2015 · Jakarta–Bandung, Indonesia', sv: '2012 – 2015 · Jakarta–Bandung, Indonesien' },
  'exp5.t': { en: 'Software Engineer & Product Manager Various Startups', sv: 'Mjukvaruutvecklare & Produktchef diverse startups' },
  'exp5.p': {
    en: "Freelance and full-time roles at TMLEnergy, KMK Online, and Greeneration including founding my own startup.",
    sv: "Frilans- och fast anställning på TMLEnergy, KMK Online och Greeneration, inklusive att grunda min egen startup."
  },

  // ---- BLOG ----
  'blog.h2': { en: 'Writing', sv: 'Skriver' },
  'blog1.p': {
    en: "How my agency runs on AI I built myself: LLM resume parsing, explainable fit scoring with fairness guardrails, and the schema trick that keeps prompts and templates in sync. With diagrams and the research papers behind the design choices.",
    sv: "Hur min byrå drivs på AI jag byggt själv: LLM-tolkning av CV:n, förklarbar matchningspoäng med rättvisespärrar och schema-tricket som håller prompts och mallar i synk. Med diagram och forskningsartiklarna bakom designvalen."
  },
  'blog2.p': {
    en: "The CSV importer behind our candidate database migration: an RFC 4180 parser that survives real-world exports, bilingual column mapping, and a dry-run preview that classifies every row before anything is written.",
    sv: "CSV-importören bakom vår kandidatdatabasmigrering: en RFC 4180-parser som överlever verkliga exporter, tvåspråkig kolumnmappning och en förhandsgranskning som klassar varje rad innan något skrivs."
  },

  'blog3.p': {
    en: "Production monitoring for zero dollars: tagged structured logs, a Discord Monitoring channel, privacy-sampled funnel metrics, and a 15-minute cron smoke check that catches failures before candidates do.",
    sv: "Produktionsövervakning för noll kronor: taggade strukturerade loggar, en Discord Monitoring-kanal, integritetsbevakade trattmätvärden och ett röktest på cron var femtonde minut som fångar fel innan kandidaterna gör det."
  },

  // ---- SPEAKING ----
  'spk.h2': { en: 'Speaking & mentoring', sv: 'Föreläsningar & mentorskap' },
  'spk1': { en: '"Indonesia\'s Global Talent: Why Diaspora Matters" (2025)', sv: '"Indonesiens globala talang: Varför diaspora spelar roll" (2025)' },
  'spk2': { en: "Guest lecturer at UMN & Telkom University on in-demand ICT skills; Design Thinking mentor at Telkom's Business Faculty", sv: "Gästföreläsare på UMN & Telkom University om eftertraktade ICT-kunskaper; Design Thinking-mentor på Telkoms handelshögskola" },
  'spk3': { en: 'Startup Weekend Bandung pitch coach; Design Thinking facilitator at 1000 Startup workshops (Jogjakarta, Bali, Makassar)', sv: 'Pitchcoach på Startup Weekend Bandung; Design Thinking-facilitator på 1000 Startup-workshops (Jogjakarta, Bali, Makassar)' },
  'spk4': { en: 'Project-management trainer for NGO regional leaders and student ambassadors', sv: 'Utbildare i projektledning för NGO:s regionala ledare och studentambassadörer' }
};

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    const entry = I18N[el.dataset.i18n];
    if (!entry || !entry[lang]) return;
    const v = entry[lang];
    if (el.dataset.i18n === 'hero.title') {
      // format: text before first |, then <em> wrapped part between pipes
      const parts = v.split('|');
      el.innerHTML = parts[0] + '<br>' + parts[1] + '<em>' + parts[2] + '</em>' + parts[3];
    } else if (el.dataset.i18nHtml !== undefined) {
      el.innerHTML = v;
    } else {
      el.textContent = v;
    }
  });
  document.documentElement.lang = lang === 'sv' ? 'sv' : 'en';
  try { localStorage.setItem('lang', lang); } catch(e) {}
}

function initLang() {
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  applyLang(lang);
}

document.addEventListener('DOMContentLoaded', function(){
  initLang();
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', function(){
    const cur = document.documentElement.lang === 'sv' ? 'sv' : 'en';
    applyLang(cur === 'sv' ? 'en' : 'sv');
  });
});
