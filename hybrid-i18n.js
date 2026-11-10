// hybrid-retrieval post bilingual switcher (EN/SV).
const I18N_HYBRID = {
 "t": {
  "en": "Searching Candidate CVs by Words and by Meaning: A Benchmark That Said Not to Replace the Ranking",
  "sv": "Att söka i kandidaters CV med ord och med mening: en benchmark som sa att rankningen inte skulle ersättas"
 },
 "meta": {
  "en": "Primawan Satrio · November 2026 · ~10 min read",
  "sv": "Primawan Satrio · november 2026 · ~10 min läsning"
 },
 "p1": {
  "en": "KerjaBoard, the job board my recruiting agency runs on, ranks candidates for an order with rules over fields it has parsed: years, skills, languages, salary. That works until a recruiter wants someone who \"built payment systems\" and the CV says \"settlement platform\". The rules match skills and years as words, so they cannot connect the two. So I built a search over the text of CVs, with two retrieval methods fused, and asked a question I could answer with data: would it find the people the team actually advanced better than the existing order does?",
  "sv": "KerjaBoard, jobbtavlan som min rekryteringsbyrå kör på, rankar kandidater för ett uppdrag med regler över fält som den tolkat fram: år, kompetenser, språk, lön. Det fungerar tills en rekryterare vill ha någon som ”byggt betalsystem” och CV:t säger ”avvecklingsplattform”. Reglerna matchar kompetenser och år som ord, så de kan inte koppla ihop de två. Så jag byggde en sökning över CV-text, med två sökmetoder sammanslagna, och ställde en fråga jag kunde besvara med data: skulle den hitta de kandidater teamet faktiskt gick vidare med bättre än den befintliga ordningen?"
 },
 "p2": {
  "en": "I wrote the answer rule down before running anything: the new search replaces the order on the matches page only if it beats the old order on recall at 50 with non-overlapping 95% intervals. Otherwise it ships as a search box. It failed the rule. This post covers how it is built, what a review found before the first push, and why the result still tells me something.",
  "sv": "Jag skrev ner svarsregeln innan jag körde något: den nya sökningen ersätter ordningen på matchningssidan bara om den slår den gamla ordningen på recall vid 50 med icke-överlappande 95 %-intervall. Annars blir den en sökruta. Den klarade inte regeln. Det här inlägget handlar om hur den är byggd, vad en granskning hittade före första driftsättningen och varför resultatet ändå säger mig något."
 },
 "h_pipe": {
  "en": "The CV text is stored, embedded and shown, so I treat it as published",
  "sv": "CV-texten lagras, bäddas in och visas, så jag behandlar den som publicerad"
 },
 "fig1": {
  "en": "Figure 1. A CV goes in; only scrubbed text reaches the database, the embedding model and the vector index.",
  "sv": "Figur 1. Ett CV går in; bara rensad text når databasen, inbäddningsmodellen och vektorindexet."
 },
 "pipe_p1": {
  "en": "Each CV is read from storage, turned into text, scrubbed, cut into passages of about 250 words (at most eight per candidate, with a 40-word overlap), and written twice: the text into a D1 table with an FTS5 index for BM25, and one 1024-number embedding per passage into Vectorize. The embedding model is bge-m3, which handles Indonesian and English in one space. Every search is one embedding call, one vector query and a handful of database reads.",
  "sv": "Varje CV läses från lagringen, görs om till text, rensas, delas i stycken om cirka 250 ord (högst åtta per kandidat, med 40 ords överlapp) och skrivs två gånger: texten i en D1-tabell med ett FTS5-index för BM25, och en inbäddning med 1024 tal per stycke i Vectorize. Inbäddningsmodellen är bge-m3, som hanterar indonesiska och engelska i samma rum. Varje sökning är ett inbäddningsanrop, en vektorfråga och en handfull databasläsningar."
 },
 "pipe_p2": {
  "en": "The scrub matters more here than anywhere else in the system. The AI fit assessment reads a scrubbed CV once and forgets it. This index keeps the text, ships it to an embedding model, and later shows passages to staff and to freelancers. So before the first push I had an independent reviewer, an automated review agent, attack it with realistic constructed layouts. They found three blockers:",
  "sv": "Rensningen är viktigare här än någon annanstans i systemet. AI-bedömningen av passning läser ett rensat CV en gång och glömmer det. Det här indexet behåller texten, skickar den till en inbäddningsmodell och visar senare stycken för personal och för frilansare. Så före första driftsättningen lät jag en oberoende granskare, en automatiserad granskningsagent, angripa det med realistiska konstruerade layouter. De hittade tre blockerande fel:"
 },
 "blk_l1": {
  "en": "<strong>Contact data survived.</strong> The existing scrub, built to filter one transient prompt, missed scheme-less social links (<code>t.me/x</code>, <code>linktr.ee/x</code>), personal domains, emails wrapped across lines, phone numbers with en dashes or zero-width characters, and passport numbers. The fix runs a second scrub that reuses the freelancer-preview blackout and strips the account's own stored email and phone by value.",
  "sv": "<strong>Kontaktuppgifter överlevde.</strong> Den befintliga rensningen, byggd för att filtrera en enda flyktig prompt, missade sociala länkar utan schema (<code>t.me/x</code>, <code>linktr.ee/x</code>), personliga domäner, mejladresser som brutits över rader, telefonnummer med tankstreck eller nollbreddstecken, och passnummer. Åtgärden kör en andra rensning som återanvänder frilansarnas förhandsvisningsmaskning och tar bort kontots egen lagrade e-post och telefon genom att matcha värdet."
 },
 "blk_l2": {
  "en": "<strong>An empty account name switched off name removal.</strong> The scrub removes the candidate's name from the CV by matching the account name; with no name on the account there was nothing to match. Such accounts are now not indexed at all.",
  "sv": "<strong>Ett tomt kontonamn stängde av namnborttagningen.</strong> Rensningen tar bort kandidatens namn ur CV:t genom att matcha kontonamnet; utan namn på kontot fanns inget att matcha. Sådana konton indexeras nu inte alls."
 },
 "blk_l3": {
  "en": "<strong>The BM25 query was quadratic.</strong> Joined the natural way, the planner scanned the whole FTS table once per chunk: 1.8 s at 2,000 chunks and 16.5 s at 8,000 in a local test. Running the match first, in a subquery, returned the same rows in 27 ms at 8,000. My tests had seven users and could not see it, and D1 runs one query at a time, so I expect one slow search would have stalled other requests. There is now a test over 12,000 chunks with a time bound and a plan check.",
  "sv": "<strong>BM25-frågan var kvadratisk.</strong> Sammanfogad på det naturliga sättet skannade planeraren hela FTS-tabellen en gång per stycke: 1,8 s vid 2 000 stycken och 16,5 s vid 8 000 i ett lokalt test. Att köra matchningen först, i en delfråga, gav samma rader på 27 ms vid 8 000. Mina tester hade sju användare och kunde inte se det, och D1 kör en fråga i taget, så jag räknar med att en långsam sökning hade stoppat andra förfrågningar. Nu finns ett test över 12 000 stycken med en tidsgräns och en kontroll av frågeplanen."
 },
 "pipe_p3": {
  "en": "The review also caught a retention bug: if a candidate deletes their account while their CV is being indexed, the vector write can land after the cleanup and nothing ever removes it. The indexer now re-checks the account after writing, and the cleanup queue keeps each entry for an hour. Candidates in the EU are not indexed at all, because the EU privacy notice promises that CVs stay in the EU at rest and I cannot show that for the embedding service or the vector index. The notice now describes the index, and says plainly that the scrub cannot catch everything: a sentence about religion, health or family in the body of a CV is not recognisable as such.",
  "sv": "Granskningen fångade också ett fel i hur länge data sparas: om en kandidat raderar sitt konto medan CV:t indexeras kan vektorskrivningen landa efter städningen och ingenting tar någonsin bort den. Indexeraren kontrollerar nu kontot på nytt efter skrivningen, och städkön behåller varje post i en timme. Kandidater i EU indexeras inte alls, eftersom EU-integritetsmeddelandet lovar att CV:n stannar i EU när de lagras och jag inte kan visa det för inbäddningstjänsten eller vektorindexet. Meddelandet beskriver nu indexet och säger rakt ut att rensningen inte kan fånga allt: en mening om religion, hälsa eller familj i CV:ts brödtext går inte att känna igen som sådan."
 },
 "pipe_p4": {
  "en": "Two operational details bit me on the first backfill. Vectorize rate-limits writes, and my first indexer sent a delete before every first-time upsert and a delete for every candidate without a CV, which turned the backfill into a wall of \"Too Many Requests\" errors; a candidate never indexed has no vectors to delete, and skipping that call fixed it. And the cron tick has a fixed cost by design: it probes an index for never-indexed candidates and scans a fixed window of ids for stale ones, so the work per tick does not grow with the number of candidates.",
  "sv": "Två driftdetaljer bet mig vid den första indexeringen. Vectorize begränsar skrivningar, och min första indexerare skickade en radering före varje förstagångsskrivning och en radering för varje kandidat utan CV, vilket gjorde den första indexeringen till en vägg av ”Too Many Requests”; en kandidat som aldrig indexerats har inga vektorer att radera, och att hoppa över anropet löste det. Och cron-ticken har en fast kostnad med flit: det prövar ett index efter aldrig indexerade kandidater och skannar ett fast fönster av id:n efter inaktuella, så arbetet per tick växer inte med antalet kandidater."
 },
 "h_fuse": {
  "en": "Two legs, one fusion",
  "sv": "Två spår, en sammanslagning"
 },
 "fuse_p1": {
  "en": "BM25 ranks passages by how many of the query's words they contain and how rare those words are. The embedding leg ranks them by closeness in meaning. Their scores are on different scales, so I fuse ranks, not scores: reciprocal-rank fusion gives each candidate the sum of 1 / (60 + rank) over the lists it appears in. Each candidate is represented by their best passage, and the passage shown is the BM25 one when both legs found the candidate, because it holds the query's own words. A candidate who objected to sourcing, is suspended or has been erased is dropped on every read, whatever the index still holds.",
  "sv": "BM25 rankar stycken efter hur många av frågans ord de innehåller och hur sällsynta orden är. Inbäddningsspåret rankar dem efter närhet i mening. Poängen ligger på olika skalor, så jag slår ihop rangordningar, inte poäng: reciprocal-rank fusion ger varje kandidat summan av 1 / (60 + rang) över de listor den förekommer i. Varje kandidat representeras av sitt bästa stycke, och det stycke som visas är BM25-stycket när båda benen hittade kandidaten, eftersom det innehåller frågans egna ord. En kandidat som invänt mot sourcing, är avstängd eller har raderats tas bort vid varje läsning, vad indexet än fortfarande innehåller."
 },
 "h_bench": {
  "en": "The benchmark, and the rule I set first",
  "sv": "Benchmarken, och regeln jag satte först"
 },
 "bench_p1": {
  "en": "Ground truth is what the team did: the candidates it advanced to \"Request to send profile\" or further, on orders where such a candidate has an indexed CV. That is 75 advanced candidate and order pairs (70 distinct people) on 23 orders; 7 more advanced candidates have no indexed CV and are left out for every method alike. The query for an order is its title, the must-have skills the rule engine parsed, and its requirements, never the client brief. Every method ranks the same pool of candidates with an indexed CV. I compared six rankings: the stored rule order, BM25, embeddings, the two fused, the fused list re-ordered by the stored rule score, and the fused top 50 re-ordered by a cross-encoder reranker.",
  "sv": "Facit är vad teamet gjorde: de kandidater det gick vidare med till ”Request to send profile” eller längre, på uppdrag där en sådan kandidat har ett indexerat CV. Det är 75 par av kandidat och uppdrag (70 olika personer) på 23 uppdrag; ytterligare 7 kandidater som gått vidare saknar indexerat CV och lämnas utanför för alla metoder lika. Frågan för ett uppdrag är dess titel, de måste-kompetenser regelmotorn tolkat och dess krav, aldrig kundbriefen. Varje metod rankar samma pool av kandidater med ett indexerat CV. Jag jämförde sex rankningar: den lagrade regelordningen, BM25, inbäddningar, de två sammanslagna, den sammanslagna listan omsorterad efter den lagrade regelpoängen, och de 50 främsta i den sammanslagna listan omsorterade av en reranker av typen cross-encoder."
 },
 "fig2": {
  "en": "Figure 2. Recall at 50, averaged over orders, with 95% bootstrap intervals over orders. The rule order is averaged over 22 orders (one order has no stored scores); every other method over all 23.",
  "sv": "Figur 2. Recall vid 50, medelvärde över uppdrag, med 95 %-bootstrapintervall över uppdrag. Regelordningen är medelvärdesbildad över 22 uppdrag (ett uppdrag saknar lagrade poäng); varje annan metod över alla 23."
 },
 "res.h0": {
  "en": "Method",
  "sv": "Metod"
 },
 "res.h1": {
  "en": "recall@20",
  "sv": "recall@20"
 },
 "res.h2": {
  "en": "recall@50",
  "sv": "recall@50"
 },
 "res.h3": {
  "en": "recall@100",
  "sv": "recall@100"
 },
 "res.h4": {
  "en": "MRR",
  "sv": "MRR"
 },
 "res.h5": {
  "en": "nDCG@20",
  "sv": "nDCG@20"
 },
 "res.r0c0": {
  "en": "Rule order",
  "sv": "Regelordning"
 },
 "res.r0c1": {
  "en": "0.10",
  "sv": "0,10"
 },
 "res.r0c2": {
  "en": "0.18",
  "sv": "0,18"
 },
 "res.r0c3": {
  "en": "0.31",
  "sv": "0,31"
 },
 "res.r0c4": {
  "en": "0.20",
  "sv": "0,20"
 },
 "res.r0c5": {
  "en": "0.09",
  "sv": "0,09"
 },
 "res.r1c0": {
  "en": "BM25",
  "sv": "BM25"
 },
 "res.r1c1": {
  "en": "0.19",
  "sv": "0,19"
 },
 "res.r1c2": {
  "en": "0.42",
  "sv": "0,42"
 },
 "res.r1c3": {
  "en": "0.52",
  "sv": "0,52"
 },
 "res.r1c4": {
  "en": "0.08",
  "sv": "0,08"
 },
 "res.r1c5": {
  "en": "0.09",
  "sv": "0,09"
 },
 "res.r2c0": {
  "en": "Embeddings",
  "sv": "Inbäddningar"
 },
 "res.r2c1": {
  "en": "0.18",
  "sv": "0,18"
 },
 "res.r2c2": {
  "en": "0.32",
  "sv": "0,32"
 },
 "res.r2c3": {
  "en": "0.43",
  "sv": "0,43"
 },
 "res.r2c4": {
  "en": "0.07",
  "sv": "0,07"
 },
 "res.r2c5": {
  "en": "0.07",
  "sv": "0,07"
 },
 "res.r3c0": {
  "en": "Fused (RRF)",
  "sv": "Sammanslagen (RRF)"
 },
 "res.r3c1": {
  "en": "0.17",
  "sv": "0,17"
 },
 "res.r3c2": {
  "en": "0.43",
  "sv": "0,43"
 },
 "res.r3c3": {
  "en": "0.54",
  "sv": "0,54"
 },
 "res.r3c4": {
  "en": "0.09",
  "sv": "0,09"
 },
 "res.r3c5": {
  "en": "0.08",
  "sv": "0,08"
 },
 "res.r4c0": {
  "en": "Fused, then rule order",
  "sv": "Sammanslagen, sedan regelordning"
 },
 "res.r4c1": {
  "en": "0.19",
  "sv": "0,19"
 },
 "res.r4c2": {
  "en": "0.42",
  "sv": "0,42"
 },
 "res.r4c3": {
  "en": "0.58",
  "sv": "0,58"
 },
 "res.r4c4": {
  "en": "0.20",
  "sv": "0,20"
 },
 "res.r4c5": {
  "en": "0.13",
  "sv": "0,13"
 },
 "res.r5c0": {
  "en": "Fused + cross-encoder",
  "sv": "Sammanslagen + cross-encoder"
 },
 "res.r5c1": {
  "en": "0.18",
  "sv": "0,18"
 },
 "res.r5c2": {
  "en": "0.43",
  "sv": "0,43"
 },
 "res.r5c3": {
  "en": "0.58",
  "sv": "0,58"
 },
 "res.r5c4": {
  "en": "0.06",
  "sv": "0,06"
 },
 "res.r5c5": {
  "en": "0.07",
  "sv": "0,07"
 },
 "bench_p2": {
  "en": "On recall at 50, the fused search finds 45% of the advanced candidates per order against 18% for the rule order (on the 22 orders where both have a ranking; on all 23 orders the fused search is at 43%). But the intervals (0.28 to 0.62 against 0.07 to 0.31) overlap, so by the rule I set, <strong>it fails and the matches page keeps the old order</strong>. A paired comparison on the 22 orders where both have a ranking gives a difference of +0.27 with an interval of 0.11 to 0.44, which excludes zero. Overlapping separate intervals are a stricter test than a paired one, and I chose the strict one before seeing the data. I am keeping the decision I made, and I am reporting the paired number next to it so a reader can judge for themselves.",
  "sv": "På recall vid 50 hittar den sammanslagna sökningen 45 % av de kandidater som gått vidare per uppdrag mot 18 % för regelordningen (på de 22 uppdrag där båda har en rankning; på alla 23 uppdrag ligger den sammanslagna sökningen på 43 %). Men intervallen (0,28 till 0,62 mot 0,07 till 0,31) överlappar, så enligt regeln jag satte <strong>klarar den inte kravet och matchningssidan behåller den gamla ordningen</strong>. En parad jämförelse på de 22 uppdrag där båda har en rankning ger en skillnad på +0,27 med intervallet 0,11 till 0,44, vilket utesluter noll. Överlappande separata intervall är ett strängare test än ett parat, och jag valde det stränga innan jag såg data. Jag behåller beslutet jag tog, och redovisar det parade talet bredvid så att en läsare kan bedöma själv."
 },
 "bench_p3": {
  "en": "The table says something the pass or fail does not. The rule order has the better MRR, 0.20 against 0.09 for the fused list, but that comes from 4 of its 22 orders, where a candidate the team advanced is ranked first; on 10 of the 22, none of them is in its list of 300 at all, and its recall at 20 is the lowest of the six. Retrieval is better in depth: recall at 100 is 0.54 against 0.31. Re-ordering the fused list by the rule score keeps both, with the best nDCG at 20 (0.13), though every interval overlaps. The cross-encoder reranker made the top worse (MRR 0.06); it is not trained for Indonesian and these CVs mix Indonesian and English, which may be why, though I did not test that, and I dropped it. Candidates that the team sourced or a freelancer submitted, 14 of the 75, show the same pattern (recall at 50 on 8 orders: 0.03 for the rule order, 0.41 for BM25, 0.28 for the fused search; informational only, the gate was not re-run on it), and the rule engine had no application answers for them, which is a plausible reason I did not test.",
  "sv": "Tabellen säger något som godkänt eller underkänt inte gör. Regelordningen har bättre MRR, 0,20 mot 0,09 för den sammanslagna listan, men det kommer från 4 av dess 22 uppdrag, där en kandidat som teamet gick vidare med står först; på 10 av de 22 finns ingen av dem alls i dess lista om 300, och dess recall vid 20 är den lägsta av de sex. Sökningen är bättre på djupet: recall vid 100 är 0,54 mot 0,31. Att omsortera den sammanslagna listan efter regelpoängen behåller båda, med bäst nDCG vid 20 (0,13), men alla intervall överlappar. Rerankern av typen cross-encoder försämrade toppen (MRR 0,06); den är inte tränad för indonesiska och dessa CV blandar indonesiska och engelska, vilket kan vara orsaken, men det testade jag inte, och jag släppte den. Kandidater som teamet själv hittat eller en frilansare skickat in, 14 av de 75, visar samma mönster (recall vid 50 på 8 uppdrag: 0,03 för regelordningen, 0,41 för BM25, 0,28 för den sammanslagna sökningen; endast upplysande, grindregeln kördes inte om på den), och regelmotorn hade inga ansökningssvar för dem, vilket är en rimlig förklaring som jag inte testade."
 },
 "bench_p4": {
  "en": "Read this with its limits. 23 orders and 75 positive pairs is small. The positives are candidates the team already screened with the old order in view, so recall against them rewards agreeing with that screen. The embedding leg returns at most 100 passages per query, about 90 candidates, so its recall at 100 is capped. The index holds at most eight passages per candidate, about the first 1,500 to 2,000 words of a CV, so anything later in a long CV cannot be found. And the benchmark ran on the index as first built; the only scrub change since is removing leftover contact labels.",
  "sv": "Läs detta med dess begränsningar. 23 uppdrag och 75 positiva par är litet. De positiva är kandidater teamet redan sållat med den gamla ordningen i sikte, så recall mot dem belönar att man håller med den sållningen. Inbäddningsspåret returnerar högst 100 stycken per fråga, cirka 90 kandidater, så dess recall vid 100 har ett tak. Indexet rymmer högst åtta stycken per kandidat, ungefär de första 1 500 till 2 000 orden i ett CV, så allt senare i ett långt CV går inte att hitta. Och benchmarken kördes på indexet som det först byggdes; den enda rensningsändringen sedan dess är att kvarlämnade kontaktetiketter tas bort."
 },
 "h_ship": {
  "en": "What shipped, and a leak check I did live",
  "sv": "Vad som levererades, och en läckagekontroll jag gjorde skarpt"
 },
 "ship_p1": {
  "en": "The search shipped as a box, \"Search by description\", for the internal team and for freelance recruiters, with a how-to page that states the benchmark result and its limits. Staff open the candidate's profile from a result. A freelancer gets the same card as in the existing name search, and sees the matched passage only for a candidate that nobody owns or has claimed, the same scope as the preview before claiming, with the same contact blackout applied on top. Searches are rate limited, tighter for freelancers, because each one is an embedding call.",
  "sv": "Sökningen levererades som en ruta, ”Search by description”, för interna teamet och för frilansande rekryterare, med en instruktionssida som anger benchmarkresultatet och dess begränsningar. Personalen öppnar kandidatens profil från ett resultat. En frilansare får samma kort som i den befintliga namnsökningen, och ser det matchade stycket bara för en kandidat som ingen äger eller gjort anspråk på, samma omfång som förhandsvisningen före anspråk, med samma kontaktmaskning lagd ovanpå. Sökningarna är hastighetsbegränsade, hårdare för frilansare, eftersom varje sökning är ett inbäddningsanrop."
 },
 "ship_p2": {
  "en": "Before announcing it, I created a throwaway freelancer account, searched for six real orders, and read what came back. No email, phone number, LinkedIn link or nationality appeared in a passage. It did show me a flaw. A stray label such as \"LinkedIn:\" left in the stored text, with its value already removed, made the freelancer blackout black out ordinary hyphenated words after it, like \"infrastructure-as-code\" and \"zero-downtime\". The scrub now removes those leftover labels, and I re-indexed everything and repeated the check on eight orders: 53 passages, no contact detail, no nationality, no blackout characters. The throwaway account and its session were deleted afterwards.",
  "sv": "Innan jag annonserade det skapade jag ett engångskonto för en frilansare, sökte på sex verkliga uppdrag och läste vad som kom tillbaka. Ingen e-postadress, inget telefonnummer, ingen LinkedIn-länk och ingen nationalitet förekom i ett stycke. Det visade mig ändå ett fel. En kvarlämnad etikett som ”LinkedIn:” i den lagrade texten, med värdet redan borttaget, fick frilansarnas maskning att maska vanliga bindestrecksord efter den, som ”infrastructure-as-code” och ”zero-downtime”. Rensningen tar nu bort de kvarlämnade etiketterna, och jag indexerade om allt och upprepade kontrollen på åtta uppdrag: 53 stycken, ingen kontaktuppgift, ingen nationalitet, inga maskningstecken. Engångskontot och dess session raderades efteråt."
 },
 "h_lessons": {
  "en": "What I take from it",
  "sv": "Vad jag tar med mig"
 },
 "les_l1": {
  "en": "<strong>Write the pass rule before the run.</strong> A +0.27 paired difference is tempting. The rule I set kept the old order in place while the data was still thin.",
  "sv": "<strong>Skriv godkänd-regeln före körningen.</strong> En parad skillnad på +0,27 är frestande. Regeln jag satte höll kvar den gamla ordningen medan data fortfarande var tunn."
 },
 "les_l2": {
  "en": "<strong>The two methods are complements, not rivals.</strong> The rule order sometimes nails the first place and is blind to CV text; retrieval reaches deeper and is blind to years and visas. The best next experiment is a combination that mixes the rule score with the retrieval score instead of only re-ordering by it, on more orders.",
  "sv": "<strong>De två metoderna kompletterar varandra, de är inte rivaler.</strong> Regelordningen träffar ibland förstaplatsen och är blind för CV-text; sökningen når djupare och är blind för år och visum. Det bästa nästa experimentet är en kombination som blandar regelpoängen med sökpoängen i stället för att bara sortera om efter den, på fler uppdrag."
 },
 "les_l3": {
  "en": "<strong>Test with the size you will have.</strong> A query plan that is fine at seven users and broken at eight thousand chunks is invisible to a normal test suite; a testdatae of that size is cheap.",
  "sv": "<strong>Testa med den storlek du kommer att ha.</strong> En frågeplan som är bra vid sju användare och trasig vid åttatusen stycken är osynlig för en vanlig testsvit; en testdata av den storleken är billig."
 },
 "les_l4": {
  "en": "<strong>Text you keep is text you must be able to defend.</strong> A scrub designed for one prompt is not good enough for a table, a vector index and a results page. The residuals (prose about religion or health) are now written into the privacy notice instead of being left for someone to discover.",
  "sv": "<strong>Text du behåller är text du måste kunna försvara.</strong> En rensning utformad för en prompt räcker inte för en tabell, ett vektorindex och en resultatsida. Resterna (löpande text om religion eller hälsa) står nu i integritetsmeddelandet i stället för att lämnas åt någon att upptäcka."
 },
 "outro": {
  "en": "The search is live. The ranking stays as it was. The benchmark supports exactly that much: the search finds more of the people the team advanced, with a sample too small to prove it. How useful it is in daily work I cannot say yet, and I would rather ship that than the version of the story where the new thing wins.",
  "sv": "Sökningen är i drift. Rankningen förblir som den var. Så mycket stöder benchmarken: sökningen hittar fler av de personer teamet gick vidare med, med ett urval för litet för att bevisa det. Hur användbar den är i det dagliga arbetet kan jag inte säga än, och jag levererar hellre det än den version av historien där det nya vinner."
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
      const e = I18N_HYBRID[el.dataset.i18n];
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
