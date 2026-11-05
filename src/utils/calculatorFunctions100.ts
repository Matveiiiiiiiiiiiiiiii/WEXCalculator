import {
  gcd,
  lcm,
  primeFactorization,
  solveQuadratic,
  solveRightTriangle,
  solveCircleAndSphere,
  calculateBMI,
  calculateFuelTrip,
  calculateTipSplit,
  toRoman,
  fromRoman,
  calculateMolarMass,
  calculateDatasetStats,
  determinant2x2,
  inverse2x2,
  vector3dOperations,
  solveProjectileMotion,
  solveIdealGas,
  calculateCombinatorics,
  solveProgressions,
  complexArithmetic,
  solveAnnuityLoan,
  calculateElectricityCost,
  calculateHalfLife,
  solveRegularPolygon,
  calculateDilution,
  calculateLedResistor,
  calculateHeatTransfer,
  calculateSoundAttenuation,
  calculateAspectRatio,
  solveFreeFallEnergy,
  decodeResistor,
} from './mathExtended';


export type CalcCategory =
  | 'algebra'
  | 'geometry'
  | 'physics'
  | 'electronics'
  | 'chemistry'
  | 'finance'
  | 'stats'
  | 'daily';

export interface CalcInputDef {
  key: string;
  labelUk: string;
  labelRu: string;
  labelEn: string;
  defaultValue: number | string;
  type?: 'number' | 'text' | 'select';
  options?: { value: string; labelUk: string; labelRu: string; labelEn: string }[];
  unit?: string;
}

export interface CalculatorFunctionDef {
  id: string;
  num: number;
  category: CalcCategory;
  nameUk: string;
  nameRu: string;
  nameEn: string;
  formula: string;
  descriptionUk: string;
  descriptionRu: string;
  descriptionEn: string;
  inputs: CalcInputDef[];
  calculate: (inputs: Record<string, any>) => {
    resultFormatted: string;
    insertValue: string;
    steps: string[];
  };
}

// Standalone mathematical helpers
export function isPrime(n: number): { isPrime: boolean; reason: string } {
  const num = Math.round(n);
  if (num <= 1) return { isPrime: false, reason: `${num} не є простим (≤ 1)` };
  if (num <= 3) return { isPrime: true, reason: `${num} є простим числом` };
  if (num % 2 === 0) return { isPrime: false, reason: `${num} ділиться на 2` };
  if (num % 3 === 0) return { isPrime: false, reason: `${num} ділиться на 3` };
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0) return { isPrime: false, reason: `${num} ділиться на ${i}` };
    if (num % (i + 2) === 0) return { isPrime: false, reason: `${num} ділиться на ${i + 2}` };
  }
  return { isPrime: true, reason: `${num} не має дільників, крім 1 та самого себе` };
}

export function fibonacci(n: number): { value: number; sequence: number[] } {
  const count = Math.max(0, Math.min(60, Math.round(n)));
  if (count === 0) return { value: 0, sequence: [0] };
  if (count === 1) return { value: 1, sequence: [0, 1] };
  const seq = [0, 1];
  for (let i = 2; i <= count; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return { value: seq[count], sequence: seq };
}

export function doubleFactorial(n: number): number {
  let num = Math.round(n);
  if (num <= 0) return 1;
  let res = 1;
  while (num > 0) {
    res *= num;
    num -= 2;
  }
  return res;
}

export function catalanNumber(n: number): number {
  const k = Math.max(0, Math.min(25, Math.round(n)));
  if (k === 0 || k === 1) return 1;
  // C_n = (2n)! / ((n+1)! * n!)
  let c = 1;
  for (let i = 1; i <= k; i++) {
    c = (c * (k + i)) / i;
  }
  return Math.round(c / (k + 1));
}

export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let b = base % mod;
  let e = exp;
  let res = 1;
  while (e > 0) {
    if (e % 2 === 1) res = (res * b) % mod;
    e = Math.floor(e / 2);
    b = (b * b) % mod;
  }
  return res;
}

export function modInverse(a: number, m: number): number | null {
  let [m0, x0, x1] = [m, 0, 1];
  let a0 = a;
  if (m === 1) return 0;
  while (a0 > 1) {
    if (m0 === 0) return null;
    const q = Math.floor(a0 / m0);
    let t = m0;
    m0 = a0 % m0;
    a0 = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }
  if (x1 < 0) x1 += m;
  return x1;
}

export function heronTriangle(a: number, b: number, c: number): {
  valid: boolean;
  area: number;
  perimeter: number;
  semiperimeter: number;
  inradius: number;
  circumradius: number;
} {
  if (a + b <= c || a + c <= b || b + c <= a || a <= 0 || b <= 0 || c <= 0) {
    return { valid: false, area: 0, perimeter: 0, semiperimeter: 0, inradius: 0, circumradius: 0 };
  }
  const p = (a + b + c) / 2;
  const s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
  const r = s / p;
  const R = (a * b * c) / (4 * s);
  return {
    valid: true,
    area: Number(s.toFixed(4)),
    perimeter: a + b + c,
    semiperimeter: p,
    inradius: Number(r.toFixed(4)),
    circumradius: Number(R.toFixed(4)),
  };
}

export function lawOfCosines(a: number, b: number, gammaDeg: number): {
  c: number;
  area: number;
} {
  const rad = (gammaDeg * Math.PI) / 180;
  const c2 = a * a + b * b - 2 * a * b * Math.cos(rad);
  const c = Math.sqrt(Math.max(0, c2));
  const area = 0.5 * a * b * Math.sin(rad);
  return { c: Number(c.toFixed(4)), area: Number(area.toFixed(4)) };
}

export function pendulumPeriod(lengthM: number, g = 9.80665): { periodS: number; frequencyHz: number } {
  const l = Math.max(0.001, lengthM);
  const t = 2 * Math.PI * Math.sqrt(l / g);
  return { periodS: Number(t.toFixed(4)), frequencyHz: Number((1 / t).toFixed(4)) };
}

export function springOscillation(massKg: number, kSpring: number): { periodS: number; frequencyHz: number } {
  if (massKg <= 0 || kSpring <= 0) return { periodS: 0, frequencyHz: 0 };
  const t = 2 * Math.PI * Math.sqrt(massKg / kSpring);
  return { periodS: Number(t.toFixed(4)), frequencyHz: Number((1 / t).toFixed(4)) };
}

export function coulombForce(q1_uC: number, q2_uC: number, distM: number): { forceN: number } {
  const k = 8.98755e9;
  const q1 = q1_uC * 1e-6;
  const q2 = q2_uC * 1e-6;
  const r = Math.max(0.0001, distM);
  const f = (k * Math.abs(q1 * q2)) / (r * r);
  return { forceN: Number(f.toPrecision(5)) };
}

export function seriesResistors(rList: number[]): number {
  return rList.reduce((acc, v) => acc + (v || 0), 0);
}

export function parallelResistors(rList: number[]): number {
  const nonZero = rList.filter((r) => r > 0);
  if (nonZero.length === 0) return 0;
  const sumInv = nonZero.reduce((acc, r) => acc + 1 / r, 0);
  return sumInv > 0 ? Number((1 / sumInv).toFixed(3)) : 0;
}

export function rcFilter(rOhms: number, c_uF: number): {
  tauMs: number;
  cutoffFreqHz: number;
  time99PctMs: number;
} {
  const cFarads = c_uF * 1e-6;
  const tau = rOhms * cFarads;
  const fc = tau > 0 ? 1 / (2 * Math.PI * tau) : 0;
  return {
    tauMs: Number((tau * 1000).toFixed(3)),
    cutoffFreqHz: Number(fc.toFixed(2)),
    time99PctMs: Number((tau * 5 * 1000).toFixed(3)),
  };
}

export function voltageDivider(vIn: number, r1: number, r2: number): { vOut: number; ratio: number } {
  if (r1 + r2 <= 0) return { vOut: 0, ratio: 0 };
  const ratio = r2 / (r1 + r2);
  const vOut = vIn * ratio;
  return { vOut: Number(vOut.toFixed(4)), ratio: Number(ratio.toFixed(4)) };
}

export function phConverter(ph: number): {
  ph: number;
  poh: number;
  hPlusM: number;
  ohMinusM: number;
  typeUk: string;
} {
  const cleanPh = Math.max(0, Math.min(14, ph));
  const poh = 14 - cleanPh;
  const hPlus = Math.pow(10, -cleanPh);
  const ohMinus = Math.pow(10, -poh);
  let typeUk = 'Нейтральне середовище';
  if (cleanPh < 6.8) typeUk = 'Кисле середовище';
  else if (cleanPh > 7.2) typeUk = 'Лужне середовище';
  return {
    ph: Number(cleanPh.toFixed(2)),
    poh: Number(poh.toFixed(2)),
    hPlusM: Number(hPlus.toPrecision(3)),
    ohMinusM: Number(ohMinus.toPrecision(3)),
    typeUk,
  };
}

export function compoundInterestPeriodic(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 12
): { finalBalance: number; interestEarned: number } {
  const r = annualRatePct / 100;
  const n = compoundsPerYear;
  const t = years;
  const finalBalance = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = finalBalance - principal;
  return {
    finalBalance: Number(finalBalance.toFixed(2)),
    interestEarned: Number(interestEarned.toFixed(2)),
  };
}

export function ruleOf72(ratePct: number): number {
  if (ratePct <= 0) return 0;
  return Number((72 / ratePct).toFixed(1));
}

export function breakEvenAnalysis(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): { units: number; revenue: number } {
  const margin = pricePerUnit - variableCostPerUnit;
  if (margin <= 0) return { units: 0, revenue: 0 };
  const units = Math.ceil(fixedCosts / margin);
  return { units, revenue: units * pricePerUnit };
}

export function bmrMifflinStJeor(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female'
): { bmr: number; sedentary: number; moderate: number; active: number } {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return {
    bmr: Math.round(bmr),
    sedentary: Math.round(bmr * 1.2),
    moderate: Math.round(bmr * 1.55),
    active: Math.round(bmr * 1.725),
  };
}

export function dnaComplementAndGC(seq: string): {
  cleanSeq: string;
  complement: string;
  rna: string;
  gcPercent: number;
  length: number;
} {
  const clean = seq.toUpperCase().replace(/[^ATCG]/g, '');
  const compMap: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
  const complement = clean.split('').map((c) => compMap[c] || c).join('');
  const rna = clean.replace(/T/g, 'U');
  const gcCount = (clean.match(/[GC]/g) || []).length;
  const gcPercent = clean.length > 0 ? (gcCount / clean.length) * 100 : 0;
  return {
    cleanSeq: clean,
    complement,
    rna,
    gcPercent: Number(gcPercent.toFixed(1)),
    length: clean.length,
  };
}

export function calculateDownloadTime(sizeMB: number, speedMbps: number): { seconds: number; formatted: string } {
  if (speedMbps <= 0) return { seconds: 0, formatted: '0 с' };
  const totalMbits = sizeMB * 8;
  const seconds = Math.round(totalMbits / speedMbps);
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  let formatted = '';
  if (hrs > 0) {
    formatted = `${hrs} год ${mins % 60} хв`;
  } else if (mins > 0) {
    formatted = `${mins} хв ${seconds % 60} с`;
  } else {
    formatted = `${seconds} с`;
  }
  return { seconds, formatted };
}

export function convertBases(val: string, fromBase: number): { dec: string; hex: string; bin: string; oct: string } {
  const clean = String(val).trim();
  const num = parseInt(clean, fromBase);
  if (isNaN(num)) return { dec: '0', hex: '0', bin: '0', oct: '0' };
  return {
    dec: num.toString(10),
    hex: num.toString(16).toUpperCase(),
    bin: num.toString(2),
    oct: num.toString(8),
  };
}

export function calculateVAT(sum: number, ratePct: number): { addedVat: number; totalWithVat: number; cleanBase: number; extractedVat: number } {
  const rate = ratePct / 100;
  const addedVat = Number(((sum * rate)).toFixed(2));
  const totalWithVat = Number((sum + addedVat).toFixed(2));
  const cleanBase = Number((sum / (1 + rate)).toFixed(2));
  const extractedVat = Number((sum - cleanBase).toFixed(2));
  return { addedVat, totalWithVat, cleanBase, extractedVat };
}

export function solveLinearSystem2x2(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): {
  delta: number;
  deltaX: number;
  deltaY: number;
  hasUniqueSolution: boolean;
  x: number;
  y: number;
} {
  const delta = a1 * b2 - a2 * b1;
  const deltaX = c1 * b2 - c2 * b1;
  const deltaY = a1 * c2 - a2 * c1;
  if (delta === 0) {
    return { delta: 0, deltaX, deltaY, hasUniqueSolution: false, x: 0, y: 0 };
  }
  return {
    delta,
    deltaX,
    deltaY,
    hasUniqueSolution: true,
    x: Number((deltaX / delta).toFixed(4)),
    y: Number((deltaY / delta).toFixed(4)),
  };
}

export function solveCylinderAndCone(r: number, h: number): {
  cylinderVolume: number;
  coneVolume: number;
  coneSlantHeight: number;
} {
  const cylVol = Math.PI * r * r * h;
  const coneVol = cylVol / 3;
  const slant = Math.sqrt(r * r + h * h);
  return {
    cylinderVolume: Number(cylVol.toFixed(3)),
    coneVolume: Number(coneVol.toFixed(3)),
    coneSlantHeight: Number(slant.toFixed(3)),
  };
}

export function calculateDateDifference(d1: string, d2: string): { days: number; weeks: number; monthsApprox: number } {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    days,
    weeks: Number((days / 7).toFixed(1)),
    monthsApprox: Number((days / 30.4375).toFixed(1)),
  };
}

export function calculateOhmLaw(v?: number, i?: number, r?: number): { voltage: number; current: number; resistance: number; power: number } {
  let finalV = v ?? 0;
  let finalI = i ?? 0;
  let finalR = r ?? 0;
  if (v === undefined && i && r) finalV = i * r;
  else if (i === undefined && v && r && r > 0) finalI = v / r;
  else if (r === undefined && v && i && i > 0) finalR = v / i;
  const power = finalV * finalI;
  return {
    voltage: Number(finalV.toFixed(3)),
    current: Number(finalI.toFixed(3)),
    resistance: Number(finalR.toFixed(3)),
    power: Number(power.toFixed(3)),
  };
}

export function solveProportion(a: number, b: number, c: number): { x: number } {
  if (a === 0) return { x: 0 };
  return { x: Number(((b * c) / a).toFixed(4)) };
}

export function calculatePercentages(val: number, total: number): { percentOfTotal: number; addedPercent: number; deductedPercent: number } {
  const percentOfTotal = total !== 0 ? (val / total) * 100 : 0;
  const addedPercent = val * (1 + total / 100);
  const deductedPercent = val * (1 - total / 100);
  return {
    percentOfTotal: Number(percentOfTotal.toFixed(2)),
    addedPercent: Number(addedPercent.toFixed(2)),
    deductedPercent: Number(deductedPercent.toFixed(2)),
  };
}

export function solveCubeAndBox(l: number, w: number, h: number): { volume: number; surfaceArea: number; diagonal: number } {
  const volume = l * w * h;
  const surfaceArea = 2 * (l * w + l * h + w * h);
  const diagonal = Math.sqrt(l * l + w * w + h * h);
  return {
    volume: Number(volume.toFixed(3)),
    surfaceArea: Number(surfaceArea.toFixed(3)),
    diagonal: Number(diagonal.toFixed(3)),
  };
}

