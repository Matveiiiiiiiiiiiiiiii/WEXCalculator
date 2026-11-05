import { AiProblemSolution, ProblemSubject } from '../types/calculator';
import { Language, getTranslation } from './i18n';
import {
  solveQuadratic,
  solveRightTriangle,
  solveCircleAndSphere,
  calculateMolarMass,
  gcd,
  lcm,
} from './mathExtended';

/**
 * Intelligent Local Problem Solver Fallback
 * Provides instant, offline academic step-by-step solutions for Physics, Math, Chemistry, Geometry, and Finance
 * Formatted with "Дано", "СІ", "Знайти", "Закони", "Розв'язання", and "Блок обчислень".
 */
export function solveProblemLocally(input: string, lang: Language): AiProblemSolution | null {
  if (!input || input.trim().length === 0) return null;
  const text = input.trim();
  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  // 1. Check for Quadratic Equation: ax² + bx + c = 0 or standard variations
  const quadMatch = text.match(/([+-]?\s*\d*\.?\d*)\s*x\s*(?:\^2|²|2)?\s*([+-]\s*\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*=\s*0/i);
  if (quadMatch) {
    let aStr = quadMatch[1].replace(/\s+/g, '');
    let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    let bStr = quadMatch[2].replace(/\s+/g, '');
    let b = bStr === '' || bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
    let cStr = quadMatch[3].replace(/\s+/g, '');
    let c = parseFloat(cStr);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
      const q = solveQuadratic(a, b, c);
      return {
        id: 'local_quad_' + Date.now(),
        subject: 'math',
        subjectTitle: isUk ? 'Алгебра: Квадратне рівняння' : isEn ? 'Algebra: Quadratic Equation' : 'Алгебра: Квадратное уравнение',
        topic: isUk ? `Розв'язання рівняння ${a}x² + (${b})x + (${c}) = 0` : `Solving equation ${a}x² + (${b})x + (${c}) = 0`,
        problemStatement: text,
        givenData: [
          { label: isUk ? 'Коефіцієнт a' : isEn ? 'Coefficient a' : 'Коэффициент a', symbol: 'a', value: `${a}`, raw: `${a}`, unit: '' },
          { label: isUk ? 'Коефіцієнт b' : isEn ? 'Coefficient b' : 'Коэффициент b', symbol: 'b', value: `${b}`, raw: `${b}`, unit: '' },
          { label: isUk ? 'Вільний член c' : isEn ? 'Constant c' : 'Свободный член c', symbol: 'c', value: `${c}`, raw: `${c}`, unit: '' },
        ],
        siConversions: [],
        toFind: [
          { symbol: 'D', description: isUk ? 'Дискримінант' : isEn ? 'Discriminant' : 'Дискриминант' },
          { symbol: 'x₁, x₂', description: isUk ? 'Корені рівняння' : isEn ? 'Roots of equation' : 'Корни уравнения' },
        ],
        lawsAndFormulas: [
          'D = b² - 4ac',
          'x₁,₂ = (-b ± √D) / (2a)',
        ],
        solutionSteps: q.steps.map((st, i) => ({
          stepNumber: i + 1,
          title: isUk ? `Крок ${i + 1}` : `Step ${i + 1}`,
          explanation: st,
          formula: i === 0 ? 'D = b² - 4ac' : 'x = (-b ± √D) / 2a',
          calculation: st,
        })),
        finalAnswer: q.hasRealRoots ? `x₁ = ${q.x1}, x₂ = ${q.x2}` : `x₁,₂ = ${q.x1}`,
        computationBlock: {
          primaryExpression: `(-(${b}) + sqrt(${q.d})) / (2 * ${a})`,
          recommendedMode: 'standard',
          graphSuggestion: `${a}*x^2 + ${b}*x + ${c}`,
          computations: [
            { id: 'c1', name: 'Дискримінант D', formula: 'b^2 - 4ac', expression: `(${b})^2 - 4*${a}*${c}`, result: `${q.d}`, unit: '' },
            { id: 'c2', name: 'Корінь x₁', formula: '(-b + sqrt(D)) / 2a', expression: `(-(${b}) + sqrt(${q.d})) / (2*${a})`, result: q.x1, unit: '' },
            { id: 'c3', name: 'Корінь x₂', formula: '(-b - sqrt(D)) / 2a', expression: `(-(${b}) - sqrt(${q.d})) / (2*${a})`, result: q.x2, unit: '' },
          ],
        },
        confidence: 0.99,
      };
    }
  }

  // 2. Check for Physics: Mass & Speed (Kinetic Energy & Stopping Work)
  const massMatch = text.match(/(?:m|маса|масса|mass)\s*=\s*(\d+\.?\d*)\s*(кг|kg|г|g)?/i);
  const speedMatch = text.match(/(?:v|швидкість|скорость|speed)\s*=\s*(\d+\.?\d*)\s*(км\/год|км\/ч|km\/h|м\/с|m\/s)?/i);
  if (massMatch && speedMatch) {
    let rawM = parseFloat(massMatch[1]);
    let unitM = (massMatch[2] || 'кг').toLowerCase();
    let rawV = parseFloat(speedMatch[1]);
    let unitV = (speedMatch[2] || 'км/год').toLowerCase();

    let mSi = unitM === 'г' || unitM === 'g' ? rawM / 1000 : rawM;
    let vSi = unitV.includes('км') || unitV.includes('km') ? rawV / 3.6 : rawV;
    let ek = (mSi * vSi * vSi) / 2;
    let workA = -ek;

    const siList: string[] = [];
    if (unitM === 'г' || unitM === 'g') siList.push(`m = ${rawM} г = ${mSi} кг`);
    if (unitV.includes('км') || unitV.includes('km')) siList.push(`v = ${rawV} км/год = ${vSi.toFixed(2)} м/с`);

    return {
      id: 'local_phys_ek_' + Date.now(),
      subject: 'physics',
      subjectTitle: isUk ? 'Фізика: Кінематика та енергія' : isEn ? 'Physics: Kinematics & Energy' : 'Физика: Кинематика и энергия',
      topic: isUk ? 'Кінетична енергія тіла та робота гальмування' : 'Kinetic Energy & Stopping Work',
      problemStatement: text,
      givenData: [
        { label: isUk ? 'Маса тіла' : isEn ? 'Body mass' : 'Масса тела', symbol: 'm', value: `${rawM} ${unitM}`, raw: `${rawM}`, unit: unitM },
        { label: isUk ? 'Швидкість руху' : isEn ? 'Velocity' : 'Скорость движения', symbol: 'v', value: `${rawV} ${unitV}`, raw: `${rawV}`, unit: unitV },
        { label: isUk ? 'Кінцева швидкість' : isEn ? 'Final velocity' : 'Конечная скорость', symbol: 'v_k', value: '0 м/с', raw: '0', unit: 'м/с' },
      ],
      siConversions: siList,
      toFind: [
        { symbol: 'Ek — ?', description: isUk ? 'Кінетична енергія тіла' : isEn ? 'Kinetic energy' : 'Кинетическая энергия тела' },
        { symbol: 'A — ?', description: isUk ? 'Робота сили для повної зупинки' : isEn ? 'Stopping work' : 'Работа силы до остановки' },
      ],
      lawsAndFormulas: [
        'Ek = (m · v²) / 2',
        'A = ΔEk = Ek₂ - Ek₁ = -Ek',
        '[Ek] = кг · (м/с)² = Дж',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Зведення величин до СІ' : 'Conversion to SI units',
          explanation: isUk
            ? `Швидкість: v = ${rawV} км/год = ${vSi.toFixed(2)} м/с. Маса: m = ${mSi} кг.`
            : `Speed: v = ${rawV} km/h = ${vSi.toFixed(2)} m/s. Mass: m = ${mSi} kg.`,
          formula: 'v_SI = v_kmh / 3.6',
          calculation: `${rawV} / 3.6 = ${vSi.toFixed(2)} м/с`,
        },
        {
          stepNumber: 2,
          title: isUk ? 'Обчислення кінетичної енергії' : 'Calculating kinetic energy',
          explanation: isUk
            ? `Підставляємо значення в формулу: Ek = (${mSi} · ${vSi.toFixed(2)}²) / 2 = ${ek.toFixed(2)} Дж.`
            : `Ek = (${mSi} * ${vSi.toFixed(2)}²) / 2 = ${ek.toFixed(2)} J.`,
          formula: 'Ek = (m * v^2) / 2',
          calculation: `(${mSi} * ${(vSi * vSi).toFixed(2)}) / 2 = ${ek.toFixed(2)} Дж`,
          unitCheck: '[Ek] = Дж',
        },
        {
          stepNumber: 3,
          title: isUk ? 'Робота гальмівної сили' : 'Stopping work done',
          explanation: isUk
            ? `За теоремою про кінетичну енергію: A = Ek₂ - Ek₁ = 0 - ${ek.toFixed(2)} = ${workA.toFixed(2)} Дж.`
            : `A = Ek_final - Ek_initial = -${ek.toFixed(2)} J.`,
          formula: 'A = -Ek',
          calculation: `A = -${ek.toFixed(2)} Дж`,
          unitCheck: '[A] = Дж',
        },
      ],
      finalAnswer: isUk ? `Ek = ${ek.toFixed(2)} Дж; A = ${workA.toFixed(2)} Дж` : `Ek = ${ek.toFixed(2)} J; A = ${workA.toFixed(2)} J`,
      computationBlock: {
        primaryExpression: `(${mSi} * ${vSi.toFixed(2)}^2) / 2`,
        recommendedMode: 'standard',
        graphSuggestion: `${mSi} * x^2 / 2`,
        computations: [
          { id: 'c1', name: 'Кінетична енергія Ek', formula: '(m * v^2) / 2', expression: `(${mSi} * ${vSi.toFixed(2)}^2) / 2`, result: `${ek.toFixed(2)}`, unit: 'Дж' },
          { id: 'c2', name: 'Робота сили зупинки A', formula: '-Ek', expression: `-${ek.toFixed(2)}`, result: `${workA.toFixed(2)}`, unit: 'Дж' },
        ],
      },
      confidence: 0.99,
    };
  }

  // 3. Check for Right Triangle: a = ..., b = ...
  const legAMatch = text.match(/(?:катет\s*a|leg\s*a|a)\s*=\s*(\d+\.?\d*)\s*(см|cm|м|m)?/i);
  const legBMatch = text.match(/(?:катет\s*b|leg\s*b|b)\s*=\s*(\d+\.?\d*)\s*(см|cm|м|m)?/i);
  if (legAMatch && legBMatch) {
    const a = parseFloat(legAMatch[1]);
    const b = parseFloat(legBMatch[1]);
    const tri = solveRightTriangle(a, b);
    const unit = legAMatch[2] || 'см';

    return {
      id: 'local_geom_tri_' + Date.now(),
      subject: 'geometry',
      subjectTitle: isUk ? 'Геометрія: Прямокутний трикутник' : 'Geometry: Right Triangle',
      topic: isUk ? 'Теорема Піфагора, площа та периметр' : 'Pythagorean Theorem, Area & Perimeter',
      problemStatement: text,
      givenData: [
        { label: isUk ? 'Катет a' : 'Leg a', symbol: 'a', value: `${a} ${unit}`, raw: `${a}`, unit },
        { label: isUk ? 'Катет b' : 'Leg b', symbol: 'b', value: `${b} ${unit}`, raw: `${b}`, unit },
      ],
      siConversions: [],
      toFind: [
        { symbol: 'c — ?', description: isUk ? 'Гіпотенуза' : 'Hypotenuse' },
        { symbol: 'S — ?', description: isUk ? 'Площа' : 'Area' },
        { symbol: 'P — ?', description: isUk ? 'Периметр' : 'Perimeter' },
      ],
      lawsAndFormulas: [
        'c = √(a² + b²)',
        'S = (a · b) / 2',
        'P = a + b + c',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Обчислення гіпотенузи c' : 'Hypotenuse calculation',
          explanation: `c = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = ${tri.hypotenuse} ${unit}.`,
          formula: 'c = sqrt(a^2 + b^2)',
          calculation: `sqrt(${a}^2 + ${b}^2) = ${tri.hypotenuse} ${unit}`,
        },
        {
          stepNumber: 2,
          title: isUk ? 'Обчислення площі S' : 'Area calculation',
          explanation: `S = (${a} · ${b}) / 2 = ${tri.area} ${unit}².`,
          formula: 'S = (a * b) / 2',
          calculation: `(${a} * ${b}) / 2 = ${tri.area} ${unit}²`,
        },
        {
          stepNumber: 3,
          title: isUk ? 'Обчислення периметра P' : 'Perimeter calculation',
          explanation: `P = ${a} + ${b} + ${tri.hypotenuse} = ${tri.perimeter} ${unit}.`,
          formula: 'P = a + b + c',
          calculation: `${a} + ${b} + ${tri.hypotenuse} = ${tri.perimeter} ${unit}`,
        },
      ],
      finalAnswer: `c = ${tri.hypotenuse} ${unit}; S = ${tri.area} ${unit}²; P = ${tri.perimeter} ${unit}`,
      computationBlock: {
        primaryExpression: `sqrt(${a}^2 + ${b}^2)`,
        recommendedMode: 'scientific',
        graphSuggestion: `sqrt(${tri.hypotenuse}^2 - x^2)`,
        computations: [
          { id: 'c1', name: 'Гіпотенуза c', formula: 'sqrt(a^2 + b^2)', expression: `sqrt(${a}^2 + ${b}^2)`, result: `${tri.hypotenuse}`, unit },
          { id: 'c2', name: 'Площа S', formula: '(a * b) / 2', expression: `(${a} * ${b}) / 2`, result: `${tri.area}`, unit: `${unit}²` },
          { id: 'c3', name: 'Периметр P', formula: 'a + b + c', expression: `${a} + ${b} + ${tri.hypotenuse}`, result: `${tri.perimeter}`, unit },
        ],
      },
      confidence: 0.99,
    };
  }

  // 4. Check for Chemical Formula Molar Mass: e.g. H2SO4, NaOH, CaCO3, etc.
  const chemMatch = text.match(/(?:молярна\s*маса|molar\s*mass|M|молярная\s*масса)\s*(?:для|of)?\s*([A-Z][A-Za-z0-9\(\)]+)/i) ||
                    text.match(/^[A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*|\([A-Z][a-z]?\d*\)\d*)+$/);
  if (chemMatch) {
    const formulaStr = chemMatch[1] || chemMatch[0];
    const molar = calculateMolarMass(formulaStr);
    if (molar.molarMass > 0) {
      return {
        id: 'local_chem_molar_' + Date.now(),
        subject: 'chemistry',
        subjectTitle: isUk ? 'Хімія: Молярна маса' : 'Chemistry: Molar Mass',
        topic: isUk ? `Розрахунок молярної маси ${formulaStr}` : `Molar mass calculation of ${formulaStr}`,
        problemStatement: text,
        givenData: molar.elements.map((el) => ({
          label: `Ar(${el.symbol})`,
          symbol: `Ar(${el.symbol})`,
          value: `${el.atomicMass.toFixed(2)} г/моль (×${el.count})`,
          raw: `${el.atomicMass}`,
          unit: 'г/моль',
        })),
        siConversions: [],
        toFind: [
          { symbol: `M(${formulaStr}) — ?`, description: isUk ? 'Молярна маса речовини' : 'Molar mass of substance' },
        ],
        lawsAndFormulas: [
          'M = Σ (n_i · Ar_i)',
          'w(X) = (n_X · Ar_X / M) · 100%',
        ],
        solutionSteps: [
          {
            stepNumber: 1,
            title: isUk ? 'Підсумовування атомних мас' : 'Sum of atomic masses',
            explanation: `M(${formulaStr}) = ${molar.elements.map((e) => `${e.atomicMass}·${e.count}`).join(' + ')} = ${molar.molarMass.toFixed(3)} г/моль.`,
            formula: 'M = Σ Ar(element) * count',
            calculation: molar.elements.map((e) => `${e.atomicMass}·${e.count}`).join(' + '),
            unitCheck: '[M] = г/моль',
          },
          {
            stepNumber: 2,
            title: isUk ? 'Масові частки елементів' : 'Mass fractions of elements',
            explanation: molar.elements.map((el) => `${el.symbol}: ${el.massPercent.toFixed(1)}%`).join(', '),
            formula: 'w = (m_el / M_total) * 100%',
            calculation: molar.elements.map((el) => `w(${el.symbol}) = ${(el.count * el.atomicMass).toFixed(2)} / ${molar.molarMass.toFixed(2)} = ${el.massPercent.toFixed(1)}%`).join('; '),
          },
        ],
        finalAnswer: `M(${formulaStr}) = ${molar.molarMass.toFixed(3)} г/моль`,
        computationBlock: {
          primaryExpression: molar.elements.map((e) => `${e.atomicMass}·${e.count}`).join(' + '),
          recommendedMode: 'standard',
          computations: [
            { id: 'c1', name: `Молярна маса ${formulaStr}`, formula: 'Σ (Ar * count)', expression: molar.elements.map((e) => `${e.atomicMass}·${e.count}`).join(' + '), result: `${molar.molarMass.toFixed(3)}`, unit: 'г/моль' },
          ],
        },
        confidence: 0.99,
      };
    }
  }

  // 5. General Arithmetic / Mathematical Expression Fallback
  return null;
}
