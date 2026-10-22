let questionsByCategory = {};
let categoryOrder = [
  "economics", 
  "resource_management", 
  "culture", 
  "authority", 
  "nation", 
  "foreign", 
  "technology", 
  "social_control", 
  "territorial_organization"
];
let currentCategoryIndex = 0;
let currentQuestions = {};
let results = {};
let history = [];
let currentNodeId = null;

fetch('questions_tree.json')
  .then(res => res.json())
  .then(data => {
    questionsByCategory = data;
    startCategory(categoryOrder[currentCategoryIndex]);
  });

function loadCategory(category) {
  currentQuestions = {};
  if (questionsByCategory[category]) {
    questionsByCategory[category].forEach(q => currentQuestions[q.id] = q);
  }
}

function startCategory(category, targetId = null) {
  loadCategory(category);
  const firstId = targetId || questionsByCategory[category][0].id;
  renderNode(currentQuestions[firstId]);
}

function selectOption(nextId) {
  history.push({
    categoryIndex: currentCategoryIndex,
    nodeId: currentNodeId,
    results: { ...results }
  });

  const category = categoryOrder[currentCategoryIndex];
  const node = currentQuestions[nextId];

  if (!node.options) {
    results[category] = node.id;
    currentCategoryIndex++;
    if (currentCategoryIndex < categoryOrder.length) {
      startCategory(categoryOrder[currentCategoryIndex]);
    } else {
      localStorage.setItem('quizResults', JSON.stringify(results));
      window.location.href = 'results.html';
    }
  } else {
    renderNode(node);
  }
}

function renderNode(node) {
  currentNodeId = node.id;
  const questionEl = document.getElementById('question');
  const buttonsDiv = document.getElementById('buttons');
  buttonsDiv.innerHTML = '';
  questionEl.innerText = localizeText(node.text || "");

  if (node.options && node.options.length > 3) {
    buttonsDiv.classList.add('multi-column');
  } else {
    buttonsDiv.classList.remove('multi-column');
  }

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.innerText = localizeText(opt.text);
    if (opt.color) btn.style.backgroundColor = opt.color;
    btn.onclick = () => selectOption(opt.next);
    buttonsDiv.appendChild(btn);
  });

  updateBackButton();
}

function previousQuestion() {
  if (history.length === 0) {
    window.location.href = 'Instruction.html';
    return;
  }

  const prevState = history.pop();
  currentCategoryIndex = prevState.categoryIndex;
  results = prevState.results;

  loadCategory(categoryOrder[currentCategoryIndex]);
  renderNode(currentQuestions[prevState.nodeId]);
}

function updateBackButton() {
  const backBtn = document.getElementById('back-button');
  if (!backBtn) return;

  if (history.length === 0) {
    backBtn.innerText = "Zurück zur Anleitung";
  } else {
    backBtn.innerText = "Vorherige Frage";
    backBtn.disabled = false;
  }
}