// -------------------------------------------------------------
// CATALOGUE OF 105 PRODUCTION CALCULATOR FUNCTIONS
// -------------------------------------------------------------
export const CALCULATOR_FUNCTIONS_100: CalculatorFunctionDef[] = [
  // 1. GCD & LCM
  {
    id: 'gcd_lcm',
    num: 1,
    category: 'algebra',
    nameUk: 'НСД та НСК двох чисел',
    nameRu: 'НОД и НОК двух чисел',
    nameEn: 'GCD & LCM',
    formula: 'НСД(a, b),  НСК(a, b) = |a·b| / НСД(a, b)',
    descriptionUk: 'Найбільший спільний дільник та найменше спільне кратне',
    descriptionRu: 'Наибольший общий делитель и наименьшее общее кратное',
    descriptionEn: 'Greatest Common Divisor and Least Common Multiple',
    inputs: [
      { key: 'a', labelUk: 'Число a', labelRu: 'Число a', labelEn: 'Number a', defaultValue: 48 },
      { key: 'b', labelUk: 'Число b', labelRu: 'Число b', labelEn: 'Number b', defaultValue: 180 },
    ],
    calculate: ({ a, b }) => {
      const g = gcd(Number(a), Number(b));
      const l = lcm(Number(a), Number(b));
      return {
        resultFormatted: `НСД = ${g},  НСК = ${l}`,
        insertValue: `${g}`,
        steps: [`Алгоритм Евкліда для a=${a}, b=${b}`, `НСД(${a}, ${b}) = ${g}`, `НСК(${a}, ${b}) = (${a} · ${b}) / ${g} = ${l}`],
      };
    },
  },

  // 2. Prime Factorization
  {
    id: 'prime_factor',
    num: 2,
    category: 'algebra',
    nameUk: 'Розклад на прості множники',
    nameRu: 'Разложение на простые множители',
    nameEn: 'Prime Factorization',
    formula: 'n = p₁ᵃ¹ · p₂ᵃ² ...',
    descriptionUk: 'Канонічний розклад числа на прості множники зі степенями',
    descriptionRu: 'Каноническое разложение числа на простые со степенями',
    descriptionEn: 'Canonical prime factorization of an integer',
    inputs: [{ key: 'n', labelUk: 'Число n', labelRu: 'Число n', labelEn: 'Integer n', defaultValue: 360 }],
    calculate: ({ n }) => {
      const { formula } = primeFactorization(Number(n));
      return {
        resultFormatted: `${n} = ${formula}`,
        insertValue: formula,
        steps: [`Послідовний поділ на найменші прості дільники`, `Канонічний розклад: ${formula}`],
      };
    },
  },

  // 3. Is Prime
  {
    id: 'is_prime',
    num: 3,
    category: 'algebra',
    nameUk: 'Перевірка простого числа',
    nameRu: 'Проверка на простое число',
    nameEn: 'Prime Number Test',
    formula: 'p > 1, дільники тільки 1 та p',
    descriptionUk: 'Перевірка, чи є число простим або складеним',
    descriptionRu: 'Определение простоты числа',
    descriptionEn: 'Tests whether an integer is prime or composite',
    inputs: [{ key: 'n', labelUk: 'Число n', labelRu: 'Число n', labelEn: 'Integer n', defaultValue: 104729 }],
    calculate: ({ n }) => {
      const { isPrime: prime, reason } = isPrime(Number(n));
      return {
        resultFormatted: prime ? `Число ${n} — ПРОСТЕ` : `Число ${n} — СКЛАДЕНЕ`,
        insertValue: `${n}`,
        steps: [reason],
      };
    },
  },

  // 4. Fibonacci
  {
    id: 'fibonacci',
    num: 4,
    category: 'algebra',
    nameUk: 'Числа Фібоначчі',
    nameRu: 'Числа Фибоначчи',
    nameEn: 'Fibonacci Sequence',
    formula: 'F₀=0, F₁=1, Fₙ = Fₙ₋₁ + Fₙ₋₂',
    descriptionUk: 'Обчислення n-го числа Фібоначчі та виведення послідовності',
    descriptionRu: 'Вычисление n-го числа Фибоначчи',
    descriptionEn: 'Compute the nth Fibonacci number and sequence',
    inputs: [{ key: 'n', labelUk: 'Номер члена n', labelRu: 'Номер n', labelEn: 'Index n', defaultValue: 12 }],
    calculate: ({ n }) => {
      const { value, sequence } = fibonacci(Number(n));
      return {
        resultFormatted: `F(${n}) = ${value}`,
        insertValue: `${value}`,
        steps: [`Послідовність до n=${n}: ${sequence.slice(-6).join(', ')}`],
      };
    },
  },

  // 5. Double Factorial
  {
    id: 'double_factorial',
    num: 5,
    category: 'algebra',
    nameUk: 'Подвійний факторіал n!!',
    nameRu: 'Двойной факториал n!!',
    nameEn: 'Double Factorial n!!',
    formula: 'n!! = n · (n-2) · (n-4) ...',
    descriptionUk: 'Добуток чисел однакової парності від 1 (або 2) до n',
    descriptionRu: 'Произведение чисел той же четности',
    descriptionEn: 'Product of all integers from 1 up to n that have the same parity',
    inputs: [{ key: 'n', labelUk: 'Число n', labelRu: 'Число n', labelEn: 'Number n', defaultValue: 9 }],
    calculate: ({ n }) => {
      const val = doubleFactorial(Number(n));
      return {
        resultFormatted: `${n}!! = ${val}`,
        insertValue: `${val}`,
        steps: [`${n}!! обчислено з кроком 2`],
      };
    },
  },

  // 6. Catalan Number
  {
    id: 'catalan_number',
    num: 6,
    category: 'algebra',
    nameUk: 'Число Каталана Cₙ',
    nameRu: 'Число Каталана Cₙ',
    nameEn: 'Catalan Number C_n',
    formula: 'Cₙ = (1 / (n+1)) · (2n над n)',
    descriptionUk: 'Кількість правильних дужкових послідовностей та бінарних дерев',
    descriptionRu: 'Число правильных скобочных последовательностей',
    descriptionEn: 'Combinatorial sequence counting valid parentheses paths',
    inputs: [{ key: 'n', labelUk: 'Індекс n', labelRu: 'Индекс n', labelEn: 'Index n', defaultValue: 6 }],
    calculate: ({ n }) => {
      const val = catalanNumber(Number(n));
      return {
        resultFormatted: `C(${n}) = ${val}`,
        insertValue: `${val}`,
        steps: [`C_${n} = (1 / ${Number(n) + 1}) · (2·${n} над ${n}) = ${val}`],
      };
    },
  },

  // 7. Modular Exponentiation
  {
    id: 'mod_pow',
    num: 7,
    category: 'algebra',
    nameUk: 'Модульне піднесення до степеня',
    nameRu: 'Модульное возведение в степень',
    nameEn: 'Modular Exponentiation',
    formula: 'bᵉ mod m',
    descriptionUk: 'Швидке обчислення степеня за модулем для криптографії (RSA)',
    descriptionRu: 'Быстрое возведение в степень по модулю',
    descriptionEn: 'Fast modular exponentiation for cryptography',
    inputs: [
      { key: 'b', labelUk: 'Основа b', labelRu: 'Основание b', labelEn: 'Base b', defaultValue: 7 },
      { key: 'e', labelUk: 'Показник e', labelRu: 'Степень e', labelEn: 'Exponent e', defaultValue: 256 },
      { key: 'm', labelUk: 'Модуль m', labelRu: 'Модуль m', labelEn: 'Modulus m', defaultValue: 13 },
    ],
    calculate: ({ b, e, m }) => {
      const res = modPow(Number(b), Number(e), Number(m));
      return {
        resultFormatted: `${b}^${e} mod ${m} = ${res}`,
        insertValue: `${res}`,
        steps: [`Бінарне піднесення до степеня за модулем ${m}`, `Результат = ${res}`],
      };
    },
  },

  // 8. Modular Inverse
  {
    id: 'mod_inverse',
    num: 8,
    category: 'algebra',
    nameUk: 'Обернений елемент за модулем',
    nameRu: 'Обратный элемент по модулю',
    nameEn: 'Modular Multiplicative Inverse',
    formula: 'a · x ≡ 1 (mod m)',
    descriptionUk: 'Пошук x такого, що добуток a · x дає остачу 1 при діленні на m',
    descriptionRu: 'Нахождение обратного элемента в поле вычетов',
    descriptionEn: 'Find x such that a * x = 1 (mod m)',
    inputs: [
      { key: 'a', labelUk: 'Елемент a', labelRu: 'Элемент a', labelEn: 'Element a', defaultValue: 3 },
      { key: 'm', labelUk: 'Модуль m', labelRu: 'Модуль m', labelEn: 'Modulus m', defaultValue: 11 },
    ],
    calculate: ({ a, m }) => {
      const inv = modInverse(Number(a), Number(m));
      return {
        resultFormatted: inv !== null ? `x = ${inv}` : 'Оберненого елемента не існує (НСД ≠ 1)',
        insertValue: inv !== null ? `${inv}` : '',
        steps: [inv !== null ? `(${a} · ${inv}) mod ${m} = ${(Number(a) * inv) % Number(m)}` : 'НСД(a, m) повинен дорівнювати 1'],
      };
    },
  },

  // 9. Sum of Digits & Digital Root
  {
    id: 'sum_digits',
    num: 9,
    category: 'algebra',
    nameUk: 'Сума цифр та цифровий корінь',
    nameRu: 'Сумма цифр и цифровой корень',
    nameEn: 'Sum of Digits & Digital Root',
    formula: 'Σ digits, root = 1 + (n - 1) mod 9',
    descriptionUk: 'Сума всіх цифр числа, кількість розрядів та цифровий корінь',
    descriptionRu: 'Сумма цифр и цифровой корень числа',
    descriptionEn: 'Sum of digits, count, and single-digit digital root',
    inputs: [{ key: 'n', labelUk: 'Число n', labelRu: 'Число n', labelEn: 'Number n', defaultValue: 987654321 }],
    calculate: ({ n }) => {
      const s = String(Math.abs(Number(n)));
      const sum = s.split('').reduce((acc, c) => acc + Number(c), 0);
      const root = 1 + ((Math.abs(Number(n)) - 1) % 9);
      return {
        resultFormatted: `Сума = ${sum},  Цифровий корінь = ${root}`,
        insertValue: `${sum}`,
        steps: [`Кількість цифр: ${s.length}`, `Сума: ${s.split('').join(' + ')} = ${sum}`, `Цифровий корінь: ${root}`],
      };
    },
  },

  // 10. Divisors & Perfect Number
  {
    id: 'divisors_count',
    num: 10,
    category: 'algebra',
    nameUk: 'Дільники та досконале число',
    nameRu: 'Делители и совершенное число',
    nameEn: 'Divisors & Perfect Number',
    formula: 'd | n,  Σ d = 2n ?',
    descriptionUk: 'Знаходження всіх натуральних дільників та перевірка на досконалість',
    descriptionRu: 'Поиск всех делителей и проверка совершенности',
    descriptionEn: 'Finds all divisors and tests if number is perfect (e.g. 6, 28, 496)',
    inputs: [{ key: 'n', labelUk: 'Число n', labelRu: 'Число n', labelEn: 'Number n', defaultValue: 28 }],
    calculate: ({ n }) => {
      const num = Math.abs(Math.round(Number(n)));
      const divs: number[] = [];
      for (let i = 1; i * i <= num; i++) {
        if (num % i === 0) {
          divs.push(i);
          if (i * i !== num) divs.push(num / i);
        }
      }
      divs.sort((a, b) => a - b);
      const sumProper = divs.slice(0, -1).reduce((acc, v) => acc + v, 0);
      const isPerf = sumProper === num && num > 0;
      return {
        resultFormatted: `Дільників: ${divs.length}. ${isPerf ? '🌟 ДОСКОНАЛЕ ЧИСЛО' : 'Звичайне число'}`,
        insertValue: `${divs.length}`,
        steps: [`Всі дільники: ${divs.join(', ')}`, `Сума власних дільників: ${sumProper} ${isPerf ? '= ' + num : '≠ ' + num}`],
      };
    },
  },

  // 11. Quadratic Equation
  {
    id: 'quadratic',
    num: 11,
    category: 'algebra',
    nameUk: 'Квадратне рівняння ax² + bx + c = 0',
    nameRu: 'Квадратное уравнение ax² + bx + c = 0',
    nameEn: 'Quadratic Equation ax² + bx + c = 0',
    formula: 'D = b² - 4ac,  x = (-b ± √D) / 2a',
    descriptionUk: 'Повний розвʼязок з дискримінантом, коренями та вершиною параболи',
    descriptionRu: 'Полное решение с дискриминантом и корнями',
    descriptionEn: 'Complete solver with discriminant, roots, and parabola vertex',
    inputs: [
      { key: 'a', labelUk: 'Коефіцієнт a', labelRu: 'Коэффициент a', labelEn: 'Coefficient a', defaultValue: 1 },
      { key: 'b', labelUk: 'Коефіцієнт b', labelRu: 'Коэффициент b', labelEn: 'Coefficient b', defaultValue: -5 },
      { key: 'c', labelUk: 'Коефіцієнт c', labelRu: 'Коэффициент c', labelEn: 'Coefficient c', defaultValue: 6 },
    ],
    calculate: ({ a, b, c }) => {
      const res = solveQuadratic(Number(a), Number(b), Number(c));
      return {
        resultFormatted: res.hasRealRoots ? `x₁ = ${res.x1},  x₂ = ${res.x2}` : `Комплексні: ${res.x1}`,
        insertValue: res.x1,
        steps: res.steps,
      };
    },
  },

  // 12. Linear Equation
  {
    id: 'linear_eq',
    num: 12,
    category: 'algebra',
    nameUk: 'Лінійне рівняння ax + b = 0',
    nameRu: 'Линейное уравнение ax + b = 0',
    nameEn: 'Linear Equation ax + b = 0',
    formula: 'x = -b / a',
    descriptionUk: 'Розвʼязок лінійного рівняння першого степеня',
    descriptionRu: 'Решение линейного уравнения первой степени',
    descriptionEn: 'Solves simple first-degree linear equations',
    inputs: [
      { key: 'a', labelUk: 'Коефіцієнт a', labelRu: 'Коэффициент a', labelEn: 'Coefficient a', defaultValue: 4 },
      { key: 'b', labelUk: 'Вільний член b', labelRu: 'Свободный член b', labelEn: 'Constant b', defaultValue: -20 },
    ],
    calculate: ({ a, b }) => {
      const aVal = Number(a);
      const bVal = Number(b);
      if (aVal === 0) {
        return {
          resultFormatted: bVal === 0 ? 'Безліч розвʼязків (0 = 0)' : 'Немає розвʼязків',
          insertValue: '',
          steps: ['a = 0: рівняння вироджене'],
        };
      }
      const x = -bVal / aVal;
      return {
        resultFormatted: `x = ${x}`,
        insertValue: `${x}`,
        steps: [`${aVal}x + ${bVal} = 0`, `${aVal}x = ${-bVal}`, `x = ${-bVal} / ${aVal} = ${x}`],
      };
    },
  },

  // 13. Biquadratic Equation
  {
    id: 'biquadratic',
    num: 13,
    category: 'algebra',
    nameUk: 'Біквадратне рівняння ax⁴ + bx² + c = 0',
    nameRu: 'Биквадратное уравнение ax⁴ + bx² + c = 0',
    nameEn: 'Biquadratic Equation ax⁴ + bx² + c = 0',
    formula: 't = x², at² + bt + c = 0',
    descriptionUk: 'Метод заміни змінної t = x² для знаходження до 4 коренів',
    descriptionRu: 'Замена переменной t = x² для нахождения 4 корней',
    descriptionEn: 'Substitution method t = x² to find up to four real roots',
    inputs: [
      { key: 'a', labelUk: 'a', labelRu: 'a', labelEn: 'a', defaultValue: 1 },
      { key: 'b', labelUk: 'b', labelRu: 'b', labelEn: 'b', defaultValue: -5 },
      { key: 'c', labelUk: 'c', labelRu: 'c', labelEn: 'c', defaultValue: 4 },
    ],
    calculate: ({ a, b, c }) => {
      const q = solveQuadratic(Number(a), Number(b), Number(c));
      const roots: number[] = [];
      const t1 = parseFloat(q.x1);
      const t2 = parseFloat(q.x2);
      if (!isNaN(t1) && t1 >= 0) roots.push(Math.sqrt(t1), -Math.sqrt(t1));
      if (!isNaN(t2) && t2 >= 0 && t2 !== t1) roots.push(Math.sqrt(t2), -Math.sqrt(t2));
      roots.sort((x, y) => x - y);
      return {
        resultFormatted: roots.length ? `Корені: ${roots.map((r) => r.toFixed(2)).join(', ')}` : 'Немає дійсних коренів',
        insertValue: roots[0] !== undefined ? `${roots[0]}` : '',
        steps: [`Заміна t = x² -> ${a}t² + ${b}t + ${c} = 0`, `t₁ = ${q.x1}, t₂ = ${q.x2}`, `x = ±√t`],
      };
    },
  },

  // 14. Cramer 2x2 System
  {
    id: 'cramer_2x2',
    num: 14,
    category: 'algebra',
    nameUk: 'Система 2 лінійних рівнянь (Крамер)',
    nameRu: 'Система 2 уравнений (Крамер)',
    nameEn: '2x2 Linear System (Cramer)',
    formula: 'a1·x + b1·y = c1;  a2·x + b2·y = c2',
    descriptionUk: 'Розвʼязок системи двох рівнянь методом визначників',
    descriptionRu: 'Решение системы двух уравнений методом Крамера',
    descriptionEn: 'Solves 2x2 linear equations via determinants',
    inputs: [
      { key: 'a1', labelUk: 'a1', labelRu: 'a1', labelEn: 'a1', defaultValue: 2 },
      { key: 'b1', labelUk: 'b1', labelRu: 'b1', labelEn: 'b1', defaultValue: 3 },
      { key: 'c1', labelUk: 'c1', labelRu: 'c1', labelEn: 'c1', defaultValue: 13 },
      { key: 'a2', labelUk: 'a2', labelRu: 'a2', labelEn: 'a2', defaultValue: 1 },
      { key: 'b2', labelUk: 'b2', labelRu: 'b2', labelEn: 'b2', defaultValue: -1 },
      { key: 'c2', labelUk: 'c2', labelRu: 'c2', labelEn: 'c2', defaultValue: -1 },
    ],
    calculate: ({ a1, b1, c1, a2, b2, c2 }) => {
      const res = solveLinearSystem2x2(Number(a1), Number(b1), Number(c1), Number(a2), Number(b2), Number(c2));
      return {
        resultFormatted: res.hasUniqueSolution ? `x = ${res.x},  y = ${res.y}` : 'Немає єдиного розвʼязку (Δ = 0)',
        insertValue: `${res.x}`,
        steps: [`Головний визначник Δ = ${res.delta}`, `Δx = ${res.deltaX},  Δy = ${res.deltaY}`, `x = Δx/Δ = ${res.x},  y = Δy/Δ = ${res.y}`],
      };
    },
  },

  // 15. Golden Ratio
  {
    id: 'golden_ratio',
    num: 15,
    category: 'algebra',
    nameUk: 'Золотий переріз (Число Фі)',
    nameRu: 'Золотое сечение (Число Фи)',
    nameEn: 'Golden Ratio (Phi)',
    formula: 'φ = (1 + √5) / 2 ≈ 1.6180339887',
    descriptionUk: 'Поділ відрізка в гармонійній пропорції золотого перерізу',
    descriptionRu: 'Деление отрезка в гармонической пропорции',
    descriptionEn: 'Harmonic division of a segment according to golden ratio',
    inputs: [{ key: 'len', labelUk: 'Загальна довжина', labelRu: 'Общая длина', labelEn: 'Total length', defaultValue: 100 }],
    calculate: ({ len }) => {
      const L = Number(len);
      const phi = (1 + Math.sqrt(5)) / 2;
      const major = L / phi;
      const minor = L - major;
      return {
        resultFormatted: `Більша частина: ${major.toFixed(3)},  Менша: ${minor.toFixed(3)}`,
        insertValue: `${major.toFixed(4)}`,
        steps: [`φ = (1 + √5)/2 ≈ 1.618034`, `Більший сегмент = ${L} / 1.618034 = ${major.toFixed(3)}`, `Менший сегмент = ${L} - ${major.toFixed(3)} = ${minor.toFixed(3)}`],
      };
    },
  },

  // 16. Combinatorics
  {
    id: 'combinatorics',
    num: 16,
    category: 'algebra',
    nameUk: 'Комбінаторика (C, A, P)',
    nameRu: 'Комбинаторика (C, A, P)',
    nameEn: 'Combinatorics (n!, C, A)',
    formula: 'C(n,k) = n! / (k!(n-k)!),  A(n,k) = n! / (n-k)!',
    descriptionUk: 'Сполучення, розміщення та перестановки',
    descriptionRu: 'Сочетания, размещения и перестановки',
    descriptionEn: 'Combinations, permutations, and arrangements',
    inputs: [
      { key: 'n', labelUk: 'Загальна кількість n', labelRu: 'Всего n', labelEn: 'Total n', defaultValue: 10 },
      { key: 'k', labelUk: 'Вибірка k', labelRu: 'Выборка k', labelEn: 'Sample k', defaultValue: 3 },
    ],
    calculate: ({ n, k }) => {
      const res = calculateCombinatorics(Number(n), Number(k));
      return {
        resultFormatted: `C(${n}, ${k}) = ${res.combinations},  A(${n}, ${k}) = ${res.permutations}`,
        insertValue: `${res.combinations}`,
        steps: [`Сполучення без повторень C(${n}, ${k}) = ${res.combinations}`, `Розміщення без повторень A(${n}, ${k}) = ${res.permutations}`, `Факторіал n! = ${res.factorialN}`],
      };
    },
  },

  // 17. Combinations with Repetition
  {
    id: 'comb_repetition',
    num: 17,
    category: 'algebra',
    nameUk: 'Сполучення з повтореннями',
    nameRu: 'Сочетания с повторениями',
    nameEn: 'Combinations with Repetition',
    formula: 'C̄(n,k) = C(n+k-1, k)',
    descriptionUk: 'Кількість способів обрати k елементів з n типів з повтореннями',
    descriptionRu: 'Число способов выбрать k элементов из n типов с повторениями',
    descriptionEn: 'Stars and bars formula for choosing k items from n types',
    inputs: [
      { key: 'n', labelUk: 'Кількість типів n', labelRu: 'Типов n', labelEn: 'Types n', defaultValue: 4 },
      { key: 'k', labelUk: 'Вибірка k', labelRu: 'Выборка k', labelEn: 'Sample k', defaultValue: 6 },
    ],
    calculate: ({ n, k }) => {
      const nVal = Number(n);
      const kVal = Number(k);
      const res = calculateCombinatorics(nVal + kVal - 1, kVal);
      return {
        resultFormatted: `C̄(${n}, ${k}) = ${res.combinations}`,
        insertValue: `${res.combinations}`,
        steps: [`Формула: C(${nVal} + ${kVal} - 1, ${kVal}) = C(${nVal + kVal - 1}, ${kVal})`, `Кількість способів = ${res.combinations}`],
      };
    },
  },

  // 18. Arithmetic Progression
  {
    id: 'arithmetic_prog',
    num: 18,
    category: 'algebra',
    nameUk: 'Арифметична прогресія',
    nameRu: 'Арифметическая прогрессия',
    nameEn: 'Arithmetic Progression',
    formula: 'aₙ = a₁ + (n-1)d,  Sₙ = (a₁ + aₙ)·n / 2',
    descriptionUk: 'Обчислення n-го члена та суми перших n членів прогресії',
    descriptionRu: 'Вычисление n-го члена и суммы Sₙ',
    descriptionEn: 'Compute nth term and sum of arithmetic sequence',
    inputs: [
      { key: 'a1', labelUk: 'Перший член a1', labelRu: 'Первый член a1', labelEn: 'First term a1', defaultValue: 3 },
      { key: 'd', labelUk: 'Різниця d', labelRu: 'Разность d', labelEn: 'Step d', defaultValue: 4 },
      { key: 'n', labelUk: 'Кількість членів n', labelRu: 'Членов n', labelEn: 'Terms n', defaultValue: 10 },
    ],
    calculate: ({ a1, d, n }) => {
      const res = solveProgressions('arithmetic', Number(a1), Number(d), Number(n));
      return {
        resultFormatted: `a(${n}) = ${res.an},  S(${n}) = ${res.sumSn}`,
        insertValue: `${res.an}`,
        steps: [
          `Формула: aₙ = a₁ + (n-1)·d = ${a1} + (${n}-1)·${d} = ${res.an}`,
          `Сума перших ${n} членів: Sₙ = (${a1} + ${res.an}) · ${n} / 2 = ${res.sumSn}`,
          `Початок послідовності: ${res.terms.join(', ')}...`,
        ],
      };
    },
  },

  // 19. Geometric Progression
  {
    id: 'geometric_prog',
    num: 19,
    category: 'algebra',
    nameUk: 'Геометрична прогресія',
    nameRu: 'Геометрическая прогрессия',
    nameEn: 'Geometric Progression',
    formula: 'bₙ = b₁ · qⁿ⁻¹,  Sₙ = b₁(qⁿ - 1) / (q - 1)',
    descriptionUk: 'Обчислення n-го члена та суми n членів геометричної прогресії',
    descriptionRu: 'Вычисление n-го члена и суммы геометрической прогрессии',
    descriptionEn: 'Nth term and partial sum of geometric sequence',
    inputs: [
      { key: 'b1', labelUk: 'Перший член b1', labelRu: 'Первый член b1', labelEn: 'First term b1', defaultValue: 2 },
      { key: 'q', labelUk: 'Знаменник q', labelRu: 'Знаменатель q', labelEn: 'Ratio q', defaultValue: 3 },
      { key: 'n', labelUk: 'Кількість n', labelRu: 'Количество n', labelEn: 'Terms n', defaultValue: 6 },
    ],
    calculate: ({ b1, q, n }) => {
      const res = solveProgressions('geometric', Number(b1), Number(q), Number(n));
      return {
        resultFormatted: `b(${n}) = ${res.an},  S(${n}) = ${res.sumSn}`,
        insertValue: `${res.an}`,
        steps: [
          `Формула: bₙ = b₁ · qⁿ⁻¹ = ${b1} · ${q}^(${n}-1) = ${res.an}`,
          `Сума перших ${n} членів: Sₙ = ${b1}·(${q}^${n} - 1) / (${q} - 1) = ${res.sumSn}`,
          `Початок послідовності: ${res.terms.join(', ')}...`,
        ],
      };
    },
  },

  // 20. Complex Numbers
  {
    id: 'complex_ops',
    num: 20,
    category: 'algebra',
    nameUk: 'Комплексні числа (Арифметика)',
    nameRu: 'Комплексные числа (Арифметика)',
    nameEn: 'Complex Number Arithmetic',
    formula: 'z = a + bi,  |z| = √(a² + b²)',
    descriptionUk: 'Додавання, віднімання, множення та ділення комплексних чисел',
    descriptionRu: 'Арифметика комплексных чисел',
    descriptionEn: 'Arithmetic on complex numbers z1 and z2',
    inputs: [
      { key: 'r1', labelUk: 'Re(z1)', labelRu: 'Re(z1)', labelEn: 'Re(z1)', defaultValue: 3 },
      { key: 'i1', labelUk: 'Im(z1)', labelRu: 'Im(z1)', labelEn: 'Im(z1)', defaultValue: 4 },
      { key: 'r2', labelUk: 'Re(z2)', labelRu: 'Re(z2)', labelEn: 'Re(z2)', defaultValue: 1 },
      { key: 'i2', labelUk: 'Im(z2)', labelRu: 'Im(z2)', labelEn: 'Im(z2)', defaultValue: -2 },
      {
        key: 'op',
        labelUk: 'Операція',
        labelRu: 'Операция',
        labelEn: 'Operation',
        defaultValue: 'multiply',
        type: 'select',
        options: [
          { value: 'add', labelUk: 'Додавання (+)', labelRu: 'Сложение (+)', labelEn: 'Add (+)' },
          { value: 'subtract', labelUk: 'Віднімання (-)', labelRu: 'Вычитание (-)', labelEn: 'Subtract (-)' },
          { value: 'multiply', labelUk: 'Множення (·)', labelRu: 'Умножение (·)', labelEn: 'Multiply (·)' },
          { value: 'divide', labelUk: 'Ділення (/)', labelRu: 'Деление (/)', labelEn: 'Divide (/)' },
        ],
      },
    ],
    calculate: ({ r1, i1, r2, i2, op }) => {
      const res = complexArithmetic(Number(r1), Number(i1), Number(r2), Number(i2), op);
      return {
        resultFormatted: res.formatted,
        insertValue: res.formatted,
        steps: [
          `|z1| = ${Math.hypot(Number(r1), Number(i1)).toFixed(3)},  |z2| = ${Math.hypot(Number(r2), Number(i2)).toFixed(3)}`,
          `Результат: ${res.formatted}`,
        ],
      };
    },
  },

  // 21. Right Triangle / Pythagorean
  {
    id: 'right_triangle',
    num: 21,
    category: 'geometry',
    nameUk: 'Прямокутний трикутник (Піфагор)',
    nameRu: 'Прямоугольный треугольник (Пифагор)',
    nameEn: 'Right Triangle (Pythagorean)',
    formula: 'c = √(a² + b²),  S = (a·b)/2,  P = a+b+c',
    descriptionUk: 'Гіпотенуза, площа, висота та гострі кути прямокутного трикутника',
    descriptionRu: 'Гипотенуза, площадь, высота и углы',
    descriptionEn: 'Hypotenuse, area, altitude, and angles of a right triangle',
    inputs: [
      { key: 'a', labelUk: 'Катет a', labelRu: 'Катет a', labelEn: 'Leg a', defaultValue: 3 },
      { key: 'b', labelUk: 'Катет b', labelRu: 'Катет b', labelEn: 'Leg b', defaultValue: 4 },
    ],
    calculate: ({ a, b }) => {
      const res = solveRightTriangle(Number(a), Number(b));
      return {
        resultFormatted: `c = ${res.hypotenuse},  S = ${res.area},  P = ${res.perimeter}`,
        insertValue: `${res.hypotenuse}`,
        steps: [
          `c = √(${a}² + ${b}²) = ${res.hypotenuse}`,
          `S = (${a} · ${b}) / 2 = ${res.area}`,
          `Гострі кути: α = ${res.angleAlphaDeg}°, β = ${res.angleBetaDeg}°`,
        ],
      };
    },
  },

  // 22. Heron's Formula
  {
    id: 'heron_triangle',
    num: 22,
    category: 'geometry',
    nameUk: 'Формула Герона (Площа трикутника)',
    nameRu: 'Формула Герона (Площадь треугольника)',
    nameEn: "Heron's Formula (Triangle Area)",
    formula: 'S = √(p(p-a)(p-b)(p-c))',
    descriptionUk: 'Площа довільного трикутника за довжинами трьох його сторін',
    descriptionRu: 'Площадь любого треугольника по трем сторонам',
    descriptionEn: 'Calculates triangle area, inradius, and circumradius by 3 sides',
    inputs: [
      { key: 'a', labelUk: 'Сторона a', labelRu: 'Сторона a', labelEn: 'Side a', defaultValue: 7 },
      { key: 'b', labelUk: 'Сторона b', labelRu: 'Сторона b', labelEn: 'Side b', defaultValue: 8 },
      { key: 'c', labelUk: 'Сторона c', labelRu: 'Сторона c', labelEn: 'Side c', defaultValue: 9 },
    ],
    calculate: ({ a, b, c }) => {
      const res = heronTriangle(Number(a), Number(b), Number(c));
      return {
        resultFormatted: res.valid ? `S = ${res.area},  r = ${res.inradius},  R = ${res.circumradius}` : 'Трикутник з такими сторонами не існує',
        insertValue: `${res.area}`,
        steps: res.valid
          ? [`Півпериметр p = (${a}+${b}+${c})/2 = ${res.semiperimeter}`, `S = √(${res.semiperimeter}·${res.semiperimeter - Number(a)}·${res.semiperimeter - Number(b)}·${res.semiperimeter - Number(c)}) = ${res.area}`]
          : ['Нерівність трикутника порушена: a+b > c'],
      };
    },
  },

  // 23. Law of Cosines
  {
    id: 'law_cosines',
    num: 23,
    category: 'geometry',
    nameUk: 'Теорема косинусів',
    nameRu: 'Теорема косинусов',
    nameEn: 'Law of Cosines',
    formula: 'c² = a² + b² - 2ab·cos(γ)',
    descriptionUk: 'Знаходження третьої сторони та площі за двома сторонами та кутом між ними',
    descriptionRu: 'Нахождение третьей стороны по двум сторонам и углу',
    descriptionEn: 'Calculates the third side and area from two sides and included angle',
    inputs: [
      { key: 'a', labelUk: 'Сторона a', labelRu: 'Сторона a', labelEn: 'Side a', defaultValue: 5 },
      { key: 'b', labelUk: 'Сторона b', labelRu: 'Сторона b', labelEn: 'Side b', defaultValue: 7 },
      { key: 'g', labelUk: 'Кут γ (градуси)', labelRu: 'Угол γ (градусы)', labelEn: 'Angle γ (deg)', defaultValue: 60 },
    ],
    calculate: ({ a, b, g }) => {
      const res = lawOfCosines(Number(a), Number(b), Number(g));
      return {
        resultFormatted: `c = ${res.c},  S = ${res.area}`,
        insertValue: `${res.c}`,
        steps: [`c² = ${a}² + ${b}² - 2·${a}·${b}·cos(${g}°)`, `c = √${(Number(a)**2 + Number(b)**2 - 2*Number(a)*Number(b)*Math.cos(Number(g)*Math.PI/180)).toFixed(2)} = ${res.c}`],
      };
    },
  },

  // 24. Circle & Sphere
  {
    id: 'circle_geometry',
    num: 24,
    category: 'geometry',
    nameUk: 'Коло, круг та сфера',
    nameRu: 'Круг, окружность и сфера',
    nameEn: 'Circle & Sphere Geometry',
    formula: 'L = 2πr,  S = πr²,  V_сфери = 4/3 πr³',
    descriptionUk: 'Довжина кола, площа круга, обʼєм та площа поверхні кулі',
    descriptionRu: 'Длина окружности, площадь круга и объем сферы',
    descriptionEn: 'Circumference, area, sphere volume and surface area',
    inputs: [{ key: 'r', labelUk: 'Радіус r', labelRu: 'Радиус r', labelEn: 'Radius r', defaultValue: 5 }],
    calculate: ({ r }) => {
      const res = solveCircleAndSphere(Number(r));
      return {
        resultFormatted: `L = ${res.circumference},  S = ${res.circleArea},  V_кулі = ${res.sphereVolume}`,
        insertValue: `${res.circleArea}`,
        steps: [
          `Довжина кола L = 2 · π · ${r} = ${res.circumference}`,
          `Площа круга S = π · ${r}² = ${res.circleArea}`,
          `Об'єм сфери V = (4/3) · π · ${r}³ = ${res.sphereVolume}`,
        ],
      };
    },
  },

  // 25. Regular Polygon
  {
    id: 'regular_polygon',
    num: 25,
    category: 'geometry',
    nameUk: 'Правильний многокутник (n-кутник)',
    nameRu: 'Правильный многоугольник',
    nameEn: 'Regular n-gon',
    formula: 'S = (n·a²) / (4·tg(π/n))',
    descriptionUk: 'Внутрішній кут, площа, радіуси вписаного та описаного кіл',
    descriptionRu: 'Углы, площадь и радиусы правильного многоугольника',
    descriptionEn: 'Interior angle, area, inradius, and circumradius of regular n-gon',
    inputs: [
      { key: 'n', labelUk: 'Кількість сторін n', labelRu: 'Число сторон n', labelEn: 'Sides n', defaultValue: 6 },
      { key: 'a', labelUk: 'Довжина сторони a', labelRu: 'Длина стороны a', labelEn: 'Side length a', defaultValue: 5 },
    ],
    calculate: ({ n, a }) => {
      const res = solveRegularPolygon(Number(n), Number(a));
      return {
        resultFormatted: `S = ${res.area},  P = ${res.perimeter},  Кут = ${res.interiorAngleDeg}°`,
        insertValue: `${res.area}`,
        steps: [
          `Сума внутрішніх кутів: (${n}-2)·180° = ${res.sumAnglesDeg}°`,
          `Один кут = ${res.interiorAngleDeg}°`,
          `Радіус вписаного кола r = ${res.inradius}, описаного R = ${res.circumradius}`,
        ],
      };
    },
  },

  // 26. Cylinder & Cone
  {
    id: 'cylinder_cone',
    num: 26,
    category: 'geometry',
    nameUk: 'Циліндр та конус',
    nameRu: 'Цилиндр и конус',
    nameEn: 'Cylinder & Cone',
    formula: 'V_цил = πr²h,  V_кон = (1/3)πr²h',
    descriptionUk: 'Обʼєми, твірна конуса та повні площі поверхонь',
    descriptionRu: 'Объемы и площади поверхностей цилиндра и конуса',
    descriptionEn: 'Volumes, slant height, and surface areas of cylinder and cone',
    inputs: [
      { key: 'r', labelUk: 'Радіус основи r', labelRu: 'Радиус r', labelEn: 'Radius r', defaultValue: 4 },
      { key: 'h', labelUk: 'Висота h', labelRu: 'Высота h', labelEn: 'Height h', defaultValue: 9 },
    ],
    calculate: ({ r, h }) => {
      const res = solveCylinderAndCone(Number(r), Number(h));
      return {
        resultFormatted: `V_циліндра = ${res.cylinderVolume},  V_конуса = ${res.coneVolume}`,
        insertValue: `${res.cylinderVolume}`,
        steps: [
          `V_циліндра = π · ${r}² · ${h} = ${res.cylinderVolume}`,
          `V_конуса = (1/3) · V_циліндра = ${res.coneVolume}`,
          `Твірна конуса l = √(${r}² + ${h}²) = ${res.coneSlantHeight}`,
        ],
      };
    },
  },

  // 27. Distance in 2D & 3D
  {
    id: 'distance_points',
    num: 27,
    category: 'geometry',
    nameUk: 'Відстань між двома точками 3D',
    nameRu: 'Расстояние между двумя точками 3D',
    nameEn: '3D Point Distance',
    formula: 'd = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)',
    descriptionUk: 'Евклідова відстань та координати середини відрізка',
    descriptionRu: 'Евклидово расстояние и координаты середины отрезка',
    descriptionEn: 'Euclidean distance and segment midpoint in 3D space',
    inputs: [
      { key: 'x1', labelUk: 'x1', labelRu: 'x1', labelEn: 'x1', defaultValue: 1 },
      { key: 'y1', labelUk: 'y1', labelRu: 'y1', labelEn: 'y1', defaultValue: 2 },
      { key: 'z1', labelUk: 'z1', labelRu: 'z1', labelEn: 'z1', defaultValue: 3 },
      { key: 'x2', labelUk: 'x2', labelRu: 'x2', labelEn: 'x2', defaultValue: 4 },
      { key: 'y2', labelUk: 'y2', labelRu: 'y2', labelEn: 'y2', defaultValue: 6 },
      { key: 'z2', labelUk: 'z2', labelRu: 'z2', labelEn: 'z2', defaultValue: 8 },
    ],
    calculate: ({ x1, y1, z1, x2, y2, z2 }) => {
      const dx = Number(x2) - Number(x1);
      const dy = Number(y2) - Number(y1);
      const dz = Number(z2) - Number(z1);
      const dist = Math.hypot(dx, dy, dz);
      const mid = {
        x: (Number(x1) + Number(x2)) / 2,
        y: (Number(y1) + Number(y2)) / 2,
        z: (Number(z1) + Number(z2)) / 2,
      };
      return {
        resultFormatted: `d = ${dist.toFixed(4)},  Середина M(${mid.x}, ${mid.y}, ${mid.z})`,
        insertValue: `${dist.toFixed(4)}`,
        steps: [`Δx = ${dx}, Δy = ${dy}, Δz = ${dz}`, `d = √(${dx}² + ${dy}² + ${dz}²) = ${dist.toFixed(4)}`],
      };
    },
  },

  // 28. Newton's 2nd Law
  {
    id: 'newton_second_law',
    num: 28,
    category: 'physics',
    nameUk: 'Другий закон Ньютона (F = m·a)',
    nameRu: 'Второй закон Ньютона (F = m·a)',
    nameEn: "Newton's Second Law",
    formula: 'F = m · a',
    descriptionUk: 'Рівнодійна сила, маса тіла та прискорення',
    descriptionRu: 'Сила, масса и ускорение',
    descriptionEn: 'Force, mass, and acceleration relationship',
    inputs: [
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 12 },
      { key: 'a', labelUk: 'Прискорення a (м/с²)', labelRu: 'Ускорение a (м/с²)', labelEn: 'Acceleration a (m/s²)', defaultValue: 2.5 },
    ],
    calculate: ({ m, a }) => {
      const f = Number(m) * Number(a);
      return {
        resultFormatted: `F = ${f.toFixed(2)} Н (Ньютонів)`,
        insertValue: `${f.toFixed(2)}`,
        steps: [`F = m · a = ${m} кг · ${a} м/с² = ${f.toFixed(2)} Н`],
      };
    },
  },

  // 29. Kinetic & Potential Energy
  {
    id: 'energy_kin_pot',
    num: 29,
    category: 'physics',
    nameUk: 'Кінетична та потенційна енергія',
    nameRu: 'Кинетическая и потенциальная энергия',
    nameEn: 'Kinetic & Potential Energy',
    formula: 'Ek = (m·v²)/2,  Ep = m·g·h',
    descriptionUk: 'Механічна енергія рухомого або піднятого тіла',
    descriptionRu: 'Кинетическая и гравитационная потенциальная энергия',
    descriptionEn: 'Mechanical energy: kinetic and gravitational potential',
    inputs: [
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 4 },
      { key: 'v', labelUk: 'Швидкість v (м/с)', labelRu: 'Скорость v (м/с)', labelEn: 'Speed v (m/s)', defaultValue: 15 },
      { key: 'h', labelUk: 'Висота h (м)', labelRu: 'Высота h (м)', labelEn: 'Height h (m)', defaultValue: 10 },
    ],
    calculate: ({ m, v, h }) => {
      const ek = (Number(m) * Number(v) ** 2) / 2;
      const ep = Number(m) * 9.80665 * Number(h);
      return {
        resultFormatted: `Ek = ${ek.toFixed(2)} Дж,  Ep = ${ep.toFixed(2)} Дж`,
        insertValue: `${ek.toFixed(2)}`,
        steps: [
          `Ek = (${m} · ${v}²) / 2 = ${ek.toFixed(2)} Дж`,
          `Ep = ${m} · 9.81 · ${h} = ${ep.toFixed(2)} Дж`,
          `Повна механічна енергія E = ${(ek + ep).toFixed(2)} Дж`,
        ],
      };
    },
  },

  // 30. Gravity Pendulum
  {
    id: 'gravity_pendulum',
    num: 30,
    category: 'physics',
    nameUk: 'Математичний маятник',
    nameRu: 'Математический маятник',
    nameEn: 'Simple Gravity Pendulum',
    formula: 'T = 2π √(l / g)',
    descriptionUk: 'Період коливань та циклічна частота нитяного маятника',
    descriptionRu: 'Период и частота колебаний маятника',
    descriptionEn: 'Oscillation period and frequency of gravity pendulum',
    inputs: [{ key: 'l', labelUk: 'Довжина нитки l (м)', labelRu: 'Длина нити l (м)', labelEn: 'Length l (m)', defaultValue: 1 }],
    calculate: ({ l }) => {
      const { periodS, frequencyHz } = pendulumPeriod(Number(l));
      return {
        resultFormatted: `T = ${periodS} с,  f = ${frequencyHz} Гц`,
        insertValue: `${periodS}`,
        steps: [`T = 2 · π · √(${l} / 9.81) = ${periodS} с`, `Частота f = 1 / T = ${frequencyHz} Гц`],
      };
    },
  },

  // 31. Spring Pendulum
  {
    id: 'spring_pendulum',
    num: 31,
    category: 'physics',
    nameUk: 'Пружинний маятник',
    nameRu: 'Пружинный маятник',
    nameEn: 'Spring Oscillator',
    formula: 'T = 2π √(m / k)',
    descriptionUk: 'Період коливань тягарця на пружині жорсткістю k',
    descriptionRu: 'Период колебаний груза на пружине',
    descriptionEn: 'Period and frequency of mass-spring oscillator',
    inputs: [
      { key: 'm', labelUk: 'Маса тягарця m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 0.5 },
      { key: 'k', labelUk: 'Жорсткість k (Н/м)', labelRu: 'Жесткость k (Н/м)', labelEn: 'Stiffness k (N/m)', defaultValue: 50 },
    ],
    calculate: ({ m, k }) => {
      const { periodS, frequencyHz } = springOscillation(Number(m), Number(k));
      return {
        resultFormatted: `T = ${periodS} с,  f = ${frequencyHz} Гц`,
        insertValue: `${periodS}`,
        steps: [`T = 2 · π · √(${m} / ${k}) = ${periodS} с`],
      };
    },
  },

  // 32. Coulomb's Law
  {
    id: 'coulomb_force',
    num: 32,
    category: 'physics',
    nameUk: 'Закон Кулона (Електростатика)',
    nameRu: 'Закон Кулона (Электростатика)',
    nameEn: "Coulomb's Law",
    formula: 'F = k · |q₁·q₂| / r²',
    descriptionUk: 'Сила взаємодії між двома точковими зарядами у вакуумі',
    descriptionRu: 'Сила взаимодействия между точечными зарядами',
    descriptionEn: 'Electrostatic force between two point charges',
    inputs: [
      { key: 'q1', labelUk: 'Заряд q1 (мкКл)', labelRu: 'Заряд q1 (мкКл)', labelEn: 'Charge q1 (µC)', defaultValue: 2 },
      { key: 'q2', labelUk: 'Заряд q2 (мкКл)', labelRu: 'Заряд q2 (мкКл)', labelEn: 'Charge q2 (µC)', defaultValue: -5 },
      { key: 'r', labelUk: 'Відстань r (м)', labelRu: 'Расстояние r (м)', labelEn: 'Distance r (m)', defaultValue: 0.1 },
    ],
    calculate: ({ q1, q2, r }) => {
      const { forceN } = coulombForce(Number(q1), Number(q2), Number(r));
      return {
        resultFormatted: `F = ${forceN} Н`,
        insertValue: `${forceN}`,
        steps: [
          `k = 8.99 · 10⁹ Н·м²/Кл²`,
          `F = (8.99e9 · |${q1}e-6 · ${q2}e-6|) / ${r}² = ${forceN} Н`,
        ],
      };
    },
  },

  // 33. Projectile Motion
  {
    id: 'projectile_motion',
    num: 33,
    category: 'physics',
    nameUk: 'Балістика: Політ під кутом',
    nameRu: 'Баллистика: Полет под углом',
    nameEn: 'Projectile Motion',
    formula: 'H_max = (v₀²·sin²α)/(2g),  L = (v₀²·sin2α)/g',
    descriptionUk: 'Максимальна висота підйому, дальність та час польоту тіла',
    descriptionRu: 'Дальность, высота и время полета тела',
    descriptionEn: 'Range, max height, and flight duration of a projectile',
    inputs: [
      { key: 'v0', labelUk: 'Початкова швидкість v0 (м/с)', labelRu: 'Скорость v0 (м/с)', labelEn: 'Initial speed v0 (m/s)', defaultValue: 20 },
      { key: 'ang', labelUk: 'Кут до горизонту α (°)', labelRu: 'Угол α (°)', labelEn: 'Angle α (°)', defaultValue: 45 },
    ],
    calculate: ({ v0, ang }) => {
      const res = solveProjectileMotion(Number(v0), Number(ang));
      return {
        resultFormatted: `Дальність: ${res.totalRange} м,  H_max: ${res.maxHeight} м,  Час: ${res.flightTime} с`,
        insertValue: `${res.totalRange}`,
        steps: [
          `H_max = (${v0}² · sin²(${ang}°)) / (2 · 9.81) = ${res.maxHeight} м`,
          `Дальність L = (${v0}² · sin(2·${ang}°)) / 9.81 = ${res.totalRange} м`,
        ],
      };
    },
  },

  // 34. Ideal Gas Law
  {
    id: 'ideal_gas_law',
    num: 34,
    category: 'physics',
    nameUk: 'Рівняння Менделєєва-Клапейрона',
    nameRu: 'Уравнение Менделеева-Клапейрона',
    nameEn: 'Ideal Gas Law (PV = nRT)',
    formula: 'P · V = n · R · T',
    descriptionUk: 'Тиск, обʼєм, кількість моль або температура ідеального газу',
    descriptionRu: 'Состояние идеального газа',
    descriptionEn: 'Pressure, volume, moles, and temperature relationship',
    inputs: [
      { key: 'p', labelUk: 'Тиск P (кПа)', labelRu: 'Давление P (кПа)', labelEn: 'Pressure P (kPa)', defaultValue: 101.3 },
      { key: 'v', labelUk: 'Обʼєм V (л)', labelRu: 'Объем V (л)', labelEn: 'Volume V (L)', defaultValue: 22.4 },
      { key: 'n', labelUk: 'Кількість n (моль)', labelRu: 'Количество n (моль)', labelEn: 'Moles n', defaultValue: 1 },
      { key: 't', labelUk: 'Температура T (°C)', labelRu: 'Температура T (°C)', labelEn: 'Temp T (°C)', defaultValue: 0 },
    ],
    calculate: ({ p, v, n, t }) => {
      const res = solveIdealGas(Number(p), Number(v), Number(n), Number(t));
      const formatted = `P = ${res.p_kPa} кПа,  V = ${res.v_L} л,  n = ${res.n_mol} моль,  T = ${res.t_C} °C (${res.t_K} К)`;
      return {
        resultFormatted: formatted,
        insertValue: `${res.p_kPa}`,
        steps: [`Універсальна газова стала R = 8.314 Дж/(моль·К)`, formatted],
      };
    },
  },

  // 35. Heat Transfer
  {
    id: 'heat_transfer_q',
    num: 35,
    category: 'physics',
    nameUk: 'Теплота нагрівання Q = c·m·ΔT',
    nameRu: 'Теплота нагрева Q = c·m·ΔT',
    nameEn: 'Thermal Heat Transfer',
    formula: 'Q = c · m · ΔT',
    descriptionUk: 'Кількість теплоти для нагрівання або охолодження речовини',
    descriptionRu: 'Количество теплоты нагрева или охлаждения',
    descriptionEn: 'Heat energy absorbed or released during temperature change',
    inputs: [
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 2 },
      { key: 'c', labelUk: 'Питома теплоємність c (Дж/кг·°C)', labelRu: 'Теплоемкость c (Дж/кг·°C)', labelEn: 'Specific heat c (J/kg·°C)', defaultValue: 4184 },
      { key: 'dt', labelUk: 'Різниця температур ΔT (°C)', labelRu: 'Разность температур ΔT (°C)', labelEn: 'Temp delta ΔT (°C)', defaultValue: 50 },
    ],
    calculate: ({ m, c, dt }) => {
      const res = calculateHeatTransfer(Number(m), Number(c), Number(dt));
      return {
        resultFormatted: `Q = ${res.kiloJoules} кДж  (${res.kiloCalories} ккал)`,
        insertValue: `${res.kiloJoules}`,
        steps: [`Q = ${m} кг · ${c} Дж/(кг·°C) · ${dt} °C = ${res.joules} Дж = ${res.kiloJoules} кДж`],
      };
    },
  },

  // 36. Ohm's Law
  {
    id: 'ohm_law',
    num: 36,
    category: 'electronics',
    nameUk: 'Закон Ома (U, I, R, P)',
    nameRu: 'Закон Ома (U, I, R, P)',
    nameEn: "Ohm's Law",
    formula: 'U = I · R,  P = U · I = I² · R',
    descriptionUk: 'Напруга, сила струму, електричний опір та потужність',
    descriptionRu: 'Напряжение, ток, сопротивление и мощность',
    descriptionEn: 'Voltage, current, resistance, and electrical power',
    inputs: [
      { key: 'u', labelUk: 'Напруга U (В)', labelRu: 'Напряжение U (В)', labelEn: 'Voltage U (V)', defaultValue: 230 },
      { key: 'i', labelUk: 'Струм I (А)', labelRu: 'Ток I (А)', labelEn: 'Current I (A)', defaultValue: 4.5 },
    ],
    calculate: ({ u, i }) => {
      const res = calculateOhmLaw(Number(u), Number(i), 0);
      return {
        resultFormatted: `R = ${res.resistance} Ом,  P = ${res.power} Вт`,
        insertValue: `${res.resistance}`,
        steps: [
          `Опір R = U / I = ${u} / ${i} = ${res.resistance} Ом`,
          `Потужність P = U · I = ${u} · ${i} = ${res.power} Вт`,
        ],
      };
    },
  },

  // 37. Resistors Series & Parallel
  {
    id: 'resistors_combination',
    num: 37,
    category: 'electronics',
    nameUk: 'Послідовні та паралельні резистори',
    nameRu: 'Последовательные и параллельные резисторы',
    nameEn: 'Resistors in Series & Parallel',
    formula: 'R_посл = R1+R2+R3,  1/R_пар = 1/R1+1/R2+1/R3',
    descriptionUk: 'Еквівалентний опір при послідовному та паралельному зʼєднанні',
    descriptionRu: 'Эквивалентное сопротивление цепи',
    descriptionEn: 'Equivalent resistance for series and parallel networks',
    inputs: [
      { key: 'r1', labelUk: 'Резистор R1 (Ом)', labelRu: 'R1 (Ом)', labelEn: 'R1 (Ω)', defaultValue: 100 },
      { key: 'r2', labelUk: 'Резистор R2 (Ом)', labelRu: 'R2 (Ом)', labelEn: 'R2 (Ω)', defaultValue: 200 },
      { key: 'r3', labelUk: 'Резистор R3 (Ом)', labelRu: 'R3 (Ом)', labelEn: 'R3 (Ω)', defaultValue: 300 },
    ],
    calculate: ({ r1, r2, r3 }) => {
      const list = [Number(r1), Number(r2), Number(r3)];
      const ser = seriesResistors(list);
      const par = parallelResistors(list);
      return {
        resultFormatted: `R_послідовне = ${ser} Ом,  R_паралельне = ${par} Ом`,
        insertValue: `${par}`,
        steps: [
          `Послідовно: ${r1} + ${r2} + ${r3} = ${ser} Ом`,
          `Паралельно: 1 / (1/${r1} + 1/${r2} + 1/${r3}) = ${par} Ом`,
        ],
      };
    },
  },

  // 38. RC Filter Time Constant
  {
    id: 'rc_filter_tau',
    num: 38,
    category: 'electronics',
    nameUk: 'RC-ланцюг: Постійна часу τ',
    nameRu: 'RC-цепочка: Постоянная времени τ',
    nameEn: 'RC Circuit Time Constant',
    formula: 'τ = R · C,  f_c = 1 / (2πRC)',
    descriptionUk: 'Час заряду конденсатора та частота зрізу фільтра низьких частот',
    descriptionRu: 'Время заряда конденсатора и частота среза',
    descriptionEn: 'Capacitor charging time constant and cutoff frequency',
    inputs: [
      { key: 'r', labelUk: 'Опір R (Ом)', labelRu: 'Опор R (Ом)', labelEn: 'Resistance R (Ω)', defaultValue: 10000 },
      { key: 'c', labelUk: 'Ємність C (мкФ)', labelRu: 'Емкость C (мкФ)', labelEn: 'Capacitance C (µF)', defaultValue: 10 },
    ],
    calculate: ({ r, c }) => {
      const res = rcFilter(Number(r), Number(c));
      return {
        resultFormatted: `τ = ${res.tauMs} мс,  fc = ${res.cutoffFreqHz} Гц`,
        insertValue: `${res.tauMs}`,
        steps: [
          `τ = ${r} Ом · (${c} · 10⁻⁶ Ф) = ${res.tauMs} мс`,
          `Частота зрізу fc = 1 / (2π · τ) = ${res.cutoffFreqHz} Гц`,
          `99% повного заряду (5τ) = ${res.time99PctMs} мс`,
        ],
      };
    },
  },

  // 39. Voltage Divider
  {
    id: 'voltage_divider',
    num: 39,
    category: 'electronics',
    nameUk: 'Дільник напруги',
    nameRu: 'Делитель напряжения',
    nameEn: 'Voltage Divider',
    formula: 'V_out = V_in · (R2 / (R1 + R2))',
    descriptionUk: 'Розрахунок вихідної напруги на нижньому плечі дільника',
    descriptionRu: 'Расчет выходного напряжения делителя',
    descriptionEn: 'Output voltage calculated from resistor divider network',
    inputs: [
      { key: 'vin', labelUk: 'Вхідна напруга Vin (В)', labelRu: 'Вход Vin (В)', labelEn: 'Input Vin (V)', defaultValue: 12 },
      { key: 'r1', labelUk: 'Верхній резистор R1 (Ом)', labelRu: 'Верхний R1 (Ом)', labelEn: 'Top R1 (Ω)', defaultValue: 10000 },
      { key: 'r2', labelUk: 'Нижній резистор R2 (Ом)', labelRu: 'Нижний R2 (Ом)', labelEn: 'Bottom R2 (Ω)', defaultValue: 3300 },
    ],
    calculate: ({ vin, r1, r2 }) => {
      const res = voltageDivider(Number(vin), Number(r1), Number(r2));
      return {
        resultFormatted: `V_out = ${res.vOut} В (коефіцієнт k = ${res.ratio})`,
        insertValue: `${res.vOut}`,
        steps: [`V_out = ${vin} · (${r2} / (${r1} + ${r2})) = ${res.vOut} В`],
      };
    },
  },

  // 40. LED Resistor
  {
    id: 'led_resistor',
    num: 40,
    category: 'electronics',
    nameUk: 'Резистор для світлодіода (LED)',
    nameRu: 'Резистор для светодиода (LED)',
    nameEn: 'Current Limiting LED Resistor',
    formula: 'R = (V_живлення - V_led) / I_led',
    descriptionUk: 'Струмообмежувальний резистор та підбір найближчого номіналу ряду E24',
    descriptionRu: 'Расчет балластного резистора для LED',
    descriptionEn: 'Calculates ballast resistor and nearest standard E24 value',
    inputs: [
      { key: 'vs', labelUk: 'Живлення V_cc (В)', labelRu: 'Питание V_cc (В)', labelEn: 'Supply V_cc (V)', defaultValue: 5 },
      { key: 'vled', labelUk: 'Падіння на LED (В)', labelRu: 'Падение на LED (В)', labelEn: 'LED Forward V (V)', defaultValue: 2.1 },
      { key: 'iled', labelUk: 'Струм LED (мА)', labelRu: 'Ток LED (мА)', labelEn: 'LED Current (mA)', defaultValue: 20 },
    ],
    calculate: ({ vs, vled, iled }) => {
      const res = calculateLedResistor(Number(vs), Number(vled), Number(iled));
      return {
        resultFormatted: `R = ${res.resistorOhms} Ом  (Ряд E24: ${res.standardE24Ohm} Ом)`,
        insertValue: `${res.standardE24Ohm}`,
        steps: [
          `Падіння на резисторі: ${vs}В - ${vled}В = ${(Number(vs) - Number(vled)).toFixed(2)} В`,
          `R = ΔV / I = ${(Number(vs) - Number(vled)).toFixed(2)} В / ${Number(iled) / 1000} А = ${res.resistorOhms} Ом`,
          `Потужність резистора: ${res.resistorPowerMW} мВт`,
        ],
      };
    },
  },

  // 41. Molar Mass
  {
    id: 'molar_mass',
    num: 41,
    category: 'chemistry',
    nameUk: 'Молярна маса хімічних речовин',
    nameRu: 'Молярная масса химических соединений',
    nameEn: 'Molar Mass & Composition',
    formula: 'M = Σ (Nᵢ · A_r(Eᵢ))',
    descriptionUk: 'Автоматичний парсинг формули (H2SO4, C6H12O6, NaCl) та масові частки',
    descriptionRu: 'Расчет молярной массы и массовых долей элементов',
    descriptionEn: 'Formula parser (H2SO4, C6H12O6) with elemental mass percentages',
    inputs: [{ key: 'formula', labelUk: 'Хімічна формула', labelRu: 'Формула', labelEn: 'Chemical formula', defaultValue: 'H2SO4', type: 'text' }],
    calculate: ({ formula }) => {
      const res = calculateMolarMass(String(formula));
      return {
        resultFormatted: `M(${formula}) = ${res.molarMass} г/моль`,
        insertValue: `${res.molarMass}`,
        steps: res.elements.length > 0
          ? res.elements.map((e) => `${e.symbol} × ${e.count}: ${e.totalMass} г/моль (${e.massPercent}%)`)
          : ['Введіть коректну хімічну формулу, наприклад H2O або H2SO4'],
      };
    },
  },

  // 42. Solution Dilution
  {
    id: 'solution_dilution',
    num: 42,
    category: 'chemistry',
    nameUk: 'Розведення розчинів (C1·V1 = C2·V2)',
    nameRu: 'Разбавление растворов (C1·V1 = C2·V2)',
    nameEn: 'Solution Dilution',
    formula: 'C₁ · V₁ = C₂ · V₂',
    descriptionUk: 'Розрахунок обʼєму води для розведення концентрату до потрібної концентрації',
    descriptionRu: 'Расчет разбавления растворов',
    descriptionEn: 'Calculates required solvent volume to dilute a stock solution',
    inputs: [
      { key: 'c1', labelUk: 'Початкова концентрація C1 (%)', labelRu: 'Начальная C1 (%)', labelEn: 'Stock conc C1 (%)', defaultValue: 70 },
      { key: 'v1', labelUk: 'Початковий обʼєм V1 (мл)', labelRu: 'Начальный объем V1 (мл)', labelEn: 'Stock volume V1 (mL)', defaultValue: 100 },
      { key: 'c2', labelUk: 'Цільова концентрація C2 (%)', labelRu: 'Целевая C2 (%)', labelEn: 'Target conc C2 (%)', defaultValue: 9 },
    ],
    calculate: ({ c1, v1, c2 }) => {
      const res = calculateDilution(Number(c1), Number(v1), Number(c2));
      return {
        resultFormatted: `Підсумковий V2 = ${res.requiredV2} мл  (Додати води: ${res.waterToAdd} мл)`,
        insertValue: `${res.waterToAdd}`,
        steps: [
          `V2 = (C1 · V1) / C2 = (${c1} · ${v1}) / ${c2} = ${res.requiredV2} мл`,
          `Води додати: V2 - V1 = ${res.requiredV2} - ${v1} = ${res.waterToAdd} мл`,
        ],
      };
    },
  },

  // 43. pH and pOH
  {
    id: 'ph_poh',
    num: 43,
    category: 'chemistry',
    nameUk: 'Розрахунок pH, pOH та [H+]',
    nameRu: 'Расчет pH, pOH и [H+]',
    nameEn: 'pH and pOH Acid-Base',
    formula: 'pH = -lg[H⁺],  pH + pOH = 14',
    descriptionUk: 'Водневий показник, концентрація іонів гідроксонію та гідроксиду',
    descriptionRu: 'Водородный показатель и концентрация ионов',
    descriptionEn: 'Hydrogen ion concentration [H+] and hydroxide [OH-]',
    inputs: [{ key: 'ph', labelUk: 'Значення pH', labelRu: 'Значение pH', labelEn: 'pH value', defaultValue: 4.5 }],
    calculate: ({ ph }) => {
      const res = phConverter(Number(ph));
      return {
        resultFormatted: `pH = ${res.ph},  pOH = ${res.poh}  [${res.typeUk}]`,
        insertValue: `${res.ph}`,
        steps: [
          `pOH = 14 - ${res.ph} = ${res.poh}`,
          `[H⁺] = 10^(-${res.ph}) = ${res.hPlusM} моль/л`,
          `[OH⁻] = 10^(-${res.poh}) = ${res.ohMinusM} моль/л`,
        ],
      };
    },
  },

  // 44. DNA Reverse Complement & GC%
  {
    id: 'dna_gc',
    num: 44,
    category: 'chemistry',
    nameUk: 'ДНК: Комплементарність та GC%',
    nameRu: 'ДНК: Комплементарность и GC%',
    nameEn: 'DNA Reverse Complement & GC%',
    formula: 'A=T, G≡C,  GC% = (G+C)/L · 100%',
    descriptionUk: 'Комплементарний ланцюг, транскрипція в мРНК та відсоток GC-пар',
    descriptionRu: 'Комплементарная цепь и GC состав',
    descriptionEn: 'Reverse complement, mRNA transcription, and GC content',
    inputs: [{ key: 'seq', labelUk: 'Ланцюг ДНК (5\'->3\')', labelRu: 'Цепь ДНК (5\'->3\')', labelEn: 'DNA sequence (5\'->3\')', defaultValue: 'ATGCGATCGATCGATC', type: 'text' }],
    calculate: ({ seq }) => {
      const res = dnaComplementAndGC(String(seq));
      return {
        resultFormatted: `GC-вміст: ${res.gcPercent}%,  Довжина: ${res.length} bp`,
        insertValue: `${res.gcPercent}`,
        steps: [
          `Вхідна послідовність: ${res.cleanSeq}`,
          `Комплементарний ланцюг: ${res.complement}`,
          `Транскрипція мРНК: ${res.rna}`,
        ],
      };
    },
  },

  // 45. Compound Interest
  {
    id: 'compound_interest',
    num: 45,
    category: 'finance',
    nameUk: 'Складні відсотки (Капіталізація)',
    nameRu: 'Сложные проценты (Капитализация)',
    nameEn: 'Compound Interest',
    formula: 'S = P · (1 + r/n)ⁿᵗ',
    descriptionUk: 'Нарощення депозиту або інвестицій з щомісячною капіталізацією',
    descriptionRu: 'Капитализация вклада и чистая доходность',
    descriptionEn: 'Future investment value with compound interest',
    inputs: [
      { key: 'p', labelUk: 'Початкова сума P (грн)', labelRu: 'Сумма P', labelEn: 'Principal P', defaultValue: 50000 },
      { key: 'r', labelUk: 'Річна ставка r (%)', labelRu: 'Ставка r (%)', labelEn: 'Annual rate r (%)', defaultValue: 14 },
      { key: 't', labelUk: 'Термін t (років)', labelRu: 'Срок t (лет)', labelEn: 'Term t (years)', defaultValue: 3 },
    ],
    calculate: ({ p, r, t }) => {
      const res = compoundInterestPeriodic(Number(p), Number(r), Number(t), 12);
      return {
        resultFormatted: `Підсумок: ${res.finalBalance} грн  (Чистий дохід: +${res.interestEarned} грн)`,
        insertValue: `${res.finalBalance}`,
        steps: [
          `Щомісячна капіталізація (12 разів на рік)`,
          `Підсумкова сума: ${res.finalBalance} грн`,
          `Нараховані відсотки: ${res.interestEarned} грн`,
        ],
      };
    },
  },

  // 46. Annuity Loan
  {
    id: 'annuity_loan',
    num: 46,
    category: 'finance',
    nameUk: 'Кредит / Ануїтетний платіж',
    nameRu: 'Кредит / Аннуитетный платеж',
    nameEn: 'Amortized Loan Payment',
    formula: 'A = P · (i(1+i)ⁿ) / ((1+i)ⁿ - 1)',
    descriptionUk: 'Щомісячний фіксований платіж, загальна переплата за відсотками',
    descriptionRu: 'Ежемесячный платеж и переплата по кредиту',
    descriptionEn: 'Monthly amortized payment and interest overpayment',
    inputs: [
      { key: 'p', labelUk: 'Сума кредиту (грн)', labelRu: 'Сумма кредита', labelEn: 'Loan amount', defaultValue: 100000 },
      { key: 'r', labelUk: 'Річна ставка (%)', labelRu: 'Ставка (%)', labelEn: 'Rate (%)', defaultValue: 18 },
      { key: 'm', labelUk: 'Термін (місяців)', labelRu: 'Срок (месяцев)', labelEn: 'Months', defaultValue: 24 },
    ],
    calculate: ({ p, r, m }) => {
      const res = solveAnnuityLoan(Number(p), Number(r), Number(m));
      return {
        resultFormatted: `Щомісяця: ${res.monthlyPayment} грн  (Переплата: ${res.totalInterest} грн)`,
        insertValue: `${res.monthlyPayment}`,
        steps: [
          `Щомісячний платіж: ${res.monthlyPayment} грн`,
          `Всього буде виплачено: ${res.totalPayment} грн`,
          `Переплата за відсотками: ${res.totalInterest} грн (${res.overpaymentPct}%)`,
        ],
      };
    },
  },

  // 47. Rule of 72
  {
    id: 'rule_of_72',
    num: 47,
    category: 'finance',
    nameUk: 'Правило 72 (Подвоєння капіталу)',
    nameRu: 'Правило 72 (Удвоение капитала)',
    nameEn: 'Rule of 72 Doubling Time',
    formula: 'T ≈ 72 / r',
    descriptionUk: 'Приблизний термін у роках для подвоєння вкладу за річною процентною ставкою',
    descriptionRu: 'Срок удвоения капитала при заданной ставке',
    descriptionEn: 'Approximates years required to double money at interest rate r',
    inputs: [{ key: 'r', labelUk: 'Річна ставка r (%)', labelRu: 'Ставка r (%)', labelEn: 'Rate r (%)', defaultValue: 12 }],
    calculate: ({ r }) => {
      const years = ruleOf72(Number(r));
      return {
        resultFormatted: `Подвоєння за ≈ ${years} років`,
        insertValue: `${years}`,
        steps: [`72 / ${r}% ≈ ${years} років для подвоєння капіталу`],
      };
    },
  },

  // 48. Break-Even Analysis
  {
    id: 'break_even',
    num: 48,
    category: 'finance',
    nameUk: 'Точка беззбитковості (Break-even)',
    nameRu: 'Точка безубыточности',
    nameEn: 'Break-Even Analysis',
    formula: 'Q = Постійні витрати / (Ціна - Змінні витрати)',
    descriptionUk: 'Мінімальний обсяг продажів для виходу бізнесу в нуль',
    descriptionRu: 'Объем продаж для покрытия всех затрат',
    descriptionEn: 'Units and revenue required to cover fixed and variable costs',
    inputs: [
      { key: 'fc', labelUk: 'Постійні витрати FC (грн)', labelRu: 'Постоянные затраты FC', labelEn: 'Fixed costs FC', defaultValue: 80000 },
      { key: 'p', labelUk: 'Ціна за одиницю P (грн)', labelRu: 'Цена за штуку P', labelEn: 'Price per unit P', defaultValue: 500 },
      { key: 'vc', labelUk: 'Змінні витрати на шт VC (грн)', labelRu: 'Переменные затраты VC', labelEn: 'Variable cost/unit VC', defaultValue: 300 },
    ],
    calculate: ({ fc, p, vc }) => {
      const res = breakEvenAnalysis(Number(fc), Number(p), Number(vc));
      return {
        resultFormatted: `Беззбитковість: ${res.units} од.  (Виторг: ${res.revenue} грн)`,
        insertValue: `${res.units}`,
        steps: [
          `Маржинальний дохід на одиницю: ${p} - ${vc} = ${Number(p) - Number(vc)} грн`,
          `Точка беззбитковості: ${fc} / (${p} - ${vc}) = ${res.units} шт`,
        ],
      };
    },
  },

  // 49. VAT / Tax
  {
    id: 'vat_tax',
    num: 49,
    category: 'finance',
    nameUk: 'ПДВ 20% (Нарахування та виділення)',
    nameRu: 'НДС 20% (Начисление и выделение)',
    nameEn: 'VAT / Sales Tax',
    formula: 'ПДВ зверху = S·0.20,  У тому числі = S/6',
    descriptionUk: 'Нарахування податку на чисту суму або виділення ПДВ із загальної суми',
    descriptionRu: 'Начисление и выделение НДС',
    descriptionEn: 'Add tax on top or extract included tax portion',
    inputs: [
      { key: 'sum', labelUk: 'Сума (грн)', labelRu: 'Сумма', labelEn: 'Amount', defaultValue: 12000 },
      { key: 'rate', labelUk: 'Ставка ПДВ (%)', labelRu: 'Ставка (%)', labelEn: 'VAT Rate (%)', defaultValue: 20 },
    ],
    calculate: ({ sum, rate }) => {
      const res = calculateVAT(Number(sum), Number(rate));
      return {
        resultFormatted: `Зверху: +${res.addedVat} грн (Разом: ${res.totalWithVat}),  У т.ч.: ${res.extractedVat} грн`,
        insertValue: `${res.addedVat}`,
        steps: [
          `Нарахувати ${rate}%: ${sum} · ${rate/100} = +${res.addedVat} грн -> Всього ${res.totalWithVat} грн`,
          `Виділити з ${sum} грн: ПДВ у т.ч. = ${res.extractedVat} грн (База: ${res.cleanBase} грн)`,
        ],
      };
    },
  },

  // 50. Dataset Statistics
  {
    id: 'stats_dataset',
    num: 50,
    category: 'stats',
    nameUk: 'Статистика вибірки (x̄, Me, σ, s²)',
    nameRu: 'Статистика выборки (x̄, Me, σ, s²)',
    nameEn: 'Descriptive Statistics',
    formula: 'x̄ = Σx/n,  s² = Σ(x-x̄)²/(n-1)',
    descriptionUk: 'Середнє арифметичне, медіана, дисперсія та стандартне відхилення',
    descriptionRu: 'Среднее, медиана, дисперсия и отклонение',
    descriptionEn: 'Mean, median, variance, sample standard deviation',
    inputs: [{ key: 'data', labelUk: 'Числа через пробіл або кому', labelRu: 'Числа через запятую', labelEn: 'Numbers separated by commas', defaultValue: '12, 15, 18, 22, 25, 29, 31, 35', type: 'text' }],
    calculate: ({ data }) => {
      const arr = String(data).split(/[\s,;]+/).map(Number).filter(Number.isFinite);
      const res = calculateDatasetStats(arr);
      return {
        resultFormatted: `x̄ = ${res.mean},  Me = ${res.median},  σ = ${res.stdDev}`,
        insertValue: `${res.mean}`,
        steps: [
          `Кількість елементів: ${res.count}`,
          `Сума елементів: ${res.sum}`,
          `Середнє арифметичне: ${res.mean}`,
          `Медіана: ${res.median}`,
          `Стандартне відхилення σ: ${res.stdDev}`,
        ],
      };
    },
  },

  // 51. 3D Vector Operations
  {
    id: 'vector_ops_3d',
    num: 51,
    category: 'stats',
    nameUk: '3D Вектори: Скалярний та векторний добуток',
    nameRu: '3D Векторы: Скалярное и векторное произведение',
    nameEn: '3D Vectors: Dot & Cross Product',
    formula: 'v₁·v₂ = |v₁||v₂|cos θ,  v₁ × v₂',
    descriptionUk: 'Скалярний добуток, кут між векторами у градусах та векторний добуток',
    descriptionRu: 'Скалярное и векторное произведение',
    descriptionEn: 'Dot product, cross product, and angle between 3D vectors',
    inputs: [
      { key: 'x1', labelUk: 'x1', labelRu: 'x1', labelEn: 'x1', defaultValue: 1 },
      { key: 'y1', labelUk: 'y1', labelRu: 'y1', labelEn: 'y1', defaultValue: 2 },
      { key: 'z1', labelUk: 'z1', labelRu: 'z1', labelEn: 'z1', defaultValue: 3 },
      { key: 'x2', labelUk: 'x2', labelRu: 'x2', labelEn: 'x2', defaultValue: 4 },
      { key: 'y2', labelUk: 'y2', labelRu: 'y2', labelEn: 'y2', defaultValue: -5 },
      { key: 'z2', labelUk: 'z2', labelRu: 'z2', labelEn: 'z2', defaultValue: 6 },
    ],
    calculate: ({ x1, y1, z1, x2, y2, z2 }) => {
      const res = vector3dOperations(
        { x: Number(x1), y: Number(y1), z: Number(z1) },
        { x: Number(x2), y: Number(y2), z: Number(z2) }
      );
      return {
        resultFormatted: `v₁·v₂ = ${res.dotProduct},  Кут = ${res.angleDeg}°,  v₁×v₂ = (${res.crossProduct.x}, ${res.crossProduct.y}, ${res.crossProduct.z})`,
        insertValue: `${res.dotProduct}`,
        steps: [
          `|v₁| = ${res.mag1},  |v₂| = ${res.mag2}`,
          `Скалярний добуток: ${x1}·${x2} + ${y1}·${y2} + ${z1}·${z2} = ${res.dotProduct}`,
          `Кут між векторами: ${res.angleDeg}°`,
        ],
      };
    },
  },

  // 52. 2x2 Matrix Determinant & Inverse
  {
    id: 'matrix_2x2',
    num: 52,
    category: 'stats',
    nameUk: 'Матриця 2×2: Визначник та обернена',
    nameRu: 'Матрица 2×2: Определитель и обратная',
    nameEn: '2x2 Matrix Determinant & Inverse',
    formula: 'det(A) = ad - bc,  A⁻¹ = (1/det) · [[d, -b], [-c, a]]',
    descriptionUk: 'Визначник та обернена матриця другого порядку',
    descriptionRu: 'Определитель и обратная матрица',
    descriptionEn: 'Determinant and inverse for a 2x2 square matrix',
    inputs: [
      { key: 'a', labelUk: 'a11', labelRu: 'a11', labelEn: 'a11', defaultValue: 4 },
      { key: 'b', labelUk: 'a12', labelRu: 'a12', labelEn: 'a12', defaultValue: 7 },
      { key: 'c', labelUk: 'a21', labelRu: 'a21', labelEn: 'a21', defaultValue: 2 },
      { key: 'd', labelUk: 'a22', labelRu: 'a22', labelEn: 'a22', defaultValue: 6 },
    ],
    calculate: ({ a, b, c, d }) => {
      const det = determinant2x2(Number(a), Number(b), Number(c), Number(d));
      const inv = inverse2x2(Number(a), Number(b), Number(c), Number(d));
      return {
        resultFormatted: `det(A) = ${det}`,
        insertValue: `${det}`,
        steps: [
          `det = (${a} · ${d}) - (${b} · ${c}) = ${det}`,
          inv.inv ? `A⁻¹ = [[${inv.inv[0][0]}, ${inv.inv[0][1]}], [${inv.inv[1][0]}, ${inv.inv[1][1]}]]` : 'Матриця вироджена (det = 0)',
        ],
      };
    },
  },

  // 53. BMI and Ideal Weight
  {
    id: 'bmi_health',
    num: 53,
    category: 'daily',
    nameUk: 'Індекс маси тіла (ІМТ / BMI)',
    nameRu: 'Индекс массы тела (ИМТ / BMI)',
    nameEn: 'Body Mass Index (BMI)',
    formula: 'BMI = вага (кг) / (зріст (м))²',
    descriptionUk: 'Оцінка відповідності маси тіла та зросту, діапазон норми',
    descriptionRu: 'Оценка веса тела и нормы',
    descriptionEn: 'Body mass index and healthy weight range',
    inputs: [
      { key: 'w', labelUk: 'Вага (кг)', labelRu: 'Вес (кг)', labelEn: 'Weight (kg)', defaultValue: 70 },
      { key: 'h', labelUk: 'Зріст (см)', labelRu: 'Рост (см)', labelEn: 'Height (cm)', defaultValue: 175 },
    ],
    calculate: ({ w, h }) => {
      const res = calculateBMI(Number(w), Number(h));
      const catNamesUk: Record<string, string> = {
        underweight: 'Дефіцит маси',
        normal: 'Нормальна вага',
        overweight: 'Надлишкова вага',
        obese: 'Ожиріння',
      };
      return {
        resultFormatted: `ІМТ = ${res.bmi}  [${catNamesUk[res.category] || res.category}]`,
        insertValue: `${res.bmi}`,
        steps: [
          `ІМТ = ${w} / (${Number(h)/100})² = ${res.bmi}`,
          `Ідеальний діапазон ваги: ${res.idealWeightMin} – ${res.idealWeightMax} кг`,
        ],
      };
    },
  },

  // 54. BMR Calorie Calculator
  {
    id: 'bmr_calories',
    num: 54,
    category: 'daily',
    nameUk: 'Базальний метаболізм (BMR Міффліна)',
    nameRu: 'Базальный метаболизм (BMR Миффлина)',
    nameEn: 'BMR & Daily Calorie Needs',
    formula: 'BMR = 10m + 6.25h - 5a + s',
    descriptionUk: 'Базовий добовий рівень калорій та добова норма за активністю',
    descriptionRu: 'Суточная норма калорий по формуле Миффлина-Сан Жеора',
    descriptionEn: 'Mifflin-St Jeor formula for basal metabolic rate and TDEE',
    inputs: [
      { key: 'w', labelUk: 'Вага (кг)', labelRu: 'Вес (кг)', labelEn: 'Weight (kg)', defaultValue: 72 },
      { key: 'h', labelUk: 'Зріст (см)', labelRu: 'Рост (см)', labelEn: 'Height (cm)', defaultValue: 178 },
      { key: 'age', labelUk: 'Вік (років)', labelRu: 'Возраст (лет)', labelEn: 'Age (years)', defaultValue: 25 },
      {
        key: 'gender',
        labelUk: 'Стать',
        labelRu: 'Пол',
        labelEn: 'Gender',
        defaultValue: 'male',
        type: 'select',
        options: [
          { value: 'male', labelUk: 'Чоловік', labelRu: 'Мужчина', labelEn: 'Male' },
          { value: 'female', labelUk: 'Жінка', labelRu: 'Женщина', labelEn: 'Female' },
        ],
      },
    ],
    calculate: ({ w, h, age, gender }) => {
      const res = bmrMifflinStJeor(Number(w), Number(h), Number(age), gender);
      return {
        resultFormatted: `Базовий BMR: ${res.bmr} ккал/день`,
        insertValue: `${res.bmr}`,
        steps: [
          `Сидячий спосіб життя (×1.2): ${res.sedentary} ккал`,
          `Помірні тренування (×1.55): ${res.moderate} ккал`,
          `Висока активність (×1.725): ${res.active} ккал`,
        ],
      };
    },
  },

  // 55. Fuel & Trip Cost
  {
    id: 'fuel_trip',
    num: 55,
    category: 'daily',
    nameUk: 'Витрати пального та вартість поїздки',
    nameRu: 'Расход топлива и стоимость поездки',
    nameEn: 'Fuel Consumption & Trip Cost',
    formula: 'Пальне = (S · Витрата) / 100,  Вартість = Пальне · Ціна',
    descriptionUk: 'Необхідний літраж пального та загальна вартість маршруту',
    descriptionRu: 'Расчет литража и стоимости поездки',
    descriptionEn: 'Calculate fuel liters and total trip cost',
    inputs: [
      { key: 'dist', labelUk: 'Дистанція (км)', labelRu: 'Расстояние (км)', labelEn: 'Distance (km)', defaultValue: 450 },
      { key: 'cons', labelUk: 'Витрата (л/100 км)', labelRu: 'Расход (л/100 км)', labelEn: 'Consumption (L/100km)', defaultValue: 7.2 },
      { key: 'price', labelUk: 'Ціна пального (грн/л)', labelRu: 'Цена (грн/л)', labelEn: 'Fuel price (UAH/L)', defaultValue: 56 },
    ],
    calculate: ({ dist, cons, price }) => {
      const res = calculateFuelTrip(Number(dist), Number(cons), Number(price));
      return {
        resultFormatted: `Пальне: ${res.litersNeeded} л,  Вартість: ${res.totalCost} грн`,
        insertValue: `${res.totalCost}`,
        steps: [
          `Літрів потрібно: (${dist} · ${cons}) / 100 = ${res.litersNeeded} л`,
          `Загальна вартість: ${res.litersNeeded} л · ${price} грн = ${res.totalCost} грн`,
          `Вартість 1 км: ${res.costPerKm} грн/км`,
        ],
      };
    },
  },

  // 56. Electricity Appliance Cost
  {
    id: 'electric_cost',
    num: 56,
    category: 'daily',
    nameUk: 'Вартість споживання електроенергії',
    nameRu: 'Стоимость электроэнергии прибора',
    nameEn: 'Electricity Appliance Cost',
    formula: 'кВт·год = (P / 1000) · t,  Вартість = кВт·год · Тариф',
    descriptionUk: 'Витрати електроенергії побутового приладу (кондиціонер, бойлер, ПК)',
    descriptionRu: 'Расчет стоимости работы электроприбора',
    descriptionEn: 'Calculates energy consumption and monthly electricity cost',
    inputs: [
      { key: 'w', labelUk: 'Потужність (Вт)', labelRu: 'Мощность (Вт)', labelEn: 'Power (W)', defaultValue: 2000 },
      { key: 'h', labelUk: 'Годин на добу', labelRu: 'Часов в сутки', labelEn: 'Hours per day', defaultValue: 4 },
      { key: 'tariff', labelUk: 'Тариф (грн/кВт·год)', labelRu: 'Тариф (грн/кВт·ч)', labelEn: 'Tariff (UAH/kWh)', defaultValue: 4.32 },
    ],
    calculate: ({ w, h, tariff }) => {
      const res = calculateElectricityCost(Number(w), Number(h), Number(tariff));
      return {
        resultFormatted: `На добу: ${res.dailyCost} грн,  На місяць: ${res.monthlyCost} грн`,
        insertValue: `${res.monthlyCost}`,
        steps: [
          `Споживання на день: (${w} / 1000) · ${h} = ${res.dailyKWh} кВт·год`,
          `Вартість на місяць (30 днів): ${res.monthlyKWh} кВт·год · ${tariff} грн = ${res.monthlyCost} грн`,
        ],
      };
    },
  },

  // 57. Number Base Converter
  {
    id: 'base_converter',
    num: 57,
    category: 'daily',
    nameUk: 'Системи числення (Dec, Hex, Bin, Oct)',
    nameRu: 'Системы счисления (Dec, Hex, Bin, Oct)',
    nameEn: 'Number Base Converter',
    formula: 'Dec <-> Hex <-> Bin <-> Oct',
    descriptionUk: 'Миттєвий перевід між двійковою, вісімковою, десятковою та шістнадцятковою',
    descriptionRu: 'Перевод между 2, 8, 10 и 16 системами',
    descriptionEn: 'Instant conversions between binary, octal, decimal, and hexadecimal',
    inputs: [
      { key: 'val', labelUk: 'Вхідне значення', labelRu: 'Значение', labelEn: 'Value', defaultValue: '255', type: 'text' },
      {
        key: 'base',
        labelUk: 'Вхідна система',
        labelRu: 'Входная система',
        labelEn: 'Input base',
        defaultValue: '10',
        type: 'select',
        options: [
          { value: '10', labelUk: 'Десяткова (DEC)', labelRu: 'Десятичная (DEC)', labelEn: 'Decimal (DEC)' },
          { value: '16', labelUk: 'Шістнадцяткова (HEX)', labelRu: 'Шестнадцатеричная (HEX)', labelEn: 'Hexadecimal (HEX)' },
          { value: '2', labelUk: 'Двійкова (BIN)', labelRu: 'Двоичная (BIN)', labelEn: 'Binary (BIN)' },
          { value: '8', labelUk: 'Вісімкова (OCT)', labelRu: 'Восьмеричная (OCT)', labelEn: 'Octal (OCT)' },
        ],
      },
    ],
    calculate: ({ val, base }) => {
      const res = convertBases(String(val), Number(base));
      return {
        resultFormatted: `DEC: ${res.dec} | HEX: ${res.hex} | BIN: ${res.bin}`,
        insertValue: res.dec,
        steps: [`DEC = ${res.dec}`, `HEX = 0x${res.hex}`, `BIN = 0b${res.bin}`, `OCT = 0o${res.oct}`],
      };
    },
  },

  // 58. Aspect Ratio Scaler
  {
    id: 'aspect_ratio',
    num: 58,
    category: 'daily',
    nameUk: 'Співвідношення сторін екрана (Aspect Ratio)',
    nameRu: 'Соотношение сторон экрана',
    nameEn: 'Screen Aspect Ratio Scaler',
    formula: 'Ширина : Висота,  W / H',
    descriptionUk: 'Спрощення пропорції (16:9, 4:3) та масштабування висоти під потрібну ширину',
    descriptionRu: 'Упрощение пропорции и расчет высоты по ширине',
    descriptionEn: 'Simplifies ratio and scales pixel height to target width',
    inputs: [
      { key: 'w', labelUk: 'Ширина W (px)', labelRu: 'Ширина W (px)', labelEn: 'Width W (px)', defaultValue: 1920 },
      { key: 'h', labelUk: 'Висота H (px)', labelRu: 'Высота H (px)', labelEn: 'Height H (px)', defaultValue: 1080 },
      { key: 'target', labelUk: 'Цільова ширина (px)', labelRu: 'Целевая ширина (px)', labelEn: 'Target width (px)', defaultValue: 1280 },
    ],
    calculate: ({ w, h, target }) => {
      const res = calculateAspectRatio(Number(w), Number(h), Number(target));
      return {
        resultFormatted: `Пропорція: ${res.simplifiedRatio}  (При W=${target}px -> H=${res.scaledHeight}px)`,
        insertValue: `${res.scaledHeight}`,
        steps: [
          `Спрощене співвідношення: ${res.simplifiedRatio}`,
          `Десятковий коефіцієнт: ${res.aspectDecimal}`,
          `Масштабована висота: ${res.scaledHeight} px`,
        ],
      };
    },
  },

  // 59. Download ETA
  {
    id: 'download_eta',
    num: 59,
    category: 'daily',
    nameUk: 'Час завантаження файлу (ETA)',
    nameRu: 'Время загрузки файла (ETA)',
    nameEn: 'Download Time Calculator',
    formula: 't = Розмір (МБ · 8) / Швидкість (Мбіт/с)',
    descriptionUk: 'Розрахунок тривалості завантаження гри або фільму за швидкістю інтернету',
    descriptionRu: 'Время скачивания файла по скорости канала',
    descriptionEn: 'Estimates download duration based on internet speed',
    inputs: [
      { key: 'gb', labelUk: 'Розмір файлу (ГБ)', labelRu: 'Размер (ГБ)', labelEn: 'Size (GB)', defaultValue: 50 },
      { key: 'mbps', labelUk: 'Швидкість інтернету (Мбіт/с)', labelRu: 'Скорость (Мбит/с)', labelEn: 'Speed (Mbps)', defaultValue: 100 },
    ],
    calculate: ({ gb, mbps }) => {
      const res = calculateDownloadTime(Number(gb) * 1024, Number(mbps));
      return {
        resultFormatted: `Час: ${res.formatted}`,
        insertValue: `${res.seconds}`,
        steps: [
          `Розмір: ${gb} ГБ = ${Number(gb) * 1024 * 8} Мбіт`,
          `Швидкість: ${mbps} Мбіт/с`,
          `Орієнтовний час завантаження: ${res.formatted}`,
        ],
      };
    },
  },

  // 60. Roman Numerals
  {
    id: 'roman_numerals',
    num: 60,
    category: 'daily',
    nameUk: 'Римські числа (Конвертер)',
    nameRu: 'Римские числа (Конвертер)',
    nameEn: 'Roman Numeral Converter',
    formula: 'M=1000, D=500, C=100, L=50, X=10, V=5, I=1',
    descriptionUk: 'Двостороння конвертація між арабськими та римськими числами',
    descriptionRu: 'Конвертация арабских чисел в римские и обратно',
    descriptionEn: 'Bidirectional conversion between Arabic and Roman numerals',
    inputs: [{ key: 'n', labelUk: 'Арабське число', labelRu: 'Арабское число', labelEn: 'Arabic integer', defaultValue: 2026 }],
    calculate: ({ n }) => {
      const rom = toRoman(Number(n));
      return {
        resultFormatted: `${n} = ${rom}`,
        insertValue: rom,
        steps: [`${n} у римській системі записується як ${rom}`],
      };
    },
  },

  // 61. Circle Sector
  {
    id: 'circle_sector',
    num: 61,
    category: 'geometry',
    nameUk: 'Сектор круга (Дуга та площа)',
    nameRu: 'Сектор круга (Дуга и площадь)',
    nameEn: 'Circle Sector & Arc',
    formula: 'L = (π·r·α)/180,  S = (π·r²·α)/360',
    descriptionUk: 'Довжина дуги, площа сектора та хорда',
    descriptionRu: 'Длина дуги, площадь сектора и хорда',
    descriptionEn: 'Arc length, sector area, and chord length',
    inputs: [
      { key: 'r', labelUk: 'Радіус r', labelRu: 'Радиус r', labelEn: 'Radius r', defaultValue: 6 },
      { key: 'ang', labelUk: 'Центральний кут α (°)', labelRu: 'Угол α (°)', labelEn: 'Angle α (°)', defaultValue: 60 },
    ],
    calculate: ({ r, ang }) => {
      const rad = (Number(ang) * Math.PI) / 180;
      const arc = (Math.PI * Number(r) * Number(ang)) / 180;
      const area = (Math.PI * Number(r) ** 2 * Number(ang)) / 360;
      const chord = 2 * Number(r) * Math.sin(rad / 2);
      return {
        resultFormatted: `Дуга L = ${arc.toFixed(3)},  Площа S = ${area.toFixed(3)},  Хорда = ${chord.toFixed(3)}`,
        insertValue: `${area.toFixed(3)}`,
        steps: [
          `Довжина дуги L = (π · ${r} · ${ang}°) / 180° = ${arc.toFixed(3)}`,
          `Площа сектора S = (π · ${r}² · ${ang}°) / 360° = ${area.toFixed(3)}`,
          `Довжина хорди: 2 · ${r} · sin(${Number(ang)/2}°) = ${chord.toFixed(3)}`,
        ],
      };
    },
  },

  // 62. Ellipse Area & Perimeter
  {
    id: 'ellipse_area',
    num: 62,
    category: 'geometry',
    nameUk: 'Еліпс: Площа та периметр Рамануджана',
    nameRu: 'Эллипс: Площадь и периметр Рамануджана',
    nameEn: 'Ellipse Area & Perimeter',
    formula: 'S = π·a·b,  P ≈ π(3(a+b) - √((3a+b)(a+3b)))',
    descriptionUk: 'Площа, ексцентриситет та точний периметр за першою формулою Рамануджана',
    descriptionRu: 'Площадь и периметр эллипса',
    descriptionEn: 'Area, eccentricity, and Ramanujan approximation of perimeter',
    inputs: [
      { key: 'a', labelUk: 'Велика піввісь a', labelRu: 'Большая полуось a', labelEn: 'Semi-major axis a', defaultValue: 8 },
      { key: 'b', labelUk: 'Мала піввісь b', labelRu: 'Малая полуось b', labelEn: 'Semi-minor axis b', defaultValue: 5 },
    ],
    calculate: ({ a, b }) => {
      const aVal = Number(a);
      const bVal = Number(b);
      const area = Math.PI * aVal * bVal;
      const p = Math.PI * (3 * (aVal + bVal) - Math.sqrt((3 * aVal + bVal) * (aVal + 3 * bVal)));
      const e = Math.sqrt(Math.max(0, 1 - (bVal * bVal) / (aVal * aVal)));
      return {
        resultFormatted: `Площа S = ${area.toFixed(3)},  Периметр P ≈ ${p.toFixed(3)},  Ексцентриситет e = ${e.toFixed(3)}`,
        insertValue: `${area.toFixed(3)}`,
        steps: [
          `S = π · ${aVal} · ${bVal} = ${area.toFixed(3)}`,
          `Периметр (формула Рамануджана) ≈ ${p.toFixed(3)}`,
          `Ексцентриситет e = √(1 - b²/a²) = ${e.toFixed(3)}`,
        ],
      };
    },
  },

  // 63. Trapezoid Area & Midline
  {
    id: 'trapezoid_area',
    num: 63,
    category: 'geometry',
    nameUk: 'Трапеція: Площа та середня лінія',
    nameRu: 'Трапеция: Площадь и средняя линия',
    nameEn: 'Trapezoid Area & Midline',
    formula: 'm = (a+b)/2,  S = m · h',
    descriptionUk: 'Площа трапеції за двома основами та висотою',
    descriptionRu: 'Площадь трапеции по основаниям и высоте',
    descriptionEn: 'Trapezoid area and midline length from bases and height',
    inputs: [
      { key: 'a', labelUk: 'Нижня основа a', labelRu: 'Основание a', labelEn: 'Base a', defaultValue: 14 },
      { key: 'b', labelUk: 'Верхня основа b', labelRu: 'Основание b', labelEn: 'Base b', defaultValue: 8 },
      { key: 'h', labelUk: 'Висота h', labelRu: 'Высота h', labelEn: 'Height h', defaultValue: 6 },
    ],
    calculate: ({ a, b, h }) => {
      const aVal = Number(a);
      const bVal = Number(b);
      const hVal = Number(h);
      const m = (aVal + bVal) / 2;
      const s = m * hVal;
      return {
        resultFormatted: `Площа S = ${s.toFixed(2)},  Середня лінія m = ${m.toFixed(2)}`,
        insertValue: `${s.toFixed(2)}`,
        steps: [
          `Середня лінія m = (${aVal} + ${bVal}) / 2 = ${m}`,
          `Площа S = m · h = ${m} · ${hVal} = ${s}`,
        ],
      };
    },
  },

  // 64. Rhombus
  {
    id: 'rhombus_geom',
    num: 64,
    category: 'geometry',
    nameUk: 'Ромб: Площа за діагоналями',
    nameRu: 'Ромб: Площадь по диагоналям',
    nameEn: 'Rhombus by Diagonals',
    formula: 'S = (d₁·d₂)/2,  a = √((d₁/2)² + (d₂/2)²)',
    descriptionUk: 'Площа, довжина сторони, периметр та радіус вписаного кола',
    descriptionRu: 'Площадь, сторона и радиус вписанной окружности',
    descriptionEn: 'Area, side length, perimeter, and inradius of a rhombus',
    inputs: [
      { key: 'd1', labelUk: 'Діагональ d1', labelRu: 'Диагональ d1', labelEn: 'Diagonal d1', defaultValue: 12 },
      { key: 'd2', labelUk: 'Діагональ d2', labelRu: 'Диагональ d2', labelEn: 'Diagonal d2', defaultValue: 16 },
    ],
    calculate: ({ d1, d2 }) => {
      const d1Val = Number(d1);
      const d2Val = Number(d2);
      const s = (d1Val * d2Val) / 2;
      const a = Math.hypot(d1Val / 2, d2Val / 2);
      const p = 4 * a;
      const r = s / (2 * a);
      return {
        resultFormatted: `S = ${s},  Сторона a = ${a.toFixed(2)},  Периметр = ${p.toFixed(2)},  r = ${r.toFixed(2)}`,
        insertValue: `${s}`,
        steps: [
          `Площа S = (${d1Val} · ${d2Val}) / 2 = ${s}`,
          `Сторона a = √(${d1Val/2}² + ${d2Val/2}²) = ${a.toFixed(2)}`,
          `Периметр P = 4 · ${a.toFixed(2)} = ${p.toFixed(2)}`,
        ],
      };
    },
  },

  // 65. Cuboid & Box
  {
    id: 'box_cube_geom',
    num: 65,
    category: 'geometry',
    nameUk: 'Прямокутний паралелепіпед',
    nameRu: 'Прямоугольный параллелепипед',
    nameEn: 'Rectangular Cuboid',
    formula: 'V = a·b·c,  S = 2(ab+bc+ac),  d = √(a²+b²+c²)',
    descriptionUk: 'Обʼєм, повна площа поверхні та просторова діагональ бруска',
    descriptionRu: 'Объем, площадь поверхности и пространственная диагональ',
    descriptionEn: 'Volume, total surface area, and space diagonal of a box',
    inputs: [
      { key: 'a', labelUk: 'Довжина a', labelRu: 'Длина a', labelEn: 'Length a', defaultValue: 5 },
      { key: 'b', labelUk: 'Ширина b', labelRu: 'Ширина b', labelEn: 'Width b', defaultValue: 4 },
      { key: 'c', labelUk: 'Висота c', labelRu: 'Высота c', labelEn: 'Height c', defaultValue: 3 },
    ],
    calculate: ({ a, b, c }) => {
      const res = solveCubeAndBox(Number(a), Number(b), Number(c));
      const diag = Math.hypot(Number(a), Number(b), Number(c));
      return {
        resultFormatted: `Обʼєм V = ${res.volume},  Площа S = ${res.surfaceArea},  Діагональ = ${diag.toFixed(3)}`,
        insertValue: `${res.volume}`,
        steps: [
          `V = ${a} · ${b} · ${c} = ${res.volume}`,
          `S = 2 · (${a}·${b} + ${b}·${c} + ${a}·${c}) = ${res.surfaceArea}`,
          `Діагональ d = √(${a}² + ${b}² + ${c}²) = ${diag.toFixed(3)}`,
        ],
      };
    },
  },

  // 66. Hyperbolic Trigonometry
  {
    id: 'hyperbolic_trig',
    num: 66,
    category: 'algebra',
    nameUk: 'Гіперболічні функції (sinh, cosh, tanh)',
    nameRu: 'Гиперболические функции',
    nameEn: 'Hyperbolic Functions',
    formula: 'sinh(x) = (eˣ - e⁻ˣ)/2,  cosh(x) = (eˣ + e⁻ˣ)/2',
    descriptionUk: 'Гіперболічний синус, косинус, тангенс та їх тотожність cosh² - sinh² = 1',
    descriptionRu: 'Гиперболический синус, косинус и тангенс',
    descriptionEn: 'Hyperbolic sine, cosine, tangent and identity check',
    inputs: [{ key: 'x', labelUk: 'Аргумент x', labelRu: 'Аргумент x', labelEn: 'Value x', defaultValue: 1.5 }],
    calculate: ({ x }) => {
      const val = Number(x);
      const sh = Math.sinh(val);
      const ch = Math.cosh(val);
      const th = Math.tanh(val);
      return {
        resultFormatted: `sinh(${x}) = ${sh.toFixed(4)},  cosh(${x}) = ${ch.toFixed(4)},  tanh(${x}) = ${th.toFixed(4)}`,
        insertValue: `${sh.toFixed(4)}`,
        steps: [
          `sinh(${x}) = (e^${x} - e^-${x}) / 2 = ${sh.toFixed(4)}`,
          `cosh(${x}) = (e^${x} + e^-${x}) / 2 = ${ch.toFixed(4)}`,
          `Перевірка: cosh² - sinh² = ${(ch*ch - sh*sh).toFixed(6)}`,
        ],
      };
    },
  },

  // 67. Coordinates: DMS to Decimal
  {
    id: 'dms_coords',
    num: 67,
    category: 'geometry',
    nameUk: 'Градуси, мінути, секунди (DMS) у десяткові',
    nameRu: 'Градусы, минуты, секунды (DMS) в десятичные',
    nameEn: 'DMS to Decimal Degrees',
    formula: 'Dec = Deg + Min/60 + Sec/3600',
    descriptionUk: 'Конвертація географічних та астрономічних координат',
    descriptionRu: 'Преобразование координат из DMS в градусы',
    descriptionEn: 'Converts Degrees, Minutes, and Seconds to decimal degrees',
    inputs: [
      { key: 'deg', labelUk: 'Градуси (°)', labelRu: 'Градусы (°)', labelEn: 'Degrees (°)', defaultValue: 50 },
      { key: 'min', labelUk: 'Мінути (\')', labelRu: 'Минуты (\')', labelEn: 'Minutes (\')', defaultValue: 27 },
      { key: 'sec', labelUk: 'Секунди (\'\')', labelRu: 'Секунды (\'\')', labelEn: 'Seconds (\'\')', defaultValue: 36 },
    ],
    calculate: ({ deg, min, sec }) => {
      const dec = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
      return {
        resultFormatted: `${deg}° ${min}' ${sec}" = ${dec.toFixed(6)}°`,
        insertValue: `${dec.toFixed(6)}`,
        steps: [`${deg} + ${min}/60 + ${sec}/3600 = ${dec.toFixed(6)}°`],
      };
    },
  },

  // 68. Radians <-> Degrees
  {
    id: 'rad_deg_converter',
    num: 68,
    category: 'algebra',
    nameUk: 'Градуси ↔ Радіани',
    nameRu: 'Градусы ↔ Радианы',
    nameEn: 'Radians ↔ Degrees',
    formula: 'rad = deg · π / 180,  deg = rad · 180 / π',
    descriptionUk: 'Взаємне переведення кутів з кратністю числа π',
    descriptionRu: 'Взаимный перевод углов с числом π',
    descriptionEn: 'Converts angles between radians and degrees',
    inputs: [{ key: 'ang', labelUk: 'Кут у градусах (°)', labelRu: 'Угол в градусах (°)', labelEn: 'Degrees (°)', defaultValue: 135 }],
    calculate: ({ ang }) => {
      const rad = (Number(ang) * Math.PI) / 180;
      const piMult = Number(ang) / 180;
      return {
        resultFormatted: `${ang}° = ${rad.toFixed(4)} рад  (${piMult.toFixed(3)}π)`,
        insertValue: `${rad.toFixed(4)}`,
        steps: [`${ang}° · (π / 180) = ${rad.toFixed(4)} рад`],
      };
    },
  },

  // 69. Centripetal Acceleration & Force
  {
    id: 'centripetal_accel',
    num: 69,
    category: 'physics',
    nameUk: 'Доцентрове прискорення та сила',
    nameRu: 'Центростремительное ускорение и сила',
    nameEn: 'Centripetal Acceleration & Force',
    formula: 'a_n = v² / r,  F_n = m · a_n',
    descriptionUk: 'Нормальне прискорення та сила при русі по колу радіуса r',
    descriptionRu: 'Нормальное ускорение при движении по окружности',
    descriptionEn: 'Centripetal acceleration and inward force for circular motion',
    inputs: [
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 1200 },
      { key: 'v', labelUk: 'Швидкість v (м/с)', labelRu: 'Скорость v (м/с)', labelEn: 'Speed v (m/s)', defaultValue: 20 },
      { key: 'r', labelUk: 'Радіус кола r (м)', labelRu: 'Радиус r (м)', labelEn: 'Radius r (m)', defaultValue: 50 },
    ],
    calculate: ({ m, v, r }) => {
      const a = (Number(v) ** 2) / Number(r);
      const f = Number(m) * a;
      return {
        resultFormatted: `a_n = ${a.toFixed(2)} м/с²,  F_n = ${f.toFixed(1)} Н`,
        insertValue: `${a.toFixed(2)}`,
        steps: [
          `a_n = ${v}² / ${r} = ${a.toFixed(2)} м/с²`,
          `F_n = ${m} · ${a.toFixed(2)} = ${f.toFixed(1)} Н`,
        ],
      };
    },
  },

  // 70. Newton's Universal Gravitation
  {
    id: 'gravitation_newton',
    num: 70,
    category: 'physics',
    nameUk: 'Закон всесвітнього тяжіння',
    nameRu: 'Закон всемирного тяготения',
    nameEn: 'Universal Gravitation',
    formula: 'F = G · (m₁ · m₂) / r²',
    descriptionUk: 'Гравітаційна сила між двома космічними або масивними тілами',
    descriptionRu: 'Гравитационное притяжение между телами',
    descriptionEn: 'Gravitational attraction between two masses',
    inputs: [
      { key: 'm1', labelUk: 'Маса m1 (кг)', labelRu: 'Масса m1 (кг)', labelEn: 'Mass m1 (kg)', defaultValue: 5.972e24 },
      { key: 'm2', labelUk: 'Маса m2 (кг)', labelRu: 'Масса m2 (кг)', labelEn: 'Mass m2 (kg)', defaultValue: 70 },
      { key: 'r', labelUk: 'Відстань r (м)', labelRu: 'Расстояние r (м)', labelEn: 'Distance r (m)', defaultValue: 6.371e6 },
    ],
    calculate: ({ m1, m2, r }) => {
      const G = 6.6743e-11;
      const f = (G * Number(m1) * Number(m2)) / (Number(r) ** 2);
      return {
        resultFormatted: `F = ${f.toFixed(2)} Н`,
        insertValue: `${f.toFixed(2)}`,
        steps: [`F = 6.674e-11 · (${m1} · ${m2}) / (${r})² = ${f.toFixed(2)} Н`],
      };
    },
  },

  // 71. Momentum & Impulse
  {
    id: 'momentum_impulse',
    num: 71,
    category: 'physics',
    nameUk: 'Імпульс тіла та сили',
    nameRu: 'Импульс тела и силы',
    nameEn: 'Momentum & Impulse',
    formula: 'p = m · v,  I = F · Δt = Δp',
    descriptionUk: 'Кількість руху тіла та зміна імпульсу під дією сили',
    descriptionRu: 'Количество движения и импульс силы',
    descriptionEn: 'Linear momentum and force impulse',
    inputs: [
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 1500 },
      { key: 'v', labelUk: 'Швидкість v (м/с)', labelRu: 'Скорость v (м/с)', labelEn: 'Velocity v (m/s)', defaultValue: 25 },
    ],
    calculate: ({ m, v }) => {
      const p = Number(m) * Number(v);
      return {
        resultFormatted: `p = ${p} кг·м/с`,
        insertValue: `${p}`,
        steps: [`p = ${m} кг · ${v} м/с = ${p} кг·м/с`],
      };
    },
  },

  // 72. Archimedes Buoyancy Force
  {
    id: 'archimedes_buoyancy',
    num: 72,
    category: 'physics',
    nameUk: 'Сила Архімеда та плавання тіл',
    nameRu: 'Сила Архимеда и плавание тел',
    nameEn: 'Archimedes Buoyancy Force',
    formula: 'F_A = ρ_рід · g · V_зан',
    descriptionUk: 'Виштовхувальна сила у рідині та умова плавання тіла',
    descriptionRu: 'Выталкивающая сила и плавание тел',
    descriptionEn: 'Buoyant force in fluid and floating condition',
    inputs: [
      { key: 'rho', labelUk: 'Густина рідини ρ (кг/м³)', labelRu: 'Плотность жидкости (кг/м³)', labelEn: 'Fluid density (kg/m³)', defaultValue: 1000 },
      { key: 'v', labelUk: 'Занурений обʼєм V (м³)', labelRu: 'Погруженный объем V (м³)', labelEn: 'Submerged volume (m³)', defaultValue: 0.05 },
    ],
    calculate: ({ rho, v }) => {
      const f = Number(rho) * 9.80665 * Number(v);
      return {
        resultFormatted: `F_A = ${f.toFixed(2)} Н`,
        insertValue: `${f.toFixed(2)}`,
        steps: [`F_A = ${rho} кг/м³ · 9.81 м/с² · ${v} м³ = ${f.toFixed(2)} Н`],
      };
    },
  },

  // 73. Free Fall Kinematics
  {
    id: 'free_fall_kinematics',
    num: 73,
    category: 'physics',
    nameUk: 'Вільне падіння без опору повітря',
    nameRu: 'Свободное падение без сопротивления воздуха',
    nameEn: 'Free Fall Kinematics',
    formula: 'v = √(2gh),  t = √(2h/g)',
    descriptionUk: 'Час падіння та швидкість удару об землю з заданої висоти',
    descriptionRu: 'Время падения и скорость удара',
    descriptionEn: 'Drop time and impact velocity from given height',
    inputs: [
      { key: 'h', labelUk: 'Висота падіння h (м)', labelRu: 'Высота h (м)', labelEn: 'Height h (m)', defaultValue: 45 },
      { key: 'm', labelUk: 'Маса m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 2 },
    ],
    calculate: ({ h, m }) => {
      const res = solveFreeFallEnergy(Number(m), Number(h));
      return {
        resultFormatted: `Час: ${res.fallTimeS} с,  Швидкість: ${res.impactVelocityMPerS} м/с (${(res.impactVelocityMPerS*3.6).toFixed(1)} км/год)`,
        insertValue: `${res.impactVelocityMPerS}`,
        steps: [
          `Час падіння t = √(2 · ${h} / 9.81) = ${res.fallTimeS} с`,
          `Кінцева швидкість v = √(2 · 9.81 · ${h}) = ${res.impactVelocityMPerS} м/с`,
          `Потенційна енергія Ep = ${res.potentialEnergyJ} Дж`,
        ],
      };
    },
  },

  // 74. Speed of Sound vs Temperature
  {
    id: 'sound_temp_speed',
    num: 74,
    category: 'physics',
    nameUk: 'Швидкість звуку в повітрі від температури',
    nameRu: 'Скорость звука в воздухе от температуры',
    nameEn: 'Speed of Sound in Air',
    formula: 'c ≈ 331.3 · √(1 + T/273.15) м/с',
    descriptionUk: 'Швидкість поширення звукової хвилі при заданій температурі',
    descriptionRu: 'Зависимость скорости звука от температуры',
    descriptionEn: 'Speed of acoustic sound waves at ambient air temperature',
    inputs: [{ key: 't', labelUk: 'Температура повітря T (°C)', labelRu: 'Температура (°C)', labelEn: 'Air temp (°C)', defaultValue: 20 }],
    calculate: ({ t }) => {
      const tVal = Number(t);
      const c = 331.3 * Math.sqrt(1 + tVal / 273.15);
      const mach1KmH = c * 3.6;
      return {
        resultFormatted: `c = ${c.toFixed(2)} м/с  (${mach1KmH.toFixed(1)} км/год, 1 Мах)`,
        insertValue: `${c.toFixed(2)}`,
        steps: [`c = 331.3 · √(1 + ${tVal}/273.15) = ${c.toFixed(2)} м/с`],
      };
    },
  },

  // 75. Sound Distance Attenuation
  {
    id: 'sound_distance_attenuation',
    num: 75,
    category: 'physics',
    nameUk: 'Згасання звуку за відстанню (дБ)',
    nameRu: 'Затухание звука по расстоянию (дБ)',
    nameEn: 'Sound Distance Attenuation',
    formula: 'L₂ = L₁ - 20·lg(r₂ / r₁)',
    descriptionUk: 'Падіння рівня шуму у дБ при віддаленні від джерела',
    descriptionRu: 'Падение уровня звука по закону обратных квадратов',
    descriptionEn: 'Inverse-square attenuation of sound decibels over distance',
    inputs: [
      { key: 'l1', labelUk: 'Рівень звуку L1 (дБ)', labelRu: 'Уровень L1 (дБ)', labelEn: 'Initial dB L1', defaultValue: 90 },
      { key: 'r1', labelUk: 'Початкова відстань r1 (м)', labelRu: 'Расстояние r1 (м)', labelEn: 'Distance r1 (m)', defaultValue: 1 },
      { key: 'r2', labelUk: 'Кінцева відстань r2 (м)', labelRu: 'Расстояние r2 (м)', labelEn: 'Distance r2 (m)', defaultValue: 10 },
    ],
    calculate: ({ l1, r1, r2 }) => {
      const res = calculateSoundAttenuation(Number(l1), Number(r1), Number(r2));
      return {
        resultFormatted: `Рівень на ${r2}м: ${res.db2} дБ  (Зменшення: -${res.dropDb} дБ)`,
        insertValue: `${res.db2}`,
        steps: [`Зниження рівня: ΔL = 20 · lg(${r2} / ${r1}) = ${res.dropDb} дБ -> L2 = ${res.db2} дБ`],
      };
    },
  },

  // 76. Density, Mass & Volume
  {
    id: 'density_mass_vol',
    num: 76,
    category: 'physics',
    nameUk: 'Густина, маса та обʼєм (ρ = m/V)',
    nameRu: 'Плотность, масса и объем (ρ = m/V)',
    nameEn: 'Density, Mass & Volume',
    formula: 'ρ = m / V,  m = ρ · V',
    descriptionUk: 'Фізична густина матеріалу або знаходження маси за обʼємом',
    descriptionRu: 'Расчет плотности и массы вещества',
    descriptionEn: 'Mass density formula ρ = m/V',
    inputs: [
      { key: 'm', labelUk: 'Маса тіла m (кг)', labelRu: 'Масса m (кг)', labelEn: 'Mass m (kg)', defaultValue: 7.8 },
      { key: 'v', labelUk: 'Обʼєм V (дм³ / л)', labelRu: 'Объем V (л)', labelEn: 'Volume V (L)', defaultValue: 1 },
    ],
    calculate: ({ m, v }) => {
      const rho = Number(m) / (Number(v) / 1000);
      return {
        resultFormatted: `Густина ρ = ${rho.toFixed(1)} кг/м³  (або ${(rho/1000).toFixed(3)} г/см³)`,
        insertValue: `${rho.toFixed(1)}`,
        steps: [`ρ = ${m} кг / (${v} · 10⁻³ м³) = ${rho.toFixed(1)} кг/м³`],
      };
    },
  },

  // 77. Half-Life Radioactive Decay
  {
    id: 'half_life_decay',
    num: 77,
    category: 'physics',
    nameUk: 'Період напіврозпаду радіонуклідів',
    nameRu: 'Период полураспада радионуклидов',
    nameEn: 'Radioactive Half-Life Decay',
    formula: 'N(t) = N₀ · 2^(-t / T½)',
    descriptionUk: 'Залишок радіоактивного ізотопу через заданий час t',
    descriptionRu: 'Закон радиоактивного распада',
    descriptionEn: 'Remaining quantity after radioactive decay time t',
    inputs: [
      { key: 'n0', labelUk: 'Початкова кількість N0', labelRu: 'Начальное N0', labelEn: 'Initial N0', defaultValue: 1000 },
      { key: 'thalf', labelUk: 'Період напіврозпаду T½ (років)', labelRu: 'Период T½ (лет)', labelEn: 'Half-life T½ (years)', defaultValue: 30 },
      { key: 't', labelUk: 'Пройдений час t (років)', labelRu: 'Прошло t (лет)', labelEn: 'Elapsed t (years)', defaultValue: 90 },
    ],
    calculate: ({ n0, thalf, t }) => {
      const res = calculateHalfLife(Number(n0), Number(thalf), Number(t));
      const remainingPct = (100 - res.decayPercent).toFixed(1);
      return {
        resultFormatted: `Залишилось: ${res.remaining} (${remainingPct}%),  Розпалось: ${res.decayed}`,
        insertValue: `${res.remaining}`,
        steps: [
          `Кількість періодів напіврозпаду: ${t} / ${thalf} = ${res.halfLivesPassed}`,
          `N(t) = ${n0} · (1/2)^${res.halfLivesPassed} = ${res.remaining}`,
        ],
      };
    },
  },

  // 78. Capacitors Series & Parallel
  {
    id: 'capacitors_series_parallel',
    num: 78,
    category: 'electronics',
    nameUk: 'Послідовні та паралельні конденсатори',
    nameRu: 'Последовательные и параллельные конденсаторы',
    nameEn: 'Capacitors Series & Parallel',
    formula: 'C_пар = C1 + C2,  1/C_посл = 1/C1 + 1/C2',
    descriptionUk: 'Еквівалентна ємність батареї конденсаторів',
    descriptionRu: 'Эквивалентная емкость батареи конденсаторов',
    descriptionEn: 'Equivalent capacitance for series and parallel circuits',
    inputs: [
      { key: 'c1', labelUk: 'Ємність C1 (мкФ)', labelRu: 'C1 (мкФ)', labelEn: 'C1 (µF)', defaultValue: 10 },
      { key: 'c2', labelUk: 'Ємність C2 (мкФ)', labelRu: 'C2 (мкФ)', labelEn: 'C2 (µF)', defaultValue: 20 },
      { key: 'c3', labelUk: 'Ємність C3 (мкФ)', labelRu: 'C3 (мкФ)', labelEn: 'C3 (µF)', defaultValue: 30 },
    ],
    calculate: ({ c1, c2, c3 }) => {
      const par = Number(c1) + Number(c2) + Number(c3);
      const serInv = 1 / Number(c1) + 1 / Number(c2) + 1 / Number(c3);
      const ser = 1 / serInv;
      return {
        resultFormatted: `C_паралельне = ${par.toFixed(2)} мкФ,  C_послідовне = ${ser.toFixed(2)} мкФ`,
        insertValue: `${par.toFixed(2)}`,
        steps: [
          `Паралельно: ${c1} + ${c2} + ${c3} = ${par.toFixed(2)} мкФ`,
          `Послідовно: 1 / (1/${c1} + 1/${c2} + 1/${c3}) = ${ser.toFixed(2)} мкФ`,
        ],
      };
    },
  },

  // 79. Inductor Magnetic Energy
  {
    id: 'inductor_energy_calc',
    num: 79,
    category: 'electronics',
    nameUk: 'Енергія магнітного поля котушки',
    nameRu: 'Энергия магнитного поля катушки',
    nameEn: 'Inductor Magnetic Energy',
    formula: 'W = (L · I²) / 2',
    descriptionUk: 'Енергія, накопичена у магнітному полі дроселя або котушки',
    descriptionRu: 'Энергия в магнитном поле катушки',
    descriptionEn: 'Energy stored in inductor magnetic field',
    inputs: [
      { key: 'l', labelUk: 'Індуктивність L (Гн)', labelRu: 'Индуктивность L (Гн)', labelEn: 'Inductance L (H)', defaultValue: 0.25 },
      { key: 'i', labelUk: 'Струм I (А)', labelRu: 'Ток I (А)', labelEn: 'Current I (A)', defaultValue: 2 },
    ],
    calculate: ({ l, i }) => {
      const w = (Number(l) * Number(i) ** 2) / 2;
      return {
        resultFormatted: `W = ${w.toFixed(4)} Дж  (${w * 1000} мДж)`,
        insertValue: `${w.toFixed(4)}`,
        steps: [`W = (${l} Гн · ${i}² А²) / 2 = ${w.toFixed(4)} Дж`],
      };
    },
  },

  // 80. Simple Bank Interest
  {
    id: 'simple_interest_bank',
    num: 80,
    category: 'finance',
    nameUk: 'Прості банківські відсотки',
    nameRu: 'Простые банковские проценты',
    nameEn: 'Simple Bank Interest',
    formula: 'I = P · r · t,  S = P + I',
    descriptionUk: 'Нарахування відсотків без капіталізації на фіксований термін',
    descriptionRu: 'Начисление простых процентов',
    descriptionEn: 'Simple non-compounding interest formula',
    inputs: [
      { key: 'p', labelUk: 'Початкова сума P (грн)', labelRu: 'Сумма P', labelEn: 'Principal P', defaultValue: 30000 },
      { key: 'r', labelUk: 'Річна ставка r (%)', labelRu: 'Ставка (%)', labelEn: 'Rate (%)', defaultValue: 15 },
      { key: 't', labelUk: 'Термін t (років)', labelRu: 'Срок (лет)', labelEn: 'Term (years)', defaultValue: 2 },
    ],
    calculate: ({ p, r, t }) => {
      const i = (Number(p) * Number(r) * Number(t)) / 100;
      const total = Number(p) + i;
      return {
        resultFormatted: `Дохід: +${i} грн,  Разом: ${total} грн`,
        insertValue: `${total}`,
        steps: [`I = ${p} · (${r}/100) · ${t} = ${i} грн -> Всього ${total} грн`],
      };
    },
  },

  // 81. Inflation Purchasing Power
  {
    id: 'inflation_purchasing',
    num: 81,
    category: 'finance',
    nameUk: 'Калькулятор інфляції та реальної вартості',
    nameRu: 'Калькулятор инфляции и покупательной способности',
    nameEn: 'Inflation Purchasing Power',
    formula: 'Реальна вартість = S / (1 + i)ⁿ',
    descriptionUk: 'Зниження купівельної спроможності накопичень через n років',
    descriptionRu: 'Обесценивание сбережений со временем',
    descriptionEn: 'Purchasing power loss over n years due to inflation',
    inputs: [
      { key: 's', labelUk: 'Поточна сума (грн)', labelRu: 'Текущая сумма', labelEn: 'Current amount', defaultValue: 100000 },
      { key: 'inf', labelUk: 'Річна інфляція (%)', labelRu: 'Инфляция (%)', labelEn: 'Inflation (%)', defaultValue: 9 },
      { key: 'y', labelUk: 'Через скільки років', labelRu: 'Лет', labelEn: 'Years', defaultValue: 5 },
    ],
    calculate: ({ s, inf, y }) => {
      const real = Number(s) / Math.pow(1 + Number(inf) / 100, Number(y));
      const drop = Number(s) - real;
      return {
        resultFormatted: `Еквівалент: ${real.toFixed(2)} грн  (Втрата: -${drop.toFixed(2)} грн)`,
        insertValue: `${real.toFixed(2)}`,
        steps: [
          `Реальна купівельна спроможність через ${y} років: ${real.toFixed(2)} грн`,
          `Знецінення грошей: -${((drop / Number(s)) * 100).toFixed(1)}%`,
        ],
      };
    },
  },

  // 82. Restaurant Tip & Bill Split
  {
    id: 'tip_split_bill',
    num: 82,
    category: 'daily',
    nameUk: 'Чайові та поділ чека на компанію',
    nameRu: 'Чаевые и разделение счета',
    nameEn: 'Tip & Bill Split',
    formula: 'Разом = Чек + Чайові,  На 1 особу = Разом / n',
    descriptionUk: 'Розрахунок чайових та порівну на кожного гостя',
    descriptionRu: 'Расчет чаевых и суммы на каждого',
    descriptionEn: 'Calculate tip and equal split per guest',
    inputs: [
      { key: 'bill', labelUk: 'Сума чека (грн)', labelRu: 'Сумма счета', labelEn: 'Bill total', defaultValue: 1200 },
      { key: 'pct', labelUk: 'Чайові (%)', labelRu: 'Чаевые (%)', labelEn: 'Tip (%)', defaultValue: 10 },
      { key: 'people', labelUk: 'Кількість людей', labelRu: 'Человек', labelEn: 'Number of guests', defaultValue: 4 },
    ],
    calculate: ({ bill, pct, people }) => {
      const res = calculateTipSplit(Number(bill), Number(pct), Number(people));
      return {
        resultFormatted: `З кожного: ${res.perPerson} грн  (Чайові: +${res.tipTotal} грн)`,
        insertValue: `${res.perPerson}`,
        steps: [
          `Чайові ${pct}%: ${res.tipTotal} грн`,
          `Всього до сплати: ${res.billWithTip} грн`,
          `На кожного з ${people} осіб: ${res.perPerson} грн`,
        ],
      };
    },
  },

  // 83. Date Difference
  {
    id: 'date_diff_calendar',
    num: 83,
    category: 'daily',
    nameUk: 'Різниця між двома датами',
    nameRu: 'Разница между двумя датами',
    nameEn: 'Date Difference',
    formula: 'Δt = Date₂ - Date₁',
    descriptionUk: 'Кількість днів, робочих тижнів та місяців між датами',
    descriptionRu: 'Количество дней и недель между датами',
    descriptionEn: 'Days, weeks, and months between two calendar dates',
    inputs: [
      { key: 'd1', labelUk: 'Дата 1 (РРРР-ММ-ДД)', labelRu: 'Дата 1', labelEn: 'Date 1', defaultValue: '2026-01-01', type: 'text' },
      { key: 'd2', labelUk: 'Дата 2 (РРРР-ММ-ДД)', labelRu: 'Дата 2', labelEn: 'Date 2', defaultValue: '2026-12-31', type: 'text' },
    ],
    calculate: ({ d1, d2 }) => {
      const res = calculateDateDifference(String(d1), String(d2));
      return {
        resultFormatted: `Різниця: ${res.days} днів  (${res.weeks} тижнів, ≈${res.monthsApprox} міс.)`,
        insertValue: `${res.days}`,
        steps: [`Між ${d1} та ${d2}: ${res.days} календарних днів`],
      };
    },
  },

  // 84. Bitwise Operations
  {
    id: 'bitwise_operations_calc',
    num: 84,
    category: 'daily',
    nameUk: 'Побітові операції (AND, OR, XOR)',
    nameRu: 'Побитовые операции (AND, OR, XOR)',
    nameEn: 'Bitwise Logic Operations',
    formula: 'a & b,  a | b,  a ^ b,  ~a',
    descriptionUk: 'Двійкові побітові операції для системного програмування',
    descriptionRu: 'Двоичные побитовые операции',
    descriptionEn: 'Bitwise bit manipulation operations for programmers',
    inputs: [
      { key: 'a', labelUk: 'Число a', labelRu: 'Число a', labelEn: 'Integer a', defaultValue: 204 },
      { key: 'b', labelUk: 'Число b', labelRu: 'Число b', labelEn: 'Integer b', defaultValue: 85 },
    ],
    calculate: ({ a, b }) => {
      const aVal = Number(a);
      const bVal = Number(b);
      const and = aVal & bVal;
      const or = aVal | bVal;
      const xor = aVal ^ bVal;
      return {
        resultFormatted: `AND: ${and} | OR: ${or} | XOR: ${xor}`,
        insertValue: `${and}`,
        steps: [
          `a = ${aVal.toString(2).padStart(8, '0')}b`,
          `b = ${bVal.toString(2).padStart(8, '0')}b`,
          `a & b = ${and.toString(2).padStart(8, '0')}b (${and})`,
          `a | b = ${or.toString(2).padStart(8, '0')}b (${or})`,
          `a ^ b = ${xor.toString(2).padStart(8, '0')}b (${xor})`,
        ],
      };
    },
  },

  // 85. Unix Timestamp
  {
    id: 'unix_timestamp_tool',
    num: 85,
    category: 'daily',
    nameUk: 'Unix Timestamp Конвертер',
    nameRu: 'Конвертер Unix Timestamp',
    nameEn: 'Unix Timestamp Converter',
    formula: 'Секунди з 1 січня 1970 UTC',
    descriptionUk: 'Перетворення секунди епохи Unix у зрозумілу дату та час',
    descriptionRu: 'Преобразование секунды Unix в дату и время',
    descriptionEn: 'Converts Unix epoch timestamp into human readable date',
    inputs: [{ key: 'ts', labelUk: 'Timestamp (секунди)', labelRu: 'Timestamp (секунды)', labelEn: 'Timestamp (seconds)', defaultValue: 1772625600 }],
    calculate: ({ ts }) => {
      const date = new Date(Number(ts) * 1000);
      const iso = date.toISOString();
      const local = date.toLocaleString();
      return {
        resultFormatted: `${local} (UTC: ${iso})`,
        insertValue: iso,
        steps: [`Unix epoch: ${ts} с`, `UTC: ${iso}`, `Локальний час: ${local}`],
      };
    },
  },

  // 86. Mechanical Work & Power
  {
    id: 'work_power_mech',
    num: 86,
    category: 'physics',
    nameUk: 'Механічна робота та потужність',
    nameRu: 'Механическая работа и мощность',
    nameEn: 'Mechanical Work & Power',
    formula: 'A = F · s · cos(α),  P = A / t',
    descriptionUk: 'Робота сили на переміщенні s та середня потужність механізму',
    descriptionRu: 'Работа силы и мощность механизма',
    descriptionEn: 'Work performed by force along displacement and power',
    inputs: [
      { key: 'f', labelUk: 'Сила F (Н)', labelRu: 'Сила F (Н)', labelEn: 'Force F (N)', defaultValue: 500 },
      { key: 's', labelUk: 'Переміщення s (м)', labelRu: 'Перемещение s (м)', labelEn: 'Displacement s (m)', defaultValue: 20 },
      { key: 't', labelUk: 'Час t (с)', labelRu: 'Время t (с)', labelEn: 'Time t (s)', defaultValue: 10 },
    ],
    calculate: ({ f, s, t }) => {
      const work = Number(f) * Number(s);
      const power = work / Number(t);
      return {
        resultFormatted: `Робота A = ${work} Дж,  Потужність P = ${power} Вт`,
        insertValue: `${work}`,
        steps: [
          `Робота A = ${f} Н · ${s} м = ${work} Дж (${work/1000} кДж)`,
          `Потужність P = ${work} Дж / ${t} с = ${power} Вт (${(power/735.5).toFixed(2)} к.с.)`,
        ],
      };
    },
  },

  // 87. Hydrostatic Pressure
  {
    id: 'pressure_hydrostatic',
    num: 87,
    category: 'physics',
    nameUk: 'Гідростатичний тиск рідини',
    nameRu: 'Гидростатическое давление жидкости',
    nameEn: 'Hydrostatic Fluid Pressure',
    formula: 'P = ρ · g · h',
    descriptionUk: 'Тиск стовпа нестисливої рідини на заданій глибині h',
    descriptionRu: 'Давление столба жидкости на глубине',
    descriptionEn: 'Hydrostatic pressure exerted by liquid at depth h',
    inputs: [
      { key: 'rho', labelUk: 'Густина рідини ρ (кг/м³)', labelRu: 'Плотность ρ (кг/м³)', labelEn: 'Density ρ (kg/m³)', defaultValue: 1000 },
      { key: 'h', labelUk: 'Глибина h (м)', labelRu: 'Глубина h (м)', labelEn: 'Depth h (m)', defaultValue: 25 },
    ],
    calculate: ({ rho, h }) => {
      const p = Number(rho) * 9.80665 * Number(h);
      const bar = p / 100000;
      return {
        resultFormatted: `P = ${(p/1000).toFixed(2)} кПа  (${bar.toFixed(2)} бар, ${(bar*0.9869).toFixed(2)} атм)`,
        insertValue: `${(p/1000).toFixed(2)}`,
        steps: [`P = ${rho} кг/м³ · 9.81 м/с² · ${h} м = ${(p/1000).toFixed(2)} кПа`],
      };
    },
  },

  // 88. Carnot Heat Engine Efficiency
  {
    id: 'heat_engine_carnot',
    num: 88,
    category: 'physics',
    nameUk: 'ККД ідеальної теплової машини Карно',
    nameRu: 'КПД тепловой машины Карно',
    nameEn: 'Carnot Heat Engine Efficiency',
    formula: 'η = (T_н - T_х) / T_н · 100%',
    descriptionUk: 'Максимально можливий термодинамічний ККД за абсолютними температурами',
    descriptionRu: 'Максимальный термодинамический КПД',
    descriptionEn: 'Theoretical max thermal efficiency between hot and cold reservoirs',
    inputs: [
      { key: 'th', labelUk: 'Температура нагрівника Th (°C)', labelRu: 'Нагреватель Th (°C)', labelEn: 'Hot temp Th (°C)', defaultValue: 300 },
      { key: 'tc', labelUk: 'Температура холодильника Tc (°C)', labelRu: 'Холодильник Tc (°C)', labelEn: 'Cold temp Tc (°C)', defaultValue: 20 },
    ],
    calculate: ({ th, tc }) => {
      const tKelvinH = Number(th) + 273.15;
      const tKelvinC = Number(tc) + 273.15;
      const eta = ((tKelvinH - tKelvinC) / tKelvinH) * 100;
      return {
        resultFormatted: `ККД Карно η = ${eta.toFixed(2)}%`,
        insertValue: `${eta.toFixed(2)}`,
        steps: [
          `T_н = ${th}°C = ${tKelvinH.toFixed(2)} К`,
          `T_х = ${tc}°C = ${tKelvinC.toFixed(2)} К`,
          `η = (${tKelvinH.toFixed(1)} - ${tKelvinC.toFixed(1)}) / ${tKelvinH.toFixed(1)} = ${eta.toFixed(2)}%`,
        ],
      };
    },
  },

  // 89. Stefan-Boltzmann Radiation
  {
    id: 'black_body_radiation',
    num: 89,
    category: 'physics',
    nameUk: 'Закон Стефана-Больцмана (Випромінювання)',
    nameRu: 'Закон Стефана-Больцмана',
    nameEn: 'Stefan-Boltzmann Radiation',
    formula: 'j* = σ · T⁴,  σ ≈ 5.67037 · 10⁻⁸ Вт/(м²·К⁴)',
    descriptionUk: 'Енергетична світність абсолютно чорного тіла від абсолютної температури',
    descriptionRu: 'Энергетическая светимость черного тела',
    descriptionEn: 'Total power radiated per unit area of a black body at temperature T',
    inputs: [{ key: 't', labelUk: 'Температура поверхні T (Кельвін)', labelRu: 'Температура T (К)', labelEn: 'Temp T (K)', defaultValue: 5778 }],
    calculate: ({ t }) => {
      const sigma = 5.670374419e-8;
      const j = sigma * Math.pow(Number(t), 4);
      return {
        resultFormatted: `j* = ${(j/1e6).toFixed(3)} МВт/м²  (${j.toExponential(3)} Вт/м²)`,
        insertValue: `${(j/1e6).toFixed(3)}`,
        steps: [`j* = 5.670e-8 · (${t})⁴ = ${(j/1e6).toFixed(3)} МВт/м² (як на поверхні Сонця)`],
      };
    },
  },

  // 90. Harmonic Mean
  {
    id: 'harmonic_mean_calc',
    num: 90,
    category: 'stats',
    nameUk: 'Середнє гармонійне набору чисел',
    nameRu: 'Среднее гармоническое',
    nameEn: 'Harmonic Mean',
    formula: 'H = n / Σ(1 / xᵢ)',
    descriptionUk: 'Середнє для швидкостей та відносних величин',
    descriptionRu: 'Среднее гармоническое для скоростей',
    descriptionEn: 'Harmonic mean for rates, densities, and speeds',
    inputs: [{ key: 'vals', labelUk: 'Числа через кому', labelRu: 'Числа через запятую', labelEn: 'Numbers separated by comma', defaultValue: '60, 90, 120', type: 'text' }],
    calculate: ({ vals }) => {
      const arr = String(vals).split(/[\s,;]+/).map(Number).filter((v) => v > 0);
      if (arr.length === 0) return { resultFormatted: '0', insertValue: '0', steps: [] };
      const sumInv = arr.reduce((acc, v) => acc + 1 / v, 0);
      const h = arr.length / sumInv;
      return {
        resultFormatted: `H = ${h.toFixed(3)}`,
        insertValue: `${h.toFixed(3)}`,
        steps: [`H = ${arr.length} / (${arr.map((v) => '1/' + v).join(' + ')}) = ${h.toFixed(3)}`],
      };
    },
  },

  // 91. Geometric Mean
  {
    id: 'geometric_mean_calc',
    num: 91,
    category: 'stats',
    nameUk: 'Середнє геометричне набору чисел',
    nameRu: 'Среднее геометрическое',
    nameEn: 'Geometric Mean',
    formula: 'G = ⁿ√(x₁ · x₂ · ... · xₙ)',
    descriptionUk: 'Середнє для мультиплікативних темпів росту та індексів',
    descriptionRu: 'Среднее геометрическое для темпов роста',
    descriptionEn: 'Geometric mean for multiplicative growth rates',
    inputs: [{ key: 'vals', labelUk: 'Числа через кому', labelRu: 'Числа через запятую', labelEn: 'Numbers separated by comma', defaultValue: '4, 18, 24, 32', type: 'text' }],
    calculate: ({ vals }) => {
      const arr = String(vals).split(/[\s,;]+/).map(Number).filter((v) => v > 0);
      if (arr.length === 0) return { resultFormatted: '0', insertValue: '0', steps: [] };
      const logSum = arr.reduce((acc, v) => acc + Math.log(v), 0);
      const g = Math.exp(logSum / arr.length);
      return {
        resultFormatted: `G = ${g.toFixed(3)}`,
        insertValue: `${g.toFixed(3)}`,
        steps: [`G = (${arr.join(' · ')})^(1/${arr.length}) = ${g.toFixed(3)}`],
      };
    },
  },

  // 92. Pascal Triangle Binomial Row
  {
    id: 'pascal_triangle_coeff',
    num: 92,
    category: 'algebra',
    nameUk: 'Рядок трикутника Паскаля (Біном Ньютона)',
    nameRu: 'Строка треугольника Паскаля (Бином Ньютона)',
    nameEn: "Pascal's Triangle Row (Binomial Coefficients)",
    formula: '(a + b)ⁿ = Σ C(n, k) aⁿ⁻ᵏ bᵏ',
    descriptionUk: 'Коефіцієнти розкладу бінома Ньютона n-го степеня',
    descriptionRu: 'Биномиальные коэффициенты строки n',
    descriptionEn: 'Binomial expansion coefficients of row n',
    inputs: [{ key: 'n', labelUk: 'Степінь бінома n', labelRu: 'Степень n', labelEn: 'Power n', defaultValue: 6 }],
    calculate: ({ n }) => {
      const rowNum = Math.max(0, Math.min(20, Math.round(Number(n))));
      const row: number[] = [1];
      for (let k = 1; k <= rowNum; k++) {
        row.push(Math.round((row[k - 1] * (rowNum - k + 1)) / k));
      }
      return {
        resultFormatted: `Рядок n=${rowNum}: [ ${row.join(', ')} ]`,
        insertValue: row.join(', '),
        steps: [
          `Сума коефіцієнтів 2ⁿ = 2^${rowNum} = ${Math.pow(2, rowNum)}`,
          `Коефіцієнти: ${row.join(', ')}`,
        ],
      };
    },
  },

  // 93. Bernoulli Distribution Probability
  {
    id: 'bernoulli_distribution',
    num: 93,
    category: 'stats',
    nameUk: 'Формула Бернуллі (Імовірність k успіхів)',
    nameRu: 'Формула Бернулли (Вероятность k успехов)',
    nameEn: 'Binomial Bernoulli Probability',
    formula: 'P_n(k) = C(n, k) · pᵏ · (1-p)ⁿ⁻ᵏ',
    descriptionUk: 'Імовірність настання рівно k успіхів у серії з n незалежних випробувань',
    descriptionRu: 'Вероятность ровно k успехов в n испытаниях',
    descriptionEn: 'Probability of exactly k successes in n independent trials',
    inputs: [
      { key: 'n', labelUk: 'Кількість спроб n', labelRu: 'Испытаний n', labelEn: 'Trials n', defaultValue: 10 },
      { key: 'k', labelUk: 'Кількість успіхів k', labelRu: 'Успехов k', labelEn: 'Successes k', defaultValue: 4 },
      { key: 'p', labelUk: 'Імовірність успіху p (0..1)', labelRu: 'Вероятность p', labelEn: 'Probability p', defaultValue: 0.5 },
    ],
    calculate: ({ n, k, p }) => {
      const nVal = Number(n);
      const kVal = Number(k);
      const pVal = Number(p);
      const comb = calculateCombinatorics(nVal, kVal).combinations;
      const prob = comb * Math.pow(pVal, kVal) * Math.pow(1 - pVal, nVal - kVal);
      return {
        resultFormatted: `P(${k} з ${n}) = ${(prob * 100).toFixed(2)}%  (p = ${prob.toFixed(5)})`,
        insertValue: `${(prob * 100).toFixed(2)}%`,
        steps: [
          `C(${nVal}, ${kVal}) = ${comb}`,
          `P = ${comb} · (${pVal})^${kVal} · (${(1-pVal).toFixed(2)})^${nVal - kVal} = ${(prob * 100).toFixed(2)}%`,
        ],
      };
    },
  },

  // 94. Snells Law of Refraction
  {
    id: 'snell_refraction_law',
    num: 94,
    category: 'physics',
    nameUk: 'Закон заломлення світла Снелла',
    nameRu: 'Закон преломления света Снелла',
    nameEn: "Snell's Law of Refraction",
    formula: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
    descriptionUk: 'Кут заломлення променя світла на межі двох оптичних середовищ',
    descriptionRu: 'Угол преломления света на границе сред',
    descriptionEn: 'Angle of refraction at boundary between two optical media',
    inputs: [
      { key: 'n1', labelUk: 'Показник середовища 1 (n1)', labelRu: 'Показатель 1 (n1)', labelEn: 'Index 1 (n1)', defaultValue: 1 },
      { key: 'ang1', labelUk: 'Кут падіння θ1 (°)', labelRu: 'Угол падения θ1 (°)', labelEn: 'Incident angle θ1 (°)', defaultValue: 45 },
      { key: 'n2', labelUk: 'Показник середовища 2 (n2)', labelRu: 'Показатель 2 (n2)', labelEn: 'Index 2 (n2)', defaultValue: 1.333 },
    ],
    calculate: ({ n1, ang1, n2 }) => {
      const rad1 = (Number(ang1) * Math.PI) / 180;
      const sin2 = (Number(n1) * Math.sin(rad1)) / Number(n2);
      if (Math.abs(sin2) > 1) {
        return {
          resultFormatted: 'Повне внутрішнє відбиття (промінь не виходить)',
          insertValue: '90°',
          steps: ['sin(θ2) > 1 -> явище повного внутрішнього відбиття'],
        };
      }
      const rad2 = Math.asin(sin2);
      const ang2 = (rad2 * 180) / Math.PI;
      return {
        resultFormatted: `Кут заломлення θ2 = ${ang2.toFixed(2)}°`,
        insertValue: `${ang2.toFixed(2)}°`,
        steps: [`sin(θ2) = (${n1} · sin(${ang1}°)) / ${n2} = ${sin2.toFixed(4)} -> θ2 = ${ang2.toFixed(2)}°`],
      };
    },
  },

  // 95. Photon Energy
  {
    id: 'photon_energy_planck',
    num: 95,
    category: 'physics',
    nameUk: 'Енергія кванта світла (Фотон Планк)',
    nameRu: 'Энергия кванта света (Фотон Планк)',
    nameEn: 'Photon Energy (E = hν)',
    formula: 'E = h · ν = (h · c) / λ',
    descriptionUk: 'Енергія фотона у Джоулях та електрон-вольтах (еВ) за довжиною хвилі',
    descriptionRu: 'Энергия фотона в Джоулях и эВ',
    descriptionEn: 'Photon energy in Joules and electron-volts from wavelength',
    inputs: [{ key: 'nm', labelUk: 'Довжина хвилі λ (нм)', labelRu: 'Длина волны λ (нм)', labelEn: 'Wavelength λ (nm)', defaultValue: 550 }],
    calculate: ({ nm }) => {
      const h = 6.62607015e-34;
      const c = 2.99792458e8;
      const lambdaM = Number(nm) * 1e-9;
      const eJoules = (h * c) / lambdaM;
      const eEv = eJoules / 1.602176634e-19;
      return {
        resultFormatted: `E = ${eEv.toFixed(3)} еВ  (${eJoules.toExponential(3)} Дж)`,
        insertValue: `${eEv.toFixed(3)} eV`,
        steps: [
          `λ = ${nm} нм = ${lambdaM} м (зелене видиме світло)`,
          `E = (6.626e-34 · 3e8) / ${lambdaM} = ${eJoules.toExponential(3)} Дж = ${eEv.toFixed(3)} еВ`,
        ],
      };
    },
  },

  // 96. Mass Percentage in Compound
  {
    id: 'mass_fraction_chem',
    num: 96,
    category: 'chemistry',
    nameUk: 'Масова частка елемента у сполуці (ω%)',
    nameRu: 'Массовая доля элемента в веществе (ω%)',
    nameEn: 'Element Mass Fraction',
    formula: 'ω = (n · A_r) / M_r · 100%',
    descriptionUk: 'Відсотковий вміст заданого хімічного елемента у молекулі',
    descriptionRu: 'Процентное содержание элемента в веществе',
    descriptionEn: 'Mass percentage of element in chemical formula',
    inputs: [
      { key: 'ar', labelUk: 'Атомна маса елемента A_r', labelRu: 'Атомная масса Ar', labelEn: 'Atomic mass Ar', defaultValue: 16 },
      { key: 'n', labelUk: 'Кількість атомів елемента', labelRu: 'Число атомов', labelEn: 'Atom count', defaultValue: 4 },
      { key: 'mr', labelUk: 'Молярна маса сполуки M_r', labelRu: 'Молярная масса Mr', labelEn: 'Molecular mass Mr', defaultValue: 98 },
    ],
    calculate: ({ ar, n, mr }) => {
      const w = ((Number(ar) * Number(n)) / Number(mr)) * 100;
      return {
        resultFormatted: `Масова частка ω = ${w.toFixed(2)}%`,
        insertValue: `${w.toFixed(2)}%`,
        steps: [`ω = (${n} · ${ar}) / ${mr} · 100% = ${w.toFixed(2)}%`],
      };
    },
  },

  // 97. Molar Concentration (Molarity)
  {
    id: 'molarity_solution',
    num: 97,
    category: 'chemistry',
    nameUk: 'Молярна концентрація розчину (C = n/V)',
    nameRu: 'Молярная концентрация раствора (C = n/V)',
    nameEn: 'Molar Concentration (Molarity)',
    formula: 'C = m / (M · V) моль/л',
    descriptionUk: 'Молярність розчину за масою речовини та обʼємом розчину',
    descriptionRu: 'Молярность раствора по массе и объему',
    descriptionEn: 'Molarity of a solution from solute mass and total volume',
    inputs: [
      { key: 'm', labelUk: 'Маса розчиненої речовини m (г)', labelRu: 'Масса вещества (г)', labelEn: 'Solute mass (g)', defaultValue: 58.44 },
      { key: 'mr', labelUk: 'Молярна маса M (г/моль)', labelRu: 'Молярная масса (г/моль)', labelEn: 'Molar mass (g/mol)', defaultValue: 58.44 },
      { key: 'v', labelUk: 'Обʼєм розчину V (л)', labelRu: 'Объем раствора (л)', labelEn: 'Solution volume (L)', defaultValue: 1 },
    ],
    calculate: ({ m, mr, v }) => {
      const moles = Number(m) / Number(mr);
      const c = moles / Number(v);
      return {
        resultFormatted: `C = ${c.toFixed(3)} моль/л  (або ${c.toFixed(3)} M)`,
        insertValue: `${c.toFixed(3)} M`,
        steps: [
          `Кількість моль n = ${m} г / ${mr} г/моль = ${moles.toFixed(3)} моль`,
          `Молярність C = ${moles.toFixed(3)} моль / ${v} л = ${c.toFixed(3)} М`,
        ],
      };
    },
  },

  // 98. Cubic Equation Cardano Approximation
  {
    id: 'cubic_cardano_approx',
    num: 98,
    category: 'algebra',
    nameUk: 'Кубічне рівняння x³ + px + q = 0 (Кардано)',
    nameRu: 'Кубическое уравнение (Формула Кардано)',
    nameEn: 'Cubic Equation (Cardano Root)',
    formula: 'Q = (p/3)³ + (q/2)²,  x = u + v',
    descriptionUk: 'Дійсний розвʼязок канонічного кубічного рівняння за формулою Кардано',
    descriptionRu: 'Действительный корень кубического уравнения',
    descriptionEn: 'Real root of reduced cubic equation via Cardano method',
    inputs: [
      { key: 'p', labelUk: 'Коефіцієнт p', labelRu: 'Коэффициент p', labelEn: 'Parameter p', defaultValue: -6 },
      { key: 'q', labelUk: 'Коефіцієнт q', labelRu: 'Коэффициент q', labelEn: 'Parameter q', defaultValue: -4 },
    ],
    calculate: ({ p, q }) => {
      const pVal = Number(p);
      const qVal = Number(q);
      const Q = Math.pow(pVal / 3, 3) + Math.pow(qVal / 2, 2);
      if (Q >= 0) {
        const u = Math.cbrt(-qVal / 2 + Math.sqrt(Q));
        const v = Math.cbrt(-qVal / 2 - Math.sqrt(Q));
        const root = u + v;
        return {
          resultFormatted: `Дійсний корінь x = ${root.toFixed(4)}`,
          insertValue: `${root.toFixed(4)}`,
          steps: [`Дискримінант Кардано Q = (p/3)³ + (q/2)² = ${Q.toFixed(4)} ≥ 0`, `x = u + v = ${root.toFixed(4)}`],
        };
      } else {
        // 3 real roots via trigonometric approach
        const r = Math.sqrt(-Math.pow(pVal / 3, 3));
        const phi = Math.acos(-qVal / (2 * r));
        const x1 = 2 * Math.cbrt(r) * Math.cos(phi / 3);
        return {
          resultFormatted: `Три дійсні корені, головний: x₁ = ${x1.toFixed(4)}`,
          insertValue: `${x1.toFixed(4)}`,
          steps: [`Q = ${Q.toFixed(4)} < 0 (незвідний випадок)`, `x₁ ≈ ${x1.toFixed(4)}`],
        };
      }
    },
  },

  // 99. Resistor 4-Band & 5-Band Color Code
  {
    id: 'resistor_color_code',
    num: 99,
    category: 'electronics',
    nameUk: 'Колірне маркування резисторів',
    nameRu: 'Цветовая маркировка резисторов',
    nameEn: 'Resistor Color Code Bands',
    formula: 'R = (Band1 · 10 + Band2) · 10^Mult ± Tol%',
    descriptionUk: 'Декодування номіналу опору за кольоровими кільцями',
    descriptionRu: 'Расчет сопротивления по цветным полосам',
    descriptionEn: 'Decodes resistance value from 4 standard color rings',
    inputs: [
      { key: 'b1', labelUk: '1-а смуга (цифра)', labelRu: '1 полоса', labelEn: 'Band 1', defaultValue: 4 },
      { key: 'b2', labelUk: '2-а смуга (цифра)', labelRu: '2 полоса', labelEn: 'Band 2', defaultValue: 7 },
      { key: 'mult', labelUk: 'Множник (10^x)', labelRu: 'Множитель', labelEn: 'Multiplier', defaultValue: 3 },
      { key: 'tol', labelUk: 'Точність (%)', labelRu: 'Точность', labelEn: 'Tolerance', defaultValue: 10 },
    ],
    calculate: ({ b1, b2, mult, tol }) => {
      const res = decodeResistor(Number(b1), Number(b2), Number(mult), Number(tol));
      return {
        resultFormatted: `Опір: ${res.formatted}  (Точність ±${res.tolerancePercent}%)`,
        insertValue: `${res.resistanceOhms}`,
        steps: [`Номінал: (${b1}·10 + ${b2}) · 10^${mult} = ${res.resistanceOhms} Ом = ${res.formatted}`],
      };
    },
  },

  // 100. Ultra HD Screen Pixel Budget
  {
    id: 'aspect_ratio_4k_8k',
    num: 100,
    category: 'daily',
    nameUk: 'Кількість пікселів та щільність PPI',
    nameRu: 'Количество пикселей и плотность PPI',
    nameEn: 'Screen Pixel Budget & PPI Density',
    formula: 'Total = W · H,  PPI = √(W² + H²) / Діагональ',
    descriptionUk: 'Мегапікселі екрана (Full HD, 4K, 8K) та щільність точок на дюйм (PPI)',
    descriptionRu: 'Мегапиксели экрана и плотность точек на дюйм',
    descriptionEn: 'Total display pixel count and PPI density based on screen diagonal',
    inputs: [
      { key: 'w', labelUk: 'Ширина (px)', labelRu: 'Ширина (px)', labelEn: 'Width (px)', defaultValue: 3840 },
      { key: 'h', labelUk: 'Висота (px)', labelRu: 'Высота (px)', labelEn: 'Height (px)', defaultValue: 2160 },
      { key: 'diag', labelUk: 'Діагональ (дюймів)', labelRu: 'Диагональ (дюймов)', labelEn: 'Diagonal (inches)', defaultValue: 27 },
    ],
    calculate: ({ w, h, diag }) => {
      const wVal = Number(w);
      const hVal = Number(h);
      const diagVal = Number(diag);
      const totalPixels = wVal * hVal;
      const mp = totalPixels / 1000000;
      const ppi = Math.hypot(wVal, hVal) / diagVal;
      return {
        resultFormatted: `${mp.toFixed(2)} Мп (${totalPixels.toLocaleString()} пікс),  Щільність: ${ppi.toFixed(1)} PPI`,
        insertValue: `${totalPixels}`,
        steps: [
          `Роздільна здатність: ${wVal} × ${hVal} = ${mp.toFixed(2)} Мегапікселів`,
          `Діагональ у пікселях: ${Math.hypot(wVal, hVal).toFixed(1)} px`,
          `Щільність: ${ppi.toFixed(1)} точок на дюйм (PPI)`,
        ],
      };
    },
  },

  // 101. Doppler Effect
  {
    id: 'doppler_sound',
    num: 101,
    category: 'physics',
    nameUk: 'Ефект Доплера для звукових хвиль',
    nameRu: 'Эффект Доплера для звуковых волн',
    nameEn: 'Doppler Effect for Sound',
    formula: 'f_спост = f₀ · (c ± v_спост) / (c ∓ v_джерела)',
    descriptionUk: 'Зміна частоти звуку при наближенні або віддаленні джерела звуку',
    descriptionRu: 'Изменение частоты звука при движении источника',
    descriptionEn: 'Observed frequency shift for moving sound source and observer',
    inputs: [
      { key: 'f0', labelUk: 'Частота джерела f0 (Гц)', labelRu: 'Частота f0 (Гц)', labelEn: 'Source freq f0 (Hz)', defaultValue: 1000 },
      { key: 'vsrc', labelUk: 'Швидкість джерела v (м/с)', labelRu: 'Скорость источника (м/с)', labelEn: 'Source speed (m/s)', defaultValue: 30 },
      { key: 'vsound', labelUk: 'Швидкість звуку c (м/с)', labelRu: 'Скорость звука (м/с)', labelEn: 'Sound speed c (m/s)', defaultValue: 343 },
    ],
    calculate: ({ f0, vsrc, vsound }) => {
      const f0Val = Number(f0);
      const vsVal = Number(vsrc);
      const cVal = Number(vsound);
      const fApproach = f0Val * (cVal / (cVal - vsVal));
      const fRecede = f0Val * (cVal / (cVal + vsVal));
      return {
        resultFormatted: `Наближення: ${fApproach.toFixed(1)} Гц  |  Віддалення: ${fRecede.toFixed(1)} Гц`,
        insertValue: `${fApproach.toFixed(1)}`,
        steps: [
          `При наближенні: f = ${f0Val} · (${cVal} / (${cVal} - ${vsVal})) = ${fApproach.toFixed(1)} Гц`,
          `При віддаленні: f = ${f0Val} · (${cVal} / (${cVal} + ${vsVal})) = ${fRecede.toFixed(1)} Гц`,
        ],
      };
    },
  },

  // 102. Cone Frustum Volume
  {
    id: 'cone_frustum',
    num: 102,
    category: 'geometry',
    nameUk: 'Зрізаний конус (Обʼєм та площа)',
    nameRu: 'Усеченный конус (Объем и площадь)',
    nameEn: 'Cone Frustum Volume & Area',
    formula: 'V = (1/3)πh · (R² + Rr + r²)',
    descriptionUk: 'Обʼєм та бічна площа поверхні зрізаного конуса',
    descriptionRu: 'Объем и площадь боковой поверхности усеченного конуса',
    descriptionEn: 'Volume and lateral area of a conical frustum',
    inputs: [
      { key: 'r1', labelUk: 'Нижній радіус R', labelRu: 'Нижний радиус R', labelEn: 'Bottom radius R', defaultValue: 6 },
      { key: 'r2', labelUk: 'Верхній радіус r', labelRu: 'Верхний радиус r', labelEn: 'Top radius r', defaultValue: 3 },
      { key: 'h', labelUk: 'Висота h', labelRu: 'Высота h', labelEn: 'Height h', defaultValue: 4 },
    ],
    calculate: ({ r1, r2, h }) => {
      const R = Number(r1);
      const r = Number(r2);
      const hVal = Number(h);
      const v = (1 / 3) * Math.PI * hVal * (R * R + R * r + r * r);
      const l = Math.hypot(hVal, R - r);
      const latArea = Math.PI * (R + r) * l;
      return {
        resultFormatted: `Обʼєм V = ${v.toFixed(3)},  Бічна площа S = ${latArea.toFixed(3)}`,
        insertValue: `${v.toFixed(3)}`,
        steps: [
          `V = (1/3) · π · ${hVal} · (${R}² + ${R}·${r} + ${r}²) = ${v.toFixed(3)}`,
          `Твірна l = √(${hVal}² + (${R}-${r})²) = ${l.toFixed(3)}`,
        ],
      };
    },
  },

  // 103. Torus Volume & Surface Area
  {
    id: 'torus_geom',
    num: 103,
    category: 'geometry',
    nameUk: 'Тор / Бублик (Обʼєм та площа поверхні)',
    nameRu: 'Тор (Объем и площадь поверхности)',
    nameEn: 'Torus Volume & Surface Area',
    formula: 'V = 2π² · R · r²,  S = 4π² · R · r',
    descriptionUk: 'Обʼєм тора та площа поверхні за великим радіусом R і радіусом трубки r',
    descriptionRu: 'Объем и площадь тора по радиусам',
    descriptionEn: 'Volume and surface area of a 3D geometric torus',
    inputs: [
      { key: 'r_major', labelUk: 'Великий радіус R', labelRu: 'Большой радиус R', labelEn: 'Major radius R', defaultValue: 10 },
      { key: 'r_minor', labelUk: 'Малий радіус трубки r', labelRu: 'Малый радиус r', labelEn: 'Minor radius r', defaultValue: 2 },
    ],
    calculate: ({ r_major, r_minor }) => {
      const R = Number(r_major);
      const r = Number(r_minor);
      const v = 2 * Math.PI * Math.PI * R * r * r;
      const s = 4 * Math.PI * Math.PI * R * r;
      return {
        resultFormatted: `Обʼєм V = ${v.toFixed(2)},  Площа поверхні S = ${s.toFixed(2)}`,
        insertValue: `${v.toFixed(2)}`,
        steps: [
          `V = 2 · π² · ${R} · ${r}² = ${v.toFixed(2)}`,
          `S = 4 · π² · ${R} · ${r} = ${s.toFixed(2)}`,
        ],
      };
    },
  },

  // 104. Regular Pyramid
  {
    id: 'pyramid_geom',
    num: 104,
    category: 'geometry',
    nameUk: 'Правильна чотирикутна піраміда',
    nameRu: 'Правильная четырехугольная пирамида',
    nameEn: 'Regular Square Pyramid',
    formula: 'V = (1/3) · a² · h,  S_біч = 2 · a · h_a',
    descriptionUk: 'Обʼєм піраміди, апофема та повна площа поверхні',
    descriptionRu: 'Объем пирамиды, апофема и площадь',
    descriptionEn: 'Volume, apothem, and total surface area of a square pyramid',
    inputs: [
      { key: 'a', labelUk: 'Сторона основи a', labelRu: 'Сторона основания a', labelEn: 'Base side a', defaultValue: 6 },
      { key: 'h', labelUk: 'Висота піраміди h', labelRu: 'Высота h', labelEn: 'Height h', defaultValue: 4 },
    ],
    calculate: ({ a, h }) => {
      const aVal = Number(a);
      const hVal = Number(h);
      const v = (1 / 3) * aVal * aVal * hVal;
      const apothem = Math.hypot(hVal, aVal / 2);
      const latArea = 2 * aVal * apothem;
      const totalArea = aVal * aVal + latArea;
      return {
        resultFormatted: `V = ${v.toFixed(2)},  Апофема = ${apothem.toFixed(2)},  Повна площа S = ${totalArea.toFixed(2)}`,
        insertValue: `${v.toFixed(2)}`,
        steps: [
          `V = (1/3) · ${aVal}² · ${hVal} = ${v.toFixed(2)}`,
          `Апофема ha = √(${hVal}² + (${aVal}/2)²) = ${apothem.toFixed(2)}`,
          `Повна площа S = ${aVal}² + 2·${aVal}·${apothem.toFixed(2)} = ${totalArea.toFixed(2)}`,
        ],
      };
    },
  },

  // 105. Surface Tension & Capillary Action
  {
    id: 'surface_tension_capillary',
    num: 105,
    category: 'physics',
    nameUk: 'Капілярний підйом рідини (Формула Жюрена)',
    nameRu: 'Капиллярный подъем жидкости (Формула Жюрена)',
    nameEn: "Capillary Rise (Jurin's Law)",
    formula: 'h = (2 · γ · cos θ) / (ρ · g · r)',
    descriptionUk: 'Висота підйому меніска рідини у тонкому капілярі',
    descriptionRu: 'Высота подъема жидкости в капилляре',
    descriptionEn: 'Height of liquid column in capillary tube by surface tension',
    inputs: [
      { key: 'gamma', labelUk: 'Поверхневий натяг γ (Н/м)', labelRu: 'Натяжение γ (Н/м)', labelEn: 'Surface tension γ (N/m)', defaultValue: 0.0728 },
      { key: 'r_mm', labelUk: 'Радіус капіляра r (мм)', labelRu: 'Радиус r (мм)', labelEn: 'Capillary radius r (mm)', defaultValue: 0.5 },
      { key: 'rho', labelUk: 'Густина рідини ρ (кг/м³)', labelRu: 'Плотность ρ (кг/м³)', labelEn: 'Liquid density (kg/m³)', defaultValue: 1000 },
    ],
    calculate: ({ gamma, r_mm, rho }) => {
      const g = 9.80665;
      const rM = Number(r_mm) * 1e-3;
      const hM = (2 * Number(gamma)) / (Number(rho) * g * rM);
      const hMm = hM * 1000;
      return {
        resultFormatted: `Висота підйому h = ${hMm.toFixed(2)} мм  (${hM.toFixed(4)} м)`,
        insertValue: `${hMm.toFixed(2)} mm`,
        steps: [`h = (2 · ${gamma}) / (${rho} · 9.81 · ${rM}) = ${hMm.toFixed(2)} мм`],
      };
    },
  },
];

