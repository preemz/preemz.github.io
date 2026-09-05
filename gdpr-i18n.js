// GDPR post bilingual switcher (EN/SV).
const I18N_GDPR = {
  't': { en: 'KerjaBoard Is Now GDPR-Ready: Region-Aware Compliance on One Worker', sv: 'KerjaBoard är nu GDPR-klar: regionmedveten regelefterlevnad på en Worker' },
  'meta': { en: 'Primawan Satrio · September 2026 · ~9 min read', sv: 'Primawan Satrio · september 2026 · ca 9 min läsning' },
  'p1': {
    en: "When we decided to post EU jobs on KerjaBoard, our recruiting platform, the standard advice is to spin up a separate EU deployment: separate database, separate region, separate everything. We did not do that. We shipped full GDPR compliance for EU data subjects on the <strong>same Worker, the same database, and the same codebase</strong> that serves 6,449 Indonesian candidates — and without changing a single thing about their experience.",
    sv: "När vi bestämde oss för att publicera EU-jobb på KerjaBoard, vår rekryteringsplattform, är standardrådet att sätta upp en separat EU-driftsättning: separat databas, separat region, separat allt. Det gjorde vi inte. Vi levererade full GDPR-efterlevnad för EU-registrerade på <strong>samma Worker, samma databas och samma kodbas</strong> som betjänar 6 449 indonesiska kandidater — utan att ändra ett enda drag i deras upplevelse."
  },
  'p2': {
    en: "This post explains the architecture, what changed per region, what deliberately did not change, and the few places where GDPR forced us to build features that turned out to be good for everyone.",
    sv: "Detta inlägg förklarar arkitekturen, vad som ändrades per region, vad medvetet inte ändrades, och de få ställen där GDPR tvingade oss att bygga funktioner som visade sig vara bra för alla."
  },
  'h_start': { en: 'What we started with was better than we thought', sv: 'Det vi började med var bättre än vi trodde' },
  'start_p1': {
    en: "The first useful discovery came from checking facts instead of assuming. Our D1 database lives in Cloudflare's Eastern Europe region (Stockholm) and so does our R2 bucket holding candidate CVs. In other words, <strong>the data was already stored in the EU</strong>. There was never an EU-to-Indonesia transfer at the storage layer to fix.",
    sv: "Den första användbara upptäckten kom från att kontrollera fakta istället för att anta. Vår D1-databas ligger i Cloudflares region Östeuropa (Stockholm) och samma sak gäller vår R2-bucket med kandidat-CV:n. Med andra ord, <strong>datan lagrades redan i EU</strong>. Det fanns aldrig någon EU-till-Indonesien-överföring på lagringslagret att åtgärda."
  },
  'start_p2': {
    en: "We also found that the three most-invoked data-subject rights already existed as self-service features: candidates could download their data as JSON, correct their profile, and delete their account outright. The largest misconception about GDPR compliance is that it is primarily about data location and database isolation. It is not. It is about <strong>lawful basis, transparency, consent mechanics, retention, and demonstrable records</strong> for the people whose data you hold. That is where the real work was.",
    sv: "Vi fann också att de tre mest använda registerade rättigheterna redan fanns som självbetjäningsfunktioner: kandidater kunde ladda ner sin data som JSON, rätta sin profil och radera sitt konto helt. Den största missuppfattningen om GDPR-efterlevnad är att den primärt handlar om datalokalisering och databasisolering. Det gör den inte. Den handlar om <strong>laglig grund, transparens, samtyckesmekanik, lagringstid och verifierbara register</strong> för de personer vars data du har. Där låg det verkliga arbetet."
  },
  'h_axes': { en: 'Two independent axes, one system', sv: 'Två oberoende axlar, ett system' },
  'axes_p1': {
    en: "The design's core decision: a job's regulatory region and a candidate's data-subject region are <strong>different things</strong> and had to be modelled separately. Jobs gained a <code>regulatoryRegion</code> (Indonesia by default, or EU). Candidates gained a <code>dataSubjectRegion</code> they declare themselves, plus a <code>signupCountry</code> recorded from request geo as evidence only. An Indonesian engineer applying to an EU remote role, and a German candidate applying to a Jakarta role, are both normal cases — neither axis may be derived from the other.",
    sv: "Designens kärnbeslut: ett jobbs regulatoriska region och en kandidats registerad region är <strong>olika saker</strong> och måste modelleras separat. Jobb fick en <code>regulatoryRegion</code> (Indonesien som standard, eller EU). Kandidater fick en <code>dataSubjectRegion</code> de själva deklarerar, plus en <code>signupCountry</code> registrerad från request-geo som endast bevis. En indonesisk ingenjör som söker en EU-distansroll, och en tysk kandidat som söker en Jakarta-roll, är båda normalfall — ingen axel får härledas från den andra."
  },
  'axes_fig_job': { en: 'posting layer', sv: 'publiceringslager' },
  'axes_fig_cand': { en: 'data layer', sv: 'datalager' },
  'axes_fig_join': { en: 'evaluated independently at every intersection — never derived from each other', sv: 'utvärderas oberoende i varje skärning — härleds aldrig från varandra' },
  'axes_fig_join2': { en: 'ID candidate → EU remote role: legal. EU candidate → Jakarta role: legal.', sv: 'ID-kandidat → EU-distansroll: lagligt. EU-kandidat → Jakarta-roll: lagligt.' },
  'axes_fig_cap': { en: 'Figure 1. The two-axis model. One Worker, one database, every combination valid.', sv: 'Figur 1. Tvåaxelmodellen. En Worker, en databas, varje kombination giltig.' },
  'h_diff': { en: 'What changed for EU candidates', sv: 'Vad som ändrades för EU-kandidater' },
  'th_concern': { en: 'Concern', sv: 'Område' },
  'th_id': { en: 'Indonesia (unchanged)', sv: 'Indonesien (oförändrat)' },
  'th_eu': { en: 'EU (new)', sv: 'EU (nytt)' },
  'td_notice': { en: 'Privacy notice', sv: 'Integritetsmeddelande' },
  'td_notice_id': { en: 'UU PDP wording, as before', sv: 'UU PDP-formulering, som tidigare' },
  'td_notice_eu': { en: 'GDPR edition: lawful bases with Article references, full rights, EU storage location', sv: 'GDPR-upplaga: lagliga grunder med artikelreferenser, fulla rättigheter, EU-lagringsplats' },
  'td_recs': { en: 'Recommendation emails', sv: 'Rekommendationsmejl' },
  'td_recs_id': { en: 'Opt-out (existing)', sv: 'Opt-out (befintligt)' },
  'td_recs_eu': { en: 'Opt-in — no email without a ticked box', sv: 'Opt-in — inget mejl utan en ikryssad ruta' },
  'td_retention': { en: 'Retention', sv: 'Lagringstid' },
  'td_retention_id': { en: '24 months', sv: '24 månader' },
  'td_retention_eu': { en: '12 months from last activity', sv: '12 månader från senaste aktivitet' },
  'td_salary': { en: 'Salary on posting', sv: 'Lön på annonsen' },
  'td_salary_id': { en: 'Optional', sv: 'Valfritt' },
  'td_salary_eu': { en: 'Mandatory with real figures (EU Pay Transparency Directive)', sv: 'Obligatoriskt med verkliga siffror (EU:s lönetransparensdirektiv)' },
  'td_obj': { en: 'Object to sourcing', sv: 'Invänd mot sourcing' },
  'td_obj_id': { en: '—', sv: '—' },
  'td_obj_eu': { en: 'Self-service button, immediate effect', sv: 'Självbetjäningsknapp, omedelbar effekt' },
  'diff_p1': {
    en: "Every region-specific rule lives in one module, <code>src/region.js</code>, with per-region profiles containing the retention months, consent model, and salary requirement. No rule is duplicated in the privacy page, the forms, and the email engine — they all read the same profile, so the notice can never promise something the code does not do.",
    sv: "Varje regionsspecifik regel finns i en modul, <code>src/region.js</code>, med per-region-profiler som innehåller lagringsmånader, samtyckesmodell och lönekrav. Ingen regel dupliceras i integritetssidan, formulären och mejlmotorn — de läser alla samma profil, så meddelandet kan aldrig lova något koden inte gör."
  },
  'h_consent': { en: 'The consent asymmetry we had to get exactly right', sv: 'Samtyckesasymmetrin vi måste få exakt rätt' },
  'consent_p1': {
    en: "The subtlest requirement was consent conversion. Indonesian candidates have always been <em>opt-out</em> for recommendation emails: we may email unless they say stop. GDPR does not accept that default for EU candidates — proactive emails need prior opt-in.",
    sv: "Det subtilaste kravet var samtyckeskonvertering. Indonesiska kandidater har alltid varit <em>opt-out</em> för rekommendationsmejl: vi får mejla om de inte säger stopp. GDPR accepterar inte det standardvärdet för EU-kandidater — proaktiva mejl kräver tidigare opt-in."
  },
  'consent_p2': {
    en: "The trap: our database holds thousands of legacy candidates with no declared region. The safe rule we shipped: <strong>legacy records default to the Indonesian profile</strong> (that is their factual provenance), any legacy candidate who later declares EU gets <em>zero</em> opt-in credit, and the opt-in flag is never backfilled for anyone. A candidate who never ticked the box does not receive proactive emails — the engine checks the region profile at send time, not a stored assumption. The recommendation engine now asks one function, <code>mayEmailRecommendations(candidate)</code>, which resolves region, consent model, and objections in a single call.",
    sv: "Fällan: vår databas innehåller tusentals äldre kandidater utan deklarerad region. Den säkra regeln vi skeppade: <strong>äldre poster får som standard den indonesiska profilen</strong> (det är deras faktiska ursprung), en äldre kandidat som senare deklarerar EU får <em>noll</em> opt-in-kredit, och opt-in-flaggan backfillas aldrig för någon. En kandidat som aldrig kryssade i rutan får inga proaktiva mejl — motorn kontrollerar regionsprofilen vid skickandetid, inte ett lagrat antagande. Rekommendationsmotorn frågar nu en funktion, <code>mayEmailRecommendations(candidate)</code>, som löser region, samtyckesmodell och invändningar i ett enda anrop."
  },
  'consent_q': {
    en: "<strong>Article 21 as a button, not an email address.</strong> The right to object to processing is real only if exercising it is easy. EU candidates get a self-service \"Stop using my data to source me\" button on their profile. It takes effect immediately: the person is excluded from proactive matching from that moment, while their live applications continue, because pulling someone out of an interview process they chose to enter would harm them more than the processing does.",
    sv: "<strong>Artikel 21 som en knapp, inte en e-postadress.</strong> Rätten att invända mot bearbetning är verklig bara om det är lätt att utöva den. EU-kandidater får en självbetjäningsknapp \"Sluta använd min data för att sourcea mig\" på sin profil. Den verkställs omedelbart: personen utesluts från proaktiv matchning från det ögonblicket, medan deras pågående ansökningar fortsätter, för att dra ut någon ur en intervjuprocess de valt att gå in i skulle skada dem mer än bearbetningen gör."
  },
  'h_conf': { en: 'Client confidentiality and GDPR, resolved', sv: 'Klientkonfidentialitet och GDPR, löst' },
  'conf_p1': {
    en: "One requirement looked contradictory at first. As a headhunting firm, our client names are confidential — candidates learn which client they are being put forward to, at the moment we put them forward, and never before. GDPR Article 13 asks for transparency about recipients. The resolution is written into the regulation itself: Article 13(1)(e) permits disclosing <strong>categories of recipients</strong>. Our EU notice names the categories (\"client companies in the banking, financial services, IT, manufacturing and professional services sectors\") and explains that the specific client is revealed before any application is forwarded. Confidentiality preserved, transparency satisfied, no legal entity names anywhere public.",
    sv: "Ett krav verkade motsägelsefullt till en början. Som headhuntingfirma är våra klientnamn konfidentiella — kandidater får veta vilken klient de föreslås för, i det ögonblick vi föreslår dem, och aldrig tidigare. GDPR artikel 13 begär transparens om mottagare. Lösningen är skriven i förordningen själv: artikel 13.1 e tillåter att man anger <strong>kategorier av mottagare</strong>. Vårt EU-meddelande namnger kategorierna (\"klientföretag inom bank-, finans-, IT-, tillverknings- och professionella tjänstesektorn\") och förklarar att den specifika klienten avslöjas innan någon ansökan vidarebefordras. Konfidentialitet bevarad, transparens uppfylld, inga juridiska enhetsnamn någonstans offentligt."
  },
  'h_pay': { en: 'Pay transparency as a feature', sv: 'Lönetransparens som en funktion' },
  'pay_p1': {
    en: "The EU Pay Transparency Directive requires applicants to see pay information before the interview stage. We turned that into a hard validation: an EU posting cannot go live unless the salary field parses to real figures. \"Competitive\" is rejected with an explanation of why. The region selector sits on the posting form for staff, and EU jobs carry a visible badge on the public page so applicants know which regime applies before they apply.",
    sv: "EU:s lönetransparensdirektiv kräver att sökande ser löneinformation före intervjustadiet. Vi gjorde det till en hård validering: en EU-annons kan inte gå live om lönefältet inte tolkas till verkliga siffror. \"Konkurrenskraftig\" avvisas med en förklaring till varför. Regionsväljaren finns på publiceringsformuläret för personalen, och EU-jobb bär en synlig märke på den offentliga sidan så att sökande vet vilken regim som gäller innan de söker."
  },
  'h_retention': { en: 'The retention sweep we built but did not switch on', sv: 'Retentionssopningen vi byggde men inte aktiverade' },
  'ret_p1': {
    en: "A retention promise that nothing enforces is a paragraph, not a policy. We built a scheduled sweep that anonymises or deletes candidate records once they pass their region's retention window (12 months EU, 24 Indonesia), cleans up the corresponding CV files in object storage, and skips anyone with a live application in an interview stage.",
    sv: "Ett löfte om lagringstid som ingenting verkställer är ett stycke, inte en policy. Vi byggde en schemalagd sopning som anonymiserar eller raderar kandidatposter när de passerar sin regions lagringsfönster (12 månader EU, 24 Indonesien), städar upp motsvarande CV-filer i objektlagring och hoppar över alla med en pågående ansökan i intervjustadium."
  },
  'ret_p2': {
    en: "It shipped <strong>disabled</strong>. A settings flag gates it, and it logs what it <em>would</em> delete for a review period before it deletes anything. A background job whose failure mode is destroying real candidate data does not get to be clever on its first day. The one task where a wrong implementation destroys data is the one task that ships behind a flag.",
    sv: "Den skeppades <strong>inaktiverad</strong>. En inställningsflagga styr den, och den loggar vad den <em>skulle</em> radera under en granskningsperiod innan den raderar något. Ett bakgrundsjobb vars felläge är att förstöra verklig kandidatdata får inte vara smart på sin första dag. Den enda uppgift där en felaktig implementering förstör data är den enda uppgift som skeppas bakom en flagga."
  },
  'h_honest': { en: 'What we deliberately did not do', sv: 'Vad vi medvetet inte gjorde' },
  'honest_l1': { en: "<strong>No cookie banner.</strong> The app sets exactly two cookies: a session cookie and a 24-hour staging cookie for documents attached before registration. Both are strictly necessary; there are no analytics or tracking scripts. The privacy notice documents them in plain language. A banner over two necessary cookies would be compliance theatre.", sv: "<strong>Ingen cookie-banner.</strong> Appen sätter exakt två cookies: en sessionscookie och en 24-timmars staging-cookie för dokument som bifogas före registrering. Båda är strikt nödvändiga; det finns inga analys- eller spårningsskript. Integritetsmeddelandet dokumenterar dem klartext. En banner över två nödvändiga cookies skulle vara efterlevnadsteater." },
  'honest_l2': { en: "<strong>No second deployment.</strong> One Worker, one database, region-aware logic. A second system would double the audit surface for a benefit (data location) we already had, and split-region matching — Indonesian engineers to EU remote roles — is the business goal, not a problem.", sv: "<strong>Ingen andra driftsättning.</strong> En Worker, en databas, regionmedveten logik. Ett andra system skulle dubbla granskningsytan för en fördel (datalokalisering) vi redan hade, och delad regionsmatchning — indonesiska ingenjörer till EU-distansroller — är affärsmålet, inte ett problem." },
  'honest_l3': { en: "<strong>No auto-deletion of the legacy population.</strong> 6,449 imported records with unknown region are treated as Indonesian-market data, prompted to self-declare at next login, never guessed at.", sv: "<strong>Ingen automatisk radering av den äldre populationen.</strong> 6 449 importerade poster med okänd region behandlas som indonesiska marknadsdata, uppmanas att själva deklarera vid nästa inloggning, aldrig gissade." },
  'honest_l4': { en: "<strong>No legal claim of being \"fully certified\".</strong> A DPIA for automated fit-scoring is flagged for legal review, an Article 27 EU representative still needs appointing, and the GDPR notice text deserves review by EU-qualified counsel before EU candidates rely on it. The engineering is done; the paperwork has owners.", sv: "<strong>Inget juridiskt påstående om att vara \"fullt certifierad\".</strong> En DPIA för automatisk matchningspoängsättning är flaggad för juridisk granskning, en artikel 27 EU-representant behöver fortfarande utses, och GDPR-meddelandetexten förtjänar granskning av EU-kvalificerad jurist innan EU-kandidater litar på den. Ingenjörsarbetet är klart; pappersarbetet har ägare." },
  'h_lessons': { en: 'What this taught us', sv: 'Vad detta lärde oss' },
  'les_l1': { en: "<strong>Check the facts before building for the worst assumption.</strong> Verifying that storage was already EU-resident saved us from an entire pointless migration project.", sv: "<strong>Kontrollera fakta innan du bygger för värsta antagandet.</strong> Att verifiera att lagringen redan var EU-baserad räddade oss från ett helt meningslöst migrationsprojekt." },
  'les_l2': { en: "<strong>A compliance rules module beats compliance logic scattered in code.</strong> When the retention months, consent model, and salary rule live in one profile object, the privacy notice and the code cannot disagree about what the rules are.", sv: "<strong>En efterlevnadsregelmodul slår efterlevnadslogik utspridd i koden.</strong> När lagringsmånaderna, samtyckesmodellen och lönereglerna finns i ett profilobjekt kan integritetsmeddelandet och koden inte vara oense om vad reglerna är." },
  'les_l3': { en: "<strong>Consent conversion has a direction, and it is not backwards.</strong> Opt-out populations do not carry consent into an opt-in regime. Never backfill.", sv: "<strong>Samtyckeskonvertering har en riktning, och den är inte bakåt.</strong> Opt-out-populationer bär inte med sig samtycke in i en opt-in-regim. Backfilla aldrig." },
  'les_l4': { en: "<strong>Some GDPR requirements improve the product.</strong> Mandatory pay ranges, a self-service objection button, and documented cookies are things candidates in every region benefit from. Compliance work done honestly is user-experience work.", sv: "<strong>Vissa GDPR-krav förbättrar produkten.</strong> Obligatoriska löneintervall, en självbetjäningsknapp för invändningar och dokumenterade cookies är saker som kandidater i alla regioner har nytta av. Efterlevnadsarbete gjort ärligt är användarupplevelsearbete." },
  'les_l5': { en: "<strong>Ship the destructive job behind a flag.</strong> Retention sweeps delete people. Dry-run first, always.", sv: "<strong>Skepp det destruktiva jobbet bakom en flagga.</strong> Retentionssopningar raderar människor. Testkörning först, alltid." },
  'outro': {
    en: "The result: one platform, two regimes, zero changes for the 6,449 candidates who never asked for any of this — and a company that can post in the EU market the moment a client asks. The full implementation was sixteen tasks over five days on a zero-dependency Cloudflare Workers stack; the region rules fit in one small module. Compliance is not a rebuild of the system. Done right, it is a layer.",
    sv: "Resultatet: en plattform, två regimer, noll ändringar för de 6 449 kandidater som aldrig bad om detta — och ett företag som kan publicera på EU-marknaden så snart en klient ber. Hela implementeringen var sexton uppgifter över fem dagar på en beroendefri Cloudflare Workers-stack; regionsreglerna får plats i en liten modul. Efterlevnad är inte en ombyggnad av systemet. Rätt gjort är det ett lager."
  }
};

document.addEventListener('DOMContentLoaded', function(){
  let lang = null;
  try { lang = localStorage.getItem('lang'); } catch(e) {}
  if (!lang) lang = (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  const btn = document.getElementById('lang-toggle');
  function apply(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const e = I18N_GDPR[el.dataset.i18n];
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
