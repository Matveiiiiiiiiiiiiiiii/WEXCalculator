/**
 * Comprehensive extended math, physics, chemistry and geometry utilities
 * Powers WexCalculator's 50+ quick answer presets, instant solvers, and advanced tools.
 */

// Greatest Common Divisor (НСД / НОД)
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Least Common Multiple (НСК / НОК)
export function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// Prime Factorization (Розклад на прості множники)
export function primeFactorization(num: number): { factors: { prime: number; power: number }[]; formula: string } {
  let n = Math.abs(Math.round(num));
  if (n <= 1) return { factors: [{ prime: n, power: 1 }], formula: `${n}` };

  const counts: Record<number, number> = {};
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      counts[d] = (counts[d] || 0) + 1;
      n /= d;
    }
    d = d === 2 ? 3 : d + 2;
  }
  if (n > 1) {
    counts[n] = (counts[n] || 0) + 1;
  }

  const factors = Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((prime) => ({ prime, power: counts[prime] }));

  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  const toSup = (p: number) => p === 1 ? '' : String(p).split('').map(c => superscripts[c] || c).join('');
  const formula = factors.map(f => `${f.prime}${toSup(f.power)}`).join(' × ');

  return { factors, formula };
}

// Quadratic Equation Solver: ax² + bx + c = 0
export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  d: number;
  hasRealRoots: boolean;
  x1: string;
  x2: string;
  vertexX: number;
  vertexY: number;
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    // Linear bx + c = 0 -> x = -c/b
    const x = b !== 0 ? -c / b : 0;
    return {
      a, b, c, d: 0,
      hasRealRoots: b !== 0,
      x1: b !== 0 ? x.toFixed(4).replace(/\.?0+$/, '') : 'Немає розвʼязків',
      x2: b !== 0 ? x.toFixed(4).replace(/\.?0+$/, '') : 'Немає розвʼязків',
      vertexX: 0,
      vertexY: 0,
      steps: [`Рівняння лінійне: ${b}x + ${c} = 0 => x = ${-c}/${b} = ${x}`]
    };
  }

  const d = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = -d / (4 * a);
  const steps: string[] = [
    `Дискримінант D = b² - 4ac = (${b})² - 4·(${a})·(${c}) = ${b * b} - ${4 * a * c} = ${d}`,
  ];

  if (d > 0) {
    const sqrtD = Math.sqrt(d);
    const x1Val = (-b + sqrtD) / (2 * a);
    const x2Val = (-b - sqrtD) / (2 * a);
    steps.push(`√D = √${d} ≈ ${sqrtD.toFixed(4)}`);
    steps.push(`x₁ = (-b + √D) / (2a) = (${-b} + ${sqrtD.toFixed(3)}) / ${2 * a} = ${x1Val.toFixed(4).replace(/\.?0+$/, '')}`);
    steps.push(`x₂ = (-b - √D) / (2a) = (${-b} - ${sqrtD.toFixed(3)}) / ${2 * a} = ${x2Val.toFixed(4).replace(/\.?0+$/, '')}`);
    return {
      a, b, c, d,
      hasRealRoots: true,
      x1: x1Val.toFixed(4).replace(/\.?0+$/, ''),
      x2: x2Val.toFixed(4).replace(/\.?0+$/, ''),
      vertexX: Number(vertexX.toFixed(4)),
      vertexY: Number(vertexY.toFixed(4)),
      steps,
    };
  } else if (d === 0) {
    const xVal = -b / (2 * a);
    steps.push(`D = 0 -> один дійсний корінь (кратності 2)`);
    steps.push(`x = -b / (2a) = ${-b} / ${2 * a} = ${xVal.toFixed(4).replace(/\.?0+$/, '')}`);
    return {
      a, b, c, d,
      hasRealRoots: true,
      x1: xVal.toFixed(4).replace(/\.?0+$/, ''),
      x2: xVal.toFixed(4).replace(/\.?0+$/, ''),
      vertexX: Number(vertexX.toFixed(4)),
      vertexY: Number(vertexY.toFixed(4)),
      steps,
    };
  } else {
    const realPart = (-b / (2 * a)).toFixed(4).replace(/\.?0+$/, '');
    const imagPart = (Math.sqrt(-d) / (2 * Math.abs(a))).toFixed(4).replace(/\.?0+$/, '');
    steps.push(`D < 0 -> комплексні спряжені корені`);
    steps.push(`x₁,₂ = ${realPart} ± ${imagPart}i`);
    return {
      a, b, c, d,
      hasRealRoots: false,
      x1: `${realPart} + ${imagPart}i`,
      x2: `${realPart} - ${imagPart}i`,
      vertexX: Number(vertexX.toFixed(4)),
      vertexY: Number(vertexY.toFixed(4)),
      steps,
    };
  }
}

