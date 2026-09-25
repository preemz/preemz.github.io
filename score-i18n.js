// Scoring-engine post bilingual switcher (EN/SV).
const I18N_SCORE = {
 "t": {
  "en": "Why Half Our Matches Said 100%: Rebuilding KerjaBoard's Fit Scoring",
  "sv": "Varför hälften av våra matchningar visade 100 %: så byggde vi om KerjaBoards matchningspoäng"
 },
 "meta": {
  "en": "Primawan Satrio · September 2026 · ~10 min read",
  "sv": "Primawan Satrio · september 2026 · ca 10 min läsning"
 },
 "p1": {
  "en": "KerjaBoard, the job board my recruiting agency runs on, scores every candidate against every live job order and shows recruiters a percentage with the reasons behind it. In August I wrote about <a href=\"/blog-ai-recruiting-pipeline.html\">how that engine works</a>. This post is about what happened when we looked hard at the numbers it produced: <strong>nearly half of all stored matches sat at exactly 100%</strong>.",
  "sv": "KerjaBoard, jobbportalen som min rekryteringsbyrå bygger verksamheten på, poängsätter varje kandidat mot varje aktiv jobborder och visar rekryterarna en procentsats med skälen bakom. I augusti skrev jag om <a href=\"/blog-ai-recruiting-pipeline.html\">hur motorn fungerar</a>. Det här inlägget handlar om vad som hände när vi granskade siffrorna den faktiskt gav: <strong>nästan hälften av alla sparade matchningar låg på exakt 100 %</strong>."
 },
 "p2": {
  "en": "A score that says 100% for half the pool is not a score. It is a checklist wearing a percentage sign. Over three releases in September we rebuilt it into something that ranks. And while writing this post, I found one more bug in the version we had shipped that same morning. That fix is in here too.",
  "sv": "En poäng som säger 100 % för halva poolen är ingen poäng. Det är en checklista med ett procenttecken. Under tre releaser i september byggde vi om den till något som faktiskt rangordnar. Och medan jag skrev det här inlägget hittade jag ytterligare en bugg i versionen vi släppt samma morgon. Den rättelsen finns också med här."
 },
 "h_sym": {
  "en": "The symptom: the top of every list was a tie",
  "sv": "Symptomet: dött lopp i toppen av varje lista"
 },
 "sym_p1": {
  "en": "Recruiters open a job order's match list to decide who to call first. When 25 of 74 candidates on one order all read 100%, the order among them came from the database, not from the candidates. Reload the page and the \"top\" candidate could change. A recruiter has no reason to trust the top of a list like that.",
  "sv": "Rekryterare öppnar en jobborders matchningslista för att bestämma vem de ska ringa först. När 25 av 74 kandidater på en order alla visade 100 % kom ordningen mellan dem från databasen, inte från kandidaterna. Ladda om sidan och ”toppkandidaten” kunde bytas. En rekryterare har ingen anledning att lita på toppen av en sådan lista."
 },
 "h_cause": {
  "en": "The cause: every dimension was a bar",
  "sv": "Orsaken: varje dimension var en ribba"
 },
 "cause_p1": {
  "en": "The engine has six weighted dimensions: must-have skills (35), language (25), years of experience (20), tenure stability (15), seniority (10), and commercial fit such as salary, notice period, and location (15). Each one only counts when the job order asks for it. That design was sound. The grading <em>inside</em> each dimension was not. Each one was a bar: clear it and you earn full marks, with nothing for clearing it by more.",
  "sv": "Motorn har sex viktade dimensioner: obligatoriska färdigheter (35), språk (25), års erfarenhet (20), anställningsstabilitet (15), senioritet (10) och kommersiell matchning som lön, uppsägningstid och ort (15). Var och en räknas bara när jobbordern efterfrågar den. Den designen höll. Betygsättningen <em>inom</em> varje dimension gjorde det inte. Varje dimension var en ribba: klarar du den får du full pott, och inget extra för att klara den med marginal."
 },
 "cause_l1": {
  "en": "<strong>Years:</strong> <code>min(1, years ÷ minimum)</code>. On a \"3+ years\" order, 3 years and 12 years scored the same.",
  "sv": "<strong>År:</strong> <code>min(1, år ÷ minimum)</code>. På en order med ”3+ år” fick 3 år och 12 år samma poäng."
 },
 "cause_l2": {
  "en": "<strong>Tenure:</strong> full marks at 24 months, so two years in the current seat tied with ten.",
  "sv": "<strong>Anställningstid:</strong> full pott vid 24 månader, så två år i nuvarande roll var lika mycket värt som tio."
 },
 "cause_l3": {
  "en": "<strong>Seniority:</strong> any level at or above the role scored full marks, so a Director on a Senior role tied with a Senior.",
  "sv": "<strong>Senioritet:</strong> alla nivåer på eller över rollens gav full pott, så en Director på en Senior-roll fick samma poäng som en Senior."
 },
 "cause_l4": {
  "en": "<strong>Missing data:</strong> a dimension the candidate could not answer was dropped from the denominator. Being less documented could raise your score.",
  "sv": "<strong>Saknade uppgifter:</strong> en dimension kandidaten inte kunde besvara föll bort ur nämnaren. Att vara sämre dokumenterad kunde höja poängen."
 },
 "cause_p2": {
  "en": "A pool of qualified people clears all the bars. So a checklist of bars cannot rank qualified people, and ranking qualified people is the only ranking recruiters actually need.",
  "sv": "En pool av kvalificerade personer klarar alla ribbor. Därför kan en checklista av ribbor inte rangordna kvalificerade personer, och det är just den rangordningen rekryterare behöver."
 },
 "h_grade": {
  "en": "Grading instead of checking",
  "sv": "Betygsätta i stället för att bocka av"
 },
 "grade_p1": {
  "en": "The new rubric grades each dimension:",
  "sv": "Den nya poängmodellen betygsätter varje dimension:"
 },
 "grade_l1": {
  "en": "<strong>Years follow a diminishing-returns curve.</strong> Meeting the minimum earns 0.6 of the weight; depth earns the rest, reaching full marks at four times the minimum.",
  "sv": "<strong>År följer en kurva med avtagande avkastning.</strong> Att nå minimikravet ger 0,6 av vikten; djupet ger resten, med full pott vid fyra gånger minimikravet."
 },
 "grade_l2": {
  "en": "<strong>Tenure rewards continuously</strong> up to 36 months in the current role.",
  "sv": "<strong>Anställningstid belönas kontinuerligt</strong> upp till 36 månader i nuvarande roll."
 },
 "grade_l3": {
  "en": "<strong>Seniority scores closeness, not clearance.</strong> One level above the role earns 0.85, two or more earns 0.6 and is flagged \"Overqualified\".",
  "sv": "<strong>Senioritet mäter närhet, inte bara att ribban klaras.</strong> En nivå över rollen ger 0,85, två eller fler ger 0,6 och flaggas som ”Överkvalificerad”."
 },
 "grade_l4": {
  "en": "<strong>The exact unrounded score is stored</strong> as a <code>rankKey</code> tie-break, so two candidates shown at 89% still have a stable order.",
  "sv": "<strong>Den exakta, oavrundade poängen sparas</strong> som en <code>rankKey</code> för att bryta lika poäng, så två kandidater som båda visar 89 % ändå har en stabil ordning."
 },
 "grade_l5": {
  "en": "<strong>Missing data is only partly handled.</strong> If the order asks for years and the candidate never states them, that dimension earns zero, and a score resting on under half of the rubric is capped at 60. But unknown tenure, seniority, and commercial fit still drop out of the denominator, so a CV without dates can outscore one that shows 13 months in the current role (93 against 84 on the order below). That is the next fix.",
  "sv": "<strong>Saknade uppgifter är bara delvis åtgärdade.</strong> Om ordern kräver år och kandidaten aldrig anger dem ger den dimensionen noll, och en poäng som vilar på mindre än halva poängmodellen får tak på 60. Men okänd anställningstid, senioritet och kommersiell matchning faller fortfarande bort ur nämnaren, så ett CV utan datum kan få högre poäng än ett som visar 13 månader i nuvarande roll (93 mot 84 på ordern nedan). Det är nästa rättelse."
 },
 "fig1": {
  "en": "Figure 1. The years dimension before and after. The old bar paid full marks from the minimum upward; the graded curve keeps paying for depth.",
  "sv": "Figur 1. Årsdimensionen före och efter. Den gamla ribban gav full pott från minimikravet och uppåt; den graderade kurvan fortsätter belöna djup."
 },
 "tbl_intro": {
  "en": "Here is the same job order scored by the mid-September engine and the current one. The order asks for Node.js, PostgreSQL, and Docker, 3+ years, Kubernetes as a plus, hybrid in Jakarta. The candidates are synthetic.",
  "sv": "Här är samma jobborder poängsatt av motorn från mitten av september och av den nuvarande. Ordern kräver Node.js, PostgreSQL och Docker, 3+ år, Kubernetes som merit, hybrid i Jakarta. Kandidaterna är påhittade."
 },
 "tbl": {
  "en": "<table><tr><th>Candidate</th><th class=\"num\">Before</th><th class=\"num\">Now</th></tr><tr><td>3 yrs, Senior, 1 yr in current role</td><td class=\"num\">94%</td><td class=\"num\">81%</td></tr><tr><td>6 yrs, Senior, 2 yrs in current role</td><td class=\"num\">100%</td><td class=\"num\">89%</td></tr><tr><td>12 yrs, Senior, 4 yrs in role, has Kubernetes</td><td class=\"num\">100%</td><td class=\"num\">100%</td></tr><tr><td>15 yrs, Engineering Director</td><td class=\"num\">100%</td><td class=\"num\">98%</td></tr><tr><td>20 yrs, has 1 of the 3 must-have skills</td><td class=\"num\">75%</td><td class=\"num\">55% (capped)</td></tr><tr><td>20 yrs, sales background, none of the skills</td><td class=\"num\">35% (capped)</td><td class=\"num\">35% (capped)</td></tr></table>",
  "sv": "<table><tr><th>Kandidat</th><th class=\"num\">Före</th><th class=\"num\">Nu</th></tr><tr><td>3 år, Senior, 1 år i nuvarande roll</td><td class=\"num\">94 %</td><td class=\"num\">81 %</td></tr><tr><td>6 år, Senior, 2 år i nuvarande roll</td><td class=\"num\">100 %</td><td class=\"num\">89 %</td></tr><tr><td>12 år, Senior, 4 år i rollen, kan Kubernetes</td><td class=\"num\">100 %</td><td class=\"num\">100 %</td></tr><tr><td>15 år, Engineering Director</td><td class=\"num\">100 %</td><td class=\"num\">98 %</td></tr><tr><td>20 år, har 1 av 3 obligatoriska färdigheter</td><td class=\"num\">75 %</td><td class=\"num\">55 % (tak)</td></tr><tr><td>20 år, säljbakgrund, ingen av färdigheterna</td><td class=\"num\">35 % (tak)</td><td class=\"num\">35 % (tak)</td></tr></table>"
 },
 "tbl_p2": {
  "en": "Three candidates tied at 100% now separate into 89, 98, and 100. The honest part: the Director still scores 98. That is deliberate. Overqualification is a risk for the recruiter to judge (will they stay, will the salary fit?), not a capability gap, so it costs a little and raises a flag instead of burying a strong candidate.",
  "sv": "Tre kandidater som delade 100 % separeras nu till 89, 98 och 100. Den ärliga delen: Directorn får fortfarande 98. Det är avsiktligt. Överkvalificering är en risk för rekryteraren att bedöma (stannar personen, passar lönen?), inte en kompetensbrist, så den kostar lite och flaggas i stället för att begrava en stark kandidat."
 },
 "h_caps": {
  "en": "Experience must not carry a match without skills",
  "sv": "Erfarenhet får inte bära en matchning utan färdigheter"
 },
 "caps_p1": {
  "en": "The graded curves made a different problem visible. When we reviewed a real senior sales candidate based in Europe, their recommendations were led by Jakarta roles at 88%, scored almost entirely on years of experience, for jobs they had no matching skills for and could not take. Two fixes shipped the day before the new rubric:",
  "sv": "De graderade kurvorna synliggjorde ett annat problem. När vi granskade en verklig senior säljkandidat baserad i Europa toppades rekommendationerna av Jakarta-roller på 88 %, poängsatta nästan bara på års erfarenhet, för jobb som kandidaten saknade färdigheterna för och ändå inte kunde ta. Två rättelser släpptes dagen före den nya poängmodellen:"
 },
 "caps_l1": {
  "en": "<strong>Caps on skill coverage.</strong> No must-have skill evidenced caps the score at 35; under half caps it at 55; an order that states no must-have skills at all caps at 50, because there is nothing to verify. Before this, an empty placeholder posting scored a candidate 100% on a notice period alone.",
  "sv": "<strong>Tak för färdighetstäckning.</strong> Ingen obligatorisk färdighet belagd ger ett tak på 35; under hälften ger 55; en order utan obligatoriska färdigheter alls får tak på 50, eftersom det inte finns något att verifiera. Innan detta gav en tom platshållarannons en kandidat 100 % enbart på uppsägningstiden."
 },
 "caps_l2": {
  "en": "<strong>Region filtering.</strong> Candidates are recommended roles in their own region, plus multi-region and remote orders. The list says how many roles were held back and has a show-all toggle, so nothing is hidden silently.",
  "sv": "<strong>Regionfilter.</strong> Kandidater rekommenderas roller i sin egen region, plus flerregionala och distansbaserade ordrar. Listan anger hur många roller som hölls tillbaka och har en visa-alla-knapp, så inget döljs i tysthet."
 },
 "caps_p2": {
  "en": "Every cap explains itself in the breakdown, for example: capped at 55% because only 33% of the must-have skills are evidenced. A recruiter can disagree with a cap, but can never be confused by one.",
  "sv": "Varje tak förklarar sig självt i poängförklaringen, till exempel: tak på 55 % eftersom bara 33 % av de obligatoriska färdigheterna är belagda. En rekryterare kan ha invändningar mot ett tak, men aldrig bli förvirrad av det."
 },
 "captbl": {
  "en": "<table><tr><th>Condition</th><th class=\"num\">Score cannot exceed</th></tr><tr><td>None of the must-have skills evidenced</td><td class=\"num\">35</td></tr><tr><td>Under half of the must-have skills evidenced</td><td class=\"num\">55</td></tr><tr><td>The order states no must-have skills</td><td class=\"num\">50</td></tr><tr><td>No evidence of a required language</td><td class=\"num\">35</td></tr><tr><td>One level short on a required language</td><td class=\"num\">75</td></tr><tr><td>Under 12 months in the current role</td><td class=\"num\">70</td></tr><tr><td>Averages under 15 months across 3+ roles</td><td class=\"num\">75</td></tr><tr><td>Needs visa sponsorship the order does not offer</td><td class=\"num\">30</td></tr><tr><td>Not eligible to work in the region</td><td class=\"num\">20</td></tr><tr><td>Too little on file to score confidently</td><td class=\"num\">60</td></tr></table>",
  "sv": "<table><tr><th>Villkor</th><th class=\"num\">Poängen kan inte överstiga</th></tr><tr><td>Ingen av de obligatoriska färdigheterna belagd</td><td class=\"num\">35</td></tr><tr><td>Under hälften av de obligatoriska färdigheterna belagda</td><td class=\"num\">55</td></tr><tr><td>Ordern anger inga obligatoriska färdigheter</td><td class=\"num\">50</td></tr><tr><td>Inget belägg för ett krävt språk</td><td class=\"num\">35</td></tr><tr><td>En nivå under på ett krävt språk</td><td class=\"num\">75</td></tr><tr><td>Under 12 månader i nuvarande roll</td><td class=\"num\">70</td></tr><tr><td>Snitt under 15 månader över 3+ roller</td><td class=\"num\">75</td></tr><tr><td>Behöver visumsponsring som ordern inte erbjuder</td><td class=\"num\">30</td></tr><tr><td>Inte behörig att arbeta i regionen</td><td class=\"num\">20</td></tr><tr><td>För lite underlag för en säker bedömning</td><td class=\"num\">60</td></tr></table>"
 },
 "caps_p3": {
  "en": "Salary, notice period, and relocation are deliberately <em>not</em> caps. They affect whether a hire closes, not whether the person can do the job, so they score and raise flags. Work authorisation is the one commercial factor that does cap, because a candidate who cannot legally be hired cannot be placed, whatever their CV says.",
  "sv": "Lön, uppsägningstid och flytt är medvetet <em>inte</em> tak. De påverkar om en anställning går i mål, inte om personen klarar jobbet, så de poängsätts och flaggas. Arbetstillstånd är den enda kommersiella faktorn som sätter tak, eftersom en kandidat som inte lagligt kan anställas inte kan placeras, oavsett vad CV:t säger."
 },
 "fig2": {
  "en": "Figure 2. How a score is assembled. The lowest applicable cap wins, and the stored row records which rubric produced it.",
  "sv": "Figur 2. Så sätts en poäng ihop. Det lägsta tillämpliga taket gäller, och den sparade raden anger vilken poängmodell som gav den."
 },
 "h_stale": {
  "en": "The bug behind the bug: scores that outlived their rules",
  "sv": "Buggen bakom buggen: poäng som överlevde sina regler"
 },
 "stale_p1": {
  "en": "Fixing the rubric was half the job. The other half was getting the new numbers onto the board. The code had a <code>MATCH_RUBRIC_VERSION</code> constant and a comment saying every stored match carried it. <strong>The column did not exist.</strong> A cron job re-scored candidates when the rubric changed, but nothing ever re-scored a job order. So an order nobody touched kept the numbers it was published with: on one order, more than 200 candidates still showed a flat 100% that the current engine scores at 50%.",
  "sv": "Att rätta poängmodellen var halva jobbet. Den andra halvan var att få ut de nya siffrorna på tavlan. Koden hade en konstant <code>MATCH_RUBRIC_VERSION</code> och en kommentar om att varje sparad matchning bar den. <strong>Kolumnen fanns inte.</strong> Ett cron-jobb poängsatte om kandidater när poängmodellen ändrades, men ingenting poängsatte någonsin om en jobborder. En order som ingen rörde behöll alltså siffrorna från publiceringen: på en order visade över 200 kandidater fortfarande platta 100 % som den nuvarande motorn ger 50 %."
 },
 "stale_l1": {
  "en": "Every stored match now records which rubric produced it, alongside the per-candidate stamp the cron already used.",
  "sv": "Varje sparad matchning registrerar nu vilken poängmodell som gav den, utöver den stämpel per kandidat som cron-jobbet redan använde."
 },
 "stale_l2": {
  "en": "A second sweep walks job orders, those with the most visible stale scores first and the highest scores first within each, because the top of a list is what recruiters read. It is bounded per cron tick and it terminates: every row it rewrites carries the current rubric, so the queue only shrinks. If a tick makes no progress, the Monitoring channel on Discord says so.",
  "sv": "Ett andra svep går igenom jobbordrar, de med flest synliga inaktuella poäng först och högsta poäng först inom varje order, eftersom toppen av listan är det rekryterare läser. Det är begränsat per cron-körning och det blir klart: varje rad det skriver om bär den aktuella poängmodellen, så kön bara krymper. Om en körning inte gör framsteg säger Monitoring-kanalen på Discord till."
 },
 "stale_l3": {
  "en": "Admins get a re-score button that drains the queue in larger batches and reports what is left.",
  "sv": "Administratörer har en knapp för omräkning som tömmer kön i större omgångar och rapporterar vad som återstår."
 },
 "stale_l4": {
  "en": "Candidates only ever see a fit percentage produced by the current rubric. Stale scores are hidden, and if none are current, their recommendations fall back to keyword search rather than quote a number we no longer stand behind.",
  "sv": "Kandidater ser bara en matchningsprocent som den aktuella poängmodellen har gett. Inaktuella poäng döljs, och om ingen är aktuell faller rekommendationerna tillbaka på nyckelordssökning i stället för att visa en siffra vi inte längre står för."
 },
 "stale_q": {
  "en": "<strong>A comment is not evidence.</strong> The most expensive line in this whole story was a comment claiming a column existed. Check the schema.",
  "sv": "<strong>En kommentar är inget bevis.</strong> Den dyraste raden i hela den här historien var en kommentar som påstod att en kolumn fanns. Kontrollera schemat."
 },
 "h_mail": {
  "en": "Recommendation emails got stricter too",
  "sv": "Rekommendationsmejlen blev också striktare"
 },
 "mail_p1": {
  "en": "When a job order is published, strong matches get a recommendation email. Grading lowers most scores a little, so the email threshold moved from 70 to 72, and three guards now sit beside it: the candidate must evidence at least 60% of the order's must-have skills, the score's confidence must not be low, and one publish sends at most 25 emails, strongest first. The ceiling only works strongest first: the match list is built in database order, so an unsorted cap would have mailed whoever the database returned first, not the best fits.",
  "sv": "När en jobborder publiceras får starka matchningar ett rekommendationsmejl. Graderingen sänker de flesta poäng något, så mejltröskeln flyttades från 70 till 72, och tre spärrar finns nu bredvid den: kandidaten måste belägga minst 60 % av orderns obligatoriska färdigheter, poängens tillförlitlighet får inte vara låg, och en publicering skickar högst 25 mejl, starkast först. Taket fungerar bara om de starkaste tas först: matchningslistan byggs i databasordning, så ett osorterat tak hade mejlat dem som databasen råkade returnera först, inte de bästa matchningarna."
 },
 "mail_p2": {
  "en": "The threshold alone is never the anti-spam control. An order with a thin requirement block clears a lot of people, and the cost of being wrong lands in candidates' inboxes.",
  "sv": "Tröskeln ensam är aldrig skyddet mot spam. En order med tunna krav släpper igenom många, och kostnaden för att ha fel hamnar i kandidaternas inkorgar."
 },
 "h_found": {
  "en": "The bug I found while writing this post",
  "sv": "Buggen jag hittade medan jag skrev det här inlägget"
 },
 "found_p1": {
  "en": "To build the comparison table above, I ran synthetic candidates through each version of the engine. One result looked wrong. On a \"5+ years\" order, a candidate with 4 years scored 93.3 and a candidate with 5 years scored 91.6. <strong>Falling short of the requirement beat meeting it.</strong>",
  "sv": "För att bygga jämförelsetabellen ovan körde jag påhittade kandidater genom varje version av motorn. Ett resultat såg fel ut. På en order med ”5+ år” fick en kandidat med 4 år 93,3 och en kandidat med 5 år 91,6. <strong>Att inte nå kravet slog att nå det.</strong>"
 },
 "found_p2": {
  "en": "The cause was the curve. Below the minimum, the version we shipped that morning paid <code>0.85 × (years ÷ minimum)</code>. At the minimum it paid 0.6. So the curve climbed to 0.85 just under the bar and then dropped when the candidate cleared it: 4 years out of 5 earned 0.68, exactly 5 earned 0.60, and it took 8 years to climb back.",
  "sv": "Orsaken var kurvan. Under minimikravet gav versionen vi släppt samma morgon <code>0,85 × (år ÷ minimum)</code>. Vid minimikravet gav den 0,6. Kurvan klättrade alltså till 0,85 strax under ribban och föll sedan när kandidaten klarade den: 4 av 5 år gav 0,68, exakt 5 gav 0,60, och det krävdes 8 år för att komma tillbaka."
 },
 "fig3": {
  "en": "Figure 3. The original bar (grey), the cliff at the minimum in v3 (red), and the fix (blue). Below the bar the factor now climbs to exactly 0.6, so the curve never decreases.",
  "sv": "Figur 3. Den ursprungliga ribban (grått), stupet vid minimikravet i v3 (rött) och rättelsen (blått). Under ribban klättrar faktorn nu till exakt 0,6, så kurvan sjunker aldrig."
 },
 "found_p3": {
  "en": "The fix is one number: below the minimum the factor now climbs to exactly 0.6, so the curve is continuous and never decreases. It shipped the same day as rubric v4, and the re-score sweeps described above are refreshing the stored matches.",
  "sv": "Rättelsen är en enda siffra: under minimikravet klättrar faktorn nu till exakt 0,6, så kurvan är kontinuerlig och sjunker aldrig. Den släpptes samma dag som poängmodell v4, och omräkningssvepen ovan uppdaterar de sparade matchningarna."
 },
 "found_p4": {
  "en": "The more useful fix is the test. <code>scripts/test-match.mjs</code> now runs in CI before every deploy (and before <code>npm run deploy</code>) and asserts the engine's invariants: more experience never lowers a score, a candidate short of the minimum ranks below one who meets it, six of the ten hard caps hold and explain themselves, and protected attributes do not move scores. I ran it against the previous engine to make sure it catches the bug. It fails on exactly the two curve checks.",
  "sv": "Den mer användbara rättelsen är testet. <code>scripts/test-match.mjs</code> körs nu i CI före varje driftsättning (och före <code>npm run deploy</code>) och kontrollerar motorns invarianter: mer erfarenhet sänker aldrig en poäng, en kandidat under minimikravet rankas under en som når det, sex av de tio taken håller och förklarar sig själva, och skyddade attribut påverkar inte poängen. Jag körde det mot den föregående motorn för att säkerställa att det fångar buggen. Det slår fel på exakt de två kurvkontrollerna."
 },
 "h_fair": {
  "en": "Fairness: now a test, not just a promise",
  "sv": "Rättvisa: nu ett test, inte bara ett löfte"
 },
 "fair_p1": {
  "en": "The guardrail has been in the engine from the start. Date of birth, name, gender, nationality, photo, and university prestige never enter the score. We collect date of birth for client paperwork, and the scoring module never reads it.",
  "sv": "Skyddsräcket har funnits i motorn från början. Födelsedatum, namn, kön, nationalitet, foto och universitetets prestige påverkar aldrig poängen. Vi samlar in födelsedatum för kundernas pappersarbete, och poängmodulen läser det aldrig."
 },
 "fair_p2": {
  "en": "In the August post I wrote that a test asserted this. Checking for this post, I found it did not exist: the code upheld the guarantee, but nothing enforced it. Now something does. Two candidates identical except for birth date, gender, nationality, and name must produce the same score and the same reasons, to two decimals, or the CI deploy stops.",
  "sv": "I augustiinlägget skrev jag att ett test säkerställde detta. När jag kontrollerade inför det här inlägget visade det sig att testet inte fanns: koden höll garantin, men inget upprätthöll den. Nu gör något det. Två kandidater som är identiska förutom födelsedatum, kön, nationalitet och namn måste få samma poäng och samma skäl, på två decimaler, annars stoppas driftsättningen i CI."
 },
 "h_watch": {
  "en": "What I would still watch",
  "sv": "Vad jag fortfarande skulle hålla ögonen på"
 },
 "watch_l1": {
  "en": "<strong>Skills are matched against a curated lexicon.</strong> A skill it does not know yet, written only in free text, is invisible to the score. Recruiters still read the CV.",
  "sv": "<strong>Färdigheter matchas mot ett kurerat lexikon.</strong> En färdighet det ännu inte känner till, skriven bara i fritext, syns inte i poängen. Rekryterare läser fortfarande CV:t."
 },
 "watch_l2": {
  "en": "<strong>Seniority comes from job titles.</strong> Titles inflate differently across companies and countries. The matcher already has to exclude phrases like \"lead generation\" and \"account manager\", which shows how fragile title parsing is.",
  "sv": "<strong>Senioritet hämtas från titlar.</strong> Titlar blåses upp olika mellan företag och länder. Matchningen måste redan undanta fraser som ”lead generation” och ”account manager”, vilket visar hur skör titeltolkning är."
 },
 "watch_l3": {
  "en": "<strong>The weights are judgment, not fitted.</strong> Recruiters' thumbs-up and thumbs-down feedback is recorded per application, and it is the data that should eventually calibrate them.",
  "sv": "<strong>Vikterna är bedömningar, inte anpassade mot data.</strong> Rekryterarnas tumme upp och tumme ned sparas per ansökan, och det är den datan som på sikt bör kalibrera dem."
 },
 "watch_l4": {
  "en": "<strong>A score is decision support.</strong> It orders the call list; a recruiter makes the call.",
  "sv": "<strong>En poäng är beslutsstöd.</strong> Den sorterar samtalslistan; beslutet fattar en rekryterare."
 },
 "h_lessons": {
  "en": "What this taught me",
  "sv": "Vad det här lärde mig"
 },
 "les_l1": {
  "en": "<strong>A percentage has to rank, or it is decoration.</strong> If the top of the list ties, the score is a checklist.",
  "sv": "<strong>En procentsats måste rangordna, annars är den dekoration.</strong> Om det är dött lopp i toppen av listan är poängen en checklista."
 },
 "les_l2": {
  "en": "<strong>Grade every dimension, then check both sides of every breakpoint.</strong> Piecewise curves hide cliffs.",
  "sv": "<strong>Gradera varje dimension och kontrollera sedan båda sidor av varje brytpunkt.</strong> Styckvisa kurvor döljer stup."
 },
 "les_l3": {
  "en": "<strong>A score must carry the rubric that made it.</strong> Otherwise a fix never reaches the rows already on the board.",
  "sv": "<strong>En poäng måste bära poängmodellen som gav den.</strong> Annars når en rättelse aldrig raderna som redan ligger på tavlan."
 },
 "les_l4": {
  "en": "<strong>Missing data must never be rewarded, and we are not all the way there yet.</strong> \"We don't know\" has to cost something, or the least documented candidate wins.",
  "sv": "<strong>Saknade uppgifter får aldrig belönas, och där är vi inte helt ännu.</strong> ”Vi vet inte” måste kosta något, annars vinner den sämst dokumenterade kandidaten."
 },
 "les_l5": {
  "en": "<strong>Write the invariant down as a test, and run it against the old code.</strong> A test that has never failed has not proven anything.",
  "sv": "<strong>Skriv ner invarianten som ett test och kör det mot den gamla koden.</strong> Ett test som aldrig har slagit fel har inte bevisat något."
 },
 "outro": {
  "en": "None of this needed a bigger model. The engine is a few hundred lines of explainable rules, and every improvement in this post came from looking at the numbers it produced and asking whether a recruiter would agree with them. That is the forward-deployed part of the job: the model is only half of it, and the other half is sitting with the output until it earns trust.",
  "sv": "Inget av detta krävde en större modell. Motorn är några hundra rader förklarbara regler, och varje förbättring i det här inlägget kom från att titta på siffrorna den gav och fråga om en rekryterare skulle hålla med. Det är den forward-deployed delen av jobbet: modellen är bara hälften, och den andra hälften är att sitta med resultatet tills det förtjänar förtroende."
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
      const e = I18N_SCORE[el.dataset.i18n];
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
