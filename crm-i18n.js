// CRM outbound post bilingual switcher (EN/SV).
const I18N_CRM = {
 "t": {
  "en": "Building a Client CRM on Cloudflare Workers, One Weekend",
  "sv": "Att bygga ett kund-CRM på Cloudflare Workers, på en helg"
 },
 "meta": {
  "en": "Primawan Satrio · October 2026 · ~10 min read",
  "sv": "Primawan Satrio · oktober 2026 · ~10 min lästid"
 },
 "p1": {
  "en": "For two years my agency kept its client pipeline in a Google Sheet. Companies in one tab, event contacts in another, reach-outs and replies typed by hand into cells that never lined up. That sheet was the system of record for every business development conversation we had. <a href=\"https://crm.satriocs.com\" target=\"_blank\" rel=\"noopener\">Satrio CRM</a> is what replaced it, and this post is how it was built.",
  "sv": "I två år höll min byrå sin kundpipeline i ett Google Sheet. Företag i en flik, eventkontakter i en annan, utmailningar och svar som skrevs för hand i celler som aldrig stämde. Detarket var systemet för varje affärsutvecklingssamtal vi hade. <a href=\"https://crm.satriocs.com\" target=\"_blank\" rel=\"noopener\">Satrio CRM</a> är det som ersatte det, och det här inlägget handlar om hur det byggdes."
 },
 "p2": {
  "en": "<strong>What it is, plainly:</strong> an internal tool for the business development team. It is not a SaaS product, there is no marketing site, and nothing here is for sale. More than 500 companies and contacts came out of those sheets and into a real database, on one Cloudflare Worker with one D1 database, server-rendered HTML and zero runtime dependencies.",
  "sv": "<strong>Vad det är, rent ut sagt:</strong> ett internt verktyg för affärsutvecklingsteamet. Det är ingen SaaS-produkt, det finns ingen marknadsföringssajt, och ingenting här är till salu. Över 500 företag och kontakter kom ut ur detarket och in i en riktig databas, på en enda Cloudflare Worker med en enda D1-databas, serverrenderad HTML och noll runtime-beroenden."
 },
 "h_why": {
  "en": "Why a CRM, and why build it",
  "sv": "Varför ett CRM, och varför bygga det"
 },
 "why_p1": {
  "en": "The honest answer for the build decision: the sheet already held everything, and every paid CRM wanted the same data entered again, by hand, in its own shape. The sheet had no way to answer the questions we kept asking. Who did we reach out to last month and who replied? Which of our five market segments is producing qualified meetings? Who has asked us to stop emailing them, and did anyone actually stop?",
  "sv": "Det ärliga svaret på byggbeslutet: detarket hade redan all data, och varje betalt CRM ville ha samma data inmatad igen, för hand, i sin egen form. Detarket kunde inte svara på de frågor vi ställde om och om igen. Vem mejlade vi i förra månad och vem svarade? Vilket av våra fem marknadssegment ger kvalificerade möten? Vem har bett oss sluta mejla dem, och slutade någon egentligen?"
 },
 "why_p2": {
  "en": "Those questions are three SQL queries. So the tool that answers them is a database and some pages over it, which is the smallest thing that could possibly work: <strong>one Cloudflare Worker, one D1 database, no framework and no build step</strong>. The app is vanilla HTML, CSS and JavaScript rendered on the server. The only npm dependency in the whole project is a parser for incoming email, and it lives in a separate Worker.",
  "sv": "De frågorna är tre SQL-frågor. Så verktyget som svarar på dem är en databas och några sidor ovanpå, vilket är den minsta tänkbara lösningen: <strong>en Cloudflare Worker, en D1-databas, inget ramverk och inget byggsteg</strong>. Appen är vanlig HTML, CSS och JavaScript renderad på servern. Det enda npm-beroendet i hela projektet är en parsare för inkommande mejl, och den finns i en separat Worker."
 },
 "why_p3": {
  "en": "I have shipped three systems like this now, so the pattern is proven rather than novel. The reason to write it down is not the CRUD. It is the outbound engine that came after it, and the two bugs I found by testing that engine against real sentences instead of against itself.",
  "sv": "Jag har byggt tre sådana system nu, så mönstret är beprövat snarare än nytt. Anledningen att skriva ner det är inte CRUD-delen. Det är den utgående motorn som kom efteråt, och de två fel jag hittade genom att testa motorn mot riktiga meningar i stället för mot sig själv."
 },
 "h_import": {
  "en": "The sheets were not clean data",
  "sv": "Detarket var inte ren data"
 },
 "import_p1": {
  "en": "A CSV export of two years of business development looks like data until you try to load it. The importer I wrote is deliberately tolerant: every messy cell gets logged, and nothing is ever silently dropped.",
  "sv": "En CSV-export av två års affärsutveckling ser ut som data tills man försöker läsa in den. Importören jag skrev är medvetet tolerant: varje stökig cell loggas, och inget faller tyst bort."
 },
 "import_l1": {
  "en": "<strong>Idempotent by design.</strong> Re-running the import is safe, because rows are keyed and re-imported rather than appended. An import you can run twice without corrupting anything is worth more than a fast one you cannot.",
  "sv": "<strong>Idempotent av design.</strong> Att köra importen igen är säkert, eftersom rader nyckelhanteras och importeras om i stället för att läggas till. En import man kan köra två gånger utan att förstöra något är mer värd än en snabb man inte kan."
 },
 "import_l2": {
  "en": "<strong>Messy cells are parsed, not skipped.</strong> Some contact cells held a name, a job title, a company and an email address in one field. Those are pulled apart into the right columns rather than dropped for being the wrong shape.",
  "sv": "<strong>Stökiga celler parsas, inte hoppas över.</strong> Vissa kontaktceller innehöll namn, titel, företag och e-postadress i ett och samma fält. De plockas isär till rätt kolumner i stället för att kastas bort för att de har fel form."
 },
 "import_l3": {
  "en": "<strong>Duplicate company names get a second chance.</strong> Company names are not unique, so a reused company id falls back to a name match instead of becoming a second row for the same company.",
  "sv": "<strong>Dubbletter av företagsnamn får en andra chans.</strong> Företagsnamn är inte unika, så ett återanvänt företags-id faller tillbaka på en namnmatchning i stället för att bli en andra rad för samma företag."
 },
 "import_l4": {
  "en": "<strong>Written in chunks, and every chunk reports back.</strong> Each chunk is applied separately and its result is verified, so a partial apply is visible instead of quiet. D1 has a statement limit, and a script that stops halfway should say so loudly.",
  "sv": "<strong>Skriven i bitar, och varje bit rapporterar.</strong> Varje bit appliceras separat och dess resultat verifieras, så en delvis applicering syns i stället för att förbli tyst. D1 har en gräns för satser, och ett skript som stannar halvvägs bör säga det högt."
 },
 "import_l5": {
  "en": "<strong>Dry run first.</strong> The default run changes nothing. It prints what it would do, so the real run is never the first time you see the decisions it made.",
  "sv": "<strong>Testkörning först.</strong> Standardkörningen ändrar ingenting. Den skriver ut vad den skulle göra, så den riktiga körningen är aldrig första gången man ser besluten den fattat."
 },
 "h_auth": {
  "en": "Zero dependencies still needs real auth",
  "sv": "Noll beroenden behöver fortfarande riktig autentisering"
 },
 "auth_p1": {
  "en": "No auth library means writing the security parts yourself, which is only a good idea when you do it carefully. Passwords are PBKDF2-SHA256, 100,000 iterations, and compared in constant time. Sessions are rows in the database with a seven-day expiry, in an <code>HttpOnly</code> cookie, checked on every request and deleted on sight once expired.",
  "sv": "Inget autentiseringsbibliotek innebär att man skriver säkerhetsdelarna själv, vilket bara är en bra idé om man gör det noggrant. Lösenord är PBKDF2-SHA256, 100 000 iterationer, och jämförs i konstant tid. Sessioner är rader i databasen med sju dagars giltighet, i en <code>HttpOnly</code>-cookie, kontrollerade vid varje förfrågan och raderade vid första påseende när de har gått ut."
 },
 "auth_p2": {
  "en": "Every form carries a double-submit CSRF token: a random value in a cookie, echoed in a hidden field, compared byte for byte. The server-side <code>html()</code> helper stamps every POST form automatically, so a new form cannot be added without it. This is the part I would not hand-roll casually, and the reason it is acceptable here is that the same scheme has run in two other production systems of mine.",
  "sv": "Varje formulär bär en dubbelskickad CSRF-token: ett slumpvärde i en cookie, speglat i ett dolt fält, jämfört byte för byte. Serverhjälpen <code>html()</code> stämplar varje POST-formulär automatiskt, så ett nytt formulär kan inte läggas till utan det. Det här är delen jag inte skulle handskas med försummade, och anledningen till att det går är att samma metod har kört i två andra produktionssystem av mig."
 },
 "h_outbound": {
  "en": "The part that was actually interesting: outbound",
  "sv": "Den del som faktiskt var intressant: utgående trafik"
 },
 "outbound_p1": {
  "en": "A CRM that only stores what you typed in is a database with extra steps. The reason this one is worth writing about is that it also runs outbound: segments the companies, tracks outreach, reads the replies that come back, and sequences follow-ups.",
  "sv": "Ett CRM som bara sparar vad man skrev in är en databas med extra steg. Anledningen till att det här är värt att skriva om är att det också kör utgående trafik: segmenterar företagen, spårar utmailningar, läser svaren som kommer tillbaka och sekvenserar uppföljningar."
 },
 "outbound_p2": {
  "en": "Replies are read by a second Worker, wired to Cloudflare Email Routing, that shares the first Worker's database. When a reply arrives it does four things, in this order:",
  "sv": "Svar läses av en andra Worker, kopplad till Cloudflare Email Routing, som delar den första Workerns databas. När ett svar kommer gör den fyra saker, i den här ordningen:"
 },
 "out_l1": {
  "en": "<strong>Classify the reply.</strong> A pure function takes the subject and body and returns one of interested, question, out of office, unsubscribe, or bounce.",
  "sv": "<strong>Klassificera svaret.</strong> En ren funktion tar ämne och brödtext och returnerar en av intresserad, fråga, frånvarande, avregistrera eller bounce."
 },
 "out_l2": {
  "en": "<strong>Log it to the company.</strong> The reply becomes an entry on that company's timeline, so the conversation is in the same place as everything else.",
  "sv": "<strong>Logga det hos företaget.</strong> Svaret blir en rad i företagets tidslinje, så samtalet finns på samma ställe som allt annat."
 },
 "out_l3": {
  "en": "<strong>Honour an opt-out immediately.</strong> An unsubscribe or a bounce adds the address to the suppression list, and a suppressed contact is removed from any sequence they are in.",
  "sv": "<strong>Respektera en avregistrering direkt.</strong> En avregistrering eller en bounce lägger adressen på spärrlistan, och ett spärrat kontakt tas bort ur varje sekvens det är med i."
 },
 "out_l4": {
  "en": "<strong>Alert the team.</strong> A Discord message for every reply, so an interested prospect does not sit unread. Alerting is best effort and never allowed to break the processing.",
  "sv": "<strong>Varna teamet.</strong> Ett Discord-meddelande för varje svar, så en intresserad prospekt inte ligger oläst. Varningen görs efter bästa förmåga och får aldrig få bearbetningen att krascha."
 },
 "fig1": {
  "en": "Figure 1. What happens when a reply arrives. Suppression is checked by every send path, not only here.",
  "sv": "Figur 1. Vad som händer när ett svar kommer. Spärrlistan kontrolleras av varje sändväg, inte bara här."
 },
 "outbound_p3": {
  "en": "Suppression is the one rule with no exceptions in the codebase. It exists because of Indonesian law (UU 27/2022) and, for European contacts, GDPR. A single hot lead is never worth mailing someone who asked you to stop.",
  "sv": "Spärrlistan är den enda regeln utan undantag i kodbasen. Den finns på grund av indonesisk lag (UU 27/2022) och, för europeiska kontakter, GDPR. En enda het kund är aldrig värd att mejla någon som bett dig att sluta."
 },
 "h_ramp": {
  "en": "Sending slowly on purpose",
  "sv": "Att skicka långsamt med flit"
 },
 "ramp_p1": {
  "en": "A new mailbox that sends 200 cold emails on its first day gets flagged, and the flag outlives the campaign. So the sequence engine enforces a warm-up ramp: a mailbox starts at 5 sends a day and climbs 5, 8, 12, 18, 25, 35, 50, then stays there. The cap is per mailbox per day, and the ramp is a decision made once, in a pure function, rather than a setting somebody can get wrong under pressure.",
  "sv": "En ny brevlåda som skickar 200 kalla mejl första dagen flaggas, och flaggan lever längre än kampanjen. Så sekvensmotorn tvingar fram en uppvärmningsramp: en brevlåda börjar på 5 sändningar om dagen och klättrar 5, 8, 12, 18, 25, 35, 50 och stannar där. Taket är per brevlåda och dag, och rampen är ett beslut som fattas en gång, i en ren funktion, i stället för en inställning någon kan ställa fel under press."
 },
 "fig2": {
  "en": "Figure 2. The warm-up ramp. Day 0 is the mailbox's first send, not the sequence's first send.",
  "sv": "Figur 2. Uppvärmningsrampen. Dag 0 är brevlådans första sändning, inte sekvensens första."
 },
 "ramp_p2": {
  "en": "Enrolment is idempotent, each contact gets a stable A/B variant derived from its id so a contact sees the same variant at every step, and the whole scheduler is pure: given an enrolment, the suppression set, the clock and today's send count, it returns whether to send and why. Every reason it might not send is a named verdict, which is what makes the caps testable without any email infrastructure.",
  "sv": "Inskrivningen är idempotent, varje kontakt får en stabil A/B-variant härledd från sitt id så att kontakten ser samma variant vid varje steg, och hela schemaläggaren är ren: givet en inskrivning, spärrlistan, klockan och dagens sändningsantal returnerar den om den ska skicka och varför. Varje anledning till att den kanske inte skickar är ett namngivet utslag, och det är vad som gör taken testbara utan någon mejlinfrastruktur."
 },
 "h_bug": {
  "en": "The tests passed, and the classifier was wrong",
  "sv": "Testerna gick igenom, och klassificeraren var fel"
 },
 "bug_p1": {
  "en": "The reply classifier is a set of regular expressions, and it had nine tests. All nine passed. Then I fed it sentences a real prospect would actually write, and it got three of them wrong:",
  "sv": "Svarsklassificeraren är en uppsättning reguljära uttryck, och den hade nio tester. Alla nio gick igenom. Sedan matade jag den med meningar en riktig prospekt faktiskt skulle skriva, och den fick tre av dem fel:"
 },
 "bug_l1": {
  "en": "<strong>\"We have 550 employees in Jakarta, can you send pricing?\"</strong> read as a bounce, because <code>550</code> matched a bare SMTP error code. This is a qualified prospect asking to buy, and a bounce adds the address to the suppression list. One regex could have permanently silenced them.",
  "sv": "<strong>”We have 550 employees in Jakarta, can you send pricing?”</strong> lästes som en bounce, för att <code>550</code> matchade en ensam SMTP-felkod. Det här är en kvalificerad prospekt som vill köpa, och en bounce lägger adressen på spärrlistan. Ett reguljärt uttryck kunde ha tystat dem för alltid."
 },
 "bug_l2": {
  "en": "<strong>\"Thanks, but we're not interested at the moment.\"</strong> read as a hot lead, because the word \"interested\" was there and nothing checked whether anyone had negated it. The system would have paged the team about a no.",
  "sv": "<strong>”Thanks, but we're not interested at the moment.”</strong> lästes som en het kund, för att ordet ”interested” fanns där och inget kontrollerade om någon hade nekat det. Systemet hade lagt in en sida till teamet om ett nej."
 },
 "bug_l3": {
  "en": "<strong>\"Please don't unsubscribe me, I'd like to learn more.\"</strong> read as an opt-out, because it contains the word \"unsubscribe\". A warm reader would have been suppressed for politely telling us to keep going.",
  "sv": "<strong>”Please don't unsubscribe me, I'd like to learn more.”</strong> lästes som en avregistrering, för att den innehåller ordet ”unsubscribe”. En varm läsare hade sparats för att artigt be oss fortsätta."
 },
 "bug_p2": {
  "en": "The tests passed because every test case was a sentence written to match the regexes. That is the real lesson, and it is the same one from the scoring engine post: a test that has never failed has not proven anything. Testing a classifier against its own author's examples tests the author's imagination, not the code.",
  "sv": "Testerna gick igenom för att varje testfall var en mening skriven för att matcha de reguljära uttrycken. Det är den riktiga lärdommen, och det är samma som i inlägget om matchningsmotorn: ett test som aldrig har fallerat har inte bevisat något. Att testa en klassificerare mot sin egen författares exempel testar författarens fantasi, inte koden."
 },
 "bug_p3": {
  "en": "The fixes: a bounce now has to say why delivery failed, because a number in a sentence is not an SMTP code. Interest only counts when nobody negated it. An opt-out does not count when the writer explicitly asked us not to opt them out. And there are now eight regression tests, each one a real sentence, and each one one that the previous version got wrong. A reply that both declines and asks to be removed is still an opt-out, because a missed opt-out is the one error that costs real trust.",
  "sv": "Rättelserna: en bounce måste nu säga varför leveransen misslyckades, för att ett tal i en mening inte är en SMTP-kod. Intresse räknas bara när ingen har nekat det. En avregistrering räknas inte när författaren uttryckligen bett oss att inte avregistrera. Och det finns nu åtta regressionstester, var och ett en riktig mening, och var och ett en som den tidigare versionen fick fel. Ett svar som både tackar nej och ber att bli borttaget är fortfarande en avregistrering, för en missad avregistrering är det enda felet som kostar verklig tillit."
 },
 "h_gate": {
  "en": "The other bug: a kill switch anyone could arm",
  "sv": "Det andra felet: ett huvudströmbrytare vem som helst kunde lägga om"
 },
 "gate_p1": {
  "en": "The send path had a safety switch so that no cold email could leave before the domain's SPF, DKIM and DMARC records were set up and the mailbox was warmed. The switch was read from a form field in the request. Any signed-in user could arm it by posting <code>send_enabled=1</code>. A safety gate that the person it is protecting against can turn on is not a safety gate.",
  "sv": "Sändvägen hade ett säkerhetsläge så att inget kallt mejl kunde skickas innan domänens SPF-, DKIM- och DMARC-poster var klara och brevlådan uppvärmd. Läget lästes från ett fält i förfrågan. Vem som helst som var inloggad kunde lägga om det genom att posta <code>send_enabled=1</code>. En spärr som den den ska skydda mot kan sätta på är ingen spärr."
 },
 "gate_p2": {
  "en": "It now reads a Worker secret instead, which means it can only be changed by someone with access to the deployment. And while fixing it I found the related lie: with no email binding configured, a send was still logged as <code>sent</code> and the sequence advanced to the next step, so the system would report a successful campaign that nobody ever received. A send is now logged as sent only when something was actually delivered, and without the binding the step is skipped and stays queued.",
  "sv": "Den läser nu en Worker-hemlighet i stället, vilket innebär att den bara kan ändras av någon med tillgång till driftsättningen. Och under rättelsen hittade jag relaterade lögnen: utan någon mejlbindning konfigurerad loggades en sändning fortfarande som <code>sent</code> och sekvensen gick vidare till nästa steg, så systemet hade rapporterat en lyckad kampanj som ingen någonsin fått. En sändning loggas nu som skickad bara när något faktiskt levererades, och utan bindningen hoppas steget över och ligger kvar i kön."
 },
 "gate_p3": {
  "en": "Both bugs were found the same way: by looking at what the code does with real input rather than what its tests say. The classifier's tests were all written by the person who wrote the classifier. The send gate was never tested against a request that tried to defeat it.",
  "sv": "Båda felen hittades på samma sätt: genom att titta på vad koden gör med riktig indata i stället för vad dess tester säger. Klassificerarens tester var alla skrivna av den som skrev klassificeraren. Sändspärren testades aldrig mot en förfrågan som försökte kringgå den."
 },
 "h_next": {
  "en": "What is not built",
  "sv": "Vad som inte är byggt"
 },
 "next_l1": {
  "en": "Sending is still off. The warm-up ramp, the caps and the suppression checks are all live and tested, but no cold email has been sent, because the domain is not authenticated yet and the mailbox is not warmed. The gate is deliberately closed until it is.",
  "sv": "Sändning är fortfarande avstängd. Uppvärmningsrampen, taken och spärrkontrollerna är alla live och testade, men inget kallt mejl har skickats, för domänen är inte autentiserad ännu och brevlådan inte uppvärmd. Spärren är medvetet stängd tills den är det."
 },
 "next_l2": {
  "en": "No role permissions yet. Everyone signed in can do everything. For a team of four that is fine; it is the first thing to fix if the team grows.",
  "sv": "Inga rollbehörigheter ännu. Alla inloggade kan göra allt. För ett team på fyra går det bra; det är det första som bör fixas om teamet växer."
 },
 "next_l3": {
  "en": "No activity feed from other systems. Replies land in the CRM because they are emailed to it, not because anything is integrated. Anything else is still typed in.",
  "sv": "Inget aktivitetsflöde från andra system. Svar hamnar i CRM:et för att de mejlas dit, inte för att något är integrerat. Allt annat skrivs fortfarande in."
 },
 "next_l4": {
  "en": "No reporting beyond the dashboard tiles. The questions that started this are answered, by queries somebody has to run.",
  "sv": "Ingen rapportering förutom instrumentpanelens rutor. Frågorna som startade detta besvaras, av frågor någon måste köra."
 },
 "h_les": {
  "en": "What this taught me",
  "sv": "Vad det här lärde mig"
 },
 "les_l1": {
  "en": "<strong>The smallest system that answers the question beats the smallest system you can build.</strong> One Worker and one database is not the point; the point is that a sheet cannot count.",
  "sv": "<strong>Det minsta systemet som svarar på frågan slår det minsta systemet du kan bygga.</strong> En Worker och en databas är inte poängen; poängen är att ett ark inte kan räkna."
 },
 "les_l2": {
  "en": "<strong>A test suite written by the author is not an adversarial review.</strong> The classifier had nine passing tests and was wrong on three real sentences. Feed it sentences you did not write.",
  "sv": "<strong>En testsvit skriven av författaren är ingen antagonistisk granskning.</strong> Klassificeraren hade nio godkända tester och hade fel på tre riktiga meningar. Mata den med meningar du inte skrev."
 },
 "les_l3": {
  "en": "<strong>A safety gate must live somewhere the danger cannot reach.</strong> A form field is not a safety gate.",
  "sv": "<strong>En säkerhetsspärr måste finnas där faran inte kan nå den.</strong> Ett formulärfält är ingen säkerhetsspärr."
 },
 "les_l4": {
  "en": "<strong>Never log a success you did not achieve.</strong> A send with no delivery is not a send, and a system that reports otherwise is worse than one that reports nothing.",
  "sv": "<strong>Logga aldrig en framgång du inte uppnådde.</strong> En sändning utan leverans är ingen sändning, och ett system som rapporterar annat är värre än ett som inte rapporterar något."
 },
 "les_l5": {
  "en": "<strong>Compliance rules belong in the code, not in the process.</strong> \"Remember to check the list\" is not a policy. The check is in every send path, so it cannot be forgotten.",
  "sv": "<strong>Efterlevnadsregler hör hemma i koden, inte i processen.</strong> ”Kom ihåg att kolla listan” är ingen policy. Kontrollen finns i varje sändväg, så den kan inte glömmas bort."
 },
 "outro": {
  "en": "The CRM replaces the sheet, which was the whole job. The interesting part turned out to be everything that happened after the data was in: reading replies, respecting an opt-out, and sending slowly enough that the domain survives it. None of that needed a new framework. It needed somebody to test the parts that decide who gets emailed, with sentences a stranger would write.",
  "sv": "CRM:et ersätter detarket, vilket var hela jobbet. Den intressanta delen visade sig vara allt som hände efter att datan var inne: att läsa svar, respektera en avregistrering och skicka långsamt nog att domänen överlever det. Inget av det behövde ett nytt ramverk. Det behövde någon som testade delarna som bestämmer vem som får mejl, med meningar en främling skulle skriva."
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
      const e = I18N_CRM[el.dataset.i18n];
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
