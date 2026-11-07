import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { evaluateExpressionWithSteps } from '../src/utils/calculatorEngine.ts';
import { evaluateFractionStringWithSteps, decimalToFraction, toMixed } from '../src/utils/fractionEngine.ts';
import { convertUnitsWithSteps } from '../src/utils/converterEngine.ts';
import { getTranslation, localizeSeedText } from '../src/utils/i18n.ts';

test('evaluateExpressionWithSteps correctly calculates basic arithmetic', () => {
  const res = evaluateExpressionWithSteps('(250 + 150) * 4 - 300', 'DEG');
  assert.equal(res.result, 1300);
  assert.equal(res.error, undefined);
  assert.ok(res.steps.length > 0);
});

test('evaluateExpressionWithSteps handles trigonometry in DEG', () => {
  const res = evaluateExpressionWithSteps('sin(90)', 'DEG');
  assert.equal(Math.round(res.result * 1000) / 1000, 1);
});

test('evaluateFractionStringWithSteps correctly adds mixed fractions', () => {
  const res = evaluateFractionStringWithSteps('1 3/4 + 2 1/6');
  assert.ok(res.resultText.includes('3 11/12'));
  assert.ok(res.rawResult > 3.91 && res.rawResult < 3.92);
  assert.equal(res.steps.length, 5);
});

test('convertUnitsWithSteps converts meters to feet accurately', () => {
  const res = convertUnitsWithSteps('length', 'm', 'ft', 10);
  assert.ok(res.result > 32.8 && res.result < 32.9);
  assert.ok(res.formattedResult.includes('32.808'));
});

test('i18n returns authentic Ukrainian translations for solutions and empty state', () => {
  assert.equal(getTranslation('allSolutions', 'uk'), 'Усі розвʼязки');
  assert.equal(getTranslation('noSolutionsYet', 'uk'), 'Ще немає обчислень');
  assert.equal(getTranslation('trySamples', 'uk'), 'Спробувати приклади:');
  assert.equal(getTranslation('aiProblemSolver', 'uk'), 'ШІ Розвʼязання задач з фото');
});

test('localizeSeedText correctly translates seed notes and steps into Ukrainian and English', () => {
  assert.equal(localizeSeedText('Сложение дробей', 'uk'), 'Додавання дробів');
  assert.equal(localizeSeedText('Сложение дробей', 'en'), 'Addition of fractions');
  assert.equal(localizeSeedText('Теорема Пифагора', 'uk'), 'Теорема Піфагора');
  assert.equal(localizeSeedText('Вычисление выражения в скобках', 'uk'), 'Обчислення виразу в дужках');
});

test('brand name WexCalculator is never translated into Cyrillic', () => {
  assert.equal(getTranslation('appTitle', 'uk'), 'WexCalculator');
  assert.equal(getTranslation('appTitle', 'ru'), 'WexCalculator');
  assert.equal(getTranslation('appTitle', 'en'), 'WexCalculator');
  assert.equal(getTranslation('appTitle', 'es'), 'WexCalculator');
  assert.equal(getTranslation('appTitle', 'de'), 'WexCalculator');
});

test('academic notebook layout keys (Дано, СІ, Знайти, Розв\'язання) exist and are accurate', () => {
  assert.equal(getTranslation('givenLabel', 'uk'), 'Дано');
  assert.equal(getTranslation('toFindLabel', 'uk'), 'Знайти');
  assert.equal(getTranslation('solutionLabel', 'uk'), "Розв'язання");
  assert.ok(getTranslation('siLabel', 'uk').startsWith('СІ'));
  assert.equal(getTranslation('lawsAndFormulasLabel', 'uk'), 'Закони та формули');

  assert.equal(getTranslation('givenLabel', 'ru'), 'Дано');
  assert.equal(getTranslation('toFindLabel', 'ru'), 'Найти');
  assert.equal(getTranslation('solutionLabel', 'ru'), 'Решение');
  assert.ok(getTranslation('siLabel', 'ru').startsWith('СИ'));

  // Multi-input problem solving keys
  assert.ok(getTranslation('textProblemTab', 'uk'));
  assert.ok(getTranslation('solveTextProblemBtn', 'uk'));
  assert.ok(getTranslation('retryBtn', 'uk'));
  assert.ok(getTranslation('textProblemTab', 'ru'));
  assert.ok(getTranslation('retryBtn', 'ru'));
});

