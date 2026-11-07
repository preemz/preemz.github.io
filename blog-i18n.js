// Blog bilingual switcher (EN/SV). Full coverage.
const BLOG_I18N = {
  'b.title': {
    en: 'An End-to-End AI Recruiting Pipeline in Production',
    sv: 'En AI-driven rekryteringspipeline i produktion, från start till mål'
  },
  'b.meta': {
    en: "Primawan Satrio · August 2026 · ~10 min read",
    sv: "Primawan Satrio · augusti 2026 · ca 10 min läsning"
  },
  'b.update': {
    en: "<strong>Update, November 2026:</strong> I wrote this post in August, and several claims have moved since. The CV reformatter ran on Gemini for a day (the config switch worked, but Google refused every model on that account, so it went back to Anthropic) and now runs Claude Sonnet 5.5 through a small Durable Object in Western Europe. I also added an AI fit assessment next to the rule-based score; it is described in Stage 2. The sections below are corrected to match. For more on the matching and the reformatter, see the posts on <a href=\"https://preemz.github.io/blog-kerjaboard-recommendations.html\">KerjaBoard's recommendation system</a> and the <a href=\"https://preemz.github.io/blog-cv-reformatter.html\">CV reformatter</a>.",
    sv: "<strong>Uppdatering, november 2026:</strong> Jag skrev det här inlägget i augusti, och flera påståenden har ändrats sedan dess. CV-formatteringen körde på Gemini under en dag (konfigurationsbytet fungerade, men Google avvisade alla modeller på det kontot, så den gick tillbaka till Anthropic) och kör nu Claude Sonnet 5.5 via ett litet Durable Object i Västeuropa. Jag har också lagt till en AI fit assessment vid sidan av den regelbaserade poängen; den beskrivs under Steg 2. Avsnitten nedan är rättade i enlighet med detta. Mer om matchningen och formatteringen finns i inläggen om <a href=\"https://preemz.github.io/blog-kerjaboard-recommendations.html\">KerjaBoards rekommendationssystem</a> och <a href=\"https://preemz.github.io/blog-cv-reformatter.html\">CV-reformattern</a>."
  },
  'b.p1': {
    en: "Most AI demos die in the demo. The interesting question is not <em>can a model do this once</em>, but <em>can it run inside a live business every day, without a human babysitting every step</em>. I run a headhunting agency across the Indonesia\u2013Japan corridor, and instead of bolting AI onto the side, I rebuilt our recruiting pipeline around it: parsing resumes, scoring candidate fit, and reformatting CVs into client templates.",
    sv: "De flesta AI-demonstrationer dör i demonstrationsstadiet. Den intressanta frågan är inte om <em>en modell kan göra detta en gång</em>, utan om <em>den kan köras inuti ett levande företag varje dag, utan att en människa övervakar varje steg</em>. Jag driver en rekryteringsbyrå mellan Indonesien och Japan, och istället för att skruva fast AI på sidan om byggde jag om vår rekryteringspipeline runt den: tolka CV:n, poängsätta kandidatmatchning och formatera om CV:n till klientmallar."
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
    en: "Figure 1. The production pipeline. Stage 2 (score and AI fit assessment) runs on its own but never rejects anyone; stage 3 is the human decision; in stage 4 a model drafts and a recruiter reviews.",
    sv: "Figur 1. Produktionspipelinen. Steg 2 (poäng och AI fit assessment) körs av sig själv men avvisar aldrig någon; steg 3 är det mänskliga beslutet; i steg 4 skriver en modell ett utkast och en rekrytör granskar det."
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
    en: "The weighting scheme has a subtlety worth flagging. Each component only counts when the job order expresses that dimension, and its weight is removed from the denominator otherwise, so the remaining weights re-normalize automatically. That avoids punishing candidates for requirements nobody asked for, but it also means a sparse job order (one that mentions almost nothing) concentrates all the weight on whichever dimensions happen to be present, which can amplify weak signals into large score swings. In practice sparse orders are not rare: the matcher's own code comments (October 2026) say most live orders list only skills its vocabulary does not know, and that for most orders with a years requirement it sits only in the free-text Requirements block, so early versions scored many orders on very little. The validation check this post first suggested is now partly implemented as caps: a score cannot exceed 35 when an order states no must-have skills or none are evidenced, nor 55 when fewer than half are evidenced, and there is a cap of 60 when too little can be scored at all. Free-text skills are now evidenced by the candidate's own phrasing, and the Requirements block is read for years. If you borrow re-normalization, add caps like these rather than trusting it alone.",
    sv: "Viktschemat har en subtilitet värd att lyfta fram. Varje komponent räknas bara när jobordern uttrycker den dimensionen, annars tas vikten bort från nämnaren så att resterande vikter renormaliseras automatiskt. Det undviker att straffa kandidater för krav ingen bett om, men det betyder också att en gles joborder (en som nästan inte nämner något) koncentrerar hela vikten på de dimensioner som råkar finnas, vilket kan förstärka svaga signaler till stora poängutslag. I praktiken är glesa order inte ovanliga: matchningskodens egna kommentarer (oktober 2026) säger att de flesta live-order bara listar kompetenser som matchningsvokabulären inte känner till, och att årskravet för de flesta order som har ett bara står i det fria Requirements-blocket. Tidiga versioner poängsatte därför många order på mycket lite underlag. Valideringskontrollen som det här inlägget först föreslog är nu delvis genomförd som tak: poängen kan inte överstiga 35 när en order inte anger några must-have-kompetenser eller ingen av dem styrks, inte heller 55 när färre än hälften styrks, och det finns ett tak på 60 när för lite går att poängsätta över huvud taget. Fritextkompetenser styrks nu av kandidatens egna formuleringar, och Requirements-blocket läses för antal år. Lånar du renormaliseringen, lägg till tak som dessa istället för att lita på den ensam."
  },
  'b.fig2': {
    en: 'Figure 2. Weighted components with dynamic re-normalization. Weights only count when the job order expresses that dimension.',
    sv: 'Figur 2. Viktade komponenter med dynamisk renormalisering. Vikter räknas bara när jobordern uttrycker den dimensionen.'
  },
  'b.s2.fit': {
    en: "Alongside the rule-based score there is a second, slower read: an AI fit assessment. Claude reads one application at a time (the CV the candidate applied with, their answers, the job posting, and the client brief and team notes where the order has them) and returns a verdict (strong fit, good fit, possible fit or not a fit), a one-line reason naming the requirement that decided it, and strengths and considerations. Each point can carry a quote from the CV or the posting, shown only if those words really appear in the source text, so an invented citation is dropped. Staff see it on the applicant card, and a freelancer sees it for their own submissions only. The cron assesses three applications per 15-minute tick, newest first, for recent applications on open orders the team is still working, and each result is stored in <code>application_fit</code>. It informs the recruiter; it does not move a card, reject anyone or assign an owner.",
    sv: "Vid sidan av den regelbaserade poängen finns en andra, långsammare läsning: en AI fit assessment. Claude läser en ansökan i taget (CV:t kandidaten sökte med, deras svar, jobbannonsen samt klientbriefen och teamets anteckningar när ordern har sådana) och returnerar en bedömning (strong fit, good fit, possible fit eller not a fit), en enradig motivering som nämner kravet som avgjorde, samt styrkor och överväganden. Varje punkt kan bära ett citat från CV:t eller annonsen, som visas bara om orden verkligen finns i källtexten, så ett påhittat citat slängs. Personalen ser den på kandidatkortet, och en freelancer ser den bara för sina egna inskickade kandidater. Cron-jobbet bedömer tre ansökningar per 15-minuterstick, de nyaste först, för färska ansökningar på öppna order som teamet fortfarande arbetar med, och varje resultat sparas i <code>application_fit</code>. Den informerar rekrytören; den flyttar inget kort, avvisar ingen och tilldelar ingen ägare."
  },
  'b.s2.fair.h': {
    en: 'Fairness guardrails are a feature, not a checkbox',
    sv: 'Rättvisespärrar är en funktion, inte en kryssruta'
  },
  'b.s2.fair': {
    en: "We collect date of birth for client paperwork. The scoring module never reads it, and the match tests assert that candidates who differ only in birth date, gender, nationality, name, marital status, university or GPA receive identical scores. That is the strongest guarantee in the pipeline, and it is a test, not a promise. The AI fit assessment is weaker, and I would rather say so. Its input goes through a scrub that removes contact details, the name, and labelled personal particulars such as birth date, age, nationality, gender, religion and marital status, and the prompt forbids using protected characteristics, university or GPA. That is a pattern-based filter plus an instruction: it is tested against lists of text that must and must not get through, but no test shows that two otherwise identical candidates receive the same assessment, and a regex can miss a particular written in an unexpected way. Work authorisation is deliberately not excluded: a stated visa gap can cap a match score, because someone who cannot legally be hired cannot be placed. If you're deploying models on people, put the guarantees you can test in your test suite, and be exact about the ones you cannot.",
    sv: "Vi samlar in födelsedatum för klientens pappersarbete. Poängmodulen läser det aldrig, och matchningstesterna intygar att kandidater som bara skiljer sig åt i födelsedatum, kön, nationalitet, namn, civilstånd, universitet eller GPA får identiska poäng. Det är den starkaste garantin i pipelinen, och den är ett test, inte ett löfte. AI fit assessment är svagare, och det säger jag hellre rakt ut. Dess indata passerar ett filter som tar bort kontaktuppgifter, namnet och märkta personuppgifter som födelsedatum, ålder, nationalitet, kön, religion och civilstånd, och prompten förbjuder skyddade egenskaper, universitet och GPA. Det är ett mönsterbaserat filter plus en instruktion: det testas mot listor med text som måste respektive inte får släppas igenom, men inget test visar att två i övrigt identiska kandidater får samma bedömning, och ett regex kan missa en uppgift som skrivits på ett oväntat sätt. Arbetstillstånd undantas medvetet inte: ett angivet visumgap kan sätta tak för en matchningspoäng, eftersom den som inte lagligen kan anställas inte kan placeras. Om du driftsätter modeller på människor: lägg de garantier du kan testa i din testsvit, och var exakt om dem du inte kan testa."
  },

  // ---- Stage 3 ----
  'b.h2d': { en: 'Stage 3: The human in the loop, on purpose', sv: 'Steg 3: Människan i loopen, med flit' },
  'b.s3.p1': {
    en: "The recruiter sees the score <em>with its reasons</em>. This matters because a naked number invites either blind trust or blind dismissal; reasons invite calibration. Over time recruiters learn where the model over-weights and where their own judgment should override, which is exactly the collaboration pattern you want between humans and automated screening.",
    sv: "Rekrytören ser poängen <em>med sina motiveringar</em>. Detta spelar roll eftersom ett bart tal inbjuder antingen till blind tilltro eller blind avfärding; motiveringar inbjuder till kalibrering. Med tiden lär sig rekrytörerna var modellen övervärderar och var deras eget omdöme ska styra, vilket är exakt det samarbetsmönster du vill ha mellan människor och automatiserad gallring."
  },
  'b.s3.p2': {
    en: "Automation triages; humans decide. No application is auto-rejected: the score and the fit assessment are shown, and a recruiter moves the card. The one hard rule sits on the apply form: where an employer cannot sponsor a visa, the applicant has to confirm the right to work there before the form files. That is a rule, not a model. Ownership is mostly manual, with three automatic exceptions, all driven by who brought the candidate rather than by any model: a tracked referral link assigns the sharing recruiter as owner at apply time (an internal owner, or a freelancer claim with a fee window); a candidate with a standing freelance claim carries it into a new application; and an off-board click-through with no link goes to a house owner, so nobody is left unowned. In recruiting, a false negative (rejecting someone who would have placed) costs more than a few minutes of recruiter time.",
    sv: "Automatisering gallrar; människor beslutar. Ingen ansökan avslås automatiskt: poängen och fit assessment visas, och en rekrytör flyttar kortet. Den enda hårda regeln finns i ansökningsformuläret: när en arbetsgivare inte kan sponsra visum måste den sökande bekräfta rätten att arbeta där innan formuläret skickas in. Det är en regel, inte en modell. Ägandet är mestadels manuellt, med tre automatiska undantag som alla styrs av vem som tog med kandidaten och inte av någon modell: en spårad referral-länk gör den delande rekrytören till ägare vid ansökningstillfället (en intern ägare, eller en freelancer-claim med ett arvodesfönster); en kandidat med en pågående freelancer-claim för den med sig in i en ny ansökan; och ett klick som lämnar plattformen utan länk går till en house owner, så att ingen blir utan ägare. I rekrytering kostar en falskt negativ (att avvisa någon som hade blivit placerad) mer än några minuters rekrytörtid."
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
    en: "The schema generates the <strong>LLM prompt</strong> and the <strong>recruiter review form</strong>, and fixes the key names the <strong>template fill</strong> must use.",
    sv: "Schemat genererar <strong>LLM-prompten</strong> och <strong>rekrytörens granskningsformulär</strong>, och fastställer vilka nyckelnamn <strong>mallifyllnaden</strong> måste använda."
  },
  'b.s4.l3': {
    en: "The LLM receives the raw CV text plus the target schema and returns structured JSON. Production uses Claude Sonnet 5.5 through a Durable Object in Western Europe; the code can also call Workers AI through AI Gateway, Gemini, or any OpenAI-compatible endpoint, chosen by config.",
    sv: "LLM:en tar emot CV-texten plus målschemat och returnerar strukturerad JSON. Produktionen använder Claude Sonnet 5.5 via ett Durable Object i Västeuropa; koden kan också anropa Workers AI via AI Gateway, Gemini eller valfri OpenAI-kompatibel endpoint, vald via konfiguration."
  },
  'b.s4.l4': {
    en: "A tolerant JSON parser handles the common failures of LLM output: markdown fences, chatty preambles, and output cut off mid-object (it keeps everything up to the last complete element). It does not repair a trailing comma: a complete object that has one fails with a 'malformed JSON' error and the recruiter retries.",
    sv: "En tolerant JSON-tolk hanterar de vanliga felen i LLM-utdata: markdown-staket, pratsamma inledningar och utdata som kapats mitt i ett objekt (den behåller allt fram till det sista kompletta elementet). Den reparerar inte ett avslutande kommatecken: ett komplett objekt som har ett misslyckas med felet ”malformed JSON” och rekrytören försöker igen."
  },
  'b.s4.l5': {
    en: "The recruiter reviews extracted fields in the browser and corrects anything wrong; the corrected data fills the client's DOCX.",
    sv: "Rekrytören granskar extraherade fält i webbläsaren och rättar det som blivit fel; de korrigerade data fyller klientens DOCX."
  },
  'b.s4.p2': {
    en: "The schema-driven approach is the key trick: adding a new client format means writing one declarative object, not new prompt engineering. The prompt and the review form can't drift apart, because both are generated from the same definition. The template is only as in sync as its tokens: it has to use the same field keys, and a renamed key leaves a blank section in the client's DOCX.",
    sv: "Schemadriven design är nyckelknepet: att lägga till ett nytt klientformat betyder att skriva ett deklarativt objekt, inte ny promptteknik. Prompten och granskningsformuläret kan inte glida isär, eftersom båda genereras från samma definition. Mallen är bara i synk så länge dess tokens använder samma fältnycklar, och en omdöpt nyckel ger ett tomt avsnitt i klientens DOCX."
  },
  'b.fig3': {
    en: "Figure 3. One format definition drives the prompt and the review form, and fixes the keys the DOCX template must use.",
    sv: "Figur 3. En formatdefinition styr prompten och granskningsformuläret, och fastställer nycklarna som DOCX-mallen måste använda."
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
    en: "<strong>Provider abstraction is worth having, but swapping is not free.</strong> The reformatter can call Anthropic, Workers AI through AI Gateway, Gemini, or any OpenAI-compatible endpoint, chosen by config, and I have now swapped for real. On 23 September I flipped it to Gemini and back to Anthropic the same day: the flip was a config change, but Google refused every model on that account. On 3 October I added a gateway path that falls back to the direct API. It is parked, because with no gateway credits every call failed, and its fallback sent the gateway's model id to Anthropic, which answers 404 to that spelling, so an upload failed until 13 October. The move to Sonnet 5.5 that day took code as well as config: it thinks by default, thinking spends the output budget, a refusal arrives as a normal response with no text, and older models reject the effort setting it needs. The next day Anthropic answered 403 to a staff member routed through a region it does not serve, so the call now leaves from a Durable Object in Western Europe. The AI fit assessment only calls Anthropic, so it would not follow a config swap. The abstraction was cheap to write; each real swap exposed a difference it did not hide.",
    sv: "<strong>Leverantörsabstraktion är värd att ha, men att byta är inte gratis.</strong> Formatteringen kan anropa Anthropic, Workers AI via AI Gateway, Gemini eller valfri OpenAI-kompatibel endpoint, vald via konfiguration, och jag har nu bytt på riktigt. Den 23 september slog jag om den till Gemini och tillbaka till Anthropic samma dag: omslaget var en konfigurationsändring, men Google avvisade alla modeller på det kontot. Den 3 oktober lade jag till en gateway-väg som faller tillbaka på det direkta API:et. Den är parkerad, eftersom varje anrop misslyckades utan gateway-krediter, och dess fallback skickade gatewayns modell-id till Anthropic, som svarar 404 på den stavningen, så en uppladdning misslyckades fram till den 13 oktober. Bytet till Sonnet 5.5 samma dag krävde kod och inte bara konfiguration: den tänker som standard, tänkandet förbrukar utdatabudgeten, en vägran kommer som ett vanligt svar utan text, och äldre modeller avvisar effort-inställningen den behöver. Dagen därpå svarade Anthropic 403 till en medarbetare som routades via en region de inte betjänar, så anropet lämnar nu från ett Durable Object i Västeuropa. AI fit assessment anropar bara Anthropic, så den följer inte med ett konfigurationsbyte. Abstraktionen var billig att skriva; varje verkligt byte avslöjade en skillnad som den inte dolde."
  },
  'b.l4': {
    en: "<strong>Human-in-the-loop is where trust compounds.</strong> The design routes uncertainty to the person best placed to resolve it: the recruiter sees extracted fields before anything goes to a client, and the score with its reasons before anything moves. What I have not built is a loop that learns from those corrections. The download route stores nothing, and the agree or disagree feedback on match scores is shown to staff but not used for tuning. Treating recruiter edits as labeled data is an idea for later, not a feature.",
    sv: "<strong>Människan i loopen är där förtroendet förädlas.</strong> Designen leder osäkerhet till den person som bäst kan lösa den: rekrytören ser extraherade fält innan något går till en klient, och poängen med sina motiveringar innan något flyttas. Det jag inte har byggt är en loop som lär sig av de rättelserna. Nedladdningsrutten sparar ingenting, och feedbacken ”agree” eller ”disagree” på matchningspoäng visas för personalen men används inte för justering. Att behandla rekrytörens ändringar som märkta data är en idé för senare, inte en funktion."
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
  // reference entries keep English titles (academic convention); intro and annotations are translated above/below as needed

  // ---- Wrap-up ----
  'b.h2h': { en: 'Wrapping up', sv: 'Sammanfattningsvis' },
  'b.outro': {
    en: "None of the individual pieces here is exotic: regexes, weighted scoring, an LLM call behind a schema. The engineering value and the forward-deployed mindset lives in the seams: knowing which problems need a model and which need a regex, making automated judgments inspectable, keeping humans on the decisions that deserve them, and proving fairness claims with tests. That's the difference between an AI demo and an AI pipeline a real business runs on.",
    sv: "Ingen av delarna här är exotisk: regex, viktad poängsättning, ett LLM-anrop bakom ett schema. Ingenjörsvärdet och forward deployed-tänket finns i sömmarna: att veta vilka problem som behöver en modell och vilka som behöver ett regex, göra automatiserade bedömningar inspekterbara, låta människor ta de beslut som förtjänar dem och bevisa rättviseutfästelser med tester. Det är skillnaden mellan en AI-demo och en AI-pipeline som ett riktigt företag drivs på."
  }
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
