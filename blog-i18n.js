// Blog bilingual switcher (EN/SV). Full coverage.
const BLOG_I18N = {
  'b.back': { en: '\u2190 primawan.github.io', sv: '\u2190 primawan.github.io' },
  'b.title': {
    en: 'An End-to-End AI Recruiting Pipeline in Production',
    sv: 'En AI-driven rekryteringspipeline i produktion, från start till mål'
  },
  'b.meta': { en: 'Primawan Satrio · August 2026 · ~10 min read', sv: 'Primawan Satrio · augusti 2026 · ca 10 min läsning' },
  'b.p1': {
    en: "Most AI demos die in the demo. The interesting question is not <em>can a model do this once</em>, but <em>can it run inside a live business every day, without a human babysitting every step</em>. I run a headhunting agency across the Indonesia\u2013Japan corridor, and instead of bolting AI onto the side, I rebuilt our recruiting pipeline around it: parsing resumes, scoring candidate fit, reformatting CVs into client templates, and engaging candidates automatically.",
    sv: "De flesta AI-demonstrationer dör i demonstrationsstadiet. Den intressanta frågan är inte om <em>en modell kan göra detta en gång</em>, utan om <em>den kan köras inuti ett levande företag varje dag, utan att en människa övervakar varje steg</em>. Jag driver en rekryteringsbyrå mellan Indonesien och Japan, och istället för att skruva fast AI på sidan om byggde jag om vår rekryteringspipeline runt den: tolka CV:n, poängsätta kandidatmatchning, formatera om CV:n till klientmallar och följa upp kandidater automatiskt."
  },
  'b.p2': {
    en: "This post explains how the pipeline works, why each stage is designed the way it is, and what I learned deploying LLMs where mistakes cost real placements. It runs on Cloudflare Workers with D1 for data and R2 for document storage, with no origin server anywhere.",
    sv: "Detta inlägg förklarar hur pipelinen fungerar, varför varje steg är designat som det är och vad jag lärde mig av att driftsätta LLM:ar där misstag kostar riktiga placeringar. Det körs på Cloudflare Workers med D1 för data och R2 för dokumentlagring, helt utan egen server."
  },
  'b.h2a': { en: 'The pipeline at a glance', sv: 'Pipelinen i korthet' },
  'b.p3': {
    en: "A candidate's journey through our system touches four AI-assisted stages before a recruiter ever picks up the phone:",
    sv: "En kandidats resa genom vårt system passerar fyra AI-assisterade steg innan en rekrytör någonsin plockar upp telefonen:"
  },
  'b.fig1': {
    en: 'Figure 1. The production pipeline. Stages 2 and 4 are fully automated; stage 3 is deliberately human.',
    sv: 'Figur 1. Produktionspipelinen. Steg 2 och 4 är helt automatiserade; steg 3 är medvetet mänskligt.'
  },

  // ---- Stage 1 ----
  'b.h2b': { en: 'Stage 1: Reading any resume reliably', sv: 'Steg 1: Att läsa valfri CV pålitligt' },
  'b.s1.p1': {
    en: "Resumes arrive as PDF or DOCX in any layout, half of them from Indonesian candidates mixing Bahasa and English. Before an LLM sees anything, deterministic code extracts plain text and mines structure with rules tuned to real-world messiness:",
    sv: "CV:n kommer in som PDF eller DOCX i alla tänkbara layouter, varannan från indonesiska kandidater som blandar bahasa och engelska. Innan en LLM ser något extraherar deterministisk kod ren text och plockar ut struktur med regler anpassade för verklighetens röriga format:"
  },
  'b.s1.l1': {
    en: "<strong>Tenor parsing.</strong> Employment date ranges like <code>Jan 2020 \u2013 Present</code>, <code>2021\u20132023</code>, or <code>s/d sekarang</code> are extracted to compute tenure months per role, which later feeds both stability scoring and seniority inference.",
    sv: "<strong>Anställningstid.</strong> Datumintervall som <code>Jan 2020 \u2013 nu</code>, <code>2021\u20132023</code> eller <code>s/d sekarang</code> extraheras för att räkna ut månader per tjänst, vilket senare matar både stabilitetspoäng och senioritetsbedömning."
  },
  'b.s1.l2': {
    en: "<strong>Skill canonicalization.</strong> An alias map collapses <code>sklearn</code>, <code>scikit-learn</code>, and <code>Scikit Learn</code> to one canonical skill so counts don't fragment.",
    sv: "<strong>Kompetensnormalisering.</strong> En aliasmappning slår ihop <code>sklearn</code>, <code>scikit-learn</code> och <code>Scikit Learn</code> till en enda kanonisk kompetens så att antalen inte fragmenteras."
  },
  'b.s1.l3': {
    en: "<strong>Date normalization.</strong> Indonesian CVs write dates day-first (<code>14/08/1995</code>), European style. The normalizer disambiguates ambiguous numeric dates rather than guessing wrong.",
    sv: "<strong>Datumnormalisering.</strong> Indonesiska CV:n skriver datum dag-först (<code>14/08/1995</code>), europeisk stil. Normalisern avgör tvetydliga numeriska datum istället för att gissa fel."
  },
  'b.s1.q': {
    en: "<strong>Design rule:</strong> use the LLM where language understanding is genuinely needed (summaries, unstructured fields, template mapping). Use deterministic parsing where a regex is more reliable, free, and auditable. Hybrid beats pure-LLM on both cost and consistency.",
    sv: "<strong>Designregel:</strong> använd LLM där språkförståelse verkligen behövs (sammanfattningar, ostrukturerade fält, mallmappning). Använd deterministisk tolkning där regex är mer pålitligt, gratis och spårbart. Hybrid slår ren LLM på både kostnad och konsistens."
  },

  // ---- Stage 2 ----
  'b.h2c': { en: 'Stage 2: Explainable fit scoring', sv: 'Steg 2: Förklarbar matchningspoäng' },
  'b.s2.p1': {
    en: "Given a job order and a parsed resume, the scoring engine estimates how well this candidate fits. But the design constraint that shaped everything was <strong>explainability</strong>: every point in the score must come with a reason a recruiter can read, agree or disagree with, and act on.",
    sv: "Givet ett joborder och en tolkad CV uppskattar poängmotorn hur väl kandidaten passar. Men designkravet som formade allt var <strong>förklarbarhet</strong>: varje poäng i resultatet måste komma med ett skäl som rekrytören kan läsa, hålla med om eller inte, och agera på."
  },
  'b.s2.p2': {
    en: "The weighting scheme has a subtlety worth flagging. Each component only counts when the job order expresses that dimension, and its weight is removed from the denominator otherwise, so the remaining weights re-normalize automatically. That avoids punishing candidates for requirements nobody asked for, but it also means a sparse job order (one that mentions almost nothing) concentrates all the weight on whichever dimensions happen to be present, which can amplify weak signals into large score swings. In practice our job orders are written against a client intake template that always covers skills and experience, so the degenerate case is rare; if you borrow this idea, add a validation check for orders that specify too few dimensions rather than trusting re-normalization to sort it out.",
    sv: "Viktschemat har en subtilitet värd att lyfta fram. Varje komponent räknas bara när jobordern uttrycker den dimensionen, annars tas vikten bort från nämnaren så att resterande vikter renormaliseras automatiskt. Det undviker att straffa kandidater för krav ingen bett om, men det betyder också att en gles joborder (en som nästan inte nämner något) koncentrerar hela vikten på de dimensioner som råkar finnas, vilket kan förstärka svaga signaler till stora poängutslag. I praktiken skrivs våra joborders mot en klientintervjumall som alltid täcker kompetens och erfarenhet, så det degenererade fallet är ovanligt; lånar du denna idé, lägg till en valideringskontroll för order som specificerar för få dimensioner istället för att lita på att renormaliseringen löser det."
  },
  'b.fig2': {
    en: 'Figure 2. Weighted components with dynamic re-normalization. Weights only count when the job order expresses that dimension.',
    sv: 'Figur 2. Viktade komponenter med dynamisk renormalisering. Vikter räknas bara när jobordern uttrycker den dimensionen.'
  },
  'b.s2.fair.h': {
    en: 'Fairness guardrails are a feature, not a checkbox',
    sv: 'Rättvisespärrar är en funktion, inte en kryssruta'
  },
  'b.s2.fair': {
    en: "<strong>Fairness guardrails are a feature, not a checkbox.</strong> We collect date of birth for client paperwork. The scoring module never reads it, and there is a test asserting two identical candidates with different birth dates receive identical scores. Name, gender, nationality, photo, and university prestige are likewise excluded by construction, not by prompt politeness. If you're deploying models on people, this class of guarantee belongs in your test suite, next to your business logic.",
    sv: "<strong>Rättvisespärrar är en funktion, inte en kryssruta.</strong> Vi samlar in födelsetid för klients pappersarbete. Poängmodulen läser aldrig den, och det finns ett test som intygar att två identiska kandidater med olika födelsetider får identiska poäng. Namn, kön, nationalitet, foto och universitetsprestige exkluderas likasån av konstruktion, inte av artighet i prompten. Om du driftsätter modeller på människor hör denna typ av garanti hemma i din testsvit, bredvid affärslogiken."
  },

  // ---- Stage 3 ----
  'b.h2d': { en: 'Stage 3: The human in the loop, on purpose', sv: 'Steg 3: Människan i loopen, med flit' },
  'b.s3.p1': {
    en: "The recruiter sees the score <em>with its reasons</em>. A naked number invites either blind trust or blind dismissal; reasons invite calibration. Over time recruiters learn where the model over-weights and where their own judgment should override, which is exactly the collaboration pattern you want between humans and automated screening.",
    sv: "Rekrytören ser poängen <em>med sina motiveringar</em>. Ett bart tal inbjuder antingen till blind tilltro eller blind avfärding; motiveringar inbjuder till kalibrering. Med tiden lär sig rekrytörerna var modellen övervärderar och var deras eget omdöme ska styra, vilket är exakt det samarbetsmönster du vill ha mellan människor och automatiserad gallring."
  },
  'b.s3.p2': {
    en: "Ownership stays manual by design: no application is ever auto-assigned or auto-rejected. Automation triages; humans decide. In recruiting, a false negative (rejecting someone who would have placed) costs more than a few minutes of recruiter time.",
    sv: "Ägandet förblir manuellt av design: ingen ansökan tilldelas eller avslås automatiskt. Automatisering gallrar; människor beslutar. I rekrytering kostar en falskt negativ (att avvisa någon som hade blivit placerad) mer än några minuters rekrytörtid."
  },

  // ---- Stage 4 ----
  'b.h2e': { en: 'Stage 4: LLM-powered CV reformatting', sv: 'Steg 4: LLM-driven CV-formattering' },
  'b.s4.p1': {
    en: "When a candidate advances, each client expects their own submission format: a specific DOCX template with particular sections and phrasing. Historically recruiters retyped resumes into these formats by hand, which is slow, repetitive work on every placement. Now:",
    sv: "När en kandidat går vidare kräver varje klient sitt eget leveransformat: en specifik DOCX-mall med särskilda avsnitt och formuleringar. Tidigare skrev rekrytörerna om CV:n till dessa format för hand, långsamt och repetitivt arbete vid varje placering. Nu:"
  },
  'b.s4.l1': {
    en: "Each client format is declared as a <strong>schema</strong>: field keys, labels, groupings, hints, repeating blocks (employment history).",
    sv: "Varje klientformat deklareras som ett <strong>schema</strong>: fältnycklar, etiketter, grupperingar, tips, repeterande block (anställningshistorik)."
  },
  'b.s4.l2': {
    en: "The schema generates three artifacts from one source of truth: the <strong>LLM prompt</strong>, the <strong>recruiter review form</strong>, and the <strong>template fill</strong>.",
    sv: "Schemat genererar tre artefakter från en enda sanningskälla: <strong>LLM-prompten</strong>, <strong>rekrytarens granskningsformulär</strong> och <strong>mallifyllnaden</strong>."
  },
  'b.s4.l3': {
    en: "The LLM (OpenAI or Anthropic, provider-swappable via config) receives the raw CV text plus the target schema and returns structured JSON.",
    sv: "LLM:en (OpenAI eller Anthropic, utbytbar leverantör via konfiguration) tar emot CV-texten plus målschemat och returnerar strukturerad JSON."
  },
  'b.s4.l4': {
    en: "A tolerant JSON parser handles the reality of LLM output: markdown fences, trailing commas, chatty preambles.",
    sv: "En tolerant JSON-tolk hanterar verklighetens LLM-utdata: markdown-staket, avslutande kommatecken, pratsamma inledningar."
  },
  'b.s4.l5': {
    en: "The recruiter reviews extracted fields in the browser and corrects anything wrong; the corrected data fills the client's DOCX.",
    sv: "Rekrytören granskar extraherade fält i webbläsaren och rättar det som blivit fel; de korrigerade data fyller klientens DOCX."
  },
  'b.s4.p2': {
    en: "The schema-driven approach is the key trick: adding a new client format means writing one declarative object, not new prompt engineering. The prompt can't drift out of sync with the form or the template, because they're all projections of the same definition.",
    sv: "Schemadriven design är nyckelknepet: att lägga till ett nytt klientformat betyder att skriva ett deklarativt objekt, inte ny promptteknik. Prompten kan inte hamna ur synk med formuläret eller mallen, eftersom alla tre är projektioner av samma definition."
  },
  'b.fig3': {
    en: 'Figure 3. Schema-as-single-source-of-truth for prompt, UI, and output generation.',
    sv: 'Figur 3. Schema som ensam sanningskälla för prompt, gränssnitt och utdatagenerering.'
  },

  // ---- Lessons ----
  'b.h2f': { en: 'What production taught me', sv: 'Vad produktionen lärde mig' },
  'b.l1': {
    en: "<strong>Deterministic-first architecture pays twice.</strong> Rules handle the structured 80% of a resume cheaply and consistently; the LLM handles the messy 20%. Costs stay predictable and failures stay debuggable.",
    sv: "<strong>Deterministisk-först-arkitektur lönar sig dubbel.</strong> Regler hanterar den strukturerade 80 procenten av en CV billigt och konsistent; LLM:en hanterar de röriga 20 procenten. Kostnaderna förblir förutsägbara och felen felsökbara."
  },
  'b.l2': {
    en: "<strong>Explainability is a product requirement, not an ethics poster.</strong> Recruiters adopted the scoring engine because they could interrogate it. A black-box score would have been ignored correctly.",
    sv: "<strong>Förklarbarhet är en produktkrav, inte en etikaffisch.</strong> Rekrytörerna tog till sig poängmotorn för att de kunde ifrågasätta den. En black box-poäng skulle ha ignorerats, med rätta."
  },
  'b.l3': {
    en: "<strong>Provider abstraction is cheap insurance.</strong> Supporting OpenAI-compatible and Anthropic APIs behind one interface was a small one-time cost, and it means model swaps are now config changes rather than code changes. I have not needed to switch providers under pressure yet, so treat this as insurance I have bought but not cashed in.",
    sv: "<strong>Leverantörabstraktion är billig försäkring.</strong> Att stödja OpenAI-kompatibla och Anthropic-API:er bakom ett gränssnitt var en liten engångskostnad, och det betyder att modellbyten nu är konfigurationsändringar snarare än kodändringar. Jag har ännu inte behövt byta leverantör under press, så se detta som en försäkring jag köpt men inte löst in."
  },
  'b.l4': {
    en: "<strong>Human-in-the-loop is where trust compounds.</strong> Every recruiter correction is implicit labeled data. The pipeline gets better not by retraining, but because the design routes uncertainty to the person best placed to resolve it.",
    sv: "<strong>Människan i loopen är där förtroendet förädlas.</strong> Varje rekrytörkorrigering är implicit märkta data. Pipelinen blir bättre inte genom omträning, utan för att designen leder osäkerhet till den person som bäst kan lösa den."
  },
  'b.l5': {
    en: "<strong>Fairness constraints belong in tests.</strong> If a protected attribute must not influence a decision, prove it with an assertion, not a policy memo.",
    sv: "<strong>Rättvisekrav hör hemma i tester.</strong> Om en skyddad egenskap inte får påverka ett beslut, bevisa det med en assertion, inte med ett policypm."
  },

  // ---- Papers ----
  'b.h2g': { en: 'Papers worth reading alongside this', sv: 'Artiklar värda att läsa vid sidan om' },
  'b.refs.intro': {
    en: "If you want to go deeper on the research behind these design choices, start here:",
    sv: "Om du vill gå djupare på forskningen bakom dessa designval, börja här:"
  },
  // reference entries keep English titles (academic convention) — intro + annotations translated above/below as needed

  // ---- Wrap-up ----
  'b.h2h': { en: 'Wrapping up', sv: 'Sammanfattningsvis' },
  'b.outro': {
    en: "None of the individual pieces here is exotic: regexes, weighted scoring, an LLM call behind a schema, a WhatsApp bot. The engineering value and the forward-deployed mindset lives in the seams: knowing which problems need a model and which need a regex, making automated judgments inspectable, keeping humans on the decisions that deserve them, and proving fairness claims with tests. That's the difference between an AI demo and an AI pipeline a real business runs on.",
    sv: "Ingen av delarna här är exotisk: regex, viktad poängsättning, ett LLM-anrop bakom ett schema, en WhatsApp-bot. Ingenjörsvärdet och forward deployed-tänket finns i sömmarna: att veta vilka problem som behöver en modell och vilka som behöver ett regex, göra automatiserade bedömningar inspekterbara, låta människor ta de beslut som förtjänar dem och bevisa rättviseutfästelser med tester. Det är skillnaden mellan en AI-demo och en AI-pipeline som ett riktigt företag drivs på."
  }
};