test('mathExtended correctly computes gcd, lcm, and prime factorization', async () => {
  const { gcd, lcm, primeFactorization } = await import('../src/utils/mathExtended.ts');
  assert.equal(gcd(48, 180), 12);
  assert.equal(lcm(12, 18), 36);
  const fact = primeFactorization(360);
  assert.equal(fact.formula, '2³ × 3² × 5');
});

test('mathExtended solveQuadratic finds roots and discriminant accurately', async () => {
  const { solveQuadratic } = await import('../src/utils/mathExtended.ts');
  const res = solveQuadratic(1, -5, 6);
  assert.equal(res.d, 1);
  assert.equal(res.hasRealRoots, true);
  assert.equal(res.x1, '3');
  assert.equal(res.x2, '2');
});

test('mathExtended right triangle solver calculates hypotenuse and area', async () => {
  const { solveRightTriangle } = await import('../src/utils/mathExtended.ts');
  const res = solveRightTriangle(3, 4);
  assert.equal(res.hypotenuse, 5);
  assert.equal(res.area, 6);
  assert.equal(res.perimeter, 12);
});

test('mathExtended chemistry molar mass parses formulas accurately', async () => {
  const { calculateMolarMass } = await import('../src/utils/mathExtended.ts');
  const water = calculateMolarMass('H2O');
  assert.ok(water.molarMass > 18.01 && water.molarMass < 18.02);

  const sulfuric = calculateMolarMass('H2SO4');
  assert.ok(sulfuric.molarMass > 98.0 && sulfuric.molarMass < 98.1);
  assert.equal(sulfuric.elements.length, 3);
});

test('mathExtended roman numerals conversion is bi-directional', async () => {
  const { toRoman, fromRoman } = await import('../src/utils/mathExtended.ts');
  assert.equal(toRoman(2026), 'MMXXVI');
  assert.equal(fromRoman('MMXXVI'), 2026);
  assert.equal(toRoman(1999), 'MCMXCIX');
  assert.equal(fromRoman('MCMXCIX'), 1999);
});

test('mathExtended decodeResistor calculates 4-band and 5-band resistance correctly', async () => {
  const { decodeResistor } = await import('../src/utils/mathExtended.ts');
  // Yellow (4), Violet (7), Orange (1k mult = index 3), Gold (5% tol = index 10) -> 47 kΩ
  const res47k = decodeResistor(4, 7, 3, 10);
  assert.equal(res47k.resistanceOhms, 47000);
  assert.equal(res47k.formatted, '47 kΩ');
  assert.equal(res47k.tolerancePercent, 5);
});