// Right Triangle / Pythagorean Solver
export function solveRightTriangle(legA: number, legB: number): {
  hypotenuse: number;
  area: number;
  perimeter: number;
  heightH: number;
  angleAlphaDeg: number;
  angleBetaDeg: number;
} {
  const c = Math.sqrt(legA * legA + legB * legB);
  const area = (legA * legB) / 2;
  const perimeter = legA + legB + c;
  const heightH = (legA * legB) / c;
  const alphaRad = Math.asin(legA / c);
  const betaRad = Math.PI / 2 - alphaRad;
  return {
    hypotenuse: Number(c.toFixed(4)),
    area: Number(area.toFixed(4)),
    perimeter: Number(perimeter.toFixed(4)),
    heightH: Number(heightH.toFixed(4)),
    angleAlphaDeg: Number(((alphaRad * 180) / Math.PI).toFixed(2)),
    angleBetaDeg: Number(((betaRad * 180) / Math.PI).toFixed(2)),
  };
}

// Circle and Sphere Geometry
export function solveCircleAndSphere(radius: number): {
  circumference: number;
  circleArea: number;
  sphereVolume: number;
  sphereSurface: number;
} {
  const r = Math.max(0, radius);
  return {
    circumference: Number((2 * Math.PI * r).toFixed(4)),
    circleArea: Number((Math.PI * r * r).toFixed(4)),
    sphereVolume: Number(((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(4)),
    sphereSurface: Number((4 * Math.PI * r * r).toFixed(4)),
  };
}

// Body Mass Index (BMI / ІМТ)
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  idealWeightMin: number;
  idealWeightMax: number;
} {
  const hM = heightCm / 100;
  if (hM <= 0 || weightKg <= 0) return { bmi: 0, category: 'normal', idealWeightMin: 0, idealWeightMax: 0 };
  const bmi = weightKg / (hM * hM);
  let category: 'underweight' | 'normal' | 'overweight' | 'obese' = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    idealWeightMin: Number((18.5 * hM * hM).toFixed(1)),
    idealWeightMax: Number((24.9 * hM * hM).toFixed(1)),
  };
}

// Fuel and Trip Cost
export function calculateFuelTrip(distanceKm: number, consumptionPer100km: number, fuelPricePerLiter: number): {
  litersNeeded: number;
  totalCost: number;
  costPerKm: number;
} {
  const liters = (distanceKm * consumptionPer100km) / 100;
  const cost = liters * fuelPricePerLiter;
  const costKm = distanceKm > 0 ? cost / distanceKm : 0;
  return {
    litersNeeded: Number(liters.toFixed(2)),
    totalCost: Number(cost.toFixed(2)),
    costPerKm: Number(costKm.toFixed(2)),
  };
}

// Tip and Bill Split
export function calculateTipSplit(billAmount: number, tipPercent: number, numPeople: number): {
  tipTotal: number;
  billWithTip: number;
  perPerson: number;
  tipPerPerson: number;
} {
  const tip = (billAmount * tipPercent) / 100;
  const total = billAmount + tip;
  const count = Math.max(1, Math.round(numPeople));
  return {
    tipTotal: Number(tip.toFixed(2)),
    billWithTip: Number(total.toFixed(2)),
    perPerson: Number((total / count).toFixed(2)),
    tipPerPerson: Number((tip / count).toFixed(2)),
  };
}

// Roman Numerals Converter
const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

export function toRoman(num: number): string {
  let n = Math.floor(num);
  if (n <= 0 || n > 3999) return 'N/A';
  let result = '';
  for (const [val, roman] of ROMAN_MAP) {
    while (n >= val) {
      result += roman;
      n -= val;
    }
  }
  return result;
}

export function fromRoman(roman: string): number {
  const map: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };
  const clean = roman.toUpperCase().trim();
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const cur = map[clean[i]] || 0;
    const next = map[clean[i + 1]] || 0;
    if (next > cur) {
      total += (next - cur);
      i++;
    } else {
      total += cur;
    }
  }
  return total;
}

// Chemical Periodic Table and Molar Mass Calculator
export interface ElementMassInfo {
  symbol: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  massPercent: number;
}

export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974,
  S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867,
  V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
  Zn: 65.38, Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Ag: 107.87,
  Cd: 112.41, Sn: 118.71, Sb: 121.76, I: 126.90, Ba: 137.33, W: 183.84, Pt: 195.08,
  Au: 196.97, Hg: 200.59, Pb: 207.2, Bi: 208.98, U: 238.03
};

