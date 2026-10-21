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

function localizeText(text) {
  if (!text || typeof text !== 'string') return text;

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
    [/How absolute should the reliance on Land Value Taxation \(LVT\) be\?/i, 'Wie absolut sollte die Abhängigkeit von der Grundwertsteuer sein?'],
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
    [/Promoting employment, economic stability, and public-private innovation/i, 'Förderung von Beschäftigung, wirtschaftlicher Stabilität und öffentlich-private Innovation'],
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
    [/A flat, uniform percentage applied equally across all participants to preserve market neutrality\./i, 'Ein flacher, einheitlicher Prozentsatz, der für alle gleich gilt, um die Marktnetzneutralität zu wahren.'],
    [/A graduated progressive scale where contribution rates increase as income or wealth capacity rises\./i, 'Eine gestaffelte progressive Skala, bei der die Beitragssätze mit Einkommen oder Vermögen steigen.'],
    [/Confiscatory maximum rates \(approaching 100%\) on extreme incomes, private fortunes, or inheritances to prevent economic dynasties\./i, 'Konfiskatorische Höchstsätze (nahezu 100 %) auf extreme Einkommen, Privatvermögen oder Erbschaften, um wirtschaftliche Dynastien zu verhindern.'],
    [/Unimproved land value is the sole source of public revenue, abolishing all taxes on income, labor, commerce, and buildings\./i, 'Der unbebaute Bodenwert ist die alleinige Einnahmequelle des Staates und ersetzt alle Steuern auf Einkommen, Arbeit, Handel und Gebäude.'],
    [/Land Value Tax is the foundational revenue base to stop speculation, supplemented by standard taxes to fund public services and welfare\./i, 'Die Grundwertsteuer bildet die Grundlage der Einnahmen, um Spekulation zu verhindern, ergänzt durch normale Steuern zur Finanzierung öffentlicher Dienste und Sozialleistungen.'],
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
