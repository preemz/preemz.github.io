// BayarKerja stack post bilingual switcher (EN/SV).
const I18N_BK = {
 "t": {
  "en": "Next.js and Postgres on Cloudflare Workers: What Building BayarKerja Taught Me",
  "sv": "Next.js och Postgres på Cloudflare Workers: vad bygget av BayarKerja lärde mig"
 },
 "meta": {
  "en": "Primawan Satrio · September 2026 · ~9 min read",
  "sv": "Primawan Satrio · september 2026 · ~9 min lästid"
 },
 "p1": {
  "en": "<a href=\"https://bayarkerja.com\" target=\"_blank\" rel=\"noopener\">BayarKerja</a> is the payroll product I am building inside Satrio Consulting: Indonesian payroll with PPh 21 under the TER scheme and BPJS contributions, plus an Employer of Record site for overseas companies hiring in Indonesia. The first working version, from an empty repository to a deployed app with sign-in, a demo company, and a payroll run you can click through, came together over one weekend in 38 commits.",
  "sv": "<a href=\"https://bayarkerja.com\" target=\"_blank\" rel=\"noopener\">BayarKerja</a> är den lönetjänst jag bygger inom Satrio Consulting: indonesisk lönehantering med PPh 21 enligt TER-modellen och BPJS-avgifter, plus en Employer of Record-sajt för utländska företag som anställer i Indonesien. Den första fungerande versionen, från ett tomt repo till en driftsatt app med inloggning, ett demoföretag och en lönekörning man kan klicka sig igenom, kom till under en helg i 38 commits."
 },
 "p2": {
  "en": "<strong>Where it stands, plainly:</strong> BayarKerja is pre-launch. The free PPh 21 calculator and the demo workspace are live. The first client payroll runs only after a tax consultant signs off the rule set. Nobody is being paid through it yet, and this post does not pretend otherwise.",
  "sv": "<strong>Läget, rent ut sagt:</strong> BayarKerja är inte lanserat. Den kostnadsfria PPh 21-kalkylatorn och demomiljön är live. Den första lönekörningen för en kund görs först när en skattekonsult har godkänt regeluppsättningen. Ingen får lön genom systemet ännu, och det här inlägget låtsas inget annat."
 },
 "p3": {
  "en": "This post is about the stack. The tax engine is its own story. The part worth writing down is what happened when a Next.js app with a real Postgres database met the Cloudflare Workers runtime, because the runtime has opinions and it enforces them.",
  "sv": "Det här inlägget handlar om stacken. Skattemotorn är en egen historia. Det som är värt att skriva ner är vad som hände när en Next.js-app med en riktig Postgres-databas mötte Cloudflare Workers-miljön, för den miljön har bestämda åsikter och ser till att de följs."
 },
 "h_why": {
  "en": "Why this stack",
  "sv": "Varför den här stacken"
 },
 "why_p1": {
  "en": "KerjaBoard, my job board, runs on Workers with D1, Cloudflare's SQLite. Payroll is a different animal. It is money, it is relational all the way down (companies, members, employees, runs, payslips), every figure needs an audit trail, and several companies share one database. That is Postgres territory. I also wanted Next.js, because half of BayarKerja is public pages in Indonesian that have to rank in search, and the other half is an app.",
  "sv": "KerjaBoard, min jobbportal, körs på Workers med D1, Cloudflares SQLite. Lönehantering är något annat. Det handlar om pengar, datan är relationell rakt igenom (företag, medlemmar, anställda, körningar, lönebesked), varje siffra behöver ett revisionsspår och flera företag delar en databas. Det är Postgres-territorium. Jag ville också ha Next.js, eftersom halva BayarKerja är publika sidor på indonesiska som måste ranka i sök, och andra halvan är en app."
 },
 "why_p2": {
  "en": "So: Next.js 16, deployed to a single Cloudflare Worker through the OpenNext adapter, with Neon serverless Postgres, Drizzle as the query layer, and Better Auth for accounts. One Worker serves the Indonesian site, the English Employer of Record site, the calculator API, and the app. GitHub Actions runs the tests, builds, and deploys on every push to main.",
  "sv": "Alltså: Next.js 16, driftsatt till en enda Cloudflare Worker via OpenNext-adaptern, med Neon serverless Postgres, Drizzle som frågelager och Better Auth för konton. En Worker serverar den indonesiska sajten, den engelska Employer of Record-sajten, kalkylatorns API och appen. GitHub Actions kör testerna, bygger och driftsätter vid varje push till main."
 },
 "h_scope": {
  "en": "Lesson 1: there is no environment at module scope",
  "sv": "Lärdom 1: det finns ingen miljö på modulnivå"
 },
 "scope_p1": {
  "en": "In a Node server you create the database client at the top of a file and import it everywhere. On Workers under OpenNext, secrets like <code>DATABASE_URL</code> and the auth signing key do not exist when the module loads. They arrive with the request. Build the client at import time and it gets <code>undefined</code>.",
  "sv": "I en Node-server skapar man databasklienten överst i en fil och importerar den överallt. På Workers under OpenNext finns hemligheter som <code>DATABASE_URL</code> och autentiseringens signeringsnyckel inte när modulen laddas. De kommer med förfrågan. Bygger man klienten vid import får den <code>undefined</code>."
 },
 "scope_p2": {
  "en": "The fix keeps every <code>import { db }</code> call site unchanged: <code>db</code> is a small proxy that builds the real client the first time anything touches it, when the environment is there. Better Auth gets the same treatment. It is a dozen lines, and it is the kind of thing you only learn by deploying.",
  "sv": "Lösningen lämnar varje <code>import { db }</code> orörd: <code>db</code> är en liten proxy som bygger den riktiga klienten första gången något rör den, när miljön finns. Better Auth får samma behandling. Det är ett dussin rader, och det är sådant man bara lär sig genom att driftsätta."
 },
 "h_nl": {
  "en": "Lesson 2: echo adds a newline",
  "sv": "Lärdom 2: echo lägger till en radbrytning"
 },
 "nl_p1": {
  "en": "The first deploy with the database wired in could not reach it. The connection string was correct in GitHub's secret store and correct on my machine. The CI step that copied it into the Worker was <code>echo \"$DATABASE_URL\" | wrangler secret put DATABASE_URL</code>, and <code>echo</code> appends a newline. The Worker's secret ended in <code>\\n</code>, which is enough to break a Postgres URL.",
  "sv": "Den första driftsättningen med databasen inkopplad nådde den inte. Anslutningssträngen var korrekt i GitHubs hemlighetslager och korrekt på min dator. CI-steget som kopierade den till Workern var <code>echo \"$DATABASE_URL\" | wrangler secret put DATABASE_URL</code>, och <code>echo</code> lägger till en radbrytning. Workerns hemlighet slutade med <code>\\n</code>, vilket räcker för att förstöra en Postgres-URL."
 },
 "nl_p2": {
  "en": "Every secret now goes through <code>printf '%s'</code>, and the deploy step refuses to ship a Worker without an auth signing key rather than deploying one that cannot sign sessions. Half an hour of debugging for one character.",
  "sv": "Varje hemlighet går nu genom <code>printf '%s'</code>, och driftsättningssteget driftsättningen stoppas om signeringsnyckeln saknas, i stället för att skicka ut en Worker som inte kan signera sessioner. En halvtimmes felsökning för ett tecken."
 },
 "h_saga": {
  "en": "Lesson 3: the runtime decides your database driver",
  "sv": "Lärdom 3: miljön bestämmer din databasdrivrutin"
 },
 "saga_p1": {
  "en": "In the hour between 16:00 and 17:00 on that Saturday, the database setup changed five times:",
  "sv": "Under timmen mellan 16.00 och 17.00 den lördagen ändrades databasuppsättningen fem gånger:"
 },
 "fig1": {
  "en": "Figure 1. One hour of the database layer, from the git log. It ended where it started, on the HTTP driver, but for a different reason.",
  "sv": "Figur 1. En timme av databaslagret, ur git-loggen. Det slutade där det började, på HTTP-drivrutinen, men av ett annat skäl."
 },
 "saga_p2": {
  "en": "Neon offers two ways in from a Worker. The <strong>HTTP driver</strong> sends each query as a <code>fetch</code>: stateless, fast to start, and with no interactive transactions. The <strong>WebSocket driver</strong> keeps a real Postgres session open, so <code>BEGIN</code> and <code>COMMIT</code> work. A payroll run writes a run row, one payslip per employee, and the totals. That is exactly what transactions are for, so I switched to the WebSocket pool.",
  "sv": "Neon erbjuder två vägar in från en Worker. <strong>HTTP-drivrutinen</strong> skickar varje fråga som en <code>fetch</code>: tillståndslös, snabb att starta och utan interaktiva transaktioner. <strong>WebSocket-drivrutinen</strong> håller en riktig Postgres-session öppen, så <code>BEGIN</code> och <code>COMMIT</code> fungerar. En lönekörning skriver en körningsrad, ett lönebesked per anställd och totalerna. Det är precis vad transaktioner är till för, så jag bytte till WebSocket-poolen."
 },
 "saga_p3": {
  "en": "Nine minutes later I switched back. The pool was created once and cached, the way you would in Node, so the second request reused a socket the first request had opened. Workers do not allow that: I/O objects belong to the request that created them, and touching one from another request fails with an error about performing I/O on behalf of a different request. A long-lived connection pool is precisely the thing the Workers model forbids.",
  "sv": "Nio minuter senare bytte jag tillbaka. Poolen skapades en gång och cachades, som man gör i Node, så den andra förfrågan återanvände en socket som den första hade öppnat. Det tillåter inte Workers: I/O-objekt tillhör förfrågan som skapade dem, och att röra ett från en annan förfrågan misslyckas med ett fel om I/O för en annan förfrågans räkning. En långlivad anslutningspool är just det som Workers-modellen förbjuder."
 },
 "saga_p4": {
  "en": "The HTTP driver sidesteps the problem because there is nothing to share: one query, one <code>fetch</code>, done. So BayarKerja runs on it, and lives without transactions for now. The durable version of the fix is Cloudflare Hyperdrive with the standard <code>pg</code> driver, which pools connections outside the Worker and gives real transactions back. That move is planned before billing or the payroll ledger depends on atomic writes.",
  "sv": "HTTP-drivrutinen undviker problemet eftersom det inte finns något att dela: en fråga, en <code>fetch</code>, klart. Så BayarKerja körs på den och klarar sig utan transaktioner tills vidare. Den hållbara lösningen är Cloudflare Hyperdrive med standarddrivrutinen <code>pg</code>, som poolar anslutningar utanför Workern och ger tillbaka riktiga transaktioner. Den flytten är planerad innan fakturering eller lönebokföringen blir beroende av atomära skrivningar."
 },
 "h_notx": {
  "en": "Lesson 4: living without transactions, honestly",
  "sv": "Lärdom 4: att leva utan transaktioner, ärligt"
 },
 "notx_p1": {
  "en": "Without <code>BEGIN</code>/<code>COMMIT</code>, \"all or nothing\" has to be built by hand, and the honest thing is to say how far that goes. Four measures carry it:",
  "sv": "Utan <code>BEGIN</code>/<code>COMMIT</code> måste ”allt eller inget” byggas för hand, och det ärliga är att säga hur långt det räcker. Det vilar på fyra åtgärder:"
 },
 "notx_l1": {
  "en": "<strong>Compute before writing payslips.</strong> The payroll engine is pure: no I/O, no clock, integer rupiah. The run row goes in first because the payslips need its id; then every payslip is calculated in memory before any payslip is written, and a calculation error takes the same cleanup path as a failed write.",
  "sv": "<strong>Räkna innan lönebeskeden skrivs.</strong> Lönemotorn är ren: ingen I/O, ingen klocka, heltal i rupiah. Körningsraden skrivs först eftersom lönebeskeden behöver dess id; sedan räknas varje lönebesked ut i minnet innan något lönebesked skrivs, och ett beräkningsfel går samma städväg som en misslyckad skrivning."
 },
 "notx_l2": {
  "en": "<strong>Compensate on failure.</strong> If any write fails, the run's payslips and then the run shell are deleted before the error surfaces.",
  "sv": "<strong>Kompensera vid fel.</strong> Om någon skrivning misslyckas raderas körningens lönebesked och sedan själva körningsraden innan felet visas."
 },
 "notx_l3": {
  "en": "<strong>Let the database refuse duplicates.</strong> A unique index on (company, month) means a double click or a retry cannot create two payroll runs for the same month.",
  "sv": "<strong>Låt databasen vägra dubbletter.</strong> Ett unikt index på (företag, månad) gör att ett dubbelklick eller ett nytt försök inte kan skapa två lönekörningar för samma månad."
 },
 "notx_l4": {
  "en": "<strong>Guard state changes on the state you read.</strong> Approving a run updates it only <code>WHERE status</code> still equals what was read a moment ago. If another request got there first, zero rows change and the action fails loudly instead of skipping a step in the approval chain.",
  "sv": "<strong>Villkora statusbyten på den status du läste.</strong> Att godkänna en körning uppdaterar den bara <code>WHERE status</code> fortfarande är det som lästes nyss. Om en annan förfrågan hann före ändras noll rader och åtgärden misslyckas tydligt i stället för att hoppa över ett steg i godkännandekedjan."
 },
 "fig2": {
  "en": "Figure 2. How a payroll run is written on a driver without transactions.",
  "sv": "Figur 2. Hur en lönekörning skrivs med en drivrutin utan transaktioner."
 },
 "notx_p2": {
  "en": "This is compensation, not atomicity. A crash between the last payslip and the totals write would be visible, and the code says so in a comment next to the writes. For a while that comment said the opposite: it described the writes as one batched transaction, and the code never batched anything. A review pass caught it and the comment was rewritten to match the code. If you only read the comments, the system was transactional for most of a day.",
  "sv": "Det här är kompensation, inte atomicitet. En krasch mellan sista lönebeskedet och skrivningen av totalerna skulle synas, och koden säger det i en kommentar bredvid skrivningarna. Ett tag sa kommentaren motsatsen: den beskrev skrivningarna som en enda batchad transaktion, och koden batchade aldrig något. En granskning fångade det och kommentaren skrevs om så att den stämmer med koden. Om man bara läste kommentarerna var systemet transaktionellt större delen av ett dygn."
 },
 "notx_p3": {
  "en": "Sign-up has the same gap. The HTTP driver has no transactions, so Better Auth's adapter runs with them switched off and writes the user, the account, and the session as three separate statements. A sign-up that fails in the middle can leave a user without an account, which is one more reason the move to real transactions is first on the list below.",
  "sv": "Registreringen har samma lucka. HTTP-drivrutinen har inga transaktioner, så Better Auths adapter körs med dem avstängda och skriver användaren, kontot och sessionen som tre separata satser. En registrering som avbryts halvvägs kan lämna en användare utan konto, vilket är ytterligare ett skäl till att flytten till riktiga transaktioner står först på listan nedan."
 },
 "h_half": {
  "en": "Lesson 5: partial states are real states",
  "sv": "Lärdom 5: halvfärdiga tillstånd är riktiga tillstånd"
 },
 "half_p1": {
  "en": "Every new account gets its own demo company with twelve fictional employees and two calculated runs, so a visitor can try a full payroll cycle without entering anyone's real salary. Signing up against the live site found the bug that no test had: when building that demo company failed halfway, the visitor was signed in but belonged to no company. The app treated \"no company\" the same as \"not signed in\" and sent them to the sign-in page, where signing in led straight back to the sign-in page whenever the rebuild failed again.",
  "sv": "Varje nytt konto får ett eget demoföretag med tolv fiktiva anställda och två beräknade körningar, så att en besökare kan prova en hel lönecykel utan att mata in någons riktiga lön. En registrering mot den skarpa sajten hittade felet som inget test hade hittat: när bygget av demoföretaget misslyckades halvvägs var besökaren inloggad men tillhörde inget företag. Appen behandlade ”inget företag” som ”inte inloggad” och skickade dem till inloggningssidan, där inloggning ledde direkt tillbaka till inloggningssidan så länge återuppbyggnaden fortsatte att misslyckas."
 },
 "half_p2": {
  "en": "Without transactions, \"halfway\" is not an edge case, it is a state the system can be in. The fix was a repair path: when a session exists but no membership does, the app builds or reuses the demo company and carries on. If the repair itself fails, the visitor gets a page that explains what happened and offers a retry, instead of a sign-in form for someone who is already signed in.",
  "sv": "Utan transaktioner är ”halvvägs” inget specialfall, det är ett tillstånd systemet kan befinna sig i. Lösningen blev en reparationsväg: när en session finns men inget medlemskap skapar appen demoföretaget eller återanvänder det och fortsätter. Om själva reparationen misslyckas får besökaren en sida som förklarar vad som hände och erbjuder ett nytt försök, i stället för ett inloggningsformulär till någon som redan är inloggad."
 },
 "h_tenant": {
  "en": "Lesson 6: the tenant belongs in the WHERE clause",
  "sv": "Lärdom 6: tenanten hör hemma i WHERE-satsen"
 },
 "tenant_p1": {
  "en": "Several companies share one database, so the most important rule in the codebase is that one company can never see another's payroll. Today that is enforced in the application, not by Postgres row-level security, and it rests on a few rules:",
  "sv": "Flera företag delar en databas, så den viktigaste regeln i kodbasen är att ett företag aldrig kan se ett annat företags löner. I dag upprätthålls det i applikationen, inte av Postgres row-level security, och det vilar på några regler:"
 },
 "tenant_l1": {
  "en": "<strong>The company is part of the lookup, not a check afterwards.</strong> A query asks for \"run 42 belonging to this company\". A run id from another company is indistinguishable from one that does not exist.",
  "sv": "<strong>Företaget är en del av uppslaget, inte en kontroll efteråt.</strong> En fråga ber om ”körning 42 som tillhör det här företaget”. Ett körnings-id från ett annat företag går inte att skilja från ett som inte finns."
 },
 "tenant_l2": {
  "en": "<strong>Server actions are public endpoints.</strong> In Next.js a server action is a plain POST that anyone can send. A redirect on the page is not a security boundary, so every action checks the session and scopes its write to the signed-in company itself.",
  "sv": "<strong>Server actions är publika endpoints.</strong> I Next.js är en server action en vanlig POST som vem som helst kan skicka. En omdirigering på sidan är ingen säkerhetsgräns, så varje action kontrollerar sessionen och begränsar sin skrivning till det inloggade företaget."
 },
 "tenant_l3": {
  "en": "<strong>The demo persona switch can only take rights away.</strong> In a demo company you can view the app as an employee to see what staff see, and that view really does lose admin rights. Outside a demo company the setting is ignored, so a forged cookie changes nothing.",
  "sv": "<strong>Demons rollbyte kan bara ta bort rättigheter.</strong> I ett demoföretag kan man se appen som anställd för att se vad personalen ser, och den vyn förlorar verkligen adminrättigheterna. Utanför ett demoföretag ignoreras inställningen, så en förfalskad cookie ändrar ingenting."
 },
 "tenant_l4": {
  "en": "<strong>Small doors get closed too.</strong> The operator panel requires a verified email address, not just an address on a list, and internal redirects refuse protocol-relative targets like <code>//evil.com</code>.",
  "sv": "<strong>Små dörrar stängs också.</strong> Operatörspanelen kräver en verifierad e-postadress, inte bara en adress på en lista, och interna omdirigeringar vägrar protokollrelativa mål som <code>//evil.com</code>."
 },
 "tenant_p2": {
  "en": "Application-level scoping is one mistake away from a leak, which is why I want row-level security in Postgres underneath it as a second line of defence before real payroll data goes in.",
  "sv": "Med avgränsning enbart på applikationsnivå räcker det med ett misstag för att data ska läcka, och därför vill jag ha row-level security i Postgres under den som en andra försvarslinje innan riktig lönedata läggs in."
 },
 "h_engine": {
  "en": "The engine stays on the server",
  "sv": "Motorn stannar på servern"
 },
 "engine_p1": {
  "en": "The public PPh 21 calculator could have run in the browser. It does not: the page posts to an API route that uses the same TER, gross-up, and BPJS functions as the payroll engine, and tests check that it builds the tax base the same way the payslips do, so the two cannot quietly drift apart. The project has 116 tests, including golden tests pinned to the worked examples in the Indonesian tax office's own PPh 21 guide, and CI runs them before every build. A mismatch there is treated as a regulatory defect, not a stale expectation.",
  "sv": "Den publika PPh 21-kalkylatorn hade kunnat köras i webbläsaren. Det gör den inte: sidan skickar till en API-route som använder samma TER-, gross-up- och BPJS-funktioner som lönemotorn, och tester kontrollerar att den bygger skatteunderlaget på samma sätt som lönebeskeden, så att de två inte i tysthet börjar avvika från varandra. Projektet har 116 tester, bland dem golden tests låsta till räkneexemplen i den indonesiska skattemyndighetens (DJP) egen PPh 21-guide, och CI kör dem före varje bygge. En avvikelse där behandlas som ett regelfel, inte som en inaktuell förväntan."
 },
 "h_next": {
  "en": "What is next",
  "sv": "Vad som händer härnäst"
 },
 "next_l1": {
  "en": "Move to Hyperdrive and <code>pg</code>, so payroll runs and sign-ups become real transactions and the compensation code can go.",
  "sv": "Flytta till Hyperdrive och <code>pg</code>, så att lönekörningar och registreringar blir riktiga transaktioner och kompensationskoden kan tas bort."
 },
 "next_l2": {
  "en": "Add Postgres row-level security under the application checks.",
  "sv": "Lägga till row-level security i Postgres under applikationens kontroller."
 },
 "next_l3": {
  "en": "Tax-consultant sign-off on the rule set, then the first client payroll.",
  "sv": "Skattekonsultens godkännande av regeluppsättningen, och sedan den första lönekörningen för en kund."
 },
 "h_les": {
  "en": "What this taught me",
  "sv": "Vad det här lärde mig"
 },
 "les_l1": {
  "en": "<strong>Choose the driver after you know whether you need transactions.</strong> On Workers, that decision is made by the runtime, not by preference.",
  "sv": "<strong>Välj drivrutin när du vet om du behöver transaktioner.</strong> På Workers fattas det beslutet av miljön, inte av tycke och smak."
 },
 "les_l2": {
  "en": "<strong>Treat module scope as hostile.</strong> No environment, no shared sockets. Build lazily, per request.",
  "sv": "<strong>Behandla modulnivån som fientlig.</strong> Ingen miljö, inga delade sockets. Skapa klienten först när den behövs, per förfrågan."
 },
 "les_l3": {
  "en": "<strong>Partial states are states.</strong> If writes can stop halfway, design the page a user sees when they do.",
  "sv": "<strong>Halvfärdiga tillstånd är tillstånd.</strong> Om skrivningar kan stanna halvvägs, designa sidan användaren ser när det händer."
 },
 "les_l4": {
  "en": "<strong>The tenant goes in the WHERE clause,</strong> every time, and a foreign id should look exactly like a missing one.",
  "sv": "<strong>Tenanten hör hemma i WHERE-satsen,</strong> varje gång, och ett främmande id ska se ut precis som ett som saknas."
 },
 "les_l5": {
  "en": "<strong>Test against the live site.</strong> The worst bug of the weekend was found by signing up, not by the test suite.",
  "sv": "<strong>Testa mot den skarpa sajten.</strong> Helgens värsta fel hittades genom att registrera sig, inte av testsviten."
 },
 "outro": {
  "en": "A weekend is enough to get a Next.js and Postgres app running on the edge. It is not enough to make it trustworthy with other people's salaries, and the gap between those two is the list above. BayarKerja stays pre-launch until that list is done.",
  "sv": "En helg räcker för att få en Next.js- och Postgres-app att köra i edge-miljön. Den räcker inte för att göra den pålitlig med andras löner, och skillnaden mellan de två är listan ovan. BayarKerja lanseras inte förrän den listan är klar."
 },
 "back": {
  "en": "← Back to portfolio",
  "sv": "← Tillbaka till portfolion"
 }
};

document.addEventListener('DOMContentLoaded', function(){
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  const btn = document.getElementById('lang-toggle');
  function apply(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const e = I18N_BK[el.dataset.i18n];
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