export function calculateMolarMass(formula: string): {
  molarMass: number;
  elements: ElementMassInfo[];
  error?: string;
} {
  const clean = formula.trim().replace(/\s+/g, '');
  if (!clean) return { molarMass: 0, elements: [] };

  // Parse parentheses e.g. Ca(OH)2 or Fe2(SO4)3
  const elementCounts: Record<string, number> = {};

  function parseChunk(str: string, multiplier: number = 1) {
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const sym = match[1];
      const count = (match[2] ? parseInt(match[2], 10) : 1) * multiplier;
      elementCounts[sym] = (elementCounts[sym] || 0) + count;
    }
  }

  try {
    let expanded = clean;
    // Replace (Group)N with expanded characters
    const parenRegex = /\(([^()]+)\)(\d*)/g;
    let iterations = 0;
    while (parenRegex.test(expanded) && iterations < 5) {
      iterations++;
      expanded = expanded.replace(parenRegex, (_, inner, numStr) => {
        const mult = numStr ? parseInt(numStr, 10) : 1;
        // repeat inner element tokens
        return inner.replace(/([A-Z][a-z]*)(\d*)/g, (_match: string, s: string, c: string) => {
          const count = (c ? parseInt(c, 10) : 1) * mult;
          return `${s}${count}`;
        });
      });
    }

    parseChunk(expanded, 1);

    let total = 0;
    const elements: ElementMassInfo[] = [];

    for (const [sym, count] of Object.entries(elementCounts)) {
      const mass = ATOMIC_MASSES[sym];
      if (!mass) {
        return { molarMass: 0, elements: [], error: `Невідомий хімічний елемент: ${sym}` };
      }
      const elTotal = mass * count;
      total += elTotal;
    }

    for (const [sym, count] of Object.entries(elementCounts)) {
      const mass = ATOMIC_MASSES[sym];
      const elTotal = mass * count;
      elements.push({
        symbol: sym,
        count,
        atomicMass: mass,
        totalMass: Number(elTotal.toFixed(3)),
        massPercent: total > 0 ? Number(((elTotal / total) * 100).toFixed(2)) : 0,
      });
    }

    return {
      molarMass: Number(total.toFixed(3)),
      elements: elements.sort((a, b) => b.totalMass - a.totalMass),
    };
  } catch {
    return { molarMass: 0, elements: [], error: 'Помилка розбору хімічної формули' };
  }
}

// Statistical dataset calculations
export function calculateDatasetStats(numbers: number[]): {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
} {
  const valid = numbers.filter(Number.isFinite);
  if (valid.length === 0) {
    return { count: 0, sum: 0, mean: 0, median: 0, mode: [], min: 0, max: 0, range: 0, variance: 0, stdDev: 0 };
  }
  const count = valid.length;
  const sum = valid.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  const sorted = [...valid].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const freqs: Record<number, number> = {};
  let maxFreq = 0;
  for (const n of valid) {
    freqs[n] = (freqs[n] || 0) + 1;
    if (freqs[n] > maxFreq) maxFreq = freqs[n];
  }
  const modes = Object.keys(freqs)
    .map(Number)
    .filter((n) => freqs[n] === maxFreq && maxFreq > 1);

  // Variance & Standard Deviation
  const variance = valid.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  return {
    count,
    sum: Number(sum.toFixed(4)),
    mean: Number(mean.toFixed(4)),
    median: Number(median.toFixed(4)),
    mode: modes,
    min,
    max,
    range: Number(range.toFixed(4)),
    variance: Number(variance.toFixed(4)),
    stdDev: Number(stdDev.toFixed(4)),
  };
}

