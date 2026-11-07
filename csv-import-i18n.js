// CSV import post bilingual switcher (EN/SV).
const I18N_CSV = {
  't': { en: 'Importing thousands of candidates without breaking a single record', sv: 'Att importera tusentals kandidater utan att förstöra en enda post' },
  'meta': {
    en: "Primawan Satrio · August 2026 · ~9 min read",
    sv: "Primawan Satrio · augusti 2026 · ca 9 min läsning"
  },
  'update': {
    en: "<strong>Update, November 2026:</strong> This post originally skipped the commit step, so it is covered below. Importing now requires a lawful-basis attestation that is stored with the import, the admin picks an internal owner or leaves people in the follow-up queue, and uploads are capped at 20 MB. The importer reads 24 fields rather than the five in the alias table, including marital status, last university, GPA and salary details added in October 2026. I also corrected what the post said about who can use the importer, the size of the parser, and how the duplicate lookups run.",
    sv: "<strong>Uppdatering, november 2026:</strong> Det här inlägget hoppade ursprungligen över importsteget, så det beskrivs nedan. Importen kräver nu ett intyg om rättslig grund som sparas tillsammans med importen, administratören väljer en intern ägare eller låter personerna ligga kvar i uppföljningskön, och uppladdningar är begränsade till 20 MB. Importören läser 24 fält, inte bara de fem i aliastabellen, bland annat civilstånd, senaste universitet, GPA och lönedetaljer som lades till i oktober 2026. Jag har också rättat vad inlägget sa om vem som kan använda importören, parserns storlek och hur dubblettuppslagen körs."
  },
  'p1': {
    en: "When we moved our recruiting operation onto our own platform, the hardest part was not the job board or the application flow. It was the database: years of candidate records living in a Lark base, with column names in a mix of English and Bahasa Indonesia, phone numbers formatted six different ways, and the same people entered more than once by different recruiters. A naive import would have created phantom duplicates that our team would chase for months.",
    sv: "När vi flyttade vår rekryteringsverksamhet till vår egen plattform var den svåraste delen inte jobbbrädet eller ansökningsflödet. Det var databasen: åratal av kandidatposter i en Lark-bas, med kolumnnamn i en blandning av engelska och bahasa Indonesia, telefonnummer formaterade på sex olika sätt och samma personer registrerade flera gånger av olika rekrytörer. En naiv import skulle ha skapt spökaliaseringar som vårt team jagat i månader."
  },
  'p2': {
    en: "This post covers the CSV importer we built to solve that: a forgiving parser, smart column mapping, and a dry-run preview that shows exactly what will happen to every row before anything is written. The feature now lives at <code>/admin/import</code>, and our internal staff (admins and the internal team) use it whenever a client or partner sends over a spreadsheet of candidates. Freelance recruiters cannot open it.",
    sv: "Detta inlägg handlar om CSV-importören vi byggde för att lösa det: en tolerant parser, smart kolumnmappning och en förhandsgranskning som visar exakt vad som kommer hända med varje rad innan något skrivs. Funktionen finns nu på <code>/admin/import</code>, och vår interna personal (administratörer och det interna teamet) använder den närhelst en klient eller partner skickar över ett kalkylblad med kandidater. Frilansande rekrytörer kan inte öppna den."
  },
  'h_parse': { en: 'Parsing: assume the file is worse than it is', sv: 'Tolkning: anta att filen är sämre än den verkar' },
  'parse_p1': {
    en: "Spreadsheet exports are hostile. Real files we received contained a UTF-8 byte-order mark, CRLF line endings from Windows Excel, quoted fields with embedded commas and newlines, doubled quotes inside quoted fields, and trailing blank lines. Rather than pull in a dependency on a Workers-sized budget, we wrote a ~40-line RFC 4180 parser that handles all of it:",
    sv: "Kalkylbladsexporter är fientliga. Riktiga filer vi tog emot innehöll en UTF-8-byteordningsmarkering, CRLF-radslut från Windows Excel, citerade fält med inbäddade kommatecken och radbrytningar, dubbla citattecken inuti citerade fält och avslutande tomma rader. Istället för att dra in ett beroende på en Workers-begränsad budget skrev vi en RFC 4180-parser på cirka 40 rader som hanterar allt:"
  },
  'parse_l1': { en: "<strong>Byte-order mark stripping</strong> so the first header is not silently corrupted into <code>ï»¿email</code>", sv: "<strong>Borttagning av byteordningsmarkering</strong> så att första rubriken inte tyst förstörs till <code>ï»¿email</code>" },
  'parse_l2': { en: "<strong>Proper quote state machine</strong> with escaped-quote handling (<code>\"\"</code> inside a quoted field)", sv: "<strong>Äkta citattillståndsmaskin</strong> med hantering av escapede citattecken (<code>\"\"</code> inuti ett citerat fält)" },
  'parse_l3': { en: "<strong>Blank-row filtering</strong> and whitespace trimming on every cell", sv: "<strong>Filtrering av tomrader</strong> och whitespace-borttagning i varje cell" },
  'parse_q': { en: "<strong>Design rule:</strong> every quirk in this parser exists because a real export contained it. When your parser meets a new quirk in production, fix the parser, not the file.", sv: "<strong>Designregel:</strong> varje egenhet i denna parser finns där för att en riktig export innehöll den. När din parser stöter på en ny egenhet i produktion, fixa parsern, inte filen." },
  'h_map': { en: 'Column mapping: meet the spreadsheet where it is', sv: 'Kolumnmappning: möt kalkylbladet där det är' },
  'map_p1': {
    en: "The next problem is that exports never use your field names. Our Lark base called the email column everything from <code>Email Address</code> to <code>e-mail</code> to <code>surel</code> (Indonesian for email). Instead of forcing a rigid template, the importer guesses the mapping using an alias table, with Indonesian aliases as first-class citizens. The fields grew over time: marital status, last university, GPA and salary details (currency, period, gross or net) were added in October 2026.",
    sv: "Nästa problem är att exporter aldrig använder dina fältnamn. Vår Lark-bas kallade e-postkolumnen allt från <code>Email Address</code> till <code>e-mail</code> till <code>surel</code> (indonesiska för e-post). Istället för att tvinga fram en stel mall gissar importören mappningen utifrån en aliastabell, med indonesiska alias som förstagradsklassmedborgare. Fälten har vuxit med tiden: civilstånd, senaste universitet, GPA och lönedetaljer (valuta, period, brutto eller netto) lades till i oktober 2026."
  },
  'map_cap': {
    en: "The table shows five of the 24 importable fields. Header matching is done on a normalized form: lowercased, everything but letters and digits stripped, so \"E-Mail Address\" matches \"emailaddress\". When no header matches exactly, hints longer than three characters are also tried as substrings.",
    sv: "Tabellen visar fem av de 24 fält som går att importera. Rubrikmatchning görs på en normaliserad form: gemen, allt utom bokstäver och siffror borttaget, så att ”E-Mail Address” matchar ”emailaddress”. När ingen rubrik matchar exakt prövas även ledtrådar längre än tre tecken som delsträngar."
  },
  'map_p2': {
    en: "The guesser has two rules that matter. First, it never maps the same column twice: once a header is claimed by a field, it is removed from the pool, so two similar columns cannot both feed one field. Second, every guess is shown to the admin on a review screen where any choice can be overridden before committing. The machine proposes; a human disposes.",
    sv: "Gissaren har två regler som betyder något. För det första mappar den aldrig samma kolumn två gånger: när en rubrik tagits i anspråk av ett fält tas den ur poolen, så att två liknande kolumner inte båda kan mata ett fält. För det andra visas varje gissning för administratören på en granskningsskärm där alla val kan åsidosättas innan importen genomförs. Maskinen föreslår; en människa avgör."
  },
  'h_dry': { en: 'The dry-run: no surprises allowed', sv: 'Körningen utan skrivning: inga överraskningar tillåtna' },
  'dry_p1': {
    en: "The part I am most insistent on is that no candidate record is created until the admin has seen, row by row, what will happen. The upload lands on a review page showing every row classified into one of five actions:",
    sv: "Det jag är mest bestämd angående är att ingen kandidatpost skapas förrän administratören har sett, rad för rad, vad som kommer hända. Uppladdningen landar på en granskningsskärm som visar varje rad klassad till en av fem åtgärder:"
  },
  'dry_l1': {
    en: "<strong>create</strong>: valid, unknown email, will be imported",
    sv: "<strong>create</strong>: giltig, okänd e-post, kommer att importeras"
  },
  'dry_l2': {
    en: "<strong>invalid</strong>: missing or malformed email, or missing name; excluded with the reason shown",
    sv: "<strong>invalid</strong>: saknad eller felformaterad e-post, eller saknat namn; utesluts med angiven orsak"
  },
  'dry_l3': {
    en: "<strong>duplicateInFile</strong>: same email appeared on an earlier line of this same file",
    sv: "<strong>duplicateInFile</strong>: samma e-post fanns på en tidigare rad i samma fil"
  },
  'dry_l4': {
    en: "<strong>alreadyRegistered</strong>: this person already has an account on the platform",
    sv: "<strong>alreadyRegistered</strong>: personen har redan ett konto på plattformen"
  },
  'dry_l5': {
    en: "<strong>ownedByRecruiter</strong>: the person sits in a recruiter's talent pool with an active ownership window; the preview names the recruiter and the expiry date",
    sv: "<strong>ownedByRecruiter</strong>: personen finns i en rekrytörs talangpool med ett aktivt ägarskapsfönster; förhandsgranskningen anger rekrytören och utgångsdatumet"
  },
  'dry_p2': {
    en: "Email is the identity key for all of it. Everything deduplicates on the normalized (lowercased) email address, because in our business the email is the one field that reliably identifies a person across systems, while names collide and phone numbers change format.",
    sv: "E-post är identitetsnyckeln för allt detta. Allt avdupliceras på den normaliserade (gemena) e-postadressen, för i vår bransch är e-post det enda fält som pålitligt identifierar en person över system, medan namn kolliderar och telefonnummer byter format."
  },
  'dry_fig_note': { en: 'admin edits mapping, preview recomputes', sv: 'administratören redigerar mappningen, förhandsgranskningen räknas om' },
  'dry_fig_top': { en: 'five outcomes per row: create · invalid · duplicateInFile · alreadyRegistered · ownedByRecruiter', sv: 'fem utfall per rad: create · invalid · duplicateInFile · alreadyRegistered · ownedByRecruiter' },
  'dry_fig_cap': {
    en: "Figure 1. The import flow. No candidate record is created until a human presses Import on the review page and ticks the lawful-basis box.",
    sv: "Figur 1. Importflödet. Ingen kandidatpost skapas förrän en människa trycker på Import på granskningsskärmen och kryssar i rutan för rättslig grund."
  },
  'h_commit': {
    en: "The commit step",
    sv: "Importsteget"
  },
  'commit_p1': {
    en: "Pressing Import is a separate step with its own rules, not a click-through:",
    sv: "Att trycka på Import är ett eget steg med egna regler, inte ett klick på OK:"
  },
  'commit_l1': {
    en: "<strong>Lawful-basis attestation.</strong> The admin must tick a box confirming a lawful basis for the records, that the people were told their data is held for recruitment, and that the file is a migration of an existing database rather than newly sourced data. The import stores the timestamp (<code>attestedAt</code>) and the exact wording shown (<code>attestationText</code>).",
    sv: "<strong>Intyg om rättslig grund.</strong> Administratören måste kryssa i en ruta som bekräftar en rättslig grund för posterna, att personerna har blivit informerade om att deras data lagras för rekrytering, och att filen är en migrering av en befintlig databas och inte nyligen sökta data. Importen sparar tidpunkten (<code>attestedAt</code>) och den exakta lydelsen som visades (<code>attestationText</code>)."
  },
  'commit_l2': {
    en: "<strong>An owner, or the follow-up queue.</strong> Whoever runs the import picks an internal team member as owner for the new records, or leaves them unassigned, in which case they land in the follow-up queue. Ownership is never assigned automatically.",
    sv: "<strong>En ägare, eller uppföljningskön.</strong> Den som kör importen väljer en intern teammedlem som ägare till de nya posterna, eller låter dem vara otilldelade, och då hamnar de i uppföljningskön. Ägarskap tilldelas aldrig automatiskt."
  },
  'commit_l3': {
    en: "<strong>Rows are inserted one at a time,</strong> only the <code>create</code> rows, after the preview is recomputed with the submitted mapping. Imported people get a random password nobody knows, so they take over their account through the normal registration flow.",
    sv: "<strong>Rader läggs in en i taget,</strong> bara <code>create</code>-raderna, efter att förhandsgranskningen räknats om med den inskickade mappningen. Importerade personer får ett slumpmässigt lösenord som ingen känner till, så de tar över sitt konto via det vanliga registreringsflödet."
  },
  'commit_l4': {
    en: "<strong>Uploads are capped at 20 MB,</strong> and a file with no data rows is refused before anything is stored.",
    sv: "<strong>Uppladdningar är begränsade till 20 MB,</strong> och en fil utan datarader nekas innan något sparas."
  },
  'h_perf': {
    en: "Performance: two passes, and what they do not fix",
    sv: "Prestanda: två pass, och vad de inte löser"
  },
  'perf_p1': {
    en: "The deduplication check needs the database: a lookup for registered users and another for recruiter ownership, per row. On Cloudflare Workers a request has a limited budget of subrequests, so the preview separates the file-only work from the database work in two passes:",
    sv: "Avdupliceringskontrollen behöver databasen: ett uppslag mot registrerade användare och ett mot rekrytörägarskap, per rad. På Cloudflare Workers har en request en begränsad budget av subrequests, så förhandsgranskningen skiljer arbetet som bara rör filen från databasarbetet i två pass:"
  },
  'perf_l1': {
    en: "<strong>Synchronous first pass</strong> over the file itself: validate emails, require names, detect in-file duplicates with a set. No database involved, and ordering stays strict so \"same email appears earlier in this file\" is always accurate.",
    sv: "<strong>Synkront första pass</strong> över själva filen: validera e-post, kräv namn, upptäck dubbletter i filen med en mängd. Ingen databas inblandad, och ordningen förblir strikt så att ”samma e-post fanns tidigare i filen” alltid är korrekt."
  },
  'perf_l2': {
    en: "<strong>Concurrent second pass</strong> over the surviving rows: each row fires its own lookup against registered users and recruiter ownerships, all started at once with <code>Promise.all</code>. That is concurrent, not batched. It finishes sooner, but it is still about two queries per row (a third when the person is in a pool), so the subrequest cost grows with the file.",
    sv: "<strong>Samtidigt andra pass</strong> över de överlevande raderna: varje rad skickar sitt eget uppslag mot registrerade användare och rekrytörägarskap, alla startade på en gång med <code>Promise.all</code>. Det är samtidigt, inte batchat. Det går snabbare, men det blir fortfarande ungefär två frågor per rad (en tredje när personen finns i en pool), så subrequest-kostnaden växer med filen."
  },
  'perf_p2': {
    en: "Every import is also recorded with its filename, headers, mapping, and who uploaded it, so a bad import can be audited after the fact rather than wondered about.",
    sv: "Varje import registreras också med filnamn, rubriker, mappning och vem som laddade upp den, så att en dålig import kan granskas i efterhand istället för att undras över."
  },
  'perf_p3': {
    en: "I have not measured where the subrequest limit bites for this importer, and the commit step also inserts rows one at a time. For a very large file the workaround is to split it; the fix I would make is to replace the per-row lookups with a few bulk queries.",
    sv: "Jag har inte mätt var subrequest-gränsen slår till för den här importören, och importsteget lägger också in rader en i taget. För en mycket stor fil är lösningen att dela upp den; åtgärden jag skulle göra är att ersätta uppslagen per rad med några få bulkfrågor."
  },
  'h_lessons': { en: 'What this taught us', sv: 'Vad detta lärde oss' },
  'les_l1': {
    en: "<strong>Dedupe on identity, not on rows.</strong> The unit of truth is the person (by email), not the spreadsheet line. Getting this wrong is how companies end up calling the same candidate twice from two \"different\" records.",
    sv: "<strong>Avduplicera på identitet, inte på rader.</strong> Sanningsenheten är personen (via e-post), inte kalkylbladsraden. Att ha fel här är hur företag hamnar i att ringa samma kandidat två gånger från två ”olika” poster."
  },
  'les_l2': {
    en: "<strong>Show the future before you create it.</strong> A dry-run preview that classifies every row converts an import from an act of faith into a reviewable decision. The admin who sees \"In a recruiter's talent pool until 30/11/2026\" trusts the system; the one who sees a spinner does not.",
    sv: "<strong>Visa framtiden innan du skapar den.</strong> En förhandsgranskning som klassar varje rad gör en import från en trosakt till ett granskningsbart beslut. Administratören som ser ”I en rekrytörs talangpool till 30/11/2026” litar på systemet; den som ser en spinner gör det inte."
  },
  'les_l3': {
    en: "<strong>Bilingual data needs bilingual tooling.</strong> Half our header aliases are Indonesian because our data is Indonesian. Tooling that only understands English column names would have made every import a manual mapping exercise.",
    sv: "<strong>Tvåspråkiga data kräver tvåspråkiga verktyg.</strong> Hälften av våra rubrikalias är indonesiska för att våra data är indonesiska. Verktyg som bara förstår engelska kolumnnamn skulle ha gjort varje import till en manuell mappningsövning."
  },
  'les_l4': {
    en: "<strong>A ~40-line parser beats a dependency when you know exactly what you must survive.</strong> RFC 4180 is small, and owning the code means the next weird export is a one-line fix away.",
    sv: "<strong>En parser på ~40 rader slår ett beroende när du vet exakt vad den måste klara.</strong> RFC 4180 är liten, och att äga koden betyder att nästa konstiga export är en rad fix bort."
  },
  'outro': {
    en: "The importer looks mundane next to LLM pipelines and scoring engines, but it is the feature that made the rest trustworthy: the match engine can only be as good as the candidate data underneath it, and this is how that data got in cleanly.",
    sv: "Importören ser vardagsmässig ut bredvid LLM-pipelines och poängmotorer, men det är funktionen som gjorde resten pålitlig: matchmotorn kan bara vara så bra som kandidatdata under den, och så här kom dessa data in rent."
  }
};

document.addEventListener('DOMContentLoaded', function(){
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  const btn = document.getElementById('lang-toggle');
  function apply(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const e = I18N_CSV[el.dataset.i18n];
      if (e && e[l]) el.innerHTML = e[l];  // strings may contain <code>/<strong>
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
