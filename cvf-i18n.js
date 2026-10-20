// cv-reformatter post bilingual switcher (EN/SV).
const I18N_CVF = {
 "t": {
  "en": "Designing a CV Reformatter: Any Resume In, the Client’s Exact Template Out",
  "sv": "Att designa en CV-omformaterare: valfritt CV in, kundens exakta mall ut"
 },
 "meta": {
  "en": "Primawan Satrio · October 2026 · ~12 min read",
  "sv": "Primawan Satrio · oktober 2026 · ca 12 min läsning"
 },
 "p1": {
  "en": "Every client of my recruiting agency wants candidate CVs in its own Word template. One wants a blind CV with the candidate's name in the header and the client's own contact block in place of the candidate's. Another wants the full profile, with a line for how long the candidate has worked in Singapore. When a client has no template, we send our own anonymous Satrio Consulting CV, so the client hires through us rather than around us. Before this tool, a recruiter retyped each CV into the right template by hand, for every candidate and every client.",
  "sv": "Varje kund hos min rekryteringsbyrå vill ha kandidaternas CV:n i sin egen Word-mall. En vill ha ett blint CV med kandidatens namn i sidhuvudet och kundens eget kontaktblock i stället för kandidatens. En annan vill ha hela profilen, med en rad för hur länge kandidaten har arbetat i Singapore. När en kund saknar mall skickar vi vårt eget anonyma Satrio Consulting-CV, så att kunden anställer genom oss i stället för att gå förbi oss. Innan verktyget fanns förde en rekryterare över varje CV för hand till rätt mall, för varje kandidat och varje kund."
 },
 "p2": {
  "en": "The CV reformatter inside KerjaBoard, our job board, does that work now. A recruiter picks a candidate from the database or uploads a file, picks the client format, checks the draft on a review screen, and downloads a finished <code>.docx</code> in the client's template. It went live in August 2026, the internal recruiting team uses it on real client submissions, and their verdict so far is that it works. This post is the system design: the stages, the decision behind each one, and the bugs that shaped them.",
  "sv": "CV-omformateraren i KerjaBoard, vår jobbplattform, gör det arbetet nu. En rekryterare väljer en kandidat i databasen eller laddar upp en fil, väljer kundens format, granskar utkastet på en granskningssida och laddar ner en färdig <code>.docx</code> i kundens mall. Den gick live i augusti 2026, det interna rekryteringsteamet använder den i riktiga kandidatpresentationer för kunder, och deras omdöme hittills är att den fungerar. Det här inlägget handlar om systemdesignen: stegen, beslutet bakom varje steg och buggarna som formade dem."
 },
 "h_shape": {
  "en": "The shape of the pipeline",
  "sv": "Pipelinens form"
 },
 "shape1": {
  "en": "Eight stages across two requests. Everything runs on the same Cloudflare Worker as the rest of KerjaBoard, and the document path (PDF parsing, the model call, the Word renderer) uses no npm packages.",
  "sv": "Åtta steg fördelade på två förfrågningar. Allt körs på samma Cloudflare Worker som resten av KerjaBoard, och dokumentflödet (PDF-tolkning, modellanropet, Word-renderaren) använder inga npm-paket."
 },
 "fig1": {
  "en": "Figure 1. The reformatter pipeline. The first request ends at the review screen; the download is a second request, built only from what the recruiter approved.",
  "sv": "Figur 1. Omformaterarens pipeline. Den första förfrågan slutar på granskningssidan; nedladdningen är en andra förfrågan som byggs enbart av det rekryteraren har godkänt."
 },
 "shape2": {
  "en": "The split into two requests is the most important decision in the design. The model's output is a draft, never a document. Nothing reaches a client until a recruiter has read every field, and the download is rebuilt from the fields the recruiter submitted, so a correction made on the review screen is the version that ships.",
  "sv": "Uppdelningen i två förfrågningar är det viktigaste beslutet i designen. Modellens svar är ett utkast, aldrig ett dokument. Inget når en kund innan en rekryterare har läst varje fält, och nedladdningen byggs av de fält som rekryteraren skickade in, så en rättelse på granskningssidan är den version som levereras."
 },
 "h_schema": {
  "en": "One definition, three consumers",
  "sv": "En definition, tre konsumenter"
 },
 "schema1": {
  "en": "Each format is one object in <code>CLIENT_FORMATS</code>: groups of fields, a repeating block for work history, and flags such as <code>blind</code>, <code>anonymous</code> and <code>english</code>. That one object generates the JSON schema in the prompt, the inputs on the review screen, and fixes the key names the template's tokens must use.",
  "sv": "Varje format är ett objekt i <code>CLIENT_FORMATS</code>: grupper av fält, ett upprepat block för arbetslivserfarenhet och flaggor som <code>blind</code>, <code>anonymous</code> och <code>english</code>. Samma objekt genererar JSON-schemat i prompten, fälten på granskningssidan, och det bestämmer vilka nyckelnamn mallens tokens måste använda."
 },
 "fig2": {
  "en": "Figure 2. A format definition drives the prompt, the review form and the template. A field added to the definition reaches the prompt and the review form automatically; the template only has to use the same key.",
  "sv": "Figur 2. En formatdefinition styr prompten, granskningsformuläret och mallen. Ett fält som läggs till i definitionen hamnar automatiskt i prompten och granskningsformuläret; mallen behöver bara använda samma nyckel."
 },
 "schema2": {
  "en": "The alternative, a prompt, a form and a template each written by hand, drifts the first time someone renames a field: the model fills a key the template never reads, and the client gets a blank section. With one definition, a new format is a short list: the object, the template file, one entry in a lookup table, and a line in the in-app guide. Prompt rules check the flags rather than the format's name where they can, so the newest format reused a translation rule an earlier format needed.",
  "sv": "Om prompt, formulär och mall i stället skrivs för hand var för sig glider de isär första gången någon döper om ett fält: modellen fyller i en nyckel som mallen aldrig läser, och kunden får en tom sektion. Med en enda definition är ett nytt format en kort lista: objektet, mallfilen, en rad i en uppslagstabell och en rad i guiden i appen. Promptreglerna utgår från flaggorna snarare än formatets namn där det går, så det nyaste formatet återanvände en översättningsregel som ett tidigare format behövde."
 },
 "h_extract": {
  "en": "Extraction is the hard part",
  "sv": "Textutvinningen är den svåra delen"
 },
 "ex1": {
  "en": "The first serious bug report said the reformatter was \"not accurate\". Every field on the review screen read <code>xxxx</code>. That is not an accuracy problem; it is zero input. The PDF parser had returned an empty string, the model had been asked to read nothing, and it had correctly answered that nothing was there. Tuning the prompt would have changed nothing.",
  "sv": "Den första allvarliga buggrapporten sa att omformateraren var ”inte träffsäker”. Varje fält på granskningssidan visade <code>xxxx</code>. Det är inget träffsäkerhetsproblem; det är noll indata. PDF-tolken hade returnerat en tom sträng, modellen hade fått ingenting att läsa och hade helt riktigt svarat att det inte fanns något där. Att justera prompten hade inte ändrat något."
 },
 "ex2": {
  "en": "PDF is not a text format. It is a set of drawing instructions, and the tools people use to make CVs store the letters in at least five different ways. The parser in <code>src/cv.js</code> learned each one from a real CV that came back empty or garbled:",
  "sv": "PDF är inget textformat. Det är en uppsättning ritinstruktioner, och verktygen som folk gör CV:n i lagrar bokstäverna på minst fem olika sätt. Tolken i <code>src/cv.js</code> lärde sig vart och ett från ett riktigt CV som kom tillbaka tomt eller förvanskat:"
 },
 "tbl.h0": {
  "en": "How the text is stored",
  "sv": "Hur texten lagras"
 },
 "tbl.h1": {
  "en": "What we saw",
  "sv": "Vad vi såg"
 },
 "tbl.h2": {
  "en": "The fix",
  "sv": "Lösningen"
 },
 "tbl.r0c0": {
  "en": "Compressed streams with stray bytes before <code>endstream</code>",
  "sv": "Komprimerade strömmar med extra byte före <code>endstream</code>"
 },
 "tbl.r0c1": {
  "en": "Every field empty",
  "sv": "Alla fält tomma"
 },
 "tbl.r0c2": {
  "en": "Inflate exactly the stream's declared <code>/Length</code>, not up to the end marker",
  "sv": "Packa upp exakt strömmens angivna <code>/Length</code>, inte fram till slutmarkören"
 },
 "tbl.r1c0": {
  "en": "Glyph IDs in hex, a constant offset from Unicode (common in DOCX-to-PDF converters)",
  "sv": "Glyf-ID:n i hex, med en konstant förskjutning från Unicode (vanligt hos DOCX-till-PDF-konverterare)"
 },
 "tbl.r1c1": {
  "en": "No text at all",
  "sv": "Ingen text alls"
 },
 "tbl.r1c2": {
  "en": "Read the offset from the file's own ToUnicode maps and take the most common one",
  "sv": "Läs förskjutningen ur filens egna ToUnicode-tabeller och ta den vanligaste"
 },
 "tbl.r2c0": {
  "en": "One ToUnicode map per font subset, the same code meaning different letters",
  "sv": "En ToUnicode-tabell per typsnittsdelmängd, där samma kod betyder olika bokstäver"
 },
 "tbl.r2c1": {
  "en": "Real words mixed with wrong characters",
  "sv": "Riktiga ord blandade med fel tecken"
 },
 "tbl.r2c2": {
  "en": "Decode each string through the map of the font in use at that point",
  "sv": "Avkoda varje sträng med tabellen för det typsnitt som används just där"
 },
 "tbl.r3c0": {
  "en": "Glyph indices with no ToUnicode map at all",
  "sv": "Glyfindex helt utan ToUnicode-tabell"
 },
 "tbl.r3c1": {
  "en": "Text shifted into nonsense",
  "sv": "Text förskjuten till nonsens"
 },
 "tbl.r3c2": {
  "en": "Search offsets per font; score each on letters, vowel ratio and common letter pairs",
  "sv": "Sök förskjutning per typsnitt; poängsätt var och en på bokstäver, vokalandel och vanliga bokstavspar"
 },
 "tbl.r4c0": {
  "en": "Uncompressed or ASCII85-wrapped streams",
  "sv": "Okomprimerade eller ASCII85-kodade strömmar"
 },
 "tbl.r4c1": {
  "en": "An empty string from a plain English CV",
  "sv": "En tom sträng från ett vanligt engelskt CV"
 },
 "tbl.r4c2": {
  "en": "Read raw streams as they are; decode ASCII85 before inflating",
  "sv": "Läs råa strömmar som de är; avkoda ASCII85 före uppackning"
 },
 "ex3": {
  "en": "Row four was the subtle one. Scoring candidate offsets by letter count alone picks a neighbour three or four places away, which turns a heading into readable-looking nonsense. Adding vowel ratio and a small set of common English and Indonesian letter pairs is what broke those ties. That change was run against a corpus of about three thousand real CV files, old parser against new: it improved 265 and made none worse. Later extractor changes were checked the same way on smaller sets, and the newest class has its own test in CI.",
  "sv": "Rad fyra var den lömska. Om man poängsätter tänkbara förskjutningar enbart efter antal bokstäver vinner ofta en granne tre eller fyra steg bort, vilket gör en rubrik till nonsens som ser läsbart ut. Det var vokalandelen och en liten uppsättning vanliga engelska och indonesiska bokstavspar som avgjorde de fallen. Den ändringen kördes mot en korpus på ungefär tretusen riktiga CV-filer, gammal tolk mot ny: den förbättrade 265 filer och försämrade ingen. Senare ändringar har kontrollerats på samma sätt mot mindre urval, och den senaste klassen har ett eget test i CI."
 },
 "ex4": {
  "en": "Two guards sit around the extractor. A <code>looksReadable</code> check refuses mojibake before the model call, with a message asking the recruiter to re-save the file as DOCX, because sending garbage to a model three times with retries just produces three empty answers. And each text operator is found with a linear scan before any pattern matching runs: one image-heavy Japanese CV form made the old regular expression quadratic, and the Worker ran out of CPU time.",
  "sv": "Två spärrar omger textutvinningen. En <code>looksReadable</code>-kontroll stoppar teckenröra före modellanropet, med ett meddelande som ber rekryteraren spara om filen som DOCX, eftersom skräp som skickas till en modell tre gånger bara ger tre tomma svar. Och varje textoperator hittas med en linjär genomsökning innan någon mönstermatchning körs: ett bildtungt japanskt CV-formulär gjorde det gamla reguljära uttrycket kvadratiskt, och Workern fick slut på CPU-tid."
 },
 "h_model": {
  "en": "The model call",
  "sv": "Modellanropet"
 },
 "m1": {
  "en": "The prompt is mostly rules about facts. Copy every degree, GPA, certificate, employer and date exactly as written. Include every employer. Never guess: an unknown field is the literal string <code>xxxx</code> and an unknown list is empty. For clients who want English, translate the prose but keep proper nouns as written, so a product or system name is not turned into something the client cannot search for.",
  "sv": "Prompten består mest av regler om fakta. Kopiera varje examen, betygssnitt, certifikat, arbetsgivare och datum exakt som det står. Ta med varje arbetsgivare. Gissa aldrig: ett okänt fält blir strängen <code>xxxx</code> och en okänd lista blir tom. För kunder som vill ha engelska översätts löptexten men egennamn behålls som de står, så att namnet på en produkt eller ett system inte blir något som kunden inte kan söka på."
 },
 "m2": {
  "en": "The call goes to Claude Sonnet with low thinking effort, because thinking spends the same output budget the JSON needs. The answer is parsed leniently: markdown fences are stripped, and JSON cut off mid-object is closed at the last complete element, so a long CV still reaches review with most of its data instead of failing on \"Unexpected end of JSON input\". A truncated answer is reported as running out of output space and is not retried, because a retry would stop in the same place. Empty answers and server errors get up to three attempts, with a longer wait before each retry.",
  "sv": "Anropet går till Claude Sonnet med låg tankeinsats, eftersom tänkandet förbrukar samma utdatabudget som JSON-svaret behöver. Svaret tolkas tolerant: markdown-staket tas bort, och JSON som klippts av mitt i ett objekt stängs vid det sista hela elementet, så att ett långt CV ändå når granskningen med det mesta av sin data i stället för att avbrytas med ”Unexpected end of JSON input”. Ett avklippt svar rapporteras som slut på utdatautrymme och körs inte om, eftersom ett nytt försök skulle stanna på samma ställe. Vid tomma svar och serverfel görs upp till tre försök, med längre väntan före varje nytt försök."
 },
 "m3": {
  "en": "Why not a free model? I measured it in August 2026 with the production prompt. On a clean CV, Claude and two free Workers AI models scored the same. On the same CV with its line breaks stripped and a section cut out, both free models returned nothing usable, while Claude still extracted five of six jobs and the correct GPA. A later re-run on newer cheap models did much better, so that verdict belongs to that generation of models, not to free models in general. The code now has a triage step that can send clean CVs to a cheaper model; it is built and switched off until an A/B run says it is safe.",
  "sv": "Varför inte en gratis modell? Jag mätte det i augusti 2026 med produktionsprompten. På ett rent CV fick Claude och två gratis Workers AI-modeller samma resultat. På samma CV med radbrytningarna borttagna och en sektion bortklippt gav båda gratismodellerna ingenting användbart, medan Claude fortfarande fick ut fem av sex anställningar och rätt betygssnitt. En senare omkörning med nyare billiga modeller gick betydligt bättre, så det utslaget gäller den generationen modeller, inte gratismodeller i allmänhet. Koden har nu ett sorteringssteg som kan skicka rena CV:n till en billigare modell; det är byggt men avstängt tills en A/B-körning visar att det är säkert."
 },
 "h_err": {
  "en": "Four errors, four causes",
  "sv": "Fyra fel, fyra orsaker"
 },
 "e1": {
  "en": "Over two months the provider call failed in four different ways, and each one looked like a broken formatter to the recruiter who hit it:",
  "sv": "Under två månader misslyckades anropet till leverantören på fyra olika sätt, och vart och ett såg ut som en trasig omformaterare för rekryteraren som drabbades:"
 },
 "e_l1": {
  "en": "<strong>401:</strong> billing on the API account, not the key itself. A new key fixed it without a deploy.",
  "sv": "<strong>401:</strong> faktureringen på API-kontot, inte själva nyckeln. En ny nyckel löste det utan driftsättning."
 },
 "e_l2": {
  "en": "<strong>404 naming the model:</strong> the model ID had been retired. It lived in two places, the config and a fallback in the code, and both had to change.",
  "sv": "<strong>404 med modellens namn:</strong> modell-ID:t hade fasats ut. Det fanns på två ställen, i konfigurationen och som ett reservvärde i koden, och båda behövde ändras."
 },
 "e_l3": {
  "en": "<strong>400 asking for a workspace header:</strong> the provider tightened authentication for service-account keys. The key was fine; the request needed one more header.",
  "sv": "<strong>400 som krävde en workspace-header:</strong> leverantören skärpte autentiseringen för service-account-nycklar. Nyckeln var i ordning; förfrågan behövde en header till."
 },
 "e_l4": {
  "en": "<strong>403 \"Request not allowed\":</strong> a Worker's outbound call leaves from the data center nearest the visitor, and the provider refuses some regions. The fix is a Durable Object created once with a Western Europe location hint. Durable Objects stay where they were first created, so every model call now leaves from the same region, whoever clicks the button.",
  "sv": "<strong>403 ”Request not allowed”:</strong> det utgående anropet från en Worker går ut från datacentret närmast besökaren, och leverantören nekar vissa regioner. Lösningen är ett Durable Object som skapas en gång med en platsangivelse för Västeuropa. Durable Objects stannar där de först skapades, så varje modellanrop går nu ut från samma region, vem som än klickar på knappen."
 },
 "e2": {
  "en": "The lesson: read the status code and the body before touching anything. I also added an admin-only page that makes a real call with the configured model. Its first version left out the workspace header and reported a working key as broken. A health check has to send exactly what production sends, or it is worse than no check.",
  "sv": "Lärdomen: läs statuskoden och svarstexten innan du rör något. Jag lade också till en sida, bara för admin, som gör ett riktigt anrop med den konfigurerade modellen. Dess första version utelämnade workspace-headern och rapporterade en fungerande nyckel som trasig. En hälsokontroll måste skicka exakt det som produktionen skickar, annars är den sämre än ingen kontroll alls."
 },
 "h_review": {
  "en": "A review screen that shows the gaps",
  "sv": "En granskningssida som visar luckorna"
 },
 "r1": {
  "en": "Every field on the review screen is editable, every field the model could not fill is highlighted in yellow, an empty single-value field reads <code>xxxx</code>, and a list of the gaps sits at the top of the page. I chose visible gaps over a cleaner-looking draft on purpose. A draft that has to look complete invites a guessed notice period; a draft that shows <code>xxxx</code> asks a person to find out. The <code>xxxx</code> marker also survives into the Word file if nobody fixes it, so a missing value cannot pass for an answer. Empty lists are the exception: their section is dropped from the document, so the yellow highlight is what catches those.",
  "sv": "Varje fält på granskningssidan går att redigera, varje fält som modellen inte kunde fylla markeras med gul bakgrund, ett tomt enkelvärdesfält visar <code>xxxx</code>, och en lista över luckorna står högst upp på sidan. Jag valde synliga luckor framför ett snyggare utkast med flit. Ett utkast som måste se komplett ut inbjuder till en gissad uppsägningstid; ett utkast som visar <code>xxxx</code> ber en människa att ta reda på det. Markören <code>xxxx</code> följer också med in i Word-filen om ingen rättar den, så ett saknat värde kan inte misstas för ett svar. Tomma listor är undantaget: deras sektion tas bort ur dokumentet, så där är det den gula markeringen som fångar luckan."
 },
 "h_docx": {
  "en": "Filling Word templates with no dependencies",
  "sv": "Fylla Word-mallar utan beroenden"
 },
 "d1": {
  "en": "A <code>.docx</code> file is a ZIP archive of XML. The renderer in <code>src/docx.js</code> reads the client's template, rewrites only <code>word/document.xml</code>, and copies every other part byte for byte, so the client's logo, fonts, styles, headers and numbering stay exactly as they made them. The ZIP reader and writer, the CRC32 and the token engine are about four hundred lines of plain JavaScript inside the Worker.",
  "sv": "En <code>.docx</code>-fil är ett ZIP-arkiv med XML. Renderaren i <code>src/docx.js</code> läser kundens mall, skriver bara om <code>word/document.xml</code> och kopierar varje annan del byte för byte, så att kundens logotyp, typsnitt, stilar, sidhuvuden och numrering förblir exakt som kunden skapade dem. ZIP-läsaren och ZIP-skrivaren, CRC32 och tokenmotorn är ungefär fyrahundra rader vanlig JavaScript i Workern."
 },
 "d2": {
  "en": "The template grammar is small: <code>{{name}}</code> for a value, a paragraph that repeats once per list item, and a block loop for work history. The traps were all in Word's file format:",
  "sv": "Mallspråket är litet: <code>{{name}}</code> för ett värde, ett stycke som upprepas en gång per listpost och en blockloop för arbetslivserfarenhet. Fällorna låg alla i Words filformat:"
 },
 "d_l1": {
  "en": "<strong>Word splits text across runs.</strong> A token typed in one go can be stored as three fragments with different formatting. Loop markers and old text in a template are matched on the paragraph's combined text; simple <code>{{tokens}}</code> are still matched one run at a time, which is why every template is written with each token in a single run.",
  "sv": "<strong>Word delar upp text i flera körningar.</strong> En token som skrivs i ett svep kan lagras som tre fragment med olika formatering. Loopmarkörer och gammal text i mallen matchas mot styckets sammanslagna text; enkla <code>{{tokens}}</code> matchas fortfarande en körning i taget, och därför skrivs varje mall med varje token i en enda körning."
 },
 "d_l2": {
  "en": "<strong>ZIP sizes can live only at the end.</strong> Many Word files write zero sizes in the local headers and the real ones in the central directory. Reading local headers returned zero characters; the reader now starts from the central directory.",
  "sv": "<strong>ZIP-storlekar kan finnas bara i slutet.</strong> Många Word-filer skriver noll som storlek i de lokala filhuvudena och de riktiga storlekarna i den centrala katalogen. Att läsa de lokala filhuvudena gav noll tecken; läsaren utgår nu från den centrala katalogen."
 },
 "d_l3": {
  "en": "<strong>Templates carry old data.</strong> One client template had a previous candidate's name drawn into the banner at the top of its first page. The renderer replaces that text across runs with the current candidate's name, and the template's placeholder portrait is swapped for the uploaded photo in the same frame.",
  "sv": "<strong>Mallar bär med sig gammal data.</strong> En kundmall hade en tidigare kandidats namn inritat i bannern överst på första sidan. Renderaren ersätter den texten över flera körningar med den aktuella kandidatens namn, och mallens platshållarporträtt byts mot det uppladdade fotot i samma ram."
 },
 "d_l4": {
  "en": "<strong>Empty sections should disappear.</strong> A heading with nothing under it is dropped, so a candidate with no trainings does not get an empty Trainings section.",
  "sv": "<strong>Tomma sektioner ska försvinna.</strong> En rubrik utan innehåll tas bort, så att en kandidat utan utbildningar inte får en tom sektion för utbildningar."
 },
 "h_anon": {
  "en": "Anonymous CVs: three layers, because one is not enough",
  "sv": "Anonyma CV:n: tre lager, eftersom ett inte räcker"
 },
 "a1": {
  "en": "Our own anonymous CV carries no name, email, phone, address or link, because the client should contact us, not the candidate. A prompt rule saying so is not enough: models copy sentences verbatim, and \"contact me at\" comes along with them. So identity is removed three times:",
  "sv": "Vårt eget anonyma CV innehåller inget namn, ingen e-post, inget telefonnummer, ingen adress och ingen länk, eftersom kunden ska kontakta oss och inte kandidaten. En promptregel som säger det räcker inte: modeller kopierar meningar ordagrant, och ”kontakta mig på” följer med. Därför tas identiteten bort tre gånger:"
 },
 "a_l1": {
  "en": "<strong>The prompt</strong> forbids the name and every contact detail, and asks for \"the candidate\" instead.",
  "sv": "<strong>Prompten</strong> förbjuder namnet och alla kontaktuppgifter och ber om ”the candidate” i stället."
 },
 "a_l2": {
  "en": "<strong>A scrub on the draft</strong> removes emails, links, social handles, phone numbers and the candidate's name, using the database name when the candidate was picked, or a checked guess from the CV's header on an upload. A sentence that existed only to give a contact detail is dropped whole.",
  "sv": "<strong>En rensning av utkastet</strong> tar bort e-postadresser, länkar, sociala konton, telefonnummer och kandidatens namn, med namnet ur databasen när kandidaten valdes där, eller en kontrollerad gissning från CV:ts sidhuvud vid uppladdning. En mening som bara fanns för att ge en kontaktuppgift tas bort helt."
 },
 "a_l3": {
  "en": "<strong>A second scrub on download</strong>, by pattern only, because the review screen is editable and a recruiter can paste a phone number back in.",
  "sv": "<strong>En andra rensning vid nedladdning</strong>, enbart efter mönster, eftersom granskningssidan går att redigera och en rekryterare kan klistra in ett telefonnummer igen."
 },
 "a2": {
  "en": "The scrub had its own false positives to get right. A rupiah figure such as 3.000.000.000 looks like a phone number until you require a phone prefix and reject thousands groupings. A name can also be part of a company name: Jaya is both a given name and a common word in Indonesian company names, so a name part that appears in an employer or school line is kept. And JavaScript's <code>\\b</code> fails on names with accents or Chinese and Japanese characters, so word boundaries use Unicode letter classes. Twelve cases like these, plus a rendered document checked for leftover identity details, run as a test in CI before every deploy.",
  "sv": "Rensningen hade sina egna falsklarm att reda ut. En summa i rupiah som 3.000.000.000 ser ut som ett telefonnummer tills man kräver ett telefonprefix och avvisar tusentalsgrupperingar. Ett namn kan också ingå i ett företagsnamn: Jaya är både ett förnamn och ett vanligt ord i indonesiska företagsnamn, så en namndel som förekommer på en rad om arbetsgivare eller skola behålls. Och JavaScripts <code>\\b</code> fungerar inte på namn med accenter eller kinesiska och japanska tecken, så ordgränser använder Unicode-bokstavsklasser. Tolv fall av det här slaget, plus ett renderat dokument som kontrolleras för kvarvarande identitetsuppgifter, körs som ett test i CI före varje driftsättning."
 },
 "a3": {
  "en": "One gap I know about: the download request does not know the candidate's name, so the second scrub catches contact patterns but not a name the recruiter types back in on the review screen. The review page says how many details were removed, and the recruiter is the last check. Closing it properly means carrying the identity through the form, which I have not built yet.",
  "sv": "En lucka jag känner till: nedladdningsförfrågan känner inte till kandidatens namn, så den andra rensningen fångar kontaktmönster men inte ett namn som rekryteraren skriver in igen på granskningssidan. Granskningssidan visar hur många uppgifter som togs bort, och rekryteraren är den sista kontrollen. Att stänga luckan ordentligt kräver att identiteten följer med genom formuläret, och det har jag inte byggt än."
 },
 "h_roles": {
  "en": "The bug at the last click",
  "sv": "Buggen vid sista klicket"
 },
 "ro1": {
  "en": "The reformatter started as admin-only. When the internal team needed it, the obvious move was to reuse the admin routes, but the <code>/admin</code> paths sit behind an extra login at the edge that only admin passes, so staff were blocked before the app's own permission check ever ran. The team got parallel <code>/internal</code> routes. Two bugs followed. The first attempt renamed the admin upload route instead of adding a new one, which broke it for admin. Later, the review form posted to an <code>/internal</code> download route that did not exist, so the team could upload and review a CV and then hit \"Page not found\" on the final click.",
  "sv": "Omformateraren var från början bara för admin. När det interna teamet behövde den var det självklara att återanvända admin-routes, men <code>/admin</code>-sökvägarna ligger bakom en extra inloggning i nätverkskanten som bara admin klarar, så personalen stoppades innan appens egen behörighetskontroll ens kördes. Teamet fick parallella <code>/internal</code>-routes. Två buggar följde. Första försöket döpte om admins uppladdningsroute i stället för att lägga till en ny, vilket fick den att sluta fungera för admin. Senare skickade granskningsformuläret till en <code>/internal</code>-route för nedladdning som inte fanns, så teamet kunde ladda upp och granska ett CV och sedan få ”Page not found” vid sista klicket."
 },
 "ro2": {
  "en": "After any route change I now send a request to every route in both namespaces and expect a login redirect, never a 404. The automated smoke test after each deploy covers only the admin page so far. The rule I took from it: when a second role needs a feature, add routes, never rename the existing ones.",
  "sv": "Efter varje ändring av routes skickar jag nu en förfrågan till varje route i båda namnrymderna och förväntar mig en omdirigering till inloggningen, aldrig en 404. Det automatiska röktestet efter varje driftsättning täcker än så länge bara admin-sidan. Regeln jag tog med mig: när en andra roll behöver en funktion, lägg till routes och döp aldrig om de befintliga."
 },
 "h_next": {
  "en": "What is not solved",
  "sv": "Vad som inte är löst"
 },
 "n_l1": {
  "en": "<strong>Scanned CVs.</strong> An image-only PDF has no text layer, and there is no OCR path yet. The recruiter is asked for a text-based file.",
  "sv": "<strong>Skannade CV:n.</strong> En PDF som bara består av bilder saknar textlager, och det finns ingen OCR-väg än. Rekryteraren ombeds skaffa en textbaserad fil."
 },
 "n_l2": {
  "en": "<strong>Cost routing.</strong> The triage step that would send clean CVs to a cheaper model stays off until an A/B run on real CVs shows that the cheap path does not miss or invent fields.",
  "sv": "<strong>Kostnadsstyrning.</strong> Sorteringssteget som skulle skicka rena CV:n till en billigare modell förblir avstängt tills en A/B-körning på riktiga CV:n visar att den billiga vägen inte missar eller hittar på fält."
 },
 "n_l3": {
  "en": "<strong>The name on the download request</strong>, as described above.",
  "sv": "<strong>Namnet i nedladdningsförfrågan</strong>, som beskrivs ovan."
 },
 "outro": {
  "en": "None of the parts is exotic: a PDF parser, one LLM call behind a schema, a review form and a ZIP writer. The design work was in the seams: one definition behind the prompt, the form and the template; the model's output treated as a draft that a person approves; and every gap made visible instead of plausible.",
  "sv": "Ingen av delarna är exotisk: en PDF-tolk, ett LLM-anrop bakom ett schema, ett granskningsformulär och en ZIP-skrivare. Designarbetet låg i sömmarna: en definition bakom prompten, formuläret och mallen; modellens svar behandlat som ett utkast som en människa godkänner; och varje lucka synlig i stället för ifylld med något rimligt."
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
      const e = I18N_CVF[el.dataset.i18n];
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