// 2x2 and 3x3 Matrix Determinant & Inversion
export function determinant2x2(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

export function inverse2x2(a: number, b: number, c: number, d: number): {
  det: number;
  inv?: [[number, number], [number, number]];
} {
  const det = determinant2x2(a, b, c, d);
  if (det === 0) return { det };
  return {
    det,
    inv: [
      [Number((d / det).toFixed(4)), Number((-b / det).toFixed(4))],
      [Number((-c / det).toFixed(4)), Number((a / det).toFixed(4))]
    ]
  };
}

// Physical Constants Lookup List
export interface PhysicalConstant {
  id: string;
  symbol: string;
  nameUk: string;
  nameRu: string;
  nameEn: string;
  value: string;
  numericVal: number;
  unit: string;
}

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  {
    id: 'c',
    symbol: 'c',
    nameUk: 'Швидкість світла у вакуумі',
    nameRu: 'Скорость света в вакууме',
    nameEn: 'Speed of light in vacuum',
    value: '299 792 458',
    numericVal: 299792458,
    unit: 'м/с',
  },
  {
    id: 'g',
    symbol: 'g',
    nameUk: 'Прискорення вільного падіння',
    nameRu: 'Ускорение свободного падения',
    nameEn: 'Standard gravity',
    value: '9.80665',
    numericVal: 9.80665,
    unit: 'м/с²',
  },
  {
    id: 'G',
    symbol: 'G',
    nameUk: 'Гравітаційна стала',
    nameRu: 'Гравитационная постоянная',
    nameEn: 'Gravitational constant',
    value: '6.67430 × 10⁻¹¹',
    numericVal: 6.6743e-11,
    unit: 'Н·м²/кг²',
  },
  {
    id: 'h',
    symbol: 'h',
    nameUk: 'Стала Планка',
    nameRu: 'Постоянная Планка',
    nameEn: 'Planck constant',
    value: '6.62607 × 10⁻³⁴',
    numericVal: 6.62607e-34,
    unit: 'Дж·с',
  },
  {
    id: 'hbar',
    symbol: 'ħ',
    nameUk: 'Зведена стала Планка (Дірака)',
    nameRu: 'Приведенная постоянная Планка',
    nameEn: 'Reduced Planck constant',
    value: '1.05457 × 10⁻³⁴',
    numericVal: 1.05457e-34,
    unit: 'Дж·с',
  },
  {
    id: 'NA',
    symbol: 'N_A',
    nameUk: 'Число Авогадро',
    nameRu: 'Постоянная Авогадро',
    nameEn: 'Avogadro constant',
    value: '6.02214 × 10²³',
    numericVal: 6.02214e23,
    unit: 'моль⁻¹',
  },
  {
    id: 'R',
    symbol: 'R',
    nameUk: 'Універсальна газова стала',
    nameRu: 'Универсальная газовая постоянная',
    nameEn: 'Molar gas constant',
    value: '8.31446',
    numericVal: 8.31446,
    unit: 'Дж/(моль·К)',
  },
  {
    id: 'k',
    symbol: 'k',
    nameUk: 'Стала Больцмана',
    nameRu: 'Постоянная Больцмана',
    nameEn: 'Boltzmann constant',
    value: '1.38065 × 10⁻²³',
    numericVal: 1.38065e-23,
    unit: 'Дж/К',
  },
  {
    id: 'e',
    symbol: 'e',
    nameUk: 'Елементарний електричний заряд',
    nameRu: 'Элементарный электрический заряд',
    nameEn: 'Elementary charge',
    value: '1.60218 × 10⁻¹⁹',
    numericVal: 1.60218e-19,
    unit: 'Кл',
  },
  {
    id: 'eps0',
    symbol: 'ε₀',
    nameUk: 'Електрична стала (вакууму)',
    nameRu: 'Электрическая постоянная',
    nameEn: 'Vacuum electric permittivity',
    value: '8.85419 × 10⁻¹²',
    numericVal: 8.85419e-12,
    unit: 'Ф/м',
  },
  {
    id: 'mu0',
    symbol: 'μ₀',
    nameUk: 'Магнітна стала (вакууму)',
    nameRu: 'Магнитная постоянная',
    nameEn: 'Vacuum magnetic permeability',
    value: '1.25664 × 10⁻⁶',
    numericVal: 1.25664e-6,
    unit: 'Гн/м',
  },
  {
    id: 'me',
    symbol: 'm_e',
    nameUk: 'Маса спокою електрона',
    nameRu: 'Масса покоя электрона',
    nameEn: 'Electron mass',
    value: '9.10938 × 10⁻³¹',
    numericVal: 9.10938e-31,
    unit: 'кг',
  },
];

// 20. Resistor Color Code (4-band and 5-band)
export const RESISTOR_COLORS = [
  { nameUk: 'Чорний', nameRu: 'Черный', nameEn: 'Black', digit: 0, mult: 1, tol: null, hex: '#18181b', textHex: '#ffffff' },
  { nameUk: 'Коричневий', nameRu: 'Коричневый', nameEn: 'Brown', digit: 1, mult: 10, tol: 1, hex: '#78350f', textHex: '#ffffff' },
  { nameUk: 'Червоний', nameRu: 'Красный', nameEn: 'Red', digit: 2, mult: 100, tol: 2, hex: '#dc2626', textHex: '#ffffff' },
  { nameUk: 'Помаранчевий', nameRu: 'Оранжевый', nameEn: 'Orange', digit: 3, mult: 1000, tol: 0.05, hex: '#ea580c', textHex: '#ffffff' },
  { nameUk: 'Жовтий', nameRu: 'Желтый', nameEn: 'Yellow', digit: 4, mult: 10000, tol: 0.02, hex: '#eab308', textHex: '#000000' },
  { nameUk: 'Зелений', nameRu: 'Зеленый', nameEn: 'Green', digit: 5, mult: 100000, tol: 0.5, hex: '#16a34a', textHex: '#ffffff' },
  { nameUk: 'Синій', nameRu: 'Синий', nameEn: 'Blue', digit: 6, mult: 1000000, tol: 0.25, hex: '#2563eb', textHex: '#ffffff' },
  { nameUk: 'Фіолетовий', nameRu: 'Фиолетовый', nameEn: 'Violet', digit: 7, mult: 10000000, tol: 0.1, hex: '#9333ea', textHex: '#ffffff' },
  { nameUk: 'Сірий', nameRu: 'Серый', nameEn: 'Gray', digit: 8, mult: 100000000, tol: 0.01, hex: '#64748b', textHex: '#ffffff' },
  { nameUk: 'Білий', nameRu: 'Белый', nameEn: 'White', digit: 9, mult: 1000000000, tol: null, hex: '#f8fafc', textHex: '#000000' },
  { nameUk: 'Золотий', nameRu: 'Золотой', nameEn: 'Gold', digit: -1, mult: 0.1, tol: 5, hex: '#d97706', textHex: '#ffffff' },
  { nameUk: 'Срібний', nameRu: 'Серебряный', nameEn: 'Silver', digit: -1, mult: 0.01, tol: 10, hex: '#94a3b8', textHex: '#000000' },
];