const exactTranslations = new Map([
  ["A single, uniform national consumption tax on all final goods, eliminating income, corporate, and payroll taxes.", "Eine einheitliche nationale Verbrauchsteuer auf alle Endprodukte, die Einkommen-, Körperschaft- und Lohnsteuern ersetzt."],
  ["Protective import tariffs, customs duties, and foreign trade levies, eliminating direct domestic taxation on citizens.", "Schutzzölle auf Einfuhren und weitere Abgaben auf den Außenhandel, die direkte inländische Steuern für Bürger ersetzen."],
  ["Embrace social progress: reform outdated cultural norms, expand individual liberty, and advance equality through reason.", "Gesellschaftlichen Fortschritt fördern: überholte kulturelle Normen reformieren, individuelle Freiheit ausweiten und Gleichberechtigung durch Vernunft voranbringen."],
  ["Resist modern decay: secular liberal modernity is spiritually hollow or degenerate; society must return to sacred or traditional foundations.", "Dem modernen Niedergang entgegentreten: Die säkular-liberale Moderne ist geistig hohl oder dekadent; die Gesellschaft soll zu heiligen oder traditionellen Grundlagen zurückkehren."],
  ["Protecting equal civic rights, freedom of conscience, and strict legal neutrality for every individual.", "Gleiche Bürgerrechte, Gewissensfreiheit und strikte rechtliche Neutralität gegenüber jedem Einzelnen schützen."],
  ["Maximizing personal lifestyle freedom, enabling individuals to live and express themselves free from traditional taboos.", "Die persönliche Freiheit in der Lebensführung maximieren, damit jeder Mensch unabhängig von traditionellen Tabus leben und sich ausdrücken kann."],
  ["Actively dismantling systemic prejudice, historical privilege, and cultural hierarchies to achieve social equity.", "Systemische Vorurteile, historisch gewachsene Privilegien und kulturelle Hierarchien gezielt abbauen, um soziale Gleichheit zu erreichen."],
  ["Radical deconstruction: rejecting all grand narratives of 'progress' or 'truth'—cultural norms are arbitrary power constructs to be dismantled.", "Radikale Dekonstruktion: Alle großen Erzählungen von „Fortschritt“ oder „Wahrheit“ zurückweisen und kulturelle Normen als willkürliche Machtkonstrukte begreifen, die abgebaut werden müssen."],
  ["Defend established national culture, civic customs, and institutional stability as the bedrock of society.", "Die etablierte nationale Kultur, gesellschaftliche Bräuche und institutionelle Stabilität als Fundament der Gesellschaft verteidigen."],
  ["Prudently adapt to necessary social and cultural evolutions while anchoring society in established historical institutions.", "Notwendige gesellschaftliche und kulturelle Veränderungen umsichtig aufgreifen und zugleich an bewährten historischen Institutionen festhalten."],
  ["Synthesize cultural continuity and moral order with personal autonomy and individual liberties.", "Kulturelle Kontinuität und moralische Ordnung mit persönlicher Selbstbestimmung und individuellen Freiheiten verbinden."],
  ["Moral foundations: family, faith, and institutional continuity are primary, with personal liberties exercised within an orderly social fabric.", "Moralische Grundlagen: Familie, Glaube und institutionelle Kontinuität haben Vorrang; persönliche Freiheiten werden innerhalb einer geordneten Gesellschaft ausgeübt."],
  ["Individual liberty: personal autonomy, civil liberties, and free expression are society's highest heritage, keeping state moralism minimal.", "Individuelle Freiheit: persönliche Selbstbestimmung, Bürgerrechte und freie Meinungsäußerung sind das höchste gesellschaftliche Erbe; staatliche Moralvorschriften sollen auf ein Mindestmaß beschränkt bleiben."],
  ["On what foundation should society resist modern secular degeneration and preserve rooted order?", "Auf welches Fundament soll sich die Gesellschaft stützen, um der säkularen Moderne entgegenzutreten und eine verwurzelte Ordnung zu bewahren?"],
  ["A radical counter-revolution: overturning modern democratic decay through pre-modern restoration or modern techno-traditional syntheses.", "Eine radikale Gegenrevolution: den modernen demokratischen Niedergang umkehren – durch eine Rückkehr zu vormodernen Verhältnissen oder durch eine moderne Synthese aus Technologie und Tradition."],
  ["Defending historic national identity, regional distinctiveness, and traditional morality against globalist homogenization.", "Historische nationale Identität, regionale Eigenständigkeit und traditionelle Moralvorstellungen gegen eine globalistische Vereinheitlichung verteidigen."],
  ["Living strictly by established religious faith, sacred scriptures, and traditional moral teachings.", "Konsequent nach dem etablierten religiösen Glauben, heiligen Schriften und traditionellen moralischen Lehren leben."],
  ["Reviving a timeless spiritual wisdom and sacred metaphysical order shared across ancient civilizations.", "Eine zeitlose spirituelle Weisheit und sakrale metaphysische Ordnung wiederbeleben, die den alten Zivilisationen gemeinsam sind."],
  ["Turn the clock back, reject Enlightenment ideas and return to pre-modern cultural norms, virtues, and social roles.", "Das Rad zurückdrehen: Ideen der Aufklärung zurückweisen und zu vormodernen kulturellen Normen, Tugenden und gesellschaftlichen Rollen zurückkehren."],
  ["Fuse romantic folklore, ancestral spirit, and heroic national culture with high technology.", "Romantische Folklore, Ahnengeist und eine heroische nationale Kultur mit Hochtechnologie verbinden."],
  ["Forge a dynamic alternative: build a revolutionary, avant-garde pathway to modernity that breaks completely with liberal-bourgeois culture.", "Eine dynamische Alternative schaffen: einen revolutionären, avantgardistischen Weg in die Moderne einschlagen, der vollständig mit der liberal-bürgerlichen Kultur bricht."],
  ["Under a symbolic, non-governing monarch whose sole function is to defend liberty and prevent the rise of a new state.", "Unter einem symbolischen Monarchen ohne Regierungsgewalt, dessen einzige Aufgabe darin besteht, die Freiheit zu schützen und die Entstehung eines neuen Staates zu verhindern."],
  ["Where should sovereign decision-making power ultimately reside?", "Wo soll die souveräne Entscheidungsgewalt letztlich liegen?"],
  ["In the citizenry bodies.", "In den Organen der Bürgerschaft."],
  ["Through what mechanism should citizens exercise constitutional sovereignty?", "Über welche Wege sollen Bürgerinnen und Bürger ihre verfassungsmäßige Souveränität ausüben?"],
  ["In a distinguished elite or capable leadership class selected by merit, expertise, or duty.", "Bei einer herausragenden Elite oder einer fähigen Führungsschicht, ausgewählt nach Verdienst, Fachkenntnis oder Pflichtbewusstsein."],
  ["Citizens elect representatives to debate and enact legislation within a constitutional republic.", "Die Bürger wählen Vertreter, die in einer Verfassungsrepublik Gesetze beraten und verabschieden."],
  ["An elected parliament shares authority with a hereditary monarch bound by constitutional law.", "Ein gewähltes Parlament teilt sich die Macht mit einem erblichen Monarchen, der an die Verfassung gebunden ist."],
  ["What form should this direct democratic governance take?", "Welche Form soll diese direkte demokratische Mitbestimmung annehmen?"],
  ["Citizens decide policy directly through popular initiatives, referendums, and ballot measures.", "Die Bürger entscheiden unmittelbar über politische Fragen – durch Volksinitiativen, Referenden und Abstimmungen."],
  ["Power is vested in directly elected workers', peasants', or soldiers' councils.", "Die Macht liegt bei direkt gewählten Räten der Arbeiter, Bauern oder Soldaten."],
  ["Citizens govern directly through neighborhood and municipal popular assemblies that confederate regionally.", "Die Bürger regieren unmittelbar in nachbarschaftlichen und kommunalen Volksversammlungen, die sich regional zusammenschließen."],
  ["Governance is managed through digital platforms, open networks, and electronic direct democracy.", "Die Regierung wird über digitale Plattformen, offene Netzwerke und elektronische direkte Demokratie organisiert."],
  ["What qualification should grant this elite leadership class the right to govern?", "Welche Qualifikation soll dieser Führungselite das Recht zu regieren verleihen?"],
  ["Inherited noble birth, historical lineage, and rooted stewardship of society.", "Ererbter Adel, historische Abstammung und eine in der Tradition verwurzelte Verantwortung für die Gesellschaft."],
  ["Command within the military hierarchy, martial discipline, and strategic leadership.", "Befehl in der militärischen Hierarchie, militärische Disziplin und strategische Führungsfähigkeit."],
  ["What is the institutional basis of this centralized executive power?", "Auf welcher institutionellen Grundlage beruht diese zentralisierte Exekutivgewalt?"],
  ["What is the nature of this traditional or religious sovereign authority?", "Wie ist diese traditionelle oder religiöse souveräne Herrschaft beschaffen?"],
  ["How should this centralized executive power be organized and wielded?", "Wie sollte diese zentralisierte Exekutivgewalt organisiert und ausgeübt werden?"],
  ["National borders and collective identity should be rejected in favor of personal autonomy or borderless universalism.", "Nationale Grenzen und kollektive Identität sollten zugunsten individueller Selbstbestimmung oder eines grenzlosen Universalismus abgelehnt werden."],
  ["Belonging should be defined through shared values or local civic solidarity.", "Zugehörigkeit sollte sich aus gemeinsamen Werten oder lokaler Bürgersolidarität ergeben."],
  ["Belonging must be rooted in ancestral bloodlines, ethnic heritage, and biological lineage.", "Zugehörigkeit muss in Abstammung, ethnischem Erbe und biologischer Herkunft verwurzelt sein."],
  ["On what principle should society operate without national identity or state borders?", "Nach welchem Prinzip sollte eine Gesellschaft ohne nationale Identität und staatliche Grenzen organisiert sein?"],
  ["Radical individual sovereignty: the nation is an oppressive abstraction ('spook'); individuals owe no allegiance to any collective and act purely on self-interest.", "Radikale individuelle Souveränität: Die Nation gilt als unterdrückerische Abstraktion („Spuk“); der Einzelne ist keinem Kollektiv verpflichtet und handelt ausschließlich im eigenen Interesse."],
  ["Universal cosmopolitanism: all human beings belong to a single borderless global community with equal rights across the planet.", "Kosmopolitischer Universalismus: Alle Menschen gehören zu einer einzigen, grenzenlosen Weltgemeinschaft mit gleichen Rechten auf dem ganzen Planeten."],
  ["Equal constitutional rights, the rule of law, and shared political citizenship regardless of ethnic origin.", "Gleiche Verfassungsrechte, Rechtsstaatlichkeit und gemeinsame politische Staatsbürgerschaft unabhängig von der ethnischen Herkunft."],
  ["Belonging belongs to face-to-face neighborhoods, towns, and organic civic communities.", "Zugehörigkeit entsteht in unmittelbaren Nachbarschaften, Städten und organisch gewachsenen Bürgergemeinschaften."],
  ["What is the primary anchor of this political and social cohesion?", "Was bildet das zentrale Fundament dieses politischen und gesellschaftlichen Zusammenhalts?"],
  ["What core foundation defines this shared cultural or civilizational sphere?", "Was ist das zentrale Fundament dieser kulturellen oder zivilisatorischen Gemeinschaft?"],
  ["At what scale should shared ancestry and blood ties organize society?", "Auf welcher Ebene sollen gemeinsame Abstammung und Blutsverwandtschaft die Gesellschaft ordnen?"],
  ["In a sovereign nation-state centered on a distinct historical ethnic group tied to a homeland.", "In einem souveränen Nationalstaat, der sich um eine klar abgegrenzte historische Volksgruppe mit Bezug zu einem Heimatland bildet."],
  ["Across broader supra-national, continental, or racial collectives.", "In größeren übernationalen, kontinentalen oder rassisch definierten Gemeinschaften."],
  ["Trade and communicate peacefully while staying out of foreign wars", "Friedlich Handel treiben und kommunizieren, sich aber aus ausländischen Kriegen heraushalten."],
  ["Strict diplomatic restraint and complete avoidance of foreign alliances", "Strikte diplomatische Zurückhaltung und der vollständige Verzicht auf ausländische Bündnisse."],
  ["Fostering mutual solidarity and partnership across borders", "Solidarität und Partnerschaft über Grenzen hinweg fördern."],
  ["Proactively intervening abroad to stop bad actors and defend human rights", "Aktiv im Ausland eingreifen, um schädliche Akteure zu stoppen und Menschenrechte zu verteidigen."],
  ["Step away from heavy machinery in favor of rural or low-tech living", "Schwere Maschinenindustrie zurückfahren und ein ländliches Leben mit einfacher Technik bevorzugen."],
  ["Develop advanced technologies to reshape the future", "Fortschrittliche Technologien entwickeln, um die Zukunft neu zu gestalten."],
  ["Build community life around farming, rural culture, and working the land", "Das Gemeinschaftsleben auf Landwirtschaft, ländlicher Kultur und der Arbeit auf dem Land aufbauen."],
  ["Rely on local artisan craft and hand tools while rejecting automation", "Auf lokales Handwerk und einfache Werkzeuge setzen und Automatisierung ablehnen."],
  ["Abandon civilization and farming entirely to return to hunter-gatherer life", "Zivilisation und Landwirtschaft vollständig aufgeben und zum Leben als Jäger und Sammler zurückkehren."],
  ["Protecting natural habitats and balancing industrial activity with the environment", "Natürliche Lebensräume schützen und industrielle Aktivitäten mit der Umwelt in Einklang bringen."],
  ["Regulate industry with renewable energy, recycling, and sustainable practices", "Die Industrie durch erneuerbare Energien, Recycling und nachhaltige Verfahren regulieren."],
  ["Shift away from heavy manufacturing toward an information, digital, and service economy", "Die Schwerindustrie zurückfahren und zu einer Informations-, Digital- und Dienstleistungswirtschaft übergehen."],
  ["Treat technology simply as a neutral tool to solve practical everyday problems", "Technologie als neutrales Werkzeug betrachten, um praktische Alltagsprobleme zu lösen."],
  ["Where should advanced high-tech development be directed?", "Worauf sollte sich die Entwicklung fortschrittlicher Hochtechnologie richten?"],
  ["Restoring the biosphere, enhancing human biology, or surpassing physical limits", "Die Biosphäre wiederherstellen, die menschliche Biologie verbessern oder körperliche Grenzen überwinden."],
  ["Automating all production to eliminate scarcity and expanding into space", "Die gesamte Produktion automatisieren, um Knappheit zu beseitigen, und den Weltraum erschließen."],
  ["Use clean nuclear power, synthetic food, and compact cities so nature can rewild", "Saubere Kernenergie, synthetische Lebensmittel und kompakte Städte nutzen, damit sich die Natur wieder ausbreiten kann."],
  ["Enhance human bodies and minds with cybernetics, gene editing, and extended lifespans", "Menschliche Körper und Geist mithilfe von Kybernetik, Genbearbeitung und längerer Lebensspanne verbessern."],
  ["Leave biology behind entirely and upload human minds into synthetic superintelligence", "Die biologische Grundlage vollständig hinter sich lassen und menschliche Geister in eine synthetische Superintelligenz hochladen."],
  ["Deploy genetic engineering, geoengineering, and clean biotech to repair ecosystems", "Gentechnik, Geoengineering und saubere Biotechnologie einsetzen, um Ökosysteme wiederherzustellen."],
  ["Automate all production to eliminate scarcity and free humans from compulsory labor", "Die gesamte Produktion automatisieren, Knappheit beseitigen und Menschen von verpflichtender Arbeit befreien."],
  ["Expand endlessly across the solar system and maximize cosmic energy capture", "Unbegrenzt in das Sonnensystem expandieren und die Gewinnung kosmischer Energie maximieren."],
  ["Accept that technological acceleration is an unstoppable physical process that cannot be controlled", "Akzeptieren, dass die technologische Beschleunigung ein unaufhaltsamer und nicht kontrollierbarer Prozess ist."],
  ["Protecting constitutional rights—like free speech, privacy, and fair trials—while strictly limiting police and government surveillance.", "Grundrechte wie Meinungsfreiheit, Privatsphäre und faire Gerichtsverfahren schützen und zugleich Polizei sowie staatliche Überwachung strikt begrenzen."],
  ["Total lifestyle freedom—the government should never police consensual adult choices, private habits, drugs, or personal vices.", "Uneingeschränkte Freiheit in der Lebensführung: Der Staat soll einvernehmliche Entscheidungen Erwachsener, private Gewohnheiten, Drogenkonsum oder persönliche Laster niemals kontrollieren."],
  ["Protecting public health, safety, and well-being through regulation and vice deterrents without criminalizing private life.", "Öffentliche Gesundheit, Sicherheit und Wohlergehen durch Regulierung und Maßnahmen gegen schädliche Laster schützen, ohne das Privatleben zu kriminalisieren."],
  ["Defending public decency and moral cohesion by outlawing obscenity, vice, and behaviors that degrade social values.", "Öffentliche Sittlichkeit und moralischen Zusammenhalt schützen, indem Obszönität, Laster und gesellschaftlich schädliches Verhalten verboten werden."],
  ["Preemptive monitoring, intelligence gathering, and mass surveillance to prevent crime and maintain security.", "Vorausschauende Kontrolle, Nachrichtendienstinformationen und umfassende Überwachung nutzen, um Kriminalität zu verhindern und Sicherheit zu gewährleisten."],
  ["Correcting personal habits, enforcing public etiquette, and penalizing antisocial behavior to ensure social cohesion.", "Persönliche Gewohnheiten korrigieren, Regeln des öffentlichen Anstands durchsetzen und antisoziales Verhalten ahnden, um den gesellschaftlichen Zusammenhalt zu sichern."],
  ["Mobilizing daily life, youth upbringing, and family responsibilities through mandatory civic service and state duty.", "Alltag, Erziehung der Jugend und familiäre Pflichten durch verpflichtenden Bürgerdienst und staatliche Aufgaben lenken."],
  ["Eradicating the private sphere entirely: reproduction, thought, and conscience are wholly owned by the collective.", "Den privaten Bereich vollständig beseitigen: Fortpflanzung, Denken und Gewissen dem Kollektiv unterstellen."],
  ["Power must belong primarily to local communities or sovereign states via voluntary, bottom-up association.", "Die Macht soll vor allem bei lokalen Gemeinschaften oder souveränen Staaten liegen, die sich freiwillig von unten nach oben zusammenschließen."],
  ["Power should be shared or balanced between regional self-rule and a unifying central framework.", "Die Macht zwischen regionaler Selbstverwaltung und einem einigenden zentralen Rahmen aufteilen oder ausbalancieren."],
  ["Sovereignty must be undivided and concentrated within a unitary national state.", "Die Souveränität muss ungeteilt in einem einheitlichen Nationalstaat konzentriert sein."],
  ["At what scale should this decentralized sovereignty reside?", "Auf welcher Ebene soll diese dezentralisierte Souveränität angesiedelt sein?"],
  ["In sovereign cantons, states, or republics joined by treaty with unilateral veto and secession rights.", "In souveränen Kantonen, Staaten oder Republiken, die sich durch Verträge verbinden und ein einseitiges Vetorecht sowie ein Austrittsrecht behalten."],
  ["Totalitarian erasure of all local identity, regional culture, and local self-rule—every district is micromanaged like a regiment directly from the capital.", "Jede lokale Identität, regionale Kultur und Selbstverwaltung totalitär auslöschen – jeder Bezirk wird wie ein Regiment direkt aus der Hauptstadt bis ins Detail gesteuert."],
  ["Preserve institutional continuity: safeguard proven historical customs, constitutional order, and prudent stability.", "Institutionelle Kontinuität bewahren: Bewährte historische Bräuche, die Verfassungsordnung und umsichtig gewahrte Stabilität schützen."],
  ["Rooted ancestral customs, local community obligations, and regional heritage.", "Verwurzelte Bräuche der Vorfahren, Pflichten gegenüber der örtlichen Gemeinschaft und regionales Erbe."],
  ["Sacred scripture, divine law, and transcendent metaphysical truths.", "Heilige Schriften, göttliches Recht und über die Welt hinausweisende metaphysische Wahrheiten."],
  ["An organic moral order rooted in natural law, local piety, family continuity, and rooted communal bonds.", "Eine organisch gewachsene moralische Ordnung, gegründet auf Naturrecht, örtlicher Frömmigkeit, familiärer Kontinuität und festen Gemeinschaftsbindungen."],
  ["Reject egalitarian illusions, recognize natural human hierarchy and dismantle modern progressive cultural orthodoxies.", "Egalitäre Illusionen zurückweisen, eine natürliche menschliche Hierarchie anerkennen und moderne progressive kulturelle Lehrsätze aufbrechen."],
  ["In a stateless society, how should social order and coordination be maintained?", "Wie sollten in einer staatslosen Gesellschaft soziale Ordnung und Zusammenarbeit gewährleistet werden?"],
  ["How should this representative parliamentary system be organized?", "Wie sollte dieses repräsentative parlamentarische System organisiert sein?"],
  ["Scientific expertise, engineering competence, and data-driven management.", "Wissenschaftliche Fachkenntnis, ingenieurtechnische Kompetenz und datenbasierte Verwaltung."],
  ["Demonstrated talent, individual achievement, and intellectual competence proven in fair competition.", "Nachgewiesenes Talent, persönliche Leistung und geistige Fähigkeiten, die sich in fairem Wettbewerb bewährt haben."],
  ["Shared language, historical customs, and institutional national culture.", "Eine gemeinsame Sprache, historische Bräuche und eine gefestigte nationale Kultur."],
  ["Living folklore, heroic national mythology, ancestral soul, and romantic national awakening.", "Lebendige Folklore, heroische nationale Mythen, die Seele der Vorfahren und ein romantisches nationales Erwachen."],
  ["In organic, decentralized clans and close-knit local tribal kinship groups.", "In organisch gewachsenen, dezentralen Clans und eng verbundenen örtlichen Stammesgemeinschaften."],
  ["Avoid foreign entanglements and prioritize neutrality", "Verwicklungen im Ausland vermeiden und Neutralität in den Vordergrund stellen."],
  ["Pursue national power and strategic self-interest", "Nationale Macht und strategische Eigeninteressen verfolgen."],
  ["Foster international cooperation and global engagement", "Internationale Zusammenarbeit und weltweites Engagement fördern."],
  ["Sever all political, military, and significant economic ties", "Alle politischen, militärischen und wesentlichen wirtschaftlichen Verbindungen kappen."],
  ["Worldwide grassroots solidarity opposing corporate globalization and exploitation", "Weltweite Solidarität von der Basis gegen die Globalisierung von Konzernen und Ausbeutung."],
  ["Developing manufacturing, digital infrastructure, and practical everyday tools", "Produktion, digitale Infrastruktur und praktische Werkzeuge für den Alltag entwickeln."],
  ["Set aside protected wilderness and strictly limit human development", "Geschützte Wildnisgebiete einrichten und menschliche Eingriffe streng begrenzen."],
  ["Prioritize heavy manufacturing, factories, machine shops, and raw material extraction", "Schwere Industrie, Fabriken, Werkstätten und die Gewinnung von Rohstoffen priorisieren."],
  ["Speed up market competition and computing power so they outrun government regulation", "Wettbewerb und Rechenleistung so beschleunigen, dass sie staatlicher Regulierung vorauseilen."],
  ["Enforcing public security, behavioral conformity, or systematic collective discipline.", "Öffentliche Sicherheit, angepasstes Verhalten oder eine systematische kollektive Disziplin durchsetzen."]
]);