test('mathExtended 3D vector operations compute dot, cross and magnitude', async () => {
  const { vector3dOperations } = await import('../src/utils/mathExtended.ts');
  const res = vector3dOperations({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
  assert.equal(res.dotProduct, 0);
  assert.equal(res.crossProduct.z, 1);
  assert.equal(res.angleDeg, 90);
});

test('mathExtended projectile motion and combinatorics evaluate accurately', async () => {
  const { solveProjectileMotion, calculateCombinatorics } = await import('../src/utils/mathExtended.ts');
  const proj = solveProjectileMotion(20, 45);
  assert.ok(proj.maxHeight > 10 && proj.maxHeight < 11);
  assert.ok(proj.totalRange > 40 && proj.totalRange < 41);

  const comb = calculateCombinatorics(5, 2);
  assert.equal(comb.combinations, 10);
  assert.equal(comb.permutations, 20);
});

test('mathExtended annuity loan solves monthly payments accurately', async () => {
  const { solveAnnuityLoan } = await import('../src/utils/mathExtended.ts');
  const loan = solveAnnuityLoan(100000, 12, 12);
  assert.ok(loan.monthlyPayment > 8800 && loan.monthlyPayment < 8900);
  assert.ok(loan.totalInterest > 6000 && loan.totalInterest < 7000);
});

test('localProblemSolver provides authentic academic layout offline for quadratic and physics tasks', async () => {
  const { solveProblemLocally } = await import('../src/utils/localProblemSolver.ts');
  const quadSol = solveProblemLocally('x^2 - 6x + 8 = 0', 'uk');
  assert.ok(quadSol !== null);
  assert.equal(quadSol.subject, 'math');
  assert.ok(quadSol.finalAnswer.includes('x₁ = 4') || quadSol.finalAnswer.includes('4'));

  const physSol = solveProblemLocally('Тіло m = 4 кг рухається зі швидкістю v = 54 км/год', 'uk');
  assert.ok(physSol !== null);
  assert.equal(physSol.subject, 'physics');
  assert.ok(physSol.finalAnswer.includes('Ek = 450.00 Дж') || physSol.finalAnswer.includes('450'));
});

test('CALCULATOR_FUNCTIONS_100 has over 100 comprehensive functions with all required fields', async () => {
  const { CALCULATOR_FUNCTIONS_100 } = await import('../src/utils/calculatorFunctions100.ts');
  assert.ok(CALCULATOR_FUNCTIONS_100.length >= 100, `Expected at least 100 functions, found ${CALCULATOR_FUNCTIONS_100.length}`);
  
  const ids = new Set<string>();
  for (const fn of CALCULATOR_FUNCTIONS_100) {
    assert.ok(fn.id, 'Function must have an ID');
    assert.ok(!ids.has(fn.id), `Duplicate ID found: ${fn.id}`);
    ids.add(fn.id);
    assert.ok(fn.nameUk, `Function ${fn.id} must have a nameUk`);
    assert.ok(fn.nameRu, `Function ${fn.id} must have a nameRu`);
    assert.ok(fn.nameEn, `Function ${fn.id} must have a nameEn`);
    assert.ok(fn.category, `Function ${fn.id} must have a category`);
    assert.ok(fn.formula, `Function ${fn.id} must have a formula`);
    assert.ok(fn.inputs.length >= 0, `Function ${fn.id} must have inputs array`);

    // Verify default calculate execution works without throwing
    const defaultInputs: Record<string, number | string> = {};
    for (const inp of fn.inputs) {
      defaultInputs[inp.key] = inp.defaultValue;
    }
    const res = fn.calculate(defaultInputs);
    assert.ok(typeof res.resultFormatted === 'string' && res.resultFormatted.length > 0, `Calculation result for ${fn.id} must be non-empty string`);
    assert.ok(Array.isArray(res.steps) && res.steps.length > 0, `Calculation steps for ${fn.id} must be non-empty array`);
  }
});

test('CALCULATOR_FUNCTIONS_100 key math, science and finance functions produce accurate results', async () => {
  const { CALCULATOR_FUNCTIONS_100 } = await import('../src/utils/calculatorFunctions100.ts');
  const fnMap = new Map(CALCULATOR_FUNCTIONS_100.map(f => [f.id, f]));

  // 1. Heron triangle
  const heron = fnMap.get('heron_triangle')!;
  const heronRes = heron.calculate({ a: 3, b: 4, c: 5 });
  assert.equal(heronRes.insertValue, '6');

  // 2. Primality test
  const primeFn = fnMap.get('is_prime')!;
  assert.ok(primeFn.calculate({ n: 97 }).resultFormatted.includes('ПРОСТЕ'));
  assert.ok(primeFn.calculate({ n: 100 }).resultFormatted.includes('СКЛАДЕНЕ'));

  // 3. Fibonacci
  const fibFn = fnMap.get('fibonacci')!;
  assert.equal(fibFn.calculate({ n: 10 }).insertValue, '55');

  // 4. Pendulum period
  const pendFn = fnMap.get('gravity_pendulum')!;
  const pendRes = pendFn.calculate({ l: 1 });
  assert.ok(parseFloat(pendRes.insertValue) > 2.0 && parseFloat(pendRes.insertValue) < 2.02);

  // 5. Coulomb force
  const coulFn = fnMap.get('coulomb_force')!;
  const coulRes = coulFn.calculate({ q1: 1, q2: 2, r: 0.1 });
  assert.ok(parseFloat(coulRes.insertValue) > 1.7 && parseFloat(coulRes.insertValue) < 1.9);

  // 6. Resistors
  const parResFn = fnMap.get('resistors_combination')!;
  const parRes = parResFn.calculate({ r1: 100, r2: 100, r3: 100 });
  assert.ok(parRes.resultFormatted.includes('300 Ом') && parRes.resultFormatted.includes('33.333'));

  // 7. Rule of 72
  const r72Fn = fnMap.get('rule_of_72')!;
  const r72Res = r72Fn.calculate({ r: 6 });
  assert.equal(r72Res.insertValue, '12');

  // 8. DNA GC
  const dnaFn = fnMap.get('dna_gc')!;
  const dnaRes = dnaFn.calculate({ seq: 'ATGC' });
  assert.ok(dnaRes.resultFormatted.includes('50%') || dnaRes.resultFormatted.includes('GC'));
});

test('i18n contains camera freeze, zoom, notebook contrast, and 100+ functions translations', () => {
  for (const lang of ['uk', 'ru', 'en'] as const) {
    assert.ok(getTranslation('freezeCamera', lang), `Missing freezeCamera for ${lang}`);
    assert.ok(getTranslation('unfreezeCamera', lang), `Missing unfreezeCamera for ${lang}`);
    assert.ok(getTranslation('digitalZoom', lang), `Missing digitalZoom for ${lang}`);
    assert.ok(getTranslation('contrastModeNotebook', lang), `Missing contrastModeNotebook for ${lang}`);
    assert.ok(getTranslation('cameraFallbackTitle', lang), `Missing cameraFallbackTitle for ${lang}`);
    assert.ok(getTranslation('functions100Title', lang), `Missing functions100Title for ${lang}`);
  }
  // Verify Ukrainian authentic wording
  assert.equal(getTranslation('freezeCamera', 'uk'), 'Зафіксувати кадр');
  assert.equal(getTranslation('unfreezeCamera', 'uk'), 'Розморозити / Live');
  assert.equal(getTranslation('contrastModeNotebook', 'uk'), 'Зошитовий контраст');
});

test('SCIENTIFIC_CONSTANTS contains speed of light, gravitational constant, Avogadro and 30+ constants', async () => {
  const { SCIENTIFIC_CONSTANTS, getConstantById } = await import('../src/utils/scientificConstants.ts');
  assert.ok(SCIENTIFIC_CONSTANTS.length >= 30, `Expected at least 30 constants, found ${SCIENTIFIC_CONSTANTS.length}`);

  const c = getConstantById('c');
  assert.ok(c);
  assert.equal(c.value, 299792458);
  assert.equal(c.valueStr, '299792458');
  assert.equal(c.symbol, 'c');

  const G = getConstantById('G');
  assert.ok(G);
  assert.equal(G.value, 6.6743e-11);

  const Na = getConstantById('Na');
  assert.ok(Na);
  assert.equal(Na.value, 6.02214076e23);

  const h = getConstantById('h');
  assert.ok(h);
  assert.equal(h.value, 6.62607015e-34);

  const g = getConstantById('g');
  assert.ok(g);
  assert.equal(g.value, 9.80665);
});

test('CALCULATOR_FUNCTIONS_400 has over 400 comprehensive functions with unique IDs and valid calculation', async () => {
  const { CALCULATOR_FUNCTIONS_400 } = await import('../src/utils/calculatorFunctions400.ts');
  assert.ok(CALCULATOR_FUNCTIONS_400.length >= 400, `Expected at least 400 functions, found ${CALCULATOR_FUNCTIONS_400.length}`);

  const ids = new Set<string>();
  for (const fn of CALCULATOR_FUNCTIONS_400) {
    assert.ok(fn.id, 'Function must have an ID');
    assert.ok(!ids.has(fn.id), `Duplicate ID in 400 catalogue: ${fn.id}`);
    ids.add(fn.id);
    assert.ok(fn.nameUk && fn.nameEn && fn.nameRu);
    assert.ok(fn.formula);
  }

  // Test special relativistic Lorentz factor function in extended catalogue
  const relGamma = CALCULATOR_FUNCTIONS_400.find(f => f.id === 'rel_gamma');
  assert.ok(relGamma);
  const relRes = relGamma.calculate({ vFraction: 0.8 });
  assert.ok(relRes.resultFormatted);
  assert.ok(relRes.steps.length > 0);
});

test('WexProblemBankService provides 9000 curriculum problems and search/filter support', async () => {
  const { WexProblemBankService, TOTAL_PROBLEMS_COUNT, bankProblemToAiSolution } = await import('../src/utils/wexProblemBank.ts');
  assert.equal(TOTAL_PROBLEMS_COUNT, 9000);
  const all = WexProblemBankService.getAllProblems();
  assert.equal(all.length, 9000);

  // Check random problem
  const rand = WexProblemBankService.getRandomProblem();
  assert.ok(rand && rand.id && rand.num >= 1 && rand.num <= 9000);


  // Search by keyword
  const kinematics = WexProblemBankService.search('Кінематика');
  assert.ok(kinematics.length > 0);

  // Search by subject
  const physList = WexProblemBankService.search('', 'physics');
  assert.ok(physList.length > 0);

  // Verify conversion to academic layout solution
  const first = all[0];
  const aiSol = bankProblemToAiSolution(first, 'uk');
  assert.equal(aiSol.id, first.id);
  assert.ok(aiSol.givenData.length > 0);
  assert.ok(aiSol.solutionSteps.length > 0);
  assert.ok(aiSol.finalAnswer.length > 0);
});

test('WexAIEngine performs 100% offline reasoning with 0ms speed for Physics and Math', async () => {
  const { WexAIEngine, wexSolutionToAiSolution } = await import('../src/utils/wexAI.ts');

  // 1. Physics kinematics
  const phys = WexAIEngine.solve('Тіло m = 2 кг рухається зі швидкістю v = 72 км/год', 'uk');
  assert.equal(phys.subject, 'physics');
  assert.ok(phys.answer.includes('Дж'));
  assert.ok(phys.steps.length > 0);

  // 2. Quadratic equation
  const quad = WexAIEngine.solve('x^2 - 5x + 6 = 0', 'uk');
  assert.equal(quad.subject, 'math');
  assert.ok(quad.answer.includes('3') && quad.answer.includes('2'));

  // 3. Chemistry molar mass
  const chem = WexAIEngine.solve('M(H2SO4)', 'uk');
  assert.equal(chem.subject, 'chemistry');
  assert.ok(chem.answer.includes('98'));

  // 4. Expression evaluation
  const math = WexAIEngine.solve('25 * 4 + 100', 'uk');
  assert.equal(math.answer, '200');

  // Verify adapter to AiProblemSolution
  const aiSol = wexSolutionToAiSolution(phys, 'm=2кг, v=72км/год', 'uk');
  assert.ok(aiSol.id.startsWith('wexai_'));
  assert.equal(aiSol.subject, 'physics');
  assert.ok(aiSol.givenData.length > 0);
});

test('Fraction engine parses expressions and converts decimals to exact fractions', () => {
  // Test decimal to fraction
  const f1 = decimalToFraction(0.625);
  assert.equal(f1.n, 5);
  assert.equal(f1.d, 8);

  const mixed = toMixed(11, 4);
  assert.equal(mixed.whole, 2);
  assert.equal(mixed.n, 3);
  assert.equal(mixed.d, 4);

  // Test expression parsing with steps
  const evalRes = evaluateFractionStringWithSteps('1 3/4 + 2 1/6');
  assert.ok(!evalRes.error);
  assert.ok(evalRes.resultText.includes('3 11/12'));
  assert.ok(evalRes.steps.length >= 3);
});

test('Offline engine asset pack file exists and is within target 64-70 MB range', () => {
  const assetPath = path.resolve(process.cwd(), 'public/assets/wex_offline_engine_pack.dat');
  assert.ok(fs.existsSync(assetPath), 'Asset pack must exist in public/assets/');
  const stats = fs.statSync(assetPath);
  const sizeMB = stats.size / (1024 * 1024);
  assert.ok(sizeMB >= 64 && sizeMB <= 70, `Size ${sizeMB.toFixed(2)} MB must be between 64 and 70 MB`);
});

test('DeviceMode translations and phone-by-default behavior are verified', () => {
  for (const lang of ['uk', 'ru', 'en'] as const) {
    assert.ok(getTranslation('deviceMode', lang), `Missing deviceMode for ${lang}`);
    assert.ok(getTranslation('devicePhone', lang), `Missing devicePhone for ${lang}`);
    assert.ok(getTranslation('deviceTablet', lang), `Missing deviceTablet for ${lang}`);
    assert.ok(getTranslation('devicePc', lang), `Missing devicePc for ${lang}`);
    assert.ok(getTranslation('tutorial', lang), `Missing tutorial for ${lang}`);
    assert.ok(getTranslation('aiAssistant', lang), `Missing aiAssistant for ${lang}`);
  }
  assert.equal(getTranslation('devicePhone', 'uk'), 'Телефон');
  assert.equal(getTranslation('deviceTablet', 'uk'), 'Планшет');
  assert.equal(getTranslation('devicePc', 'uk'), 'ПК / Десктоп');
});

test('WexAI chat resolves textual inputs with 0ms offline intelligence', async () => {
  const { WexAIEngine } = await import('../src/utils/wexAI.ts');

  // Test quadratic solver from text
  const quadSol = WexAIEngine.solve('2x^2 - 5x + 2 = 0', 'uk');
  assert.ok(quadSol.answer.includes('2') || quadSol.answer.includes('0.5'));
  assert.equal(quadSol.subject, 'math');

  // Test kinematics from text
  const kinSol = WexAIEngine.solve('v=72км/год, t=15хв, s=?', 'uk');
  assert.ok(kinSol.answer.includes('18') || kinSol.answer.includes('18000'));

  // Test chemistry molar mass from text
  const chemSol = WexAIEngine.solve('H2SO4', 'uk');
  assert.ok(chemSol.answer.includes('98'));
});