export function decodeResistor(b1: number, b2: number, multIndex: number, tolIndex: number, b3?: number): {
  resistanceOhms: number;
  formatted: string;
  tolerancePercent: number;
} {
  let baseVal = 0;
  if (b3 !== undefined && b3 >= 0) {
    baseVal = b1 * 100 + b2 * 10 + b3;
  } else {
    baseVal = b1 * 10 + b2;
  }
  const multiplier = RESISTOR_COLORS[multIndex]?.mult ?? 1;
  const ohms = baseVal * multiplier;
  const tolerancePercent = RESISTOR_COLORS[tolIndex]?.tol ?? 5;

  let formatted = '';
  if (ohms >= 1e6) {
    formatted = `${(ohms / 1e6).toFixed(2).replace(/\.?0+$/, '')} MΩ`;
  } else if (ohms >= 1e3) {
    formatted = `${(ohms / 1e3).toFixed(2).replace(/\.?0+$/, '')} kΩ`;
  } else {
    formatted = `${ohms.toFixed(2).replace(/\.?0+$/, '')} Ω`;
  }

  return { resistanceOhms: ohms, formatted, tolerancePercent };
}

// 21. 3D Vector Operations
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export function vector3dOperations(v1: Vector3D, v2: Vector3D): {
  dotProduct: number;
  crossProduct: Vector3D;
  mag1: number;
  mag2: number;
  angleDeg: number;
  sum: Vector3D;
  diff: Vector3D;
} {
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const cross: Vector3D = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  let angleDeg = 0;
  if (mag1 > 0 && mag2 > 0) {
    const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
  }
  return {
    dotProduct: Number(dot.toFixed(4)),
    crossProduct: {
      x: Number(cross.x.toFixed(4)),
      y: Number(cross.y.toFixed(4)),
      z: Number(cross.z.toFixed(4)),
    },
    mag1: Number(mag1.toFixed(4)),
    mag2: Number(mag2.toFixed(4)),
    angleDeg: Number(angleDeg.toFixed(2)),
    sum: { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z },
    diff: { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z },
  };
}

// 22. Projectile Motion (Балістика)
export function solveProjectileMotion(v0: number, angleDeg: number, g = 9.80665): {
  maxHeight: number;
  totalRange: number;
  flightTime: number;
  vx: number;
  vy0: number;
} {
  const rad = (angleDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);
  const flightTime = (2 * vy0) / g;
  const maxHeight = (vy0 * vy0) / (2 * g);
  const totalRange = vx * flightTime;
  return {
    maxHeight: Number(maxHeight.toFixed(3)),
    totalRange: Number(totalRange.toFixed(3)),
    flightTime: Number(flightTime.toFixed(3)),
    vx: Number(vx.toFixed(3)),
    vy0: Number(vy0.toFixed(3)),
  };
}

// 23. Ideal Gas Law: P·V = n·R·T
export function solveIdealGas(
  p_kPa?: number,
  v_L?: number,
  n_mol?: number,
  t_C?: number
): { p_kPa: number; v_L: number; n_mol: number; t_C: number; t_K: number } {
  const R = 8.31446;
  let p = p_kPa;
  let v = v_L;
  let n = n_mol;
  let tK = t_C !== undefined ? t_C + 273.15 : undefined;

  if (p === undefined && v && n && tK) {
    p = (n * R * tK) / v;
  } else if (v === undefined && p && n && tK) {
    v = (n * R * tK) / p;
  } else if (n === undefined && p && v && tK) {
    n = (p * v) / (R * tK);
  } else if (tK === undefined && p && v && n) {
    tK = (p * v) / (n * R);
  }

  const finalTK = tK ?? 293.15;
  return {
    p_kPa: Number((p ?? 101.325).toFixed(3)),
    v_L: Number((v ?? 22.4).toFixed(3)),
    n_mol: Number((n ?? 1).toFixed(3)),
    t_C: Number((finalTK - 273.15).toFixed(2)),
    t_K: Number(finalTK.toFixed(2)),
  };
}

