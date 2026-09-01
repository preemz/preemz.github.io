// Observability post bilingual switcher (EN/SV).
const I18N_OBS = {
  't': { en: 'Observability on a Workers Free Plan', sv: 'Observabilitet på en Workers Free Plan' },
  'meta': { en: 'Primawan Satrio · August 2026 · ~8 min read', sv: 'Primawan Satrio · augusti 2026 · ca 8 min läsning' },
  'p1': {
    en: "Our recruiting platform runs on Cloudflare Workers' free plan. That buys us zero infrastructure and zero dollars, and it also buys us roughly zero dashboards. No APM agent, no paid log retention worth the name, no tracing. When a candidate's application vanished into a 1102 error one evening, my entire debugging surface was a Cloudflare error page and my own memory of what the code was supposed to do.",
    sv: "Vår rekryteringsplattform körs på Cloudflare Workers gratisplan. Det ger oss noll infrastruktur och noll kronor, och det ger oss också ungefär noll dashboards. Ingen APM-agent, ingen betald loggretention värd namnet, ingen tracing. När en kandidats ansökan försvann i ett 1102-fel en kväll var hela min felsökningsyta en Cloudflare-felsida och mitt eget minne av vad koden skulle göra."
  },
  'p2': {
    en: "This post is about the observability layer we built afterwards. It costs nothing, it lives in about forty lines of code, and it has since caught every production failure within minutes instead of when a recruiter phones me to ask if the site is down. The stack: tagged structured logs, a Discord Monitoring channel, privacy-sampled funnel metrics, and a cron smoke check that fetches our own pages every fifteen minutes.",
    sv: "Detta inlägg handlar om observabilitetsskiktet vi byggde efteråt. Det kostar ingenting, bor i ungefär fyrtio rader kod, och har sedan dess fångat varje produktionsfel inom minuter istället för när en rekrytör ringer mig och frågar om sidan är nere. Stacken: taggade strukturerade loggar, en Discord Monitoring-kanal, integritetsbevakade trattmätvärden och en cron-röktest som hämtar våra egna sidor var femtonde minut."
  },
  'h_why': { en: 'The constraint that shaped everything', sv: 'Begränsningen som formade allt' },
  'why_p1': {
    en: "On the free plan, <code>console.log</code> output is retained for a short window and there is no queryable long-term store you can grep from a dashboard. So the design question was never \"which observability vendor\" but \"where does signal go when logs evaporate?\"",
    sv: "På gratisplanen sparas <code>console.log</code>-utdata bara en kort tid och det finns inget frågbart långtidsarkiv att grep:a från en dashboard. Så designfrågan var aldrig \"vilken observabilitetsleverantör\" utan \"vart tar signalen vägen när loggarna dunstar?\""
  },
  'why_p2': {
    en: "Our answer: logs stay for debugging what just happened, and anything that must be <em>noticed</em> gets pushed to a place the team already looks several times a day. For us that place is Discord. We already used a webhook for job announcements; we added a second channel, <strong>#monitoring</strong>, with its own webhook, and made it the single destination for every failure signal.",
    sv: "Vårt svar: loggarna stannar för att felsöka det som just hände, och allt som måste <em>läggas märke till</em> skickas till en plats teamet redan tittar på flera gånger om dagen. För oss är den platsen Discord. Vi använde redan en webhook för jobbannonsering; vi lade till en andra kanal, <strong>#monitoring</strong>, med egen webhook, och gjorde den till den enda destinationen för alla felsignaler."
  },
  'why_fig_top': { en: 'every event → both destinations; only failures page anyone', sv: 'varje händelse → båda destinationerna; bara fel pinger någon' },
  'why_fig_cap': {
    en: 'Figure 1. One metric() call fans out to ephemeral logs and the persistent Discord channel. Dashboards are for browsing; Discord is for noticing.',
    sv: 'Figur 1. Ett metric()-anrop fläkar ut till flyktiga loggar och den beständiga Discord-kanalen. Dashboards är för bläddring; Discord är för att lägga märke till saker.'
  },
  'h_metric': { en: 'One function to rule the telemetry', sv: 'En funktion att härska över telemetrin' },
  'metric_p1': {
    en: "The core is a single exported <code>metric(ctx, event, fields)</code>. It formats an event with key=value pairs, writes one tagged line to logs, and fires the Discord webhook. Every observable event in the codebase goes through it:",
    sv: "Kärnan är en enda exporterad <code>metric(ctx, event, fields)</code>. Den formaterar en händelse med nyckel=värde-par, skriver en taggad rad till loggarna och avfyrar Discord-webhooken. Varje observerbar händelse i kodbasen går genom den:"
  },
  'metric_p2': {
    en: "Three design rules keep it useful. <strong>Tag everything:</strong> every line starts with <code>[metric]</code> so a log dump can be filtered mechanically. <strong>Bound the fields:</strong> values are truncated to 60 characters so a stack trace fragment cannot flood a Discord message. <strong>Never log people:</strong> candidate emails, file contents, and names are excluded by rule; only technical dimensions (sizes, durations, counts, booleans, job IDs) pass through.",
    sv: "Tre designregler håller den användbar. <strong>Tagga allt:</strong> varje rad börjar med <code>[metric]</code> så att en loggdump kan filtreras mekaniskt. <strong>Begränsa fälten:</strong> värden kapas till 60 tecken så att ett stack trace-fragment inte kan översvämma ett Discord-meddelande. <strong>Logga aldrig människor:</strong> kandidatmejl, filinnehåll och namn exkluderas per regel; endast tekniska dimensioner (storlekar, varaktigheter, antal, booleska värden, jobb-ID) släpper igenom."
  },
  'metric_q': {
    en: "<strong>The privacy rule is enforced at the choke point.</strong> Because every event flows through one function, \"what must never be logged\" is checked in exactly one place, not sprinkled across the codebase as good intentions.",
    sv: "<strong>Integritetsregeln tillämpas vid flaskhalsen.</strong> Eftersom varje händelse flödar genom en funktion kontrolleras \"vad som aldrig får loggas\" på exakt ett ställe, inte strött över kodbasen som goda avsikter."
  },
  'h_funnel': { en: 'Funnel metrics: the business, measured', sv: 'Trattmätvärden: affären, mätt' },
  'funnel_p1': {
    en: "Error-only monitoring tells you the site is broken. It does not tell you the funnel is quietly leaking. We instrument the candidate journey as a sequence of metric events: CV extraction (with extraction success as an explicit boolean), application submission (with attachment counts), recommendation generation (with its own error event when the matcher fails). Reading a day of <code>[metric]</code> lines answers the questions that actually matter to a recruiting business:",
    sv: "Övervakning av enbart fel talar om att sidan är trasig. Den talar inte om att tratten tyst läcker. Vi instrumenterar kandidatresan som en sekvens av metrikhändelser: CV-extraktion (med extraktionsframgång som explicit boolesk), ansökningsinskickning (med antal bilagor), rekommendationsgenerering (med egen felhändelse när matcharen fallerar). Att läsa en dags <code>[metric]</code>-rader besvarar frågorna som faktiskt betyder något för en rekryteringsverksamhet:"
  },
  'funnel_l1': { en: "Are CVs extracting cleanly, or is a document format silently producing garbage?", sv: "Extraheras CV:n rent, eller producerar ett dokumentformat tyst skräp?" },
  'funnel_l2': { en: "Do applications carry the extras (portfolio, additional files) we want?", sv: "Har ansökningarna med sig de tillägg (portfölj, extra filer) vi vill se?" },
  'funnel_l3': { en: "Is the matching engine erroring on particular job orders?", sv: "Fallerar matchningsmotorn på särskilda joborders?" },
  'funnel_p2': {
    en: "The <code>cv_extract</code> event earns special mention because it is the direct descendant of the Error 1102 incident. After bounding PDF stream processing, we added <code>ok</code> (did extraction yield real text?) and timing to every extraction. When a pathological document appears now, the metric line shows it immediately: high <code>ms</code>, low <code>chars</code>, <code>ok=0</code>.",
    sv: "Händelsen <code>cv_extract</code> förtjänar särskilt omnämnande eftersom den är den direkta avkomman till Error 1102-incidenten. Efter att ha begränsat PDF-strömbehandling lade vi till <code>ok</code> (gav extraktionen riktig text?) och tidsmätning till varje extraktion. När ett patologiskt dokument dyker upp nu visar metrikraden det omedelbart: hög <code>ms</code>, lågt <code>chars</code>, <code>ok=0</code>."
  },
  'h_smoke': { en: 'The smoke check: a cron that fetches our own site', sv: 'Röktestet: en cron som hämtar vår egen sida' },
  'smoke_p1': {
    en: "The piece that turned monitoring from reactive to proactive is a scheduled handler on a 15-minute cron. It fetches a handful of our own pages (the shell, login, privacy, and the newest live job pages) and checks for 5xx responses. Failures land in the Monitoring channel with a red embed; successes write one quiet log line and notify nobody.",
    sv: "Biten som gjorde övervakningen från reaktiv till proaktiv är en schemalagd hanterare på en cron var femtonde minut. Den hämtar en handfull av våra egna sidor (skalet, login, privacy och de nyaste live-jobbsidorna) och kontrollerar 5xx-svar. Fel landar i Monitoring-kanalen med en röd inbäddning; framgångar skriver en tyst loggrad och meddelar ingen."
  },
  'smoke_q': {
    en: "<strong>The quiet-success rule matters as much as the alerting.</strong> A monitoring channel that pings on every success gets muted within a week. Ours only speaks when something fails, so when it speaks, everyone reads.",
    sv: "<strong>Den tysta framgångsregeln betyder lika mycket som larmningen.</strong> En övervakningskanal som pingar vid varje framgång tystas inom en vecka. Vår talar bara när något fallerar, så när den talar läser alla."
  },
  'smoke_p2': {
    en: "Why fetch pages over HTTP instead of calling internal functions? Because the whole point is to test what a candidate actually experiences: DNS, the edge, routing, the D1 queries behind a live job page. It even caught a real regression once, a broken SQL path on job pages that would otherwise have sat undetected until an applicant hit it. Internal smoke coverage of live job pages came directly from that incident.",
    sv: "Varför hämta sidor över HTTP istället för att anropa interna funktioner? För att hela poängen är att testa vad en kandidat faktiskt upplever: DNS, kanten, routing, D1-frågorna bakom en live-jobbsida. Den fångade till och med en verklig regression en gång, en trasig SQL-väg på jobbsidor som annars skulle ha suttit oupptäckt tills en sökande drabbades. Intern röktesttäckning av live-jobbsidor kom direkt från den incidenten."
  },
  'h_lessons': { en: 'What we would tell ourselves earlier', sv: 'Vad vi skulle säga till oss själva tidigare' },
  'les_l1': {
    en: "<strong>Observability is a routing problem, not a tooling problem.</strong> We did not need a vendor; we needed failure signals to arrive where the team already looks. Discord won because attention was already there.",
    sv: "<strong>Observabilitet är ett routingproblem, inte ett verktygsproblem.</strong> Vi behövde ingen leverantör; vi behövde felsignaler som anländer dit teamet redan tittar. Discord vann eftersom uppmärksamheten redan fanns där."
  },
  'les_l2': {
    en: "<strong>One choke point beats scattered diligence.</strong> A single metric() function with a privacy rule and field bounding gives guarantees that twenty well-meaning console.log sites never will.",
    sv: "<strong>En flaskhals slår utspridd flit.</strong> En enda metric()-funktion med integritetsregel och fältbegränsning ger garantier som tjugo välvilliga console.log-ställen aldrig kommer att ge."
  },
  'les_l3': {
    en: "<strong>Instrument the funnel, not just the failures.</strong> A silent extraction degradation costs candidates quietly. Business metrics caught it; error logs never would have.",
    sv: "<strong>Instrumentera tratten, inte bara felen.</strong> En tyst extraktionsförsämring kostar kandidater i det tysta. Affärsmetriken fångade den; felloggar hade aldrig gjort det."
  },
  'les_l4': {
    en: "<strong>Free-tier limits force honesty.</strong> Short log retention pushed push-based alerting from nice-to-have to mandatory. The constraint made the system simpler than a paid setup would have been.",
    sv: "<strong>Gratisplansgränser tvingar fram ärlighet.</strong> Kort loggretention drev push-baserad larmning från trevlig-att-ha till obligatorisk. Begränsningen gjorde systemet enklare än en betald installation skulle ha varit."
  },
  'les_l5': {
    en: "<strong>Alert only on failure, and only on what needs action.</strong> Every notification should be one a human must read. Everything else is a log line.",
    sv: "<strong>Larma endast vid fel, och endast på det som kräver åtgärd.</strong> Varje notifikation borde vara en som en människa måste läsa. Allt annat är en loggrad."
  },
  'outro': {
    en: "None of this is clever. A tagged logger, a webhook, a cron that self-pings. But the test of observability is not sophistication, it is whether the right person learns about a failure before a customer tells them. On that test this setup outperforms plenty of dashboards I have been bought and never opened.",
    sv: "Inget av detta är klurigt. En taggad loggare, en webhook, en cron som pingar sig själv. Men testet på observabilitet är inte sofistikering, det är om rätt person får veta att något fallerat innan en kund säger det. På det testet överträffar den här installationen gott och väl de dashboards jag fått betalda men aldrig öppnat."
  }
};

document.addEventListener('DOMContentLoaded', function(){
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  const btn = document.getElementById('lang-toggle');
  function apply(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const e = I18N_OBS[el.dataset.i18n];
      if (e && e[l]) el.innerHTML = e[l];
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