function localizeText(text) {
  if (!text || typeof text !== 'string') return text;
  if (exactTranslations.has(text)) return exactTranslations.get(text);

  let result = text;

  const replacements = [
    [/What should be the foundation of the economy\?/i, 'Was sollte die Grundlage der Wirtschaft sein?'],
    [/What relationship should the state have with the private market\?/i, 'Welche Beziehung sollte der Staat zum privaten Markt haben?'],
    [/What is the ultimate role of an autonomous, unregulated market\?/i, 'Welche Rolle hat ein autonomer, unregulierter Markt letztlich?'],
    [/What should be the primary priority of state economic policy\?/i, 'Was sollte die Hauptpriorität der wirtschaftspolitischen Maßnahmen des Staates sein?'],
    [/How broad should the welfare system and market regulations be\?/i, 'Wie breit sollten das Sozialsystem und die Marktregeln sein?'],
    [/How should this universal welfare and regulated market work in practice\?/i, 'Wie sollte diese allgemeine soziale Sicherung und regulierte Marktwirtschaft in der Praxis funktionieren?'],
    [/How should basic poverty relief work alongside a free market\?/i, 'Wie sollte die soziale Hilfe für Arme neben einem freien Markt funktionieren?'],
    [/How should the state promote economic stability and growth\?/i, 'Wie sollte der Staat wirtschaftliche Stabilität und Wachstum fördern?'],
    [/How should the state coordinate national industry and labor\?/i, 'Wie sollte der Staat Industrie und Arbeit auf nationaler Ebene koordinieren?'],
    [/Who should hold sovereign control over socialized productive property\?/i, 'Wer sollte die souveräne Kontrolle über sozialisiertes Produktivvermögen haben?'],
    [/What is the primary function of state-owned enterprises\?/i, 'Welche Hauptfunktion haben staatliche Unternehmen?'],
    [/How should worker-owned production be coordinated\?/i, 'Wie sollte die arbeitnehmergeführte Produktion organisiert werden?'],
    [/What mechanism should replace the market economy\?/i, 'Welches System sollte die Marktwirtschaft ersetzen?'],
    [/Which alternative framework should govern property and industry\?/i, 'Welches alternative Modell sollte Eigentum und Wirtschaft regeln?'],
    [/How should the widespread distribution of property be achieved and maintained\?/i, 'Wie sollte die breite Verteilung von Eigentum erreicht und gesichert werden?'],
    [/Which institution should anchor this cooperative property distribution\?/i, 'Welche Institution sollte diese genossenschaftliche Verteilung von Eigentum tragen?'],
    [/How should small-scale, market-oriented property ownership be sustained\?/i, 'Wie sollte kleinräumiges, marktorientiertes Eigentum erhalten werden?'],
    [/What is the primary objective of organizing industry into state-coordinated bodies\?/i, 'Was ist das Hauptziel, Industrie in staatlich koordinierte Strukturen zu organisieren?'],
    [/How should society manage the funding of public needs and the distribution of common wealth\?/i, 'Wie sollte die Gesellschaft öffentliche Aufgaben und die Verteilung gemeinsamen Reichtums finanzieren?'],
    [/How should the burden of productivity and income taxation be structured across society\?/i, 'Wie sollte die Belastung durch Produktivitäts- und Einkommenssteuern in der Gesellschaft verteilt werden?'],
    [/How absolute should the reliance on Land Value Taxation \(LVT\) be\?/i, 'Sollte die Bodenwertsteuer die einzige Einnahmequelle des Staates sein oder durch andere Steuern ergänzt werden?'],
    [/What non-income mechanism should fund the state without taxing labor and investment\?/i, 'Welcher nicht-einkommensbezogene Mechanismus sollte den Staat finanzieren, ohne Arbeit und Investitionen zu besteuern?'],
    [/What fundamental attitude should society take toward cultural heritage, modern values, and social change\?/i, 'Welche grundlegende Haltung sollte die Gesellschaft gegenüber kulturellem Erbe, modernen Werten und sozialem Wandel einnehmen?'],
    [/What is the primary objective of cultural progress and social reform\?/i, 'Was ist das Hauptziel kulturellen Fortschritts und sozialer Reformen?'],
    [/How should conservative governance balance cultural continuity with social change and individual liberty\?/i, 'Wie sollte konservative Politik kulturelle Kontinuität mit sozialem Wandel und individueller Freiheit in Einklang bringen?'],
    [/Which principle anchors this synthesis of liberty and conservative values\?/i, 'Welches Prinzip stützt diese Synthese aus Freiheit und konservativen Werten?'],
    [/What should anchor this rooted, traditional way of life\?/i, 'Was sollte dieses verwurzelte, traditionelle Lebensmodell tragen?'],
    [/What sacred foundation should guide culture and moral life\?/i, 'Welche heilige Grundlage sollte Kultur und moralisches Leben leiten?'],
    [/How should culture challenge liberal modernity and reshape society's worldview\?/i, 'Wie sollte Kultur die liberale Moderne herausfordern und die Weltanschauung der Gesellschaft neu formen?'],
    [/What is the legitimate scope of political authority over the individual\?/i, 'Welchen legitimen Umfang hat politische Autorität über das Individuum?'],
    [/What should be the legitimate basis for defining borders, citizenship, and political community\?/i, 'Was sollte die legitime Grundlage für die Definition von Grenzen, Staatsbürgerschaft und politischer Gemeinschaft sein?'],
    [/What general orientation should our foreign policy pursue\?/i, 'Welche allgemeine Ausrichtung sollte unsere Außenpolitik verfolgen?'],
    [/How should our independence from foreign conflicts be maintained\?/i, 'Wie sollte unsere Unabhängigkeit von ausländischen Konflikten erhalten bleiben?'],
    [/What should safeguard our neutrality\?/i, 'Was sollte unsere Neutralität sichern?'],
    [/How should our country exert influence on the world stage\?/i, 'Wie sollte unser Land Einfluss auf der Weltbühne ausüben?'],
    [/What is the primary aim of our global engagement\?/i, 'Was ist das Hauptziel unseres globalen Engagements?'],
    [/Through what mechanism should global order be maintained\?/i, 'Durch welchen Mechanismus sollte die globale Ordnung erhalten werden?'],
    [/How should international cooperation be structured\?/i, 'Wie sollte internationale Zusammenarbeit strukturiert sein?'],
    [/What direction should society take with technology and production\?/i, 'Welche Richtung sollte die Gesellschaft mit Technologie und Produktion einschlagen?'],
    [/How should society live away from heavy machine industry\?/i, 'Wie sollte die Gesellschaft fern von schwerer Maschinenindustrie leben?'],
    [/What should be the main priority for everyday industry and technology\?/i, 'Was sollte die wichtigste Priorität für alltägliche Industrie und Technologie sein?'],
    [/How should we maintain environmental balance\?/i, 'Wie sollten wir das ökologische Gleichgewicht erhalten?'],
    [/What kind of economy and tools should we focus on\?/i, 'Auf welche Art von Wirtschaft und welche Werkzeuge sollten wir uns konzentrieren?'],
    [/How should advanced science transform living systems and the planet\?/i, 'Wie sollte fortschrittliche Wissenschaft lebende Systeme und den Planeten verändern?'],
    [/What is the ultimate goal of human technological mastery\?/i, 'Was ist das ultimative Ziel menschlicher technologischer Beherrschung?'],
    [/How should we view runaway technological growth\?/i, 'Wie sollten wir unkontrolliertes technisches Wachstum bewerten?'],
    [/What is the legitimate scope of state authority over an individual's private conduct, personal habits, and lifestyle\?/i, 'Welchen legitimen Umfang hat staatliche Autorität über das private Verhalten, Gewohnheiten und den Lebensstil eines Einzelnen?'],
    [/What is the most important part of protecting personal freedom\?/i, 'Was ist der wichtigste Teil des Schutzes persönlicher Freiheit?'],
    [/What is the primary objective of state intervention into personal conduct\?/i, 'Was ist das Hauptziel staatlicher Eingriffe in das persönliche Verhalten?'],
    [/Through what mechanism should social order and collective discipline be maintained\?/i, 'Durch welchen Mechanismus sollten soziale Ordnung und kollektive Disziplin aufrechterhalten werden?'],
    [/How absolute should the subordination of civilian life to the state be\?/i, 'Wie absolut sollte die Unterordnung des bürgerlichen Lebens unter den Staat sein?'],
    [/How should sovereign political authority be distributed across territory and administrative levels\?/i, 'Wie sollte souveräne politische Autorität über Territorien und Verwaltungsebenen verteilt werden?'],
    [/How should power be shared between the national government and the regions\?/i, 'Wie sollte die Macht zwischen Nationalregierung und Regionen aufgeteilt werden?'],
    [/How much control should the national capital have over the rest of the country\?/i, 'Wie viel Kontrolle sollte die Hauptstadt über das übrige Land haben?'],

    [/A market or mixed economy:/i, 'Eine Markt- oder Mischwirtschaft:'],
    [/A socialist economy:/i, 'Eine sozialistische Wirtschaft:'],
    [/Non-capitalist, non-socialist alternatives:/i, 'Nichtkapitalistische, nichtsozialistische Alternativen:'],
    [/Free-market autonomy with minimal or no government interference/i, 'Freie Marktwirtschaft mit möglichst wenig staatlichem Eingriff'],
    [/A mixed economy balancing private enterprise with public oversight and investment/i, 'Eine Mischwirtschaft, die private Unternehmen mit staatlicher Aufsicht und Investitionen verbindet'],
    [/To operate within a minimal legal framework for commercial contracts and property defense/i, 'Innerhalb eines minimalen rechtlichen Rahmens für Handelsverträge und den Schutz von Eigentum arbeiten'],
    [/To serve as a counter-economic tool to bypass, starve, and eventually replace the state/i, 'Als gegensätzliche Wirtschaftsform dienen, um den Staat zu umgehen, zu schwächen und schließlich zu ersetzen'],
    [/Social safety nets, healthcare, and income redistribution/i, 'Soziale Sicherheit, Gesundheitsversorgung und Umverteilung des Einkommens'],
    [/Promoting employment, economic stability, and public-private innovation/i, 'Beschäftigung und wirtschaftliche Stabilität fördern sowie Innovation durch Zusammenarbeit von Staat und Unternehmen ermöglichen.'],
    [/Structured national coordination between government, industry, and labor/i, 'Strukturierte nationale Koordination zwischen Staat, Industrie und Arbeit'],
    [/A strong, universal welfare system that guarantees security for all citizens and holds businesses accountable to society/i, 'Ein starkes, universelles Sozialsystem, das allen Bürgern Sicherheit bietet und Unternehmen gesellschaftlich verantwortlich macht'],
    [/A lighter safety net focused on basic poverty relief while keeping taxes low and markets competitive/i, 'Ein leichterer Sozialstaat mit Fokus auf die Grundsicherung, niedrigen Steuern und wettbewerbsfähigen Märkten'],
    [/Combine a competitive market with strong public healthcare, pensions, and strict laws against monopolies\./i, 'Eine wettbewerbsfähige Marktwirtschaft mit starkem öffentlichen Gesundheitswesen, Renten und strengen Regeln gegen Monopole verbinden.'],
    [/Give workers seats on company boards, empower unions, and push banks to invest in long-term stability over quick profits\./i, 'Arbeitern Sitze in Aufsichtsräten geben, Gewerkschaften stärken und Banken dazu bringen, langfristige Stabilität statt schnellen Gewinn zu fördern.'],
    [/Maintain private business while imposing paternal duties on employers and the state to safeguard worker welfare, family security, and class harmony\./i, 'Private Unternehmen erhalten, aber Arbeitgebern und dem Staat eine fürsorgliche Pflicht auferlegen, damit die Sicherheit der Arbeitnehmer, Familien und soziale Harmonie geschützt sind.'],
    [/Anchor the market in a large network of mutual-benefit funds, credit unions, community enterprises, and worker-run cooperatives\./i, 'Die Wirtschaft auf ein Netzwerk aus gegenseitigen Fonds, Genossenschaften, lokalen Unternehmen und von Arbeitnehmern geführten Kooperativen gründen.'],
    [/Focus the state on enforcing fair competition, breaking up cartels, and keeping inflation low, with modest social aid/i, 'Der Staat soll faire Wettbewerbsregeln durchsetzen, Kartelle auflösen und die Inflation niedrig halten, mit einer bescheidenen sozialen Hilfe'],
    [/Provide a minimal, means-tested safety net strictly for the poorest citizens while leaving businesses deregulated/i, 'Ein minimales, bedarfsabhängiges Sicherheitsnetz nur für die ärmsten Bürger schaffen und Unternehmen weitgehend deregulieren'],
    [/Replace complex welfare programs and minimum wage laws with an unconditional Basic Income \(UBI\) cash payment for all/i, 'Komplexe Sozialleistungen und Mindestlohngesetze durch ein bedingungsloses Grundeinkommen für alle ersetzen'],
    [/Counter-cyclical public spending, infrastructure investment, and stimulus to maintain employment/i, 'Konjunkturgerechte öffentliche Ausgaben, Infrastrukturinvestitionen und Anreize, um Beschäftigung zu sichern'],
    [/Public-private partnerships, workforce training, and market-friendly flexibility/i, 'Öffentlich-private Partnerschaften, Weiterbildung und marktorientierte Flexibilität'],
    [/Strategic industrial planning, capital allocation, and priority sector development/i, 'Strategische Industriebewertung, Kapitalverteilung und Entwicklung wichtiger Branchen'],
    [/Institutional wage and price pacts negotiated between state, business, and labor federations/i, 'Institutionelle Lohn- und Preisabkommen zwischen Staat, Unternehmen und Gewerkschaften'],
    [/The state, acting as the centralized representative of society/i, 'Der Staat als zentrale Vertretung der Gesellschaft'],
    [/Workers and local communities organizing from the ground up/i, 'Arbeitende Menschen und lokale Gemeinschaften, die von unten organisiert werden'],
    [/To operate commercially in the global market to maximize state revenue and geopolitical power/i, 'Kommerziell auf dem Weltmarkt zu agieren, um Staatseinnahmen und geopolitische Macht zu maximieren'],
    [/To produce directly for human use under public planning, eliminating the profit motive entirely/i, 'Direkt für den menschlichen Bedarf nach öffentlicher Planung zu produzieren und den Profitorientierung ganz zu beseitigen'],
    [/Worker-owned cooperatives competing and trading inside an open market economy/i, 'Arbeitnehmergenossenschaften, die im offenen Marktsystem konkurrieren und handeln'],
    [/Voluntary, self-contained intentional moral communities established outside mainstream systems/i, 'Freiwillige, abgeschlossene moralische Gemeinschaften außerhalb des Mainstreams'],
    [/Through statutory domestic taxation on economic production \(such as personal income, corporate profits, or capital\)\./i, 'Durch gesetzliche inländische Steuern auf wirtschaftliche Produktion (z. B. Einkommen, Unternehmensgewinne oder Kapital).'],
    [/By shifting the tax burden primarily onto unimproved land and economic resource rents\./i, 'Indem die Steuerlast vor allem auf unbebauten Boden und wirtschaftliche Ressourcenrenten fällt.'],
    [/By abolishing domestic income taxes in favor of consumption or external trade levies\./i, 'Durch die Abschaffung der inländischen Einkommensteuer zugunsten von Konsum- oder Außenhandelsabgaben.'],
    [/By abolishing taxation and wage labor entirely; socialized ownership where wealth is produced and allocated directly for human need\./i, 'Durch die Abschaffung von Steuern und Lohnarbeit; sozialisiertes Eigentum, bei dem Reichtum direkt für den menschlichen Bedarf produziert und verteilt wird.'],
    [/Strictly through voluntary contributions \(donations, lotteries, or user fees\); all compulsory state levies are inherently illegitimate\./i, 'Streng durch freiwillige Beiträge (Spenden, Lotterien oder Nutzungsgebühren); jede zwangsweise staatliche Abgabe ist in sich illegitim.'],
    [/A flat, uniform percentage applied equally across all participants to preserve market neutrality\./i, 'Ein einheitlicher Steuersatz für alle, damit die Besteuerung den Wettbewerb möglichst wenig verzerrt.'],
    [/A graduated progressive scale where contribution rates increase as income or wealth capacity rises\./i, 'Eine gestaffelte progressive Skala, bei der die Beitragssätze mit Einkommen oder Vermögen steigen.'],
    [/Confiscatory maximum rates \(approaching 100%\) on extreme incomes, private fortunes, or inheritances to prevent economic dynasties\./i, 'Konfiskatorische Höchstsätze (nahezu 100 %) auf extreme Einkommen, Privatvermögen oder Erbschaften, um wirtschaftliche Dynastien zu verhindern.'],
    [/Unimproved land value is the sole source of public revenue, abolishing all taxes on income, labor, commerce, and buildings\./i, 'Der unbebaute Bodenwert ist die alleinige Einnahmequelle des Staates und ersetzt alle Steuern auf Einkommen, Arbeit, Handel und Gebäude.'],
    [/Land Value Tax is the foundational revenue base to stop speculation, supplemented by standard taxes to fund public services and welfare\./i, 'Die Bodenwertsteuer bildet die wichtigste Einnahmequelle und soll Spekulation verhindern. Weitere Steuern finanzieren öffentliche Leistungen und soziale Sicherung.'],
    [/The state is a necessary, sovereign institution required to maintain order, administer law, and govern society\./i, 'Der Staat ist eine notwendige, souveräne Institution, die Ordnung aufrechterhalten, Recht verwalten und die Gesellschaft regieren muss.'],
    [/The state's authority must be strictly confined to a minimal night-watchman role \(protecting life, property, and contracts\)\./i, 'Die Autorität des Staates muss streng auf eine minimale Nachtwächterrolle begrenzt sein (Schutz von Leben, Eigentum und Verträgen).'],
    [/The state has no legitimate authority; society must be entirely stateless and voluntary\./i, 'Der Staat hat keine legitime Autorität; die Gesellschaft muss vollständig staatenlos und freiwillig sein.'],
    [/Through completely horizontal, decentralized self-management without any rulers or hierarchy\./i, 'Durch vollständig horizontale, dezentralisierte Selbstverwaltung ohne Herrscher oder Hierarchie.'],
    [/Through representative institutions and parliamentary governance where elected officials legislate on behalf of the public\./i, 'Durch repräsentative Institutionen und parlamentarische Regierung, in der gewählte Beamte im Namen der Öffentlichkeit Gesetzgebung betreiben.'],
    [/Through direct democracy, where citizens make decisions directly via referendums, councils, or popular assemblies\./i, 'Durch direkte Demokratie, in der Bürger direkt über Referenden, Räte oder Volksversammlungen entscheiden.'],
    [/A sacred or hereditary mandate rooted in dynastic bloodline or religious law\./i, 'Ein geheiligtes oder ererbtes Mandat, das auf dynastischer Blutsverwandtschaft oder religiösem Recht beruht.'],
    [/A modern political strongman, ideological vanguard, or centralized state apparatus\./i, 'Ein moderner politischer Starker, eine ideologische Avantgarde oder ein zentralisiertes Staatsapparat.'],
    [/A joint-stock enterprise where governance is managed by an appointed CEO and board of directors\./i, 'Ein Aktienunternehmen, in dem die Regierung von einem ernannten CEO und einem Vorstand verwaltet wird.'],
    [/A hereditary monarch holding undivided autocratic power by dynastic right\./i, 'Ein erbliches Monarchenamt, das durch dynastisches Recht ungeteilte autokratische Macht ausübt.'],
    [/The state is governed directly by the clergy or priesthood administering sacred religious law\./i, 'Der Staat wird direkt von der Geistlichkeit oder dem Klerus regiert, der heiliges religiöses Recht verwaltet.'],
    [/A secular ruler whose political authority is legitimized by enforcing and protecting religious orthodoxy\./i, 'Ein weltlicher Herrscher, dessen politische Autorität durch die Durchsetzung und den Schutz religiöser Orthodoxie legitimiert wird.'],
    [/Through a single revolutionary vanguard party that directs the state and mobilizes the working class\./i, 'Durch eine einzige revolutionäre Avantgardepartei, die den Staat leitet und die Arbeiterklasse mobilisiert.'],
    [/Through a concentrated autocrat who exercises firm political control over the state apparatus\./i, 'Durch einen konzentrierten Autokraten, der eine starke politische Kontrolle über den Staatsapparat ausübt.'],
    [/Through an ethical state that acts as the ultimate moral authority and spiritual organism uniting the nation\./i, 'Durch einen ethischen Staat, der als letzte moralische Autorität und spirituelles Organ die Nation eint.'],
    [/A shared cultural, religious, or civilizational heritage\./i, 'Ein gemeinsames kulturelles, religiöses oder zivilisatorisches Erbe.'],
    [/A common religious faith, theological heritage, and confessional moral unity\./i, 'Ein gemeinsamer religiöser Glaube, theologisches Erbe und konfessionelle moralische Einheit.'],
    [/A pan-national federation or union uniting sister ethnic groups across state borders\./i, 'Eine pan-nationale Föderation oder Union, die Schwesternvölker über Staatsgrenzen hinweg vereint.'],
    [/The entire race as a single biological collective prioritizing racial solidarity and preservation\./i, 'Die gesamte Rasse als ein biologischer Kollektivkörper, der rassische Solidarität und Erhaltung priorisiert.'],
    [/By pragmatically balancing power and alliances to maximize national interest/i, 'Durch pragmatische Macht- und Bündnisausgleichung, um das nationale Interesse zu maximieren'],
    [/By expanding territorial control and dominating foreign resources/i, 'Durch Ausweitung der territorialen Kontrolle und Beherrschung fremder Ressourcen'],
    [/Maintaining international order, rights, and systemic integration/i, 'Aufrechterhaltung der internationalen Ordnung, Rechte und systemischer Integration'],
    [/Integrating into a unified world system of open borders and supranational law/i, 'Integration in ein einheitliches Weltsystem offener Grenzen und supranationalem Recht'],
    [/Focus on standard manufacturing, digital services, and environmental balance/i, 'Fokus auf Standardfertigung, digitale Dienstleistungen und ökologisches Gleichgewicht'],
    [/A strong, well-armed national defense to deter any foreign aggression/i, 'Eine starke, gut bewaffnete nationale Verteidigung zur Abschreckung fremder Aggressionen'],
    [/The state must not infringe on individual autonomy; private life and personal choices belong entirely to the individual\./i, 'Der Staat darf die individuelle Autonomie nicht verletzen; das Privatleben und persönliche Entscheidungen gehören vollständig dem Einzelnen.'],
    [/The state has a duty to guide, regulate, or direct personal behavior for public well-being, morality, or social order\./i, 'Der Staat hat die Pflicht, das persönliche Verhalten aus Gründen des öffentlichen Wohls, der Moral oder der sozialen Ordnung zu leiten, zu regulieren oder zu steuern.'],
    [/Subordinating personal life and domestic priorities directly to the collective mission of the state\./i, 'Das persönliche Leben und die privaten Prioritäten direkt der kollektiven Mission des Staates unterordnen.'],
    [/Directly in self-governing local communes and city assemblies, federating horizontally through recallable delegates\./i, 'Direkt in selbstverwaltenden lokalen Kommunen und Stadtversammlungen, die sich horizontal über abberufbare Delegierte zusammenschließen.'],
    [/A federation where states or provinces have their own constitution, laws, and powers that the central government cannot take away\./i, 'Eine Föderation, in der Staaten oder Provinzen eine eigene Verfassung, Gesetze und Befugnisse haben, die die Zentralregierung nicht entziehen kann.'],
    [/A single unified country that grants self-rule and local parliaments to specific historical or cultural regions\./i, 'Ein einheitliches Land, das bestimmten historischen oder kulturellen Regionen Selbstverwaltung und lokale Parlamente gewährt.'],
    [/A standard unified country with one set of national laws, where local councils and mayors manage everyday town affairs\./i, 'Ein einheitliches Land mit einem nationalen Rechtssystem, in dem lokale Räte und Bürgermeister die täglichen Stadtangelegenheiten verwalten.'],
    [/\bWhat should be the\b/i, 'Was sollte die'],
    [/\bWhat is the\b/i, 'Was ist die'],
    [/\bWhat should\b/i, 'Was sollte'],
    [/\bWhat is\b/i, 'Was ist'],
    [/\bHow should\b/i, 'Wie sollte'],
    [/\bHow broad should\b/i, 'Wie breit sollte'],
    [/\bHow absolute should\b/i, 'Wie absolut sollte'],
    [/\bHow much\b/i, 'Wie viel'],
    [/\bWhich\b/i, 'Welche'],
    [/\bWho should\b/i, 'Wer sollte'],
    [/\bWhy should\b/i, 'Warum sollte'],
    [/\bWhen should\b/i, 'Wann sollte'],
    [/\bThrough what\b/i, 'Durch welche'],
    [/\bWhat kind of\b/i, 'Welche Art von'],
    [/\bWhat general orientation\b/i, 'Welche allgemeine Ausrichtung'],
    [/\bWhat direction\b/i, 'Welche Richtung'],
    [/\bWhat role\b/i, 'Welche Rolle']
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}