// 24. Radioactive Half-Life & Exponential Decay
export function calculateHalfLife(n0: number, tHalf: number, tElapsed: number): {
  remaining: number;
  decayed: number;
  decayPercent: number;
  halfLivesPassed: number;
} {
  const halfLivesPassed = tHalf > 0 ? tElapsed / tHalf : 0;
  const remaining = n0 * Math.pow(0.5, halfLivesPassed);
  const decayed = n0 - remaining;
  const decayPercent = n0 > 0 ? (decayed / n0) * 100 : 0;
  return {
    remaining: Number(remaining.toFixed(4)),
    decayed: Number(decayed.toFixed(4)),
    decayPercent: Number(decayPercent.toFixed(2)),
    halfLivesPassed: Number(halfLivesPassed.toFixed(3)),
  };
}

// 25. Electricity Cost & Power Consumption
export function calculateElectricityCost(powerWatts: number, hoursPerDay: number, ratePerKWh: number): {
  dailyKWh: number;
  monthlyKWh: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
} {
  const dailyKWh = (powerWatts * hoursPerDay) / 1000;
  const monthlyKWh = dailyKWh * 30;
  const dailyCost = dailyKWh * ratePerKWh;
  const monthlyCost = monthlyKWh * ratePerKWh;
  const yearlyCost = dailyCost * 365;
  return {
    dailyKWh: Number(dailyKWh.toFixed(3)),
    monthlyKWh: Number(monthlyKWh.toFixed(2)),
    dailyCost: Number(dailyCost.toFixed(2)),
    monthlyCost: Number(monthlyCost.toFixed(2)),
    yearlyCost: Number(yearlyCost.toFixed(2)),
  };
}

// 26. Optical Refraction & Snell's Law
export function calculateSnellLaw(n1: number, n2: number, theta1Deg: number): {
  theta2Deg: number | null;
  criticalAngleDeg: number | null;
  totalInternalReflection: boolean;
} {
  const rad1 = (theta1Deg * Math.PI) / 180;
  const sinTheta2 = (n1 / n2) * Math.sin(rad1);
  let theta2Deg: number | null = null;
  let totalInternalReflection = false;

  if (sinTheta2 > 1) {
    totalInternalReflection = true;
  } else {
    theta2Deg = Number(((Math.asin(sinTheta2) * 180) / Math.PI).toFixed(2));
  }

  let criticalAngleDeg: number | null = null;
  if (n1 > n2) {
    criticalAngleDeg = Number(((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(2));
  }

  return { theta2Deg, criticalAngleDeg, totalInternalReflection };
}

// 27. Combinatorics
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= Math.min(n, 170); i++) res *= i;
  return res;
}

export function calculateCombinatorics(n: number, k: number): {
  factorialN: number;
  permutations: number;
  combinations: number;
} {
  n = Math.round(n);
  k = Math.round(k);
  if (k < 0 || k > n) {
    return { factorialN: factorial(n), permutations: 0, combinations: 0 };
  }
  const factN = factorial(n);
  const factK = factorial(k);
  const factNminusK = factorial(n - k);

  const permutations = factN / factNminusK;
  const combinations = factN / (factK * factNminusK);

  return {
    factorialN: factN,
    permutations: Math.round(permutations),
    combinations: Math.round(combinations),
  };
}

// 28. Progressions
export function solveProgressions(
  type: 'arithmetic' | 'geometric',
  a1: number,
  stepOrRatio: number,
  n: number
): {
  an: number;
  sumSn: number;
  terms: number[];
} {
  n = Math.max(1, Math.min(100, Math.round(n)));
  const terms: number[] = [];
  let sumSn = 0;

  if (type === 'arithmetic') {
    const an = a1 + (n - 1) * stepOrRatio;
    sumSn = ((a1 + an) * n) / 2;
    for (let i = 1; i <= Math.min(n, 10); i++) {
      terms.push(a1 + (i - 1) * stepOrRatio);
    }
    return { an: Number(an.toFixed(4)), sumSn: Number(sumSn.toFixed(4)), terms };
  } else {
    const an = a1 * Math.pow(stepOrRatio, n - 1);
    if (stepOrRatio === 1) {
      sumSn = a1 * n;
    } else {
      sumSn = (a1 * (1 - Math.pow(stepOrRatio, n))) / (1 - stepOrRatio);
    }
    for (let i = 1; i <= Math.min(n, 10); i++) {
      terms.push(Number((a1 * Math.pow(stepOrRatio, i - 1)).toFixed(4)));
    }
    return { an: Number(an.toFixed(4)), sumSn: Number(sumSn.toFixed(4)), terms };
  }
}

