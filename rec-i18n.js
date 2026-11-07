// kerjaboard-recommendations post bilingual switcher (EN/SV).
const I18N_REC = {
 "t": {
  "en": "How KerjaBoard Recommends Jobs and Candidates: Two Passes, One Table",
  "sv": "Så rekommenderar KerjaBoard jobb och kandidater: två körningar, en tabell"
 },
 "meta": {
  "en": "Primawan Satrio · November 2026 · ~9 min read",
  "sv": "Primawan Satrio · november 2026 · ~9 min läsning"
 },
 "p1": {
  "en": "KerjaBoard is the job board my recruiting agency runs on. Its recommendation system answers three questions: which jobs a candidate should see, which candidates a recruiter should call about a job, and who gets an email when a job goes live. An <a href=\"/blog-scoring-engine.html\">earlier post</a> covers how one candidate and one job become a score. This post covers everything around the score: when it runs, where it is stored, who is told, and how we keep it honest.",
  "sv": "KerjaBoard är jobbtavlan som min rekryteringsbyrå kör på. Rekommendationssystemet svarar på tre frågor: vilka jobb en kandidat ska se, vilka kandidater en rekryterare ska ringa om ett jobb, och vem som får ett mejl när ett jobb publiceras. Ett <a href=\"/blog-scoring-engine.html\">tidigare inlägg</a> handlar om hur en kandidat och ett jobb blir en poäng. Det här inlägget handlar om allt runt poängen: när den räknas, var den lagras, vem som får veta och hur vi håller den ärlig."
 },
 "p2": {
  "en": "The scoring is deterministic. There is no model call per pair, so the same candidate and the same job always produce the same number, and every number carries its reasons. That keeps the system cheap to run across thousands of candidates and makes every failure inspectable. It also means the system is only as good as its rules, which the last section is honest about.",
  "sv": "Poängsättningen är deterministisk. Det finns inget modellanrop per par, så samma kandidat och samma jobb ger alltid samma tal, och varje tal bär sina skäl. Det gör systemet billigt att köra över tusentals kandidater och gör varje fel möjligt att granska. Det betyder också att systemet bara är så bra som sina regler, och det sista avsnittet är ärligt om det."
 },
 "h_table": {
  "en": "One table, two writers",
  "sv": "En tabell, två kodvägar som skriver"
 },
 "table_p1": {
  "en": "Every score lives in one table, <code>job_candidate_matches</code>, with one row per job and candidate pair. A row holds the percent, a label, a confidence level, a two-decimal <code>rankKey</code> that breaks ties between equal percents, the rubric version that produced it, a <code>visaGap</code> reason when work authorisation capped the score, and three timestamps recording who has already been told: the candidate emailed, the previous owner nudged, the team announced.",
  "sv": "Varje poäng ligger i en tabell, <code>job_candidate_matches</code>, med en rad per par av jobb och kandidat. Raden innehåller procenten, en etikett, en säkerhetsnivå, en <code>rankKey</code> med två decimaler som avgör ordningen mellan lika procent, poängmodellens version som gav poängen, ett <code>visaGap</code>-skäl när arbetstillstånd begränsade poängen, och tre tidsstämplar som visar vem som redan har fått veta: kandidaten mejlad, tidigare ägare påmind, teamet informerat."
 },
 "table_p2": {
  "en": "Two code paths write to it, one in each direction.",
  "sv": "Två kodvägar skriver till den, en i vardera riktningen."
 },
 "fig1": {
  "en": "Figure 1. Both passes write the same table. Readers do not care which pass produced a row, with one exception: only the candidate pass writes <code>visaGap</code>. Only the job pass is allowed to send mail or post to the team.",
  "sv": "Figur 1. Båda körningarna skriver till samma tabell. Läsarna bryr sig inte om vilken körning som gav en rad, med ett undantag: bara kandidatkörningen skriver <code>visaGap</code>. Bara jobbkörningen får skicka mejl eller posta till teamet."
 },
 "pass_l1": {
  "en": "<strong>The job pass.</strong> When a job goes live, whether a recruiter publishes it or an admin approves an employer’s post, the job is scored against every eligible candidate, which leaves out anyone who objected to sourcing and, for EU orders, anyone who declared a region outside the EU. This is the only pass that can send anything.",
  "sv": "<strong>Jobbkörningen.</strong> När ett jobb publiceras, antingen av en rekryterare eller genom att en admin godkänner en arbetsgivares annons, poängsätts jobbet mot varje kandidat som får ingå, vilket utesluter den som invänt mot sourcing och, för EU-jobb, den som angett en region utanför EU. Det är den enda körningen som kan skicka något."
 },
 "pass_l2": {
  "en": "<strong>The candidate pass.</strong> When a candidate saves a CV, applies to a job or answers the work-status questions, that candidate is scored against every live job. It writes rows and nothing else. It never emails and never announces.",
  "sv": "<strong>Kandidatkörningen.</strong> När en kandidat sparar ett CV, söker ett jobb eller svarar på arbetsstatusfrågorna poängsätts kandidaten mot varje publicerat jobb. Den skriver rader och inget annat. Den mejlar aldrig och informerar aldrig teamet."
 },
 "why_both": {
  "en": "Why both? The job pass alone leaves a gap: a candidate who registers on Tuesday has no scores against jobs published on Monday. The candidate pass alone cannot tell a recruiter who to call the moment a job goes live. Each covers the other’s blind spot, and because both write the same rows under the same rubric, readers rarely need to know which one ran. The one difference is that the visa reason is written only by the candidate pass.",
  "sv": "Varför båda? Enbart jobbkörningen lämnar ett hål: en kandidat som registrerar sig på tisdagen har inga poäng mot jobb som publicerades på måndagen. Enbart kandidatkörningen kan inte säga till en rekryterare vem som ska ringas i samma stund som ett jobb publiceras. Var och en täcker den andras blinda fläck, och eftersom båda skriver samma rader under samma poängmodell behöver läsarna sällan veta vilken som kördes. Skillnaden är att visumskälet bara skrivs av kandidatkörningen."
 },
 "h_delivery": {
  "en": "Delivery belongs to one writer",
  "sv": "Utskick hör till en enda körning"
 },
 "deliv_p1": {
  "en": "Two writers risk a double send. A candidate pass that re-scores a pair must never clear the flag saying that pair was already emailed. Both upserts list the columns they refresh, and the three notification timestamps are not among them, so one CV upload cannot re-mail old matches. The delete that prunes a candidate’s stale rows also skips any row that has been emailed.",
  "sv": "Två kodvägar som skriver riskerar dubbla utskick. En kandidatkörning som räknar om ett par får aldrig rensa flaggan som säger att paret redan har mejlats. Båda upserts listar de kolumner de uppdaterar, och de tre notistidsstämplarna är inte med, så en CV-uppladdning kan inte mejla gamla matchningar igen. Raderingen som rensar en kandidats gamla rader hoppar också över varje rad som har mejlats."
 },
 "deliv_p2": {
  "en": "A new job emails a candidate only if the match clears every gate below.",
  "sv": "Ett nytt jobb mejlar en kandidat bara om matchningen klarar varje spärr nedan."
 },
 "gates.h0": {
  "en": "Gate",
  "sv": "Spärr"
 },
 "gates.h1": {
  "en": "Rule",
  "sv": "Regel"
 },
 "gates.h2": {
  "en": "Why",
  "sv": "Varför"
 },
 "gates.r0c0": {
  "en": "Score",
  "sv": "Poäng"
 },
 "gates.r0c1": {
  "en": "72% or more",
  "sv": "72 % eller mer"
 },
 "gates.r0c2": {
  "en": "Raised from 70 when the rubric became graded. The threshold alone is never the anti-spam control",
  "sv": "Höjd från 70 när poängmodellen blev graderad. Gränsen ensam är aldrig skyddet mot skräppost"
 },
 "gates.r1c0": {
  "en": "Confidence",
  "sv": "Säkerhet"
 },
 "gates.r1c1": {
  "en": "Not low",
  "sv": "Inte låg"
 },
 "gates.r1c2": {
  "en": "A high score built on thin data is a likely source of junk mail",
  "sv": "En hög poäng byggd på tunn data är en trolig källa till skräppost"
 },
 "gates.r2c0": {
  "en": "Must-have coverage",
  "sv": "Täckning av måste-krav"
 },
 "gates.r2c1": {
  "en": "At least 60% of the order’s must-have skills evidenced, when it lists any",
  "sv": "Minst 60 % av jobbets måste-kompetenser belagda, när det anger några"
 },
 "gates.r2c2": {
  "en": "A total can be assembled from tenure, location and salary while the hard requirements are missing",
  "sv": "En totalpoäng kan byggas av anställningstid, plats och lön medan de hårda kraven saknas"
 },
 "gates.r3c0": {
  "en": "Consent",
  "sv": "Samtycke"
 },
 "gates.r3c1": {
  "en": "EU candidates: opt-in only. Everyone else: opt-out. Anyone who objected to sourcing: never",
  "sv": "EU-kandidater: bara opt-in. Alla andra: opt-out. Den som invänt mot sourcing: aldrig"
 },
 "gates.r3c2": {
  "en": "The GDPR region rules decide, not the score",
  "sv": "GDPR-reglerna för regionen avgör, inte poängen"
 },
 "gates.r4c0": {
  "en": "Volume",
  "sv": "Volym"
 },
 "gates.r4c1": {
  "en": "At most 25 emails per publish, strongest first",
  "sv": "Högst 25 mejl per publicering, starkast först"
 },
 "gates.r4c2": {
  "en": "A thin requirement block lets a lot of people clear the other gates",
  "sv": "Ett tunt kravblock låter många klara de andra spärrarna"
 },
 "gates.r5c0": {
  "en": "Once",
  "sv": "En gång"
 },
 "gates.r5c1": {
  "en": "One email per job and candidate pair",
  "sv": "Ett mejl per par av jobb och kandidat"
 },
 "gates.r5c2": {
  "en": "The notification timestamp on the row",
  "sv": "Notistidsstämpeln på raden"
 },
 "cap_story": {
  "en": "The volume cap had a bug worth telling. It first counted emails sent. Candidates who had already been notified were skipped without using a slot, so every re-publish or admin “re-run the engine” press could mail up to 25 more people. Four presses, a hundred emails. The cap now counts everyone who qualifies, whether or not they are mailed this time, so repeating the run cannot exceed it.",
  "sv": "Volymtaket hade en bugg värd att berätta. Först räknade det skickade mejl. Kandidater som redan fått besked hoppades över utan att ta en plats, så varje ompublicering eller admins tryck på ”kör motorn igen” kunde mejla upp till 25 personer till. Fyra tryck, hundra mejl. Taket räknar nu alla som kvalificerar sig, oavsett om de mejlas den här gången, så en upprepad körning kan inte överskrida det."
 },
 "team_p": {
  "en": "The same pass also tells the team. A strong match whose previous owner’s three-month ownership window has expired produces a nudge to that owner, in one channel for internal staff and another for freelancers. A strong match with no owner is announced so someone can claim the candidate. Staff also see a count of strong matches on the job page. Candidates never see that count.",
  "sv": "Samma körning informerar också teamet. En stark matchning vars tidigare ägares tremånadersfönster har gått ut ger en påminnelse till den ägaren, i en kanal för intern personal och en annan för frilansare. En stark matchning utan ägare annonseras så att någon kan ta kandidaten. Personalen ser också ett antal starka matchningar på jobbsidan. Kandidater ser aldrig det antalet."
 },
 "h_show": {
  "en": "Region and visa: rank, badge, never hide",
  "sv": "Region och visum: rangordna, märk, dölj aldrig"
 },
 "show_p1": {
  "en": "What a candidate sees is a read of stored rows, never a computation inside the page request. Three surfaces read them: a short list on the homepage, an Apply next block after an application, and a full For you page. They use a lower floor than staff do, 40% against 60%, because after the skill caps a candidate can honestly have nothing above 60, and an empty block makes the feature look broken. Possible fits rank below strong ones. On the site, candidates see a fit label, not the percentage.",
  "sv": "Det en kandidat ser är en läsning av lagrade rader, aldrig en beräkning inne i sidanropet. Tre ytor läser dem: en kort lista på startsidan, ett block Sök nästa efter en ansökan och en hel sida För dig. De använder en lägre gräns än personalen, 40 % mot 60 %, eftersom en kandidat efter kompetensbegränsningarna med rätta kan sakna allt över 60, och ett tomt block får funktionen att se trasig ut. Möjliga matchningar rankas under starka. På sajten ser kandidater en passningsetikett, inte procenten."
 },
 "visa_p1": {
  "en": "Work authorisation shows how two correct layers can build a trap. The scorer caps a match at 30% when a candidate needs sponsorship the order does not offer, and at 20% when they cannot work in the region. The display floor is 40%. So the capped jobs were dropped before the page rendered them, and the visa badge written to explain them could never appear. Each layer was right on its own.",
  "sv": "Arbetstillstånd visar hur två korrekta lager kan bygga en fälla. Poängsättaren begränsar en matchning till 30 % när en kandidat behöver sponsring som jobbet inte erbjuder, och till 20 % när de inte får arbeta i regionen. Visningsgränsen är 40 %. Så de begränsade jobben föll bort innan sidan ritade dem, och visumetiketten som skrevs för att förklara dem kunde aldrig visas. Varje lager var rätt för sig."
 },
 "visa_p2": {
  "en": "The fix records the reason when the score is computed. The row stores <code>visaGap</code>, the list waives the floor for rows that carry one, and it orders them after every uncapped match. The candidate sees the job, ranked low, with a badge saying why. The product rule is now: show every job, rank the ones the candidate cannot legally take lower, and say why.",
  "sv": "Lösningen är att spara skälet när poängen räknas. Raden lagrar <code>visaGap</code>, listan släpper gränsen för rader som har ett, och sorterar dem efter varje obegränsad matchning. Kandidaten ser jobbet, lågt rankat, med en etikett som säger varför. Produktregeln är nu: visa varje jobb, rangordna de som kandidaten inte lagligen kan ta lägre, och säg varför."
 },
 "region_p": {
  "en": "Region follows the same rule. The list keeps roles in the candidate’s own region, roles marked global, and roles whose location says remote. The rest move to a separate section on the For you page, with a count on the homepage. An early version of the “show the hidden roles” link only dropped the filter and kept the three-card limit. The hidden rows were visa-capped and sorted last, so the same three cards came back and it looked as if recommendations ignored region. A link that promises N rows has to open a list that contains them.",
  "sv": "Regionen följer samma regel. Listan behåller roller i kandidatens egen region, roller märkta globala och roller vars plats säger remote. Resten flyttas till ett eget avsnitt på sidan För dig, med ett antal på startsidan. En tidig version av länken ”visa de dolda rollerna” tog bara bort filtret och behöll gränsen på tre kort. De dolda raderna var visumbegränsade och sorterades sist, så samma tre kort kom tillbaka och det såg ut som att rekommendationerna ignorerade regionen. En länk som lovar N rader måste öppna en lista som innehåller dem."
 },
 "null_p": {
  "en": "One SQL detail cost a debugging session. An unlabelled job has a NULL region, and <code>NOT (NULL)</code> is NULL, so such a job landed in neither the in-region list nor the outside list, while a count written with <code>CASE WHEN</code> still counted it. The page said one, the database said forty-one. Every region test in the recommendation queries now goes through <code>IFNULL(regulatoryRegion, 'ID')</code>.",
  "sv": "En SQL-detalj kostade en felsökningssession. Ett jobb utan region har NULL, och <code>NOT (NULL)</code> är NULL, så jobbet hamnade varken i listan inom regionen eller utanför, medan en räkning skriven med <code>CASE WHEN</code> ändå räknade det. Sidan sa ett, databasen sa fyrtioett. Varje regiontest i rekommendationsfrågorna går nu genom <code>IFNULL(regulatoryRegion, 'ID')</code>."
 },
 "h_honest": {
  "en": "Keeping scores honest after the rules change",
  "sv": "Att hålla poängen ärliga när reglerna ändras"
 },
 "stamp_p1": {
  "en": "A score stored under old rules is a promise nobody can keep. The rubric has a version number and both directions stamp it. Candidate pages only show rows carrying the current version, and when none qualify they fall back to a keyword search instead of quoting a number we no longer stand behind. (The <a href=\"/blog-scoring-engine.html\">earlier post</a> tells how a missing job-side half of this once left a flat 100% on an order after the rubric had changed.)",
  "sv": "En poäng lagrad under gamla regler är ett löfte som ingen kan hålla. Poängmodellen har ett versionsnummer och båda riktningarna stämplar det. Kandidatsidor visar bara rader med aktuell version, och när inga kvalificerar sig faller de tillbaka på en nyckelordssökning i stället för att citera ett tal vi inte längre står bakom. (Det <a href=\"/blog-scoring-engine.html\">tidigare inlägget</a> berättar hur en saknad jobbsida av detta en gång lämnade en platt 100 % på ett jobb efter att poängmodellen hade ändrats.)"
 },
 "sweep_intro": {
  "en": "Two sweeps in the 15-minute cron drain the backlog after a version bump.",
  "sv": "Två svep i 15-minuterscronen tömmer kön efter en versionshöjning."
 },
 "sweep_l1": {
  "en": "<strong>Candidate warm-up.</strong> It walks 20 candidates per tick whose stamp is missing or older, and parses at most 8 CVs per tick, because a parse costs a storage read plus a PDF decode. A candidate without cached CV text waits for the next tick instead of being stamped current on thin data.",
  "sv": "<strong>Kandidatuppvärmning.</strong> Den går igenom 20 kandidater per tick vars stämpel saknas eller är äldre, och tolkar högst 8 CV per tick, eftersom en tolkning kostar en läsning från lagringen plus PDF-avkodning. En kandidat utan cachad CV-text väntar till nästa tick i stället för att stämplas som aktuell på tunn data."
 },
 "sweep_l2": {
  "en": "<strong>Job sweep.</strong> It takes one live order per tick, newest first, and rewrites up to 200 of its stale rows, strongest score first, because the top of a list is what recruiters read.",
  "sv": "<strong>Jobbsvep.</strong> Det tar ett publicerat jobb per tick, det nyaste först, och skriver om upp till 200 av dess inaktuella rader, starkaste poängen först, eftersom toppen av en lista är vad rekryterare läser."
 },
 "stamp_p2": {
  "en": "The candidate-side stamp sits on the user, not on the match rows. A row-level stamp would keep anyone whose CV legitimately matches nothing in the queue for ever, parsing their resume every tick without ever writing a row to satisfy it.",
  "sv": "Kandidatsidans stämpel sitter på användaren, inte på matchraderna. En stämpel på radnivå skulle behålla alla vars CV med rätta inte matchar något i kön för alltid, och tolka deras CV varje tick utan att någonsin skriva en rad som uppfyller den."
 },
 "cron_cost": {
  "en": "The sweeps must not become the problem themselves. D1 runs one query at a time, and after a bump the stale set is large. A count over it on every tick blocked logins and tracker moves, which failed with D1 internal errors at quarter past. A per-order <code>EXISTS</code> probe fixed it: the cost of a tick no longer grows with the size of the backlog. A related planner trap: <code>rubric IS NULL OR rubric &lt; V</code> made D1 read the whole table, about 256,000 rows, to find about 6,000. Splitting it into two <code>UNION ALL</code> halves brought the count query down to about 6,400 rows read.",
  "sv": "Svepen får inte själva bli problemet. D1 kör en fråga i taget, och efter en höjning är den inaktuella mängden stor. En räkning över den vid varje tick blockerade inloggningar och tracker-flyttar, som föll med interna D1-fel kvart över. En <code>EXISTS</code>-sondering per jobb löste det: kostnaden för en tick växer inte längre med köns storlek. En besläktad fälla i planeraren: <code>rubric IS NULL OR rubric &lt; V</code> fick D1 att läsa hela tabellen, cirka 256 000 rader, för att hitta cirka 6 000. Att dela upp det i två <code>UNION ALL</code>-hälfter sänkte räknefrågan till cirka 6 400 lästa rader."
 },
 "h_worker": {
  "en": "Fitting inside a Worker",
  "sv": "Att rymmas i en Worker"
 },
 "worker_p": {
  "en": "The first version of the job pass scored every candidate inside the publish request, parsing each resume from storage. It died with Cloudflare’s “exceeded resource limits” error (1102) once the candidate base grew into the thousands. Four changes made it fit.",
  "sv": "Första versionen av jobbkörningen poängsatte varje kandidat inne i publiceringsanropet och tolkade varje CV från lagringen. Den dog med Cloudflares fel om överskridna resursgränser (1102) när kandidatbasen växte till tusentals. Fyra ändringar fick den att rymmas."
 },
 "w_l1": {
  "en": "<strong>Parse once.</strong> Each candidate carries a cached copy of their CV text and terms, filled when the CV is uploaded. Scoring reads the cache instead of fetching and decoding a PDF.",
  "sv": "<strong>Tolka en gång.</strong> Varje kandidat har en cachad kopia av sin CV-text och sina termer, fylld när CV:t laddas upp. Poängsättningen läser cachen i stället för att hämta och avkoda en PDF."
 },
 "w_l2": {
  "en": "<strong>Write in batches.</strong> D1 allows about 100 bound parameters per statement, so the chunk size is the cap divided by parameters per row, rounded down: 11 rows at 9 parameters. At 10 parameters it is 9, one under what the arithmetic allows, because 10 rows would land exactly on the cap. A chunk of 18 rows, sized before two columns were added, once became 126 variables and failed on every publish. The arithmetic now sits in a comment beside the constant.",
  "sv": "<strong>Skriv i omgångar.</strong> D1 tillåter ungefär 100 bundna parametrar per sats, så omgångsstorleken är gränsen delad med antalet parametrar per rad, avrundat nedåt: 11 rader vid 9 parametrar. Vid 10 parametrar blir det 9, ett under vad räkningen tillåter, eftersom 10 rader skulle landa exakt på gränsen. En omgång på 18 rader, dimensionerad innan två kolumner lades till, blev en gång 126 variabler och föll vid varje publicering. Uträkningen står nu i en kommentar vid konstanten."
 },
 "w_l3": {
  "en": "<strong>Skip pairs with no signal.</strong> A zero score writes no row, and on the candidate side it prunes the row it replaces.",
  "sv": "<strong>Hoppa över par utan signal.</strong> En nollpoäng skriver ingen rad, och på kandidatsidan rensar den bort raden den ersätter."
 },
 "w_l4": {
  "en": "<strong>Run it after the response.</strong> Publishing hands the job to <code>waitUntil</code>, so a slow or broken recommender cannot fail the publish.",
  "sv": "<strong>Kör efter svaret.</strong> Publiceringen lämnar över jobbet till <code>waitUntil</code>, så en långsam eller trasig rekommendationsmotor kan inte få publiceringen att misslyckas."
 },
 "h_silent": {
  "en": "How it fails silently",
  "sv": "Hur den felar tyst"
 },
 "silent_p1": {
  "en": "Because publishing must never fail on account of the recommender, its errors are caught and turned into a metric, and the publisher still sees “the job is live”. That is the right call for the person publishing and a risky one for the system: nothing on the publish screen shows that scoring died, and a broken scorer produces the same empty result as a candidate base with no matches.",
  "sv": "Eftersom publicering aldrig får misslyckas på grund av rekommendationsmotorn fångas dess fel och blir ett mätvärde, och den som publicerar ser fortfarande ”jobbet är live”. Det är rätt val för den som publicerar och ett riskabelt för systemet: inget på publiceringssidan visar att poängsättningen dog, och en trasig poängsättare ger samma tomma resultat som en kandidatbas utan matchningar."
 },
 "silent_p2": {
  "en": "In September a change to the job pass read a block-scoped constant after its <code>try</code> block. On the first scored candidate it threw a ReferenceError. Publishing still said the job went live. The pass wrote no rows, sent no emails and announced nothing, and the interface said nothing about it. The only trace was an error line in the monitoring channel, easy to read as noise. No test in the suite calls the pass, so nothing failed before the deploy.",
  "sv": "I september läste en ändring i jobbkörningen en blockavgränsad konstant efter sitt <code>try</code>-block. Vid första poängsatta kandidaten kastade den ett ReferenceError. Publiceringen sa ändå att jobbet gick live. Körningen skrev inga rader, skickade inga mejl och informerade ingen, och gränssnittet sa ingenting om det. Det enda spåret var en felrad i övervakningskanalen, lätt att läsa som brus. Inget test i sviten anropar körningen, så inget föll före driftsättningen."
 },
 "silent_p3": {
  "en": "Two habits came out of it. After any change to the pass, I run the real module in Node with a stubbed data layer and assert that it finishes and writes one row per scored candidate. And background work needs a positive signal, not only an error alarm: the pass logs candidates, scored and matching counts on every run, so a pass that did nothing shows up as a missing line.",
  "sv": "Två vanor kom ur det. Efter varje ändring av körningen kör jag den riktiga modulen i Node med ett stubbat datalager och kontrollerar att den blir klar och skriver en rad per poängsatt kandidat. Och bakgrundsarbete behöver en positiv signal, inte bara ett felalarm: körningen loggar antal kandidater, poängsatta och matchande vid varje körning, så en tyst körning syns som en saknad rad."
 },
 "silent_p4": {
  "en": "The sweeps have the same disease. A sweep that throws every tick, and one that runs and does nothing, look just like one with nothing to do. So a watchdog compares the two: if an open order still has stale rows the sweep could rewrite and the tick rewrote none, it posts to the monitoring channel.",
  "sv": "Svepen har samma sjukdom. Ett svep som kastar fel vid varje tick, och ett som körs och inte gör något, ser ut precis som ett som inte har något att göra. Därför jämför en vakthund de två: om ett öppet jobb fortfarande har inaktuella rader som svepet kunde skriva om och ticken skrev om inga, postar den i övervakningskanalen."
 },
 "silent_p5": {
  "en": "The loudest alert can be as bad as none. The first metric wrapper posted one line per scored candidate to the team’s monitoring channel, in bursts of twenty from the warm-up. Success lines now go to the logs, and the channel only hears about error-class events.",
  "sv": "Det högljuddaste larmet kan vara lika dåligt som inget. Första mätvärdesomslaget postade en rad per poängsatt kandidat i teamets övervakningskanal, i skurar om tjugo från uppvärmningen. Framgångsrader går nu till loggarna, och kanalen hör bara om fel."
 },
 "silent_p6": {
  "en": "The last silent failure is the input. Some PDFs use fonts that decode one-to-one to the wrong letters, so “Government” arrives as punctuation soup that is still plain ASCII. A sales director’s CV parsed into exactly two terms, C# and R, and scored 93% against a foodtech R&amp;D role. A readability gate now rejects text that is under about half letters, and the scorer falls back to the profile alone instead of inventing matches.",
  "sv": "Det sista tysta felet är indata. Vissa PDF:er använder typsnitt som avkodas ett-till-ett till fel bokstäver, så ”Government” kommer fram som skiljetecken som ändå är vanlig ASCII. Ett försäljningschefs-CV tolkades till exakt två termer, C# och R, och fick 93 % mot en foodtech-roll inom FoU. En läsbarhetsspärr avvisar nu text som är under ungefär hälften bokstäver, och poängsättaren faller tillbaka på enbart profilen i stället för att hitta på matchningar."
 },
 "h_weak": {
  "en": "What is still weak",
  "sv": "Vad som fortfarande är svagt"
 },
 "weak_l1": {
  "en": "<strong>The thresholds are judgment, not calibration.</strong> The cut-offs (72 to email, 60 to highlight, 40 to show) came from reading real lists. Recruiters can mark a fit score as right or wrong, and that table is empty, so there is no disagreement rate to tune against. Application outcomes are a noisy substitute, since a rejection can be about salary or a filled seat. So far there is no human-labelled set of pairs to measure against.",
  "sv": "<strong>Gränserna är omdöme, inte kalibrering.</strong> Gränserna (72 för mejl, 60 för markering, 40 för visning) kom från att läsa verkliga listor. Rekryterare kan markera en passningspoäng som rätt eller fel, och den tabellen är tom, så det finns ingen oenighetsgrad att justera mot. Ansökningsutfall är en brusig ersättning, eftersom ett avslag kan handla om lön eller en tillsatt tjänst. Hittills finns ingen människomärkt uppsättning par att mäta mot."
 },
 "weak_l2": {
  "en": "<strong>Team notifications are not capped like email.</strong> The ceiling is 25 emails per publish, but owner nudges and unowned-candidate announcements run for every strong match. A thin order can make that channel loud.",
  "sv": "<strong>Teamnotiser är inte begränsade som mejl.</strong> Taket är 25 mejl per publicering, men ägarpåminnelser och annonseringar av kandidater utan ägare körs för varje stark matchning. Ett tunt jobb kan göra den kanalen högljudd."
 },
 "weak_l3": {
  "en": "<strong>The passes have no automated test.</strong> The scorer has invariant tests and the For you page runs real handlers against the real schema. Neither pass, the delivery rules nor the sweeps has a guard in CI. The stub check above is something I run by hand.",
  "sv": "<strong>Körningarna har inget automatiskt test.</strong> Poängsättaren har invarianttester och sidan För dig kör riktiga hanterare mot det riktiga schemat. Varken någon av körningarna, utskicksreglerna eller svepen har en spärr i CI. Kontrollen med stubbat datalager ovan är något jag kör för hand."
 },
 "weak_l4": {
  "en": "<strong>It matches words, not meaning.</strong> Skills and years are read from text, so a candidate who describes the same work in different words scores lower. An AI-written fit note exists, but only for submitted applications and as a separate read for recruiters. It does not feed recommendations.",
  "sv": "<strong>Den matchar ord, inte mening.</strong> Kompetenser och år läses ur text, så en kandidat som beskriver samma arbete med andra ord får lägre poäng. En AI-skriven passningsbedömning finns, men bara för inskickade ansökningar och som en separat läsning för rekryterare. Den matar inte rekommendationerna."
 },
 "outro": {
  "en": "The score was the easy part. Most of the work went into who gets told, whether a stored number still means what it says, and making failure audible.",
  "sv": "Poängen var den enkla delen. Det mesta av arbetet gick åt till vem som får veta, om ett lagrat tal fortfarande betyder det det säger, och att göra fel hörbara."
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
      const e = I18N_REC[el.dataset.i18n];
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
