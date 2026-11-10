// fit-evals post bilingual switcher (EN/SV).
const I18N_FITEVAL = {
 "t": {
  "en": "Measuring an AI Fit Assessment: 302 Frozen Decisions, 99 I Trust",
  "sv": "Att mäta en AI-bedömning av passning: 302 frysta beslut, 99 jag litar på"
 },
 "meta": {
  "en": "Primawan Satrio · November 2026 · ~10 min read",
  "sv": "Primawan Satrio · november 2026 · ~10 min läsning"
 },
 "p1": {
  "en": "Under the applications the team is working on KerjaBoard, my recruiting agency's job board, an AI model writes a short fit assessment: a verdict (Strong fit, Good fit, Possible fit or Not a fit), a few strengths and concerns, and for each one a quote from the CV or the posting that it rests on. The model is Claude Sonnet 5.5. I put it in production, the team uses it, and until this week nobody had measured whether it is any good. This post is about how I measured it, and what the measurement found, including the parts that do not flatter it.",
  "sv": "Under de ansökningar teamet arbetar med på KerjaBoard, min rekryteringsbyrås jobbtavla, skriver en AI-modell en kort bedömning av passningen: ett omdöme (Strong fit, Good fit, Possible fit eller Not a fit), några styrkor och invändningar, och för varje punkt ett citat ur CV:t eller annonsen som den bygger på. Modellen är Claude Sonnet 5.5. Jag lanserade det, teamet använder det, och fram till den här veckan hade ingen mätt om det är bra. Det här inlägget handlar om hur jag mätte, och vad mätningen visade, även det som inte smickrar modellen."
 },
 "p2": {
  "en": "The short version: on the cases where I trust the labels, the model agrees with the team 79.8% of the time (reading Possible fit as advance; 41.4% reading it as reject), and always guessing \"advance\" agrees 78.8% of the time. The interesting results are elsewhere.",
  "sv": "Kortversionen: i de fall där jag litar på etiketterna håller modellen med teamet 79,8 % av gångerna (om Possible fit läses som vidare; 41,4 % om det läses som avvisa), och att alltid gissa ”gå vidare” håller med 78,8 % av gångerna. De intressanta resultaten finns på andra ställen."
 },
 "h_labels": {
  "en": "The label is a recruiter's decision, and decisions are messy",
  "sv": "Etiketten är en rekryterares beslut, och beslut är röriga"
 },
 "labels_p1": {
  "en": "There is no answer key for \"is this candidate a fit\". What exists is what the team did: it moved a card to <code>Request to send profile</code> (or further: Submitted, Interview, Offering, Hired), or it rejected the application. I turn that into a label, and most of the work was deciding which decisions deserve to be called labels:",
  "sv": "Det finns inget facit för ”passar kandidaten”. Det som finns är vad teamet gjorde: det flyttade ett kort till <code>Request to send profile</code> (eller längre: Submitted, Interview, Offering, Hired), eller avvisade ansökan. Jag gör om det till en etikett, och det mesta av arbetet gick åt till att avgöra vilka beslut som förtjänar att kallas etiketter:"
 },
 "lab_l1": {
  "en": "<strong>Advanced</strong> means the card reached Request to send profile or later. That is an <code>advance</code> label.",
  "sv": "<strong>Gick vidare</strong> betyder att kortet nådde Request to send profile eller senare. Det är en <code>advance</code>-etikett."
 },
 "lab_l2": {
  "en": "<strong>Rejected after an advance</strong> gets no label at all. The client may have turned the candidate down after we sent the profile, and that says nothing about the model.",
  "sv": "<strong>Avvisad efter att ha gått vidare</strong> får ingen etikett alls. Kunden kan ha tackat nej efter att vi skickat profilen, och det säger ingenting om modellen."
 },
 "lab_l3": {
  "en": "<strong>Rejected before any advance</strong> is a <code>reject</code> label, but only <em>trusted</em> if the move is in the activity log. That log started on 26 October. Earlier rejections might have been the client's call, so they are tagged <code>status-unlogged</code>, reported separately and never counted in the headline number.",
  "sv": "<strong>Avvisad före något vidare</strong> är en <code>reject</code>-etikett, men bara <em>pålitlig</em> om flytten finns i aktivitetsloggen. Loggen startade den 26 oktober. Tidigare avvisningar kan ha varit kundens beslut, så de märks <code>status-unlogged</code>, redovisas separat och räknas aldrig i huvudsiffran."
 },
 "lab_l4": {
  "en": "<strong>A staff Disagree</strong> on the fit panel is a third source, <code>feedback</code>. These are the cases where a person overrode the model, so they are selected for the model being wrong. They are kept apart and never pooled into a model comparison.",
  "sv": "<strong>Ett Disagree från personalen</strong> på passningspanelen är en tredje källa, <code>feedback</code>. Det är fallen där en människa gick emot modellen, så de är utvalda för att modellen har fel. De hålls isär och slås aldrig ihop i en modelljämförelse."
 },
 "labels_p2": {
  "en": "A review pass before the first run found that my query counted the Today page's bulk close-out, which sweeps stale cards to Rejected, as a trusted rejection. Nobody screened those cards. The fix was one condition on the log row's kind and one test row; without the review that mistake would have sat inside the headline number.",
  "sv": "En granskning före den första körningen visade att min fråga räknade Today-sidans massavslut, som sopar gamla kort till Rejected, som en pålitlig avvisning. Ingen hade granskat de korten. Rättningen var ett villkor på loggradens typ och en testrad; utan granskningen hade det felet legat inne i huvudsiffran."
 },
 "labels_p3": {
  "en": "Each decided application that has a CV file is frozen into a golden set together with its label and a copy of the job as it read that day, because an upstream sync rewrites job requirements and client briefs every day and a case must not change under the model. That gave <strong>302 frozen cases</strong> on 64 orders: 91 advanced, 24 trusted rejections, 187 untrusted ones. Thirty-two had no readable CV (the CV text was missing or too short to assess), which leaves 270 that can be scored, and 99 of them carry a trusted label: 78 advances and 21 rejections.",
  "sv": "Varje avgjord ansökan som har en CV-fil fryses i ett golden set tillsammans med sin etikett och en kopia av jobbet som det såg ut den dagen, eftersom en synkning uppströms skriver om jobbens krav och kundbriefer varje dag och ett fall inte får ändras under modellen. Det gav <strong>302 frysta fall</strong> på 64 uppdrag: 91 gick vidare, 24 pålitliga avvisningar, 187 opålitliga. Trettiotvå hade inget läsbart CV (CV-texten saknades eller var för kort för att bedöma), vilket lämnar 270 som går att poängsätta, och 99 av dem har en pålitlig etikett: 78 vidare och 21 avvisade."
 },
 "h_runner": {
  "en": "A runner that cannot touch production",
  "sv": "En körmotor som inte kan röra produktionen"
 },
 "runner_p1": {
  "en": "An eval run re-assesses the frozen cases with a chosen model. It writes to its own eval tables, plus one setting that feeds a footnote on the staff panel when the run is the production baseline, and nowhere else: not the stored assessments staff see, not the activity log, no email. A test drives the real route handlers with a data layer that records every write, and fails if a run writes anything outside that short list.",
  "sv": "En utvärderingskörning bedömer de frysta fallen på nytt med vald modell. Den skriver till sina egna utvärderingstabeller, plus en inställning som matar en fotnot på personalens panel när körningen är produktionens baslinje, och ingen annanstans: inte till de lagrade bedömningar personalen ser, inte till aktivitetsloggen, inga mejl. Ett test kör de riktiga routerna mot ett dataskikt som registrerar varje skrivning, och misslyckas om en körning skriver något utanför den korta listan."
 },
 "runner_p2": {
  "en": "A Worker request has a time limit, so a run is advanced five cases at a time by pressing one route, and a small driver script presses it until nothing is left. A full Sonnet run of 302 cases took about eight minutes. The part that took thought was failure, because a measurement that quietly loses cases is worse than none:",
  "sv": "En Worker-förfrågan har en tidsgräns, så en körning flyttas fram fem fall åt gången genom att trycka på en rutt, och ett litet drivskript trycker tills inget är kvar. En full Sonnet-körning av 302 fall tog ungefär åtta minuter. Det som krävde eftertanke var felhantering, eftersom en mätning som tyst tappar fall är sämre än ingen:"
 },
 "run_l1": {
  "en": "<strong>Nothing to assess</strong> (no readable CV) is stored as that case's final result.",
  "sv": "<strong>Inget att bedöma</strong> (inget läsbart CV) lagras som fallets slutresultat."
 },
 "run_l2": {
  "en": "<strong>The request itself is wrong for every case</strong> (a bad key, a model name the API does not know) stops the step with the reason and stores nothing. This happened for real: Haiku rejects the thinking-effort parameter the production setup sends, the driver stopped on its first press and printed the API's message. Effort is now an option on the run.",
  "sv": "<strong>Själva förfrågan är fel för alla fall</strong> (en dålig nyckel, ett modellnamn som API:et inte känner till) stoppar steget med orsaken och lagrar ingenting. Det hände på riktigt: Haiku avvisar parametern för resonemangsnivå som produktionsuppsättningen skickar, drivskriptet stannade vid första tryckningen och skrev ut API:ets meddelande. Nivån är nu ett val på körningen."
 },
 "run_l3": {
  "en": "<strong>An outage or a rate limit</strong> is not stored. The case stays pending, and the driver stops after three presses with no progress.",
  "sv": "<strong>Ett avbrott eller en hastighetsgräns</strong> lagras inte. Fallet förblir väntande, och drivskriptet stannar efter tre tryckningar utan framsteg."
 },
 "run_l4": {
  "en": "<strong>The model's own bad answer</strong> (malformed JSON, an empty answer) is retried and becomes final after three attempts, so a run always ends.",
  "sv": "<strong>Modellens eget dåliga svar</strong> (felaktig JSON, ett tomt svar) görs om och blir slutgiltigt efter tre försök, så en körning tar alltid slut."
 },
 "runner_p3": {
  "en": "The review found one more: the production CV reader swallows every storage error and returns an empty string, which an eval would have stored as a permanent \"No readable CV\". A storage blip would have silently deleted cases from the measurement. Runs now read CVs with a strict reader that throws.",
  "sv": "Granskningen hittade ytterligare ett: produktionens CV-läsare sväljer varje lagringsfel och returnerar en tom sträng, vilket en utvärdering hade lagrat som ett permanent ”No readable CV”. Ett litet lagringsfel hade tyst raderat fall ur mätningen. Körningar läser nu CV med en strikt läsare som kastar fel."
 },
 "h_agree": {
  "en": "Agreement is meaningless without a baseline",
  "sv": "Överensstämmelse är meningslös utan en baslinje"
 },
 "agree_p1": {
  "en": "Of the 99 cases with a trusted label, 78 were advances. A \"model\" that says advance every time agrees with the team on 78.8% of them. Sonnet agrees on 79.8% (95% interval 70.7 to 86.7), with Cohen's kappa 0.50 (interval 0.17 to 0.67). That is not distinguishable from guessing the majority class, and the report script now prints a warning whenever agreement is at or below that baseline.",
  "sv": "Av de 99 fallen med pålitlig etikett var 78 att gå vidare. En ”modell” som alltid säger gå vidare håller med teamet i 78,8 % av dem. Sonnet håller med i 79,8 % (95 % intervall 70,7 till 86,7), med Cohens kappa 0,50 (intervall 0,17 till 0,67). Det går inte att skilja från att gissa majoritetsklassen, och rapportskriptet skriver nu en varning varje gång överensstämmelsen ligger på eller under den baslinjen."
 },
 "agree_p2": {
  "en": "There is a second trap in the verdict itself. Possible fit is neither an advance nor a reject, so every number is reported twice, once reading it as advance and once as reject. Read as reject, Sonnet agrees on only 41.4% (kappa 0.13), because the model rated 42 of the 78 candidates the team advanced as Possible fit. The honest figure is the pair, and any single number that hides which way Possible fit was read is a choice dressed as a result.",
  "sv": "Det finns en andra fälla i själva utlåtandet. Possible fit är varken att gå vidare eller att avvisa, så varje tal redovisas två gånger, en gång där det läses som vidare och en gång som avvisa. Läst som avvisa håller Sonnet med i bara 41,4 % (kappa 0,13), eftersom modellen gav 42 av de 78 kandidater teamet gick vidare med omdömet Possible fit. Den ärliga siffran är paret, och varje enskild siffra som döljer åt vilket håll Possible fit lästes är ett val förklätt till ett resultat."
 },
 "fig1": {
  "en": "Figure 1. What the model said, by what the team did, on the 99 trusted cases. None of the 21 trusted rejections got Strong fit or Good fit, and 17 got Not a fit. But the team advanced 16 of the 33 cases the model called Not a fit.",
  "sv": "Figur 1. Vad modellen sa, utifrån vad teamet gjorde, i de 99 pålitliga fallen. Ingen av de 21 pålitliga avvisningarna fick Strong fit eller Good fit, och 17 fick Not a fit. Men teamet gick vidare med 16 av de 33 fall modellen kallade Not a fit."
 },
 "agree_p3": {
  "en": "That last sentence is the useful finding. In this sample the model never gave Strong fit or Good fit to a trusted rejection, but a Not a fit is not safe to act on alone: the team advanced about half of the cases it called that (16 of 33). Three caveats belong next to every number here. First, the team could see the assessment on the card when it decided (the feature went live on 22 October, and older or out-of-scope cards may never have had one), so agreement is flattered by an amount I cannot measure afterwards. Second, the 21 trusted rejections all come from the weeks since the log began, while the 78 advances come from all time. That mix inflates the 78.8% baseline and the one-in-two figure alike, and none of it is a clean sample. Third, 0 of 21 is consistent with a true rate of up to about 14%.",
  "sv": "Den sista meningen är det användbara fyndet. I det här urvalet gav modellen aldrig Strong fit eller Good fit åt en pålitlig avvisning, men ett Not a fit går inte att agera på ensamt: teamet gick vidare med ungefär hälften av de fall det kallade så (16 av 33). Tre förbehåll hör hemma intill varje tal här. För det första kunde teamet se bedömningen på kortet när det beslutade (funktionen lanserades den 22 oktober, och äldre eller utanför omfånget liggande kort kan aldrig ha haft någon), så överensstämmelsen överdrivs i en omfattning jag inte kan mäta i efterhand. För det andra kommer alla 21 pålitliga avvisningar från veckorna sedan loggen startade, medan de 78 som gick vidare kommer från hela tiden. Den blandningen blåser upp både baslinjen på 78,8 % och talet en av två, och inget av det är ett rent urval. För det tredje är 0 av 21 förenligt med en sann andel på upp till cirka 14 %."
 },
 "agree_p4": {
  "en": "Intervals come from a bootstrap that resamples whole orders, not single applications, because the applications of one order are not independent: they share a job description and a recruiter's taste. Resampling cases one by one would give intervals that are too narrow.",
  "sv": "Intervallen kommer från en bootstrap som drar om hela uppdrag, inte enstaka ansökningar, eftersom ansökningarna på ett uppdrag inte är oberoende: de delar jobbeskrivning och en rekryterares smak. Att dra om fall för fall hade gett för smala intervall."
 },
 "h_haiku": {
  "en": "A cheaper model, and why I am not switching",
  "sv": "En billigare modell, och varför jag inte byter"
 },
 "haiku_p1": {
  "en": "The product question was cost: can Claude Haiku 4.5 do this job? Same prompt, same 302 frozen cases, same code path. Haiku costs less than half as much per assessment. On the trusted cases its agreement is indistinguishable from Sonnet's when Possible fit is read as advance (a paired McNemar test gives p = 0.77), and clearly higher when it is read as reject (p below 0.0001), though as I explain below that second result is an artefact of how Haiku hands out verdicts. If agreement were the whole story, I would switch.",
  "sv": "Produktfrågan var kostnad: kan Claude Haiku 4.5 göra det här jobbet? Samma prompt, samma 302 frysta fall, samma kodväg. Haiku kostar mindre än hälften per bedömning. På de pålitliga fallen går dess överensstämmelse inte att skilja från Sonnets när Possible fit läses som vidare (ett parat McNemar-test ger p = 0,77), och är tydligt högre när det läses som avvisa (p under 0,0001), men som jag förklarar nedan är det andra resultatet en artefakt av hur Haiku delar ut omdömen. Om överensstämmelse vore hela historien skulle jag byta."
 },
 "res.h0": {
  "en": "",
  "sv": ""
 },
 "res.h1": {
  "en": "Sonnet 5.5",
  "sv": "Sonnet 5.5"
 },
 "res.h2": {
  "en": "Haiku 4.5",
  "sv": "Haiku 4.5"
 },
 "res.r0c0": {
  "en": "Cost per assessment",
  "sv": "Kostnad per bedömning"
 },
 "res.r0c1": {
  "en": "$0.0174",
  "sv": "0,0174 USD"
 },
 "res.r0c2": {
  "en": "$0.0077",
  "sv": "0,0077 USD"
 },
 "res.r1c0": {
  "en": "Quotes that passed grounding",
  "sv": "Citat som klarade grundningen"
 },
 "res.r1c1": {
  "en": "96.6%",
  "sv": "96,6 %"
 },
 "res.r1c2": {
  "en": "72.0%",
  "sv": "72,0 %"
 },
 "res.r2c0": {
  "en": "Protected-word keyword hits in 270 assessments",
  "sv": "Sökordsträffar på skyddade ord i 270 bedömningar"
 },
 "res.r2c1": {
  "en": "1",
  "sv": "1"
 },
 "res.r2c2": {
  "en": "10",
  "sv": "10"
 },
 "res.r3c0": {
  "en": "Latency p50 / p95",
  "sv": "Latens p50 / p95"
 },
 "res.r3c1": {
  "en": "6.2 s / 7.4 s",
  "sv": "6,2 s / 7,4 s"
 },
 "res.r3c2": {
  "en": "10.9 s / 14.4 s",
  "sv": "10,9 s / 14,4 s"
 },
 "res.r4c0": {
  "en": "Strong fit verdicts (of 270)",
  "sv": "Strong fit-utlåtanden (av 270)"
 },
 "res.r4c1": {
  "en": "18",
  "sv": "18"
 },
 "res.r4c2": {
  "en": "50",
  "sv": "50"
 },
 "res.r5c0": {
  "en": "Agreement, trusted labels, Possible fit as advance",
  "sv": "Överensstämmelse, pålitliga etiketter, Possible fit som vidare"
 },
 "res.r5c1": {
  "en": "79.8%",
  "sv": "79,8 %"
 },
 "res.r5c2": {
  "en": "81.8%",
  "sv": "81,8 %"
 },
 "res.r6c0": {
  "en": "Agreement, trusted labels, Possible fit as reject",
  "sv": "Överensstämmelse, pålitliga etiketter, Possible fit som avvisa"
 },
 "res.r6c1": {
  "en": "41.4%",
  "sv": "41,4 %"
 },
 "res.r6c2": {
  "en": "69.7%",
  "sv": "69,7 %"
 },
 "res.r7c0": {
  "en": "Always say advance (baseline)",
  "sv": "Säg alltid vidare (baslinje)"
 },
 "res.r7c1": {
  "en": "78.8%",
  "sv": "78,8 %"
 },
 "res.r7c2": {
  "en": "78.8%",
  "sv": "78,8 %"
 },
 "haiku_p2": {
  "en": "But \"grounding\" is the property that makes the assessment safe to show. Every strength and concern carries a quote from the CV or the posting, and the server checks each quote against the source and drops the ones it cannot find, so a reader never sees a quote that is not in the source. Sonnet had 3.4% of its quotes dropped. Haiku had 28%. It also produced ten keyword hits for protected words (age, nationality, religion and the like) in its prose, spread over six assessments, against one hit in one Sonnet assessment (a keyword match over-counts, for example on \"race condition\", so these are hits to read, not confirmed leaks), it ran slower with the thinking setting off, and it handed out Strong fit almost three times as often. The apparent edge for Haiku when Possible fit is read as reject comes from exactly that generosity: it turned Sonnet's Possible fits into Good fits. I am staying on Sonnet, for grounding and leakage, not for agreement.",
  "sv": "Men ”grundning” är egenskapen som gör bedömningen säker att visa. Varje styrka och farhåga bär ett citat ur CV:t eller annonsen, och servern kontrollerar varje citat mot källan och tar bort dem den inte hittar, så en läsare ser aldrig ett citat som inte finns i källan. Hos Sonnet togs 3,4 % av citaten bort. Hos Haiku 28 %. Den gav också tio sökordsträffar på skyddade ord (ålder, nationalitet, religion och liknande) i sin text, fördelade på sex bedömningar, mot en träff i en Sonnet-bedömning (en sökordsträff överräknar, till exempel på ”race condition”, så det är träffar att läsa, inte bekräftade läckor), den var långsammare med resonemangsnivån avstängd, och den delade ut Strong fit nästan tre gånger så ofta. Haikus skenbara försprång när Possible fit läses som avvisa kommer från just den frikostigheten: den gjorde Sonnets Possible fit till Good fit. Jag stannar på Sonnet, för grundning och läckage, inte för överensstämmelse."
 },
 "haiku_p3": {
  "en": "To check how much the model disagrees with itself, I re-ran Sonnet on a 40-case sample. Three had no CV; of the other 37, one verdict changed (2.7%). That is a small sample: the 95% interval for the true rate runs from under 1% to about 14%.",
  "sv": "För att se hur mycket modellen är oense med sig själv körde jag Sonnet igen på ett urval om 40 fall. Tre hade inget CV; av de andra 37 ändrades ett utlåtande (2,7 %). Det är ett litet urval: 95 %-intervallet för den sanna andelen går från under 1 % till omkring 14 %."
 },
 "h_found": {
  "en": "What turned up that had nothing to do with the score",
  "sv": "Vad som dök upp som inte hade med poängen att göra"
 },
 "found_p1": {
  "en": "While building a second feature that reads the same scrubbed CV text, I read exactly what the model is sent, and that turned up a privacy bug. Before the model reads a CV, KerjaBoard strips the name, contact details and the lines that state nationality, age and similar. A CV extracted from a PDF with one word per line carried a phone number split across lines, and the scrub that looks for phone numbers works line by line, so the number survived into the prompt. The fix joins the lines first and scrubs second, with a test that failed before the change. That bug had been live, and it surfaced because I was reading the pipeline for another reason, not because anything flagged it.",
  "sv": "När jag byggde en andra funktion som läser samma skrubbade CV-text läste jag exakt vad som skickas till modellen, och det avslöjade ett integritetsfel. Innan modellen läser ett CV tar KerjaBoard bort namn, kontaktuppgifter och raderna som anger nationalitet, ålder och liknande. Ett CV som extraherats ur en PDF med ett ord per rad hade ett telefonnummer uppdelat över flera rader, och skrubben som letar efter telefonnummer arbetar rad för rad, så numret överlevde in i prompten. Rättningen slår ihop raderna först och skrubbar sedan, med ett test som föll före ändringen. Det felet hade varit i drift, och det dök upp för att jag läste igenom flödet av ett annat skäl, inte för att något larmade."
 },
 "found_p2": {
  "en": "Three things carry on after the experiment. Staff get Agree and Disagree buttons under each assessment, so the golden set keeps growing from real corrections (an Agree is not a label, because the person already read the verdict). A daily check compares the share of dropped quotes in the last week with the 23 days before, and also flags an error rate above 10%; it posts to a monitoring channel only when one of those two thresholds is crossed. And the privacy notice now says that past applications are sometimes re-run through the model to check accuracy, with no CV text kept.",
  "sv": "Tre saker fortsätter efter experimentet. Personalen får knapparna Agree och Disagree under varje bedömning, så golden set fortsätter växa av verkliga rättelser (ett Agree är ingen etikett, eftersom personen redan läst utlåtandet). En daglig kontroll jämför andelen borttagna citat den senaste veckan med de 23 dagarna före, och flaggar också en felandel över 10 %; den postar i en övervakningskanal bara när något av de två gränsvärdena passeras. Och integritetsmeddelandet säger nu att tidigare ansökningar ibland körs om genom modellen för att kontrollera träffsäkerheten, och att ingen CV-text sparas."
 },
 "h_limits": {
  "en": "What this does not show",
  "sv": "Vad detta inte visar"
 },
 "lim_l1": {
  "en": "<strong>It says nothing about candidates the team never decided.</strong> The labels exist only where a person acted.",
  "sv": "<strong>Det säger ingenting om kandidater teamet aldrig tog ställning till.</strong> Etiketterna finns bara där en människa agerade."
 },
 "lim_l2": {
  "en": "<strong>Rejections are not all about fit.</strong> A salary mismatch or a closed order is a reject label too, so agreement cannot reach 100% even for a perfect model.",
  "sv": "<strong>Avvisningar handlar inte alla om passning.</strong> En lönemismatch eller ett stängt uppdrag är också en reject-etikett, så överensstämmelsen kan inte nå 100 % ens för en perfekt modell."
 },
 "lim_l3": {
  "en": "<strong>I did not test whether the client brief moves the verdict</strong>, or any second prompt. The runner has a switch for hiding the brief, which I have not used; a second prompt needs a code change, and the prompt version is recorded so runs on different prompts are never compared as one.",
  "sv": "<strong>Jag testade inte om kundbriefen påverkar omdömet</strong>, eller någon annan prompt. Körmotorn har en brytare för att dölja briefen, som jag inte använt; en andra prompt kräver en kodändring, och promptversionen registreras så att körningar på olika prompter aldrig jämförs som en."
 },
 "lim_l4": {
  "en": "<strong>99 trusted cases is small.</strong> The agreement interval is 16 points wide, and every comparison here that looks like a difference should be read against that.",
  "sv": "<strong>99 pålitliga fall är litet.</strong> Intervallet för överensstämmelsen är 16 procentenheter brett, och varje jämförelse här som ser ut som en skillnad bör läsas mot det."
 },
 "outro": {
  "en": "The assessment rarely rates a trusted rejection highly, but a Not a fit is wrong about as often as it is right, and more than half of the candidates the team advanced were rated only Possible fit. I know that now with an interval attached, which is more than I could say last week.",
  "sv": "Bedömningen ger sällan en pålitlig avvisning ett högt omdöme, men ett Not a fit har fel ungefär lika ofta som det har rätt, och mer än hälften av de kandidater teamet gick vidare med fick bara Possible fit. Det vet jag nu med ett intervall bifogat, vilket är mer än jag kunde säga förra veckan."
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
      const e = I18N_FITEVAL[el.dataset.i18n];
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