// 29. Complex Numbers Arithmetic
export function complexArithmetic(
  r1: number,
  i1: number,
  r2: number,
  i2: number,
  op: '+' | '-' | '*' | '/'
): {
  real: number;
  imag: number;
  magnitude: number;
  phaseDeg: number;
  formatted: string;
} {
  let real = 0;
  let imag = 0;

  if (op === '+') {
    real = r1 + r2;
    imag = i1 + i2;
  } else if (op === '-') {
    real = r1 - r2;
    imag = i1 - i2;
  } else if (op === '*') {
    real = r1 * r2 - i1 * i2;
    imag = r1 * i2 + i1 * r2;
  } else {
    const denom = r2 * r2 + i2 * i2;
    if (denom !== 0) {
      real = (r1 * r2 + i1 * i2) / denom;
      imag = (i1 * r2 - r1 * i2) / denom;
    }
  }

  const mag = Math.sqrt(real * real + imag * imag);
  const phaseDeg = (Math.atan2(imag, real) * 180) / Math.PI;
  const sign = imag >= 0 ? '+' : '-';
  const formatted = `${real.toFixed(3).replace(/\.?0+$/, '')} ${sign} ${Math.abs(imag).toFixed(3).replace(/\.?0+$/, '')}i`;

  return {
    real: Number(real.toFixed(4)),
    imag: Number(imag.toFixed(4)),
    magnitude: Number(mag.toFixed(4)),
    phaseDeg: Number(phaseDeg.toFixed(2)),
    formatted,
  };
}

// 30. CAGR & Rule of 72
export function calculateCAGR(initial: number, finalVal: number, years: number): {
  cagrPercent: number;
  totalGrowthPercent: number;
  doublingYearsRule72: number;
} {
  if (initial <= 0 || years <= 0) return { cagrPercent: 0, totalGrowthPercent: 0, doublingYearsRule72: 0 };
  const cagr = Math.pow(finalVal / initial, 1 / years) - 1;
  const cagrPercent = cagr * 100;
  const totalGrowthPercent = ((finalVal - initial) / initial) * 100;
  const doublingYears = cagrPercent > 0 ? 72 / cagrPercent : 0;
  return {
    cagrPercent: Number(cagrPercent.toFixed(2)),
    totalGrowthPercent: Number(totalGrowthPercent.toFixed(2)),
    doublingYearsRule72: Number(doublingYears.toFixed(1)),
  };
}

// 31. Cash Denominations Breakdown
export function calculateDenominations(amount: number): {
  denomination: number;
  count: number;
  subtotal: number;
}[] {
  const bills = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
  let rem = Math.floor(Math.abs(amount));
  const res: { denomination: number; count: number; subtotal: number }[] = [];
  for (const b of bills) {
    const count = Math.floor(rem / b);
    if (count > 0) {
      res.push({ denomination: b, count, subtotal: count * b });
      rem %= b;
    }
  }
  return res;
}

// 32. Regular Polygon Geometry
export function solveRegularPolygon(sides: number, sideLength: number): {
  interiorAngleDeg: number;
  sumAnglesDeg: number;
  perimeter: number;
  inradius: number;
  circumradius: number;
  area: number;
} {
  const n = Math.max(3, Math.round(sides));
  const a = Math.max(0.001, sideLength);
  const sumAngles = (n - 2) * 180;
  const interiorAngle = sumAngles / n;
  const perimeter = n * a;
  const rad = Math.PI / n;
  const inradius = a / (2 * Math.tan(rad));
  const circumradius = a / (2 * Math.sin(rad));
  const area = (n * a * a) / (4 * Math.tan(rad));

  return {
    interiorAngleDeg: Number(interiorAngle.toFixed(2)),
    sumAnglesDeg: sumAngles,
    perimeter: Number(perimeter.toFixed(3)),
    inradius: Number(inradius.toFixed(3)),
    circumradius: Number(circumradius.toFixed(3)),
    area: Number(area.toFixed(3)),
  };
}

// 33. Chemical Solution Dilution: C₁ · V₁ = C₂ · V₂
export function calculateDilution(c1: number, v1: number, c2: number): {
  requiredV2: number;
  waterToAdd: number;
  dilutionFactor: number;
} {
  if (c2 <= 0) return { requiredV2: 0, waterToAdd: 0, dilutionFactor: 0 };
  const v2 = (c1 * v1) / c2;
  const water = Math.max(0, v2 - v1);
  const factor = c1 / c2;
  return {
    requiredV2: Number(v2.toFixed(3)),
    waterToAdd: Number(water.toFixed(3)),
    dilutionFactor: Number(factor.toFixed(2)),
  };
}

// 34. LED Resistor
export function calculateLedResistor(vSupply: number, vLed: number, current_mA: number): {
  resistorOhms: number;
  resistorPowerMW: number;
  standardE24Ohm: number;
} {
  const vDrop = vSupply - vLed;
  if (vDrop <= 0 || current_mA <= 0) {
    return { resistorOhms: 0, resistorPowerMW: 0, standardE24Ohm: 0 };
  }
  const iAmps = current_mA / 1000;
  const ohms = vDrop / iAmps;
  const powerMW = vDrop * current_mA;

  const e24Bases = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
  let standard = ohms;
  if (ohms > 0) {
    const power10 = Math.floor(Math.log10(ohms));
    const normalized = ohms / Math.pow(10, power10);
    const nearest = e24Bases.reduce((prev, curr) => Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev);
    standard = nearest * Math.pow(10, power10);
  }

  return {
    resistorOhms: Number(ohms.toFixed(1)),
    resistorPowerMW: Number(powerMW.toFixed(1)),
    standardE24Ohm: Math.round(standard),
  };
}

// 35. Thermal Energy Transfer: Q = m · c · ΔT
export const SPECIFIC_HEATS = [
  { nameUk: 'Вода', nameRu: 'Вода', nameEn: 'Water', c: 4184 },
  { nameUk: 'Лід', nameRu: 'Лед', nameEn: 'Ice', c: 2090 },
  { nameUk: 'Алюміній', nameRu: 'Алюминий', nameEn: 'Aluminum', c: 900 },
  { nameUk: 'Залізо / Сталь', nameRu: 'Железо / Сталь', nameEn: 'Iron / Steel', c: 450 },
  { nameUk: 'Мідь', nameRu: 'Медь', nameEn: 'Copper', c: 385 },
  { nameUk: 'Свинець', nameRu: 'Свинец', nameEn: 'Lead', c: 130 },
  { nameUk: 'Повітря', nameRu: 'Воздух', nameEn: 'Air', c: 1005 },
];

export function calculateHeatTransfer(massKg: number, specificHeat: number, deltaTCelsius: number): {
  joules: number;
  kiloJoules: number;
  kiloCalories: number;
} {
  const q = massKg * specificHeat * deltaTCelsius;
  return {
    joules: Number(q.toFixed(1)),
    kiloJoules: Number((q / 1000).toFixed(3)),
    kiloCalories: Number((q / 4184).toFixed(3)),
  };
}

// 36. Sound Decibel Distance Attenuation
export function calculateSoundAttenuation(db1: number, r1: number, r2: number): {
  db2: number;
  dropDb: number;
} {
  if (r1 <= 0 || r2 <= 0) return { db2: db1, dropDb: 0 };
  const drop = 20 * Math.log10(r2 / r1);
  const db2 = db1 - drop;
  return {
    db2: Number(db2.toFixed(1)),
    dropDb: Number(drop.toFixed(1)),
  };
}

// 37. Aspect Ratio & Screen Resolution Scaler
export function calculateAspectRatio(w: number, h: number, targetW?: number): {
  simplifiedRatio: string;
  scaledHeight: number;
  totalPixels: number;
  aspectDecimal: number;
} {
  const g = gcd(w, h);
  const simplifiedRatio = `${w / g}:${h / g}`;
  const aspectDecimal = w / h;
  const scaledHeight = targetW ? Math.round(targetW / aspectDecimal) : h;
  const totalPixels = w * h;

  return {
    simplifiedRatio,
    scaledHeight,
    totalPixels,
    aspectDecimal: Number(aspectDecimal.toFixed(3)),
  };
}

// 38. Mortgage / Annuity Loan
export function solveAnnuityLoan(principal: number, annualRatePct: number, months: number): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  overpaymentPct: number;
} {
  if (months <= 0 || principal <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, overpaymentPct: 0 };
  }
  const monthlyRate = annualRatePct / 100 / 12;
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;
  const overpaymentPct = (totalInterest / principal) * 100;

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    overpaymentPct: Number(overpaymentPct.toFixed(2)),
  };
}

// 39. Free Fall & Energy
export function solveFreeFallEnergy(massKg: number, heightM: number, g = 9.80665): {
  potentialEnergyJ: number;
  impactVelocityMPerS: number;
  fallTimeS: number;
} {
  const ep = massKg * g * heightM;
  const v = Math.sqrt(2 * g * heightM);
  const t = Math.sqrt((2 * heightM) / g);

  return {
    potentialEnergyJ: Number(ep.toFixed(2)),
    impactVelocityMPerS: Number(v.toFixed(3)),
    fallTimeS: Number(t.toFixed(3)),
  };
}

