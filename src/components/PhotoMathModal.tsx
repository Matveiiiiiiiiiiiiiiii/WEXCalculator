import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, getTranslation } from '../utils/i18n';
import {
  AiProblemSolution,
  ProblemSubject,
  ProblemComputationItem,
} from '../types/calculator';
import {
  Camera,
  Upload,
  Sparkles,
  X,
  Check,
  Image as ImageIcon,
  Scan,
  AlertCircle,
  Calculator,
  LineChart,
  Copy,
  BookOpen,
  Atom,
  FlaskConical,
  Compass,
  TrendingUp,
  Cpu,
  Dna,
  RotateCcw,
  RefreshCw,
  Zap,
  ZapOff,
  Maximize2,
  ArrowRight,
  FileText,
  Send,
} from 'lucide-react';

interface PhotoMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolveExpression: (
    expr: string,
    mode: 'standard' | 'scientific' | 'fractions' | 'finance',
    note?: string
  ) => void;
  onOpenInGraphs?: (graphExpr: string) => void;
  lang: Language;
  isDark: boolean;
}

// Subject config with icons and styles
const SUBJECT_CONFIG: Record<
  ProblemSubject,
  { labelKey: string; icon: React.FC<{ className?: string }>; color: string; bg: string }
> = {
  physics: {
    labelKey: 'physicsSubject',
    icon: Atom,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  },
  chemistry: {
    labelKey: 'chemistrySubject',
    icon: FlaskConical,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
  geometry: {
    labelKey: 'geometrySubject',
    icon: Compass,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  },
  economics: {
    labelKey: 'economicsSubject',
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  },
  math: {
    labelKey: 'mathSubject',
    icon: Calculator,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  },
  biology: {
    labelKey: 'biologySubject',
    icon: Dna,
    color: 'text-rose-400',
    bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  },
  cs: {
    labelKey: 'csSubject',
    icon: Cpu,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  },
  other: {
    labelKey: 'otherSubject',
    icon: BookOpen,
    color: 'text-slate-400',
    bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
  },
};

// Generates localized sample problems for any language (UK, RU, EN, etc.)
function getLocalizedSampleProblems(lang: Language): (AiProblemSolution & {
  sampleTitleKey: string;
  svgGraphic: React.ReactNode;
})[] {
  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  return [
    {
      id: 'sample-physics',
      sampleTitleKey: 'sampleTask1',
      subject: 'physics',
      subjectTitle: isUk
        ? 'Фізика: Кінематика та енергія'
        : isEn
        ? 'Physics: Kinematics & Energy'
        : 'Физика: Кинематика и энергия',
      topic: isUk
        ? 'Кінетична енергія матеріальної точки та гальмівна робота'
        : isEn
        ? 'Kinetic Energy of Point Mass & Stopping Work'
        : 'Кинетическая энергия материальной точки и тормозная работа',
      problemStatement: isUk
        ? 'Тіло масою m = 4 кг рухається прямолінійно зі швидкістю v = 54 км/год. Переведіть швидкість у систему СІ. Знайдіть кінетичну енергію тіла Ek та роботу сили A для його повної зупинки.'
        : isEn
        ? 'A body of mass m = 4 kg moves in a straight line at speed v = 54 km/h. Convert speed to SI units. Calculate kinetic energy Ek and work A required to stop it.'
        : 'Тело массой m = 4 кг движется прямолинейно со скоростью v = 54 км/ч. Переведите скорость в СИ. Найдите кинетическую энергию тела Ek и работу силы A для его полной остановки.',
      givenData: [
        {
          label: isUk ? 'Маса тіла' : isEn ? 'Mass' : 'Масса тела',
          symbol: 'm',
          value: isEn ? '4 kg' : '4 кг',
          unit: isEn ? 'kg' : 'кг',
          raw: '4',
        },
        {
          label: isUk ? 'Початкова швидкість' : isEn ? 'Initial speed' : 'Начальная скорость',
          symbol: 'v',
          value: isEn ? '54 km/h' : '54 км/год',
          unit: isEn ? 'km/h' : 'км/год',
          raw: '54',
        },
        {
          label: isUk ? 'Кінцева швидкість' : isEn ? 'Final speed' : 'Конечная скорость',
          symbol: 'v_k',
          value: isEn ? '0 m/s' : '0 м/с',
          unit: isEn ? 'm/s' : 'м/с',
          raw: '0',
        },
      ],
      siConversions: isUk
        ? [
            'v = 54 км/год = (54 · 1000 м) / 3600 с = 15 м/с',
            'm = 4 кг (базова одиниця СІ)',
          ]
        : isEn
        ? [
            'v = 54 km/h = (54 * 1000 m) / 3600 s = 15 m/s',
            'm = 4 kg (base SI unit)',
          ]
        : [
            'v = 54 км/ч = (54 · 1000 м) / 3600 с = 15 м/с',
            'm = 4 кг (базовая единица СИ)',
          ],
      toFind: [
        {
          symbol: 'Ek',
          description: isUk ? 'Кінетична енергія тіла' : isEn ? 'Kinetic energy' : 'Кинетическая энергия тела',
        },
        {
          symbol: 'A',
          description: isUk ? 'Робота сили гальмування' : isEn ? 'Stopping work' : 'Работа силы торможения',
        },
      ],
      lawsAndFormulas: [
        'Ek = (m · v²) / 2',
        'A = ΔEk = Ek₂ - Ek₁ = -Ek',
        '[Ek] = кг · (м/с)² = кг · м²/с² = Н · м = Дж',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk
            ? 'Зведення величин до системи СІ'
            : isEn
            ? 'Converting values to SI units'
            : 'Приведение величин к системе СИ',
          explanation: isUk
            ? 'Швидкість подана у км/год. Переводимо в м/с діленням на 3.6: 54 км/год = 15 м/с.'
            : isEn
            ? 'Speed is given in km/h. Convert to m/s by dividing by 3.6: 54 km/h = 15 m/s.'
            : 'Скорость задана в км/ч. Переводим в м/с делением на 3.6: 54 км/ч = 15 м/с.',
          formula: 'v = 54 / 3.6',
          calculation: '54 / 3.6 = 15 m/s',
          unitCheck: '[v] = м/с',
        },
        {
          stepNumber: 2,
          title: isUk
            ? 'Розрахунок кінетичної енергії Ek'
            : isEn
            ? 'Calculating kinetic energy Ek'
            : 'Расчет кинетической энергии Ek',
          explanation: isUk
            ? 'Кінетична енергія матеріальної точки: Ek = (m · v²) / 2 = (4 · 15²) / 2 = (4 · 225) / 2 = 450 Дж.'
            : isEn
            ? 'Kinetic energy of point mass: Ek = (m · v²) / 2 = (4 · 15²) / 2 = 450 J.'
            : 'Кинетическая энергия материальной точки: Ek = (m · v²) / 2 = (4 · 15²) / 2 = 450 Дж.',
          formula: 'Ek = (m * v^2) / 2',
          calculation: '(4 * 15^2) / 2 = 450 J',
          unitCheck: '[Ek] = кг · м²/с² = Дж',
        },
        {
          stepNumber: 3,
          title: isUk
            ? 'Теорема про кінетичну енергію та робота зупинки'
            : isEn
            ? 'Work-energy theorem & braking work'
            : 'Теорема о кинетической энергии и работа торможения',
          explanation: isUk
            ? 'Робота результуючої сили дорівнює зміні кінетичної енергії: A = 0 - Ek = -450 Дж.'
            : isEn
            ? 'The net work equals change in kinetic energy: A = 0 - Ek = -450 J.'
            : 'Работа результирующей силы равна изменению кинетической энергии: A = 0 - Ek = -450 Дж.',
          formula: 'A = 0 - Ek',
          calculation: '0 - 450 = -450 J',
          unitCheck: '[A] = Дж',
        },
      ],
      finalAnswer: isUk ? 'Ek = 450 Дж; A = -450 Дж' : isEn ? 'Ek = 450 J; A = -450 J' : 'Ek = 450 Дж; A = -450 Дж',
      computationBlock: {
        primaryExpression: '(4 * 15^2) / 2',
        recommendedMode: 'scientific',
        graphSuggestion: '4 * x^2 / 2',
        computations: [
          {
            id: 'c1',
            name: isUk ? 'Переведення швидкості в СІ' : isEn ? 'Velocity conversion to SI' : 'Перевод скорости в СИ',
            formula: 'v_kmh / 3.6',
            expression: '54 / 3.6',
            result: '15',
            unit: isEn ? 'm/s' : 'м/с',
          },
          {
            id: 'c2',
            name: isUk ? 'Квадрат швидкості v²' : isEn ? 'Velocity squared v²' : 'Квадрат скорости v²',
            formula: 'v^2',
            expression: '15^2',
            result: '225',
            unit: isEn ? 'm²/s²' : 'м²/с²',
          },
          {
            id: 'c3',
            name: isUk ? 'Кінетична енергія Ek' : isEn ? 'Kinetic Energy Ek' : 'Кинетическая энергия Ek',
            formula: '(m * v^2) / 2',
            expression: '(4 * 225) / 2',
            result: '450',
            unit: isEn ? 'J' : 'Дж',
          },
        ],
      },
      confidence: 0.99,
      svgGraphic: (
        <svg viewBox="0 0 320 120" className="w-full h-full bg-slate-900 rounded-lg p-2 font-mono select-none">
          <rect width="100%" height="100%" fill="#0f172a" />
          <circle cx="60" cy="65" r="24" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" />
          <text x="52" y="70" fill="#38bdf8" fontSize="13" fontWeight="bold">m=4</text>
          <path d="M 90 65 L 180 65" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="180,60 190,65 180,70" fill="#f59e0b" />
          <text x="105" y="55" fill="#f59e0b" fontSize="12" fontWeight="bold">v=15 m/s</text>
          <text x="200" y="60" fill="#e2e8f0" fontSize="13" fontWeight="bold">Ek = m·v² / 2</text>
          <text x="200" y="80" fill="#4ade80" fontSize="12">Ek = 450 J</text>
        </svg>
      ),
    },
    {
      id: 'sample-chemistry',
      sampleTitleKey: 'sampleTask2',
      subject: 'chemistry',
      subjectTitle: isUk
        ? 'Хімія: Стехіометрія та молярність'
        : isEn
        ? 'Chemistry: Stoichiometry & Molarity'
        : 'Химия: Стехиометрия и молярность',
      topic: isUk
        ? 'Молярна маса та кількість речовини NaOH'
        : isEn
        ? 'Molar mass & substance amount of NaOH'
        : 'Молярная масса и количество вещества NaOH',
      problemStatement: isUk
        ? 'Обчисліть кількість речовини n гідроксиду натрію (NaOH) у зразку масою m = 80 г. Атомні маси: Na=23, O=16, H=1 г/моль.'
        : isEn
        ? 'Calculate the amount of substance n of sodium hydroxide (NaOH) in a sample of mass m = 80 g. Atomic masses: Na=23, O=16, H=1 g/mol.'
        : 'Рассчитайте количество вещества n гидроксида натрия (NaOH) в образце массой m = 80 г. Атомные массы: M(Na)=23, M(O)=16, M(H)=1 г/моль.',
      givenData: [
        {
          label: isUk ? 'Маса зразка' : isEn ? 'Sample mass' : 'Масса образца',
          symbol: 'm',
          value: isEn ? '80 g' : '80 г',
          unit: isEn ? 'g' : 'г',
          raw: '80',
        },
        {
          label: 'M(Na)',
          symbol: 'Ar(Na)',
          value: isEn ? '23 g/mol' : '23 г/моль',
          unit: isEn ? 'g/mol' : 'г/моль',
          raw: '23',
        },
        {
          label: 'M(O)',
          symbol: 'Ar(O)',
          value: isEn ? '16 g/mol' : '16 г/моль',
          unit: isEn ? 'g/mol' : 'г/моль',
          raw: '16',
        },
        {
          label: 'M(H)',
          symbol: 'Ar(H)',
          value: isEn ? '1 g/mol' : '1 г/моль',
          unit: isEn ? 'g/mol' : 'г/моль',
          raw: '1',
        },
      ],
      siConversions: isUk
        ? ['m = 80 г = 0.08 кг (за потреби для термодинаміки)', 'N_A = 6.022 · 10²³ моль⁻¹']
        : isEn
        ? ['m = 80 g = 0.08 kg', 'N_A = 6.022 * 10²³ mol⁻¹']
        : ['m = 80 г = 0.08 кг', 'N_A = 6.022 · 10²³ моль⁻¹'],
      toFind: [
        {
          symbol: 'M(NaOH)',
          description: isUk ? 'Молярна маса сполуки' : isEn ? 'Molar mass of NaOH' : 'Молярная масса NaOH',
        },
        {
          symbol: 'n',
          description: isUk ? 'Кількість речовини' : isEn ? 'Amount of substance' : 'Количество вещества',
        },
      ],
      lawsAndFormulas: [
        'M = Ar(Na) + Ar(O) + Ar(H)',
        'n = m / M',
        '[n] = г / (г/моль) = моль',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Розрахунок молярної маси NaOH' : isEn ? 'Calculating molar mass of NaOH' : 'Расчет молярной массы NaOH',
          explanation: isUk
            ? 'Додаємо атомні маси кожного елемента: M(NaOH) = 23 + 16 + 1 = 40 г/моль.'
            : isEn
            ? 'Sum the atomic masses: M(NaOH) = 23 + 16 + 1 = 40 g/mol.'
            : 'Складываем атомные массы каждого элемента: M(NaOH) = 23 + 16 + 1 = 40 г/моль.',
          formula: 'M = M(Na) + M(O) + M(H)',
          calculation: isEn ? '23 + 16 + 1 = 40 g/mol' : '23 + 16 + 1 = 40 г/моль',
          unitCheck: '[M] = г/моль',
        },
        {
          stepNumber: 2,
          title: isUk ? 'Застосування формули кількості речовини' : isEn ? 'Formula for amount of substance' : 'Применение формулы количества вещества',
          explanation: isUk
            ? 'Кількість речовини дорівнює відношенню маси до молярної маси: n = m / M = 80 / 40 = 2 моль.'
            : isEn
            ? 'The substance amount is the ratio of mass to molar mass: n = m / M = 80 / 40 = 2 mol.'
            : 'Количество вещества равно отношению массы образца к молярной массе: n = m / M = 80 / 40 = 2 моль.',
          formula: 'n = m / M',
          calculation: isEn ? 'n = 80 / 40 = 2 mol' : 'n = 80 / 40 = 2 моль',
          unitCheck: '[n] = моль',
        },
      ],
      finalAnswer: isUk ? 'M = 40 г/моль; n = 2 моль NaOH' : isEn ? 'M = 40 g/mol; n = 2 mol NaOH' : 'M = 40 г/моль; n = 2 моль NaOH',
      computationBlock: {
        primaryExpression: '80 / (23 + 16 + 1)',
        recommendedMode: 'standard',
        computations: [
          {
            id: 'c1',
            name: isUk ? 'Молярна маса M(NaOH)' : isEn ? 'Molar mass M(NaOH)' : 'Молярная масса M(NaOH)',
            formula: '23 + 16 + 1',
            expression: '23 + 16 + 1',
            result: '40',
            unit: isEn ? 'g/mol' : 'г/моль',
          },
          {
            id: 'c2',
            name: isUk ? 'Кількість речовини n' : isEn ? 'Substance amount n' : 'Количество вещества n',
            formula: 'm / M',
            expression: '80 / 40',
            result: '2',
            unit: isEn ? 'mol' : 'моль',
          },
        ],
      },
      confidence: 0.98,
      svgGraphic: (
        <svg viewBox="0 0 320 120" className="w-full h-full bg-slate-900 rounded-lg p-2 font-mono select-none">
          <rect width="100%" height="100%" fill="#0f172a" />
          <path d="M 40 90 L 60 40 L 70 40 L 90 90 Z" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
          <text x="46" y="80" fill="#34d399" fontSize="11" fontWeight="bold">NaOH</text>
          <text x="110" y="50" fill="#e2e8f0" fontSize="13" fontWeight="bold">m = 80 g</text>
          <text x="110" y="70" fill="#94a3b8" fontSize="11">M = 23 + 16 + 1 = 40 g/mol</text>
          <text x="110" y="90" fill="#38bdf8" fontSize="12" fontWeight="bold">n = 80 / 40 = 2 mol</text>
        </svg>
      ),
    },
    {
      id: 'sample-geometry',
      sampleTitleKey: 'sampleTask3',
      subject: 'geometry',
      subjectTitle: isUk ? 'Геометрія: Теорема Піфагора' : isEn ? 'Geometry: Pythagorean Theorem' : 'Геометрия: Теорема Пифагора',
      topic: isUk
        ? 'Розрахунок гіпотенузи c та площі прямокутного трикутника S'
        : isEn
        ? 'Calculation of hypotenuse c & triangle area S'
        : 'Расчет гипотенузы c и площади прямоугольного треугольника S',
      problemStatement: isUk
        ? 'У прямокутному трикутнику задано довжини катетів a = 9 см та b = 12 см. Обчисліть довжину гіпотенузи c, площу прямокутного трикутника S та периметр P.'
        : isEn
        ? 'In a right triangle, legs have lengths a = 9 cm and b = 12 cm. Find hypotenuse c, area S, and perimeter P.'
        : 'В прямоугольном треугольнике заданы длины катетов a = 9 см и b = 12 см. Вычислите длину гипотенузы c, площадь треугольника S и периметр P.',
      givenData: [
        {
          label: isUk ? 'Катет a' : isEn ? 'Leg a' : 'Катет a',
          symbol: 'a',
          value: isEn ? '9 cm' : '9 см',
          unit: isEn ? 'cm' : 'см',
          raw: '9',
        },
        {
          label: isUk ? 'Катет b' : isEn ? 'Leg b' : 'Катет b',
          symbol: 'b',
          value: isEn ? '12 cm' : '12 см',
          unit: isEn ? 'cm' : 'см',
          raw: '12',
        },
        {
          label: isUk ? 'Кут між катетами' : isEn ? 'Right angle' : 'Прямой угол',
          symbol: '∠C',
          value: '90°',
          unit: '°',
          raw: '90',
        },
      ],
      siConversions: isUk
        ? ['a = 9 см = 0.09 м', 'b = 12 см = 0.12 м']
        : isEn
        ? ['a = 9 cm = 0.09 m', 'b = 12 cm = 0.12 m']
        : ['a = 9 см = 0.09 м', 'b = 12 см = 0.12 м'],
      toFind: [
        {
          symbol: 'c',
          description: isUk ? 'Гіпотенуза трикутника' : isEn ? 'Hypotenuse' : 'Гипотенуза треугольника',
        },
        {
          symbol: 'S',
          description: isUk ? 'Площа прямокутного трикутника' : isEn ? 'Triangle Area' : 'Площадь прямоугольного треугольника',
        },
        {
          symbol: 'P',
          description: isUk ? 'Периметр трикутника' : isEn ? 'Perimeter' : 'Периметр треугольника',
        },
      ],
      lawsAndFormulas: [
        'c = √(a² + b²)',
        'S = (a · b) / 2',
        'P = a + b + c',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Теорема Піфагора' : isEn ? 'Pythagorean Theorem' : 'Теорема Пифагора',
          explanation: isUk
            ? 'Квадрат гіпотенузи дорівнює сумі квадратів катетів: c² = a² + b² => c = √(9² + 12²) = √(81 + 144) = √225 = 15 см.'
            : isEn
            ? 'The square of hypotenuse equals sum of squares of legs: c² = a² + b² => c = √(9² + 12²) = 15 cm.'
            : 'Квадрат гипотенузы равен сумме квадратов катетов: c² = a² + b² => c = √(9² + 12²) = 15 см.',
          formula: 'c = sqrt(a^2 + b^2)',
          calculation: 'c = sqrt(9^2 + 12^2) = sqrt(225) = 15 cm',
          unitCheck: '[c] = см',
        },
        {
          stepNumber: 2,
          title: isUk ? 'Площа прямокутного трикутника' : isEn ? 'Area of right triangle' : 'Вычисление площади треугольника',
          explanation: isUk
            ? 'Площа прямокутного трикутника дорівнює половині добутку його катетів: S = (9 · 12) / 2 = 108 / 2 = 54 см².'
            : isEn
            ? 'Area equals half the product of legs: S = (9 · 12) / 2 = 54 cm².'
            : 'Площадь прямоугольного треугольника равна половине произведения катетов: S = (9 · 12) / 2 = 54 см².',
          formula: 'S = (a * b) / 2',
          calculation: isEn ? 'S = (9 * 12) / 2 = 54 cm²' : 'S = (9 * 12) / 2 = 54 см²',
          unitCheck: '[S] = см · см = см²',
        },
        {
          stepNumber: 3,
          title: isUk ? 'Периметр трикутника' : isEn ? 'Triangle perimeter' : 'Периметр треугольника',
          explanation: isUk
            ? 'Сума довжин усіх сторін: P = a + b + c = 9 + 12 + 15 = 36 см.'
            : isEn
            ? 'Sum of all sides: P = a + b + c = 9 + 12 + 15 = 36 cm.'
            : 'Сумма длин всех сторон: P = a + b + c = 9 + 12 + 15 = 36 см.',
          formula: 'P = a + b + c',
          calculation: '9 + 12 + 15 = 36 cm',
          unitCheck: '[P] = см',
        },
      ],
      finalAnswer: isUk ? 'c = 15 см; S = 54 см²; P = 36 см' : isEn ? 'c = 15 cm; S = 54 cm²; P = 36 cm' : 'c = 15 см; S = 54 см²; P = 36 см',
      computationBlock: {
        primaryExpression: 'sqrt(9^2 + 12^2)',
        recommendedMode: 'scientific',
        graphSuggestion: 'sqrt(15^2 - x^2)',
        computations: [
          {
            id: 'c1',
            name: isUk ? 'Сума квадратів катетів a² + b²' : isEn ? 'Legs sum of squares a² + b²' : 'Сумма квадратов катетов a² + b²',
            formula: 'a^2 + b^2',
            expression: '9^2 + 12^2',
            result: '225',
            unit: isEn ? 'cm²' : 'см²',
          },
          {
            id: 'c2',
            name: isUk ? 'Гіпотенуза c' : isEn ? 'Hypotenuse c' : 'Гипотенуза c',
            formula: 'sqrt(a^2 + b^2)',
            expression: 'sqrt(225)',
            result: '15',
            unit: isEn ? 'cm' : 'см',
          },
          {
            id: 'c3',
            name: isUk ? 'Площа трикутника S' : isEn ? 'Triangle Area S' : 'Площадь S',
            formula: '(a * b) / 2',
            expression: '(9 * 12) / 2',
            result: '54',
            unit: isEn ? 'cm²' : 'см²',
          },
        ],
      },
      confidence: 0.99,
      svgGraphic: (
        <svg viewBox="0 0 320 120" className="w-full h-full bg-slate-900 rounded-lg p-2 font-mono select-none">
          <rect width="100%" height="100%" fill="#0f172a" />
          <polygon points="40,95 140,95 140,25" fill="#06b6d4" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="2" />
          <rect x="128" y="83" width="12" height="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="80" y="110" fill="#94a3b8" fontSize="11" fontWeight="bold">b = 12</text>
          <text x="148" y="65" fill="#94a3b8" fontSize="11" fontWeight="bold">a = 9</text>
          <text x="65" y="55" fill="#38bdf8" fontSize="12" fontWeight="bold">c = 15</text>
          <text x="190" y="60" fill="#e2e8f0" fontSize="12" fontWeight="bold">c = √(9² + 12²)</text>
          <text x="190" y="85" fill="#4ade80" fontSize="12">S = (9·12)/2 = 54</text>
        </svg>
      ),
    },
    {
      id: 'sample-economics',
      sampleTitleKey: 'sampleTask4',
      subject: 'economics',
      subjectTitle: isUk ? 'Економіка: Складні відсотки' : isEn ? 'Economics: Compound Interest' : 'Экономика: Сложные проценты',
      topic: isUk
        ? 'Капіталізація вкладу та нарощення капіталу'
        : isEn
        ? 'Deposit capitalization & capital growth'
        : 'Капитализация вклада и чистая доходность',
      problemStatement: isUk
        ? 'Вклад на суму S0 = 50 000 ₴ відкрито на термін n = 3 роки під ставку r = 12% річних зі щороку капіталізованими відсотками. Розрахуйте підсумкову суму S та чистий дохід I.'
        : isEn
        ? 'A deposit of S0 = 50 000 is opened for n = 3 years at annual rate r = 12% with compound interest. Calculate the final balance S and net interest I.'
        : 'Вклад на сумму S0 = 50 000 ₽ открыт на срок n = 3 года под ставку r = 12% годовых с ежегодной капитализацией процентов. Рассчитайте итоговую сумму S и сумму чистого дохода I.',
      givenData: [
        {
          label: isUk ? 'Початкова сума' : isEn ? 'Initial Principal' : 'Начальная сумма',
          symbol: 'S0',
          value: isUk ? '50 000 ₴' : isEn ? '$50 000' : '50 000 ₽',
          unit: isUk ? '₴' : isEn ? '$' : '₽',
          raw: '50000',
        },
        {
          label: isUk ? 'Річна ставка' : isEn ? 'Annual Rate' : 'Годовая ставка',
          symbol: 'r',
          value: '12%',
          unit: '%',
          raw: '12',
        },
        {
          label: isUk ? 'Термін вкладу' : isEn ? 'Term' : 'Срок вклада',
          symbol: 'n',
          value: isUk ? '3 роки' : isEn ? '3 years' : '3 года',
          unit: isUk ? 'роки' : isEn ? 'years' : 'года',
          raw: '3',
        },
      ],
      siConversions: isUk
        ? ['r = 12% = 0.12 (десятковий дріб)', 'n = 3 періоди нарахування']
        : isEn
        ? ['r = 12% = 0.12 (decimal fraction)', 'n = 3 periods']
        : ['r = 12% = 0.12 (десятичная дробь)', 'n = 3 периода начисления'],
      toFind: [
        {
          symbol: 'S',
          description: isUk ? 'Підсумкова сума вкладу' : isEn ? 'Final compound balance' : 'Итоговая сумма вклада',
        },
        {
          symbol: 'I',
          description: isUk ? 'Чистий процентний прибуток' : isEn ? 'Net interest profit' : 'Чистый доход по процентам',
        },
      ],
      lawsAndFormulas: [
        'S = S0 · (1 + r/100)ⁿ',
        'I = S - S0',
        'k = (1 + r)ⁿ',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Формула складних відсотків' : isEn ? 'Compound interest formula' : 'Формула сложных процентов',
          explanation: isUk
            ? 'Підсумкова сума вкладу зі щороку капіталізованими відсотками: S = S0 · (1 + r/100)ⁿ.'
            : isEn
            ? 'Final compound balance formula: S = S0 · (1 + r/100)ⁿ.'
            : 'Итоговая сумма вклада со сложными процентами: S = S0 · (1 + r/100)ⁿ.',
          formula: 'S = S0 * (1 + r/100)^n',
          calculation: 'S = 50000 * (1 + 0.12)^3',
          unitCheck: '[S] = грошові одиниці',
        },
        {
          stepNumber: 2,
          title: isUk ? 'Коефіцієнт нарощення' : isEn ? 'Growth factor' : 'Расчет множителя капитализации',
          explanation: isUk
            ? 'Обчислюємо коефіцієнт нарощення за 3 роки: 1.12³ = 1.404928.'
            : isEn
            ? 'Calculate multiplier: 1.12³ = 1.404928.'
            : 'Вычисляем коэффициент за 3 года: 1.12³ = 1.404928.',
          formula: '1.12^3',
          calculation: '1.12 * 1.12 * 1.12 = 1.404928',
          unitCheck: '[k] = коефіцієнт',
        },
        {
          stepNumber: 3,
          title: isUk ? 'Підсумкова сума та чистий прибуток' : isEn ? 'Final sum & net profit' : 'Итоговая сумма и процентный доход',
          explanation: isUk
            ? 'S = 50000 · 1.404928 = 70 246.40 ₴. Чистий прибуток: 70 246.40 - 50 000 = 20 246.40 ₴.'
            : isEn
            ? 'S = 50000 · 1.404928 = 70 246.40. Net interest: 70 246.40 - 50 000 = 20 246.40.'
            : 'S = 50000 · 1.404928 = 70 246.40 ₽. Чистая прибыль: 70 246.40 - 50 000 = 20 246.40 ₽.',
          formula: 'I = S - S0',
          calculation: '70246.4 - 50000 = 20246.4',
          unitCheck: '[I] = грошові одиниці',
        },
      ],
      finalAnswer: isUk ? 'S = 70 246.40 ₴; I = 20 246.40 ₴' : isEn ? 'S = 70 246.40; I = 20 246.40' : 'S = 70 246.40 ₽; I = 20 246.40 ₽',
      computationBlock: {
        primaryExpression: '50000 * (1 + 0.12)^3',
        recommendedMode: 'finance',
        graphSuggestion: '50000 * (1.12)^x',
        computations: [
          {
            id: 'c1',
            name: isUk ? 'Множник складних відсотків (1 + r/100)ⁿ' : isEn ? 'Compound factor (1 + r/100)ⁿ' : 'Множитель сложных процентов (1 + r/100)ⁿ',
            formula: '(1 + 0.12)^3',
            expression: '1.12^3',
            result: '1.404928',
            unit: '',
          },
          {
            id: 'c2',
            name: isUk ? 'Підсумкова сума вкладу S' : isEn ? 'Final balance S' : 'Итоговая сумма вклада S',
            formula: 'S0 * 1.12^3',
            expression: '50000 * 1.404928',
            result: '70246.4',
            unit: isUk ? '₴' : isEn ? '$' : '₽',
          },
          {
            id: 'c3',
            name: isUk ? 'Чистий дохід за відсотками I' : isEn ? 'Net interest I' : 'Чистый доход по процентам I',
            formula: 'S - S0',
            expression: '70246.4 - 50000',
            result: '20246.4',
            unit: isUk ? '₴' : isEn ? '$' : '₽',
          },
        ],
      },
      confidence: 0.99,
      svgGraphic: (
        <svg viewBox="0 0 320 120" className="w-full h-full bg-slate-900 rounded-lg p-2 font-mono select-none">
          <rect width="100%" height="100%" fill="#0f172a" />
          <rect x="30" y="70" width="30" height="30" fill="#a855f7" rx="3" />
          <rect x="75" y="55" width="30" height="45" fill="#a855f7" rx="3" />
          <rect x="120" y="38" width="30" height="62" fill="#a855f7" rx="3" />
          <text x="32" y="65" fill="#cbd5e1" fontSize="10">Y1</text>
          <text x="77" y="50" fill="#cbd5e1" fontSize="10">Y2</text>
          <text x="122" y="33" fill="#cbd5e1" fontSize="10">Y3</text>
          <text x="170" y="45" fill="#e2e8f0" fontSize="12" fontWeight="bold">S₀ = 50 000</text>
          <text x="170" y="65" fill="#c084fc" fontSize="11">12% Compound</text>
          <text x="170" y="88" fill="#4ade80" fontSize="12" fontWeight="bold">S = 70 246.4</text>
        </svg>
      ),
    },
    {
      id: 'sample-algebra',
      sampleTitleKey: 'sampleTask5',
      subject: 'math',
      subjectTitle: isUk ? 'Алгебра: Квадратне рівняння та парабола' : isEn ? 'Algebra: Quadratic Equation & Parabola' : 'Алгебра: Квадратное уравнение и парабола',
      topic: isUk
        ? 'Корені рівняння x² - 6x + 8 = 0 та координати вершини параболи'
        : isEn
        ? 'Roots of equation x² - 6x + 8 = 0 and parabola vertex'
        : 'Корни уравнения x² - 6x + 8 = 0 и координаты вершины параболы',
      problemStatement: isUk
        ? 'Дано квадратне рівняння x² - 6x + 8 = 0. Визначте коефіцієнти a, b, c. Знайдіть дискримінант D, дійсні корені x₁ та x₂, а також координати вершини відповідної параболи V(xv; yv).'
        : isEn
        ? 'Given quadratic equation x² - 6x + 8 = 0. Identify coefficients a, b, c. Find discriminant D, real roots x₁ and x₂, and coordinates of parabola vertex V(xv; yv).'
        : 'Дано квадратное уравнение x² - 6x + 8 = 0. Определите коэффициенты a, b, c. Найдите дискриминант D, действительные корни x₁ и x₂, а также координаты вершины параболы V(xv; yv).',
      givenData: [
        {
          label: isUk ? 'Коефіцієнт при x²' : isEn ? 'Coefficient of x²' : 'Коэффициент при x²',
          symbol: 'a',
          value: '1',
          unit: '',
          raw: '1',
        },
        {
          label: isUk ? 'Коефіцієнт при x' : isEn ? 'Coefficient of x' : 'Коэффициент при x',
          symbol: 'b',
          value: '-6',
          unit: '',
          raw: '-6',
        },
        {
          label: isUk ? 'Вільний член' : isEn ? 'Constant term' : 'Свободный член',
          symbol: 'c',
          value: '8',
          unit: '',
          raw: '8',
        },
      ],
      siConversions: [],
      toFind: [
        {
          symbol: 'D',
          description: isUk ? 'Дискримінант рівняння' : isEn ? 'Discriminant' : 'Дискриминант',
        },
        {
          symbol: 'x₁, x₂',
          description: isUk ? 'Корені квадратного рівняння' : isEn ? 'Real roots' : 'Действительные корни',
        },
        {
          symbol: 'V(xv; yv)',
          description: isUk ? 'Координати вершини параболи' : isEn ? 'Parabola vertex' : 'Вершина параболы',
        },
      ],
      lawsAndFormulas: [
        'D = b² - 4ac',
        'x₁,₂ = (-b ± √D) / (2a)',
        'xv = -b / (2a)',
        'yv = a·xv² + b·xv + c',
      ],
      solutionSteps: [
        {
          stepNumber: 1,
          title: isUk ? 'Обчислення дискримінанта D' : isEn ? 'Calculating discriminant D' : 'Вычисление дискриминанта D',
          explanation: isUk
            ? 'Підставляємо значення a = 1, b = -6, c = 8 у формулу дискримінанта: D = (-6)² - 4 · 1 · 8 = 36 - 32 = 4 > 0. Оскільки D > 0, рівняння має два різні дійсні корені.'
            : isEn
            ? 'Substitute a = 1, b = -6, c = 8 into discriminant formula: D = (-6)² - 4 · 1 · 8 = 36 - 32 = 4 > 0. Since D > 0, there are two distinct real roots.'
            : 'Подставляем a = 1, b = -6, c = 8 в формулу дискриминанта: D = (-6)² - 4 · 1 · 8 = 36 - 32 = 4 > 0. Так как D > 0, уравнение имеет два действительных корня.',
          formula: 'D = b^2 - 4*a*c',
          calculation: '(-6)^2 - 4 * 1 * 8 = 36 - 32 = 4',
          unitCheck: '√D = √4 = 2',
        },
        {
          stepNumber: 2,
          title: isUk ? 'Знаходження коренів x₁ та x₂' : isEn ? 'Finding roots x₁ and x₂' : 'Нахождение корней x₁ и x₂',
          explanation: isUk
            ? 'Застосовуємо формулу коренів: x₁ = (6 + 2) / 2 = 8 / 2 = 4; x₂ = (6 - 2) / 2 = 4 / 2 = 2 (за теоремою Вієта: 4 + 2 = 6, 4 · 2 = 8).'
            : isEn
            ? 'Apply root formula: x₁ = (6 + 2) / 2 = 4; x₂ = (6 - 2) / 2 = 2 (Vieta check: 4 + 2 = 6, 4 · 2 = 8).'
            : 'Применяем формулу корней: x₁ = (6 + 2) / 2 = 4; x₂ = (6 - 2) / 2 = 2 (проверка по теореме Виета: 4 + 2 = 6, 4 · 2 = 8).',
          formula: 'x = (-b ± sqrt(D)) / (2*a)',
          calculation: 'x1 = (6 + 2) / 2 = 4; x2 = (6 - 2) / 2 = 2',
          unitCheck: 'Корені: x = 2, x = 4',
        },
        {
          stepNumber: 3,
          title: isUk ? 'Вершина параболи V(xv; yv)' : isEn ? 'Parabola vertex V(xv; yv)' : 'Вершина параболы V(xv; yv)',
          explanation: isUk
            ? 'Абсциса вершини: xv = -(-6) / (2 · 1) = 3. Ордината: yv = 3² - 6 · 3 + 8 = 9 - 18 + 8 = -1. Вершина параболи: V(3; -1).'
            : isEn
            ? 'Vertex abscissa: xv = -(-6) / (2 · 1) = 3. Ordinate: yv = 3² - 6 · 3 + 8 = -1. Vertex: V(3, -1).'
            : 'Абсцисса вершины: xv = -(-6) / (2 · 1) = 3. Ордината: yv = 3² - 6 · 3 + 8 = -1. Вершина параболы: V(3; -1).',
          formula: 'xv = -b / (2*a); yv = f(xv)',
          calculation: 'xv = 6 / 2 = 3; yv = 3^2 - 6*3 + 8 = -1',
          unitCheck: 'V(3; -1)',
        },
      ],
      finalAnswer: isUk ? 'x₁ = 4, x₂ = 2; Вершина параболи V(3; -1)' : isEn ? 'x₁ = 4, x₂ = 2; Vertex V(3, -1)' : 'x₁ = 4, x₂ = 2; Вершина параболы V(3; -1)',
      computationBlock: {
        primaryExpression: '(-(-6) + sqrt((-6)^2 - 4*1*8)) / (2*1)',
        recommendedMode: 'standard',
        graphSuggestion: 'x^2 - 6*x + 8',
        computations: [
          {
            id: 'c1',
            name: isUk ? 'Дискримінант D' : isEn ? 'Discriminant D' : 'Дискриминант D',
            formula: 'b^2 - 4*a*c',
            expression: '(-6)^2 - 4*1*8',
            result: '4',
            unit: '',
          },
          {
            id: 'c2',
            name: isUk ? 'Перший корінь x₁' : isEn ? 'First root x₁' : 'Первый корень x₁',
            formula: '(-b + sqrt(D)) / (2*a)',
            expression: '(6 + 2) / 2',
            result: '4',
            unit: '',
          },
          {
            id: 'c3',
            name: isUk ? 'Другий корінь x₂' : isEn ? 'Second root x₂' : 'Второй корень x₂',
            formula: '(-b - sqrt(D)) / (2*a)',
            expression: '(6 - 2) / 2',
            result: '2',
            unit: '',
          },
          {
            id: 'c4',
            name: isUk ? 'Абсциса вершини xv' : isEn ? 'Vertex x' : 'Абсцисса вершины xv',
            formula: '-b / (2*a)',
            expression: '-(-6) / (2*1)',
            result: '3',
            unit: '',
          },
          {
            id: 'c5',
            name: isUk ? 'Ордината вершини yv' : isEn ? 'Vertex y' : 'Ордината вершины yv',
            formula: 'a*xv^2 + b*xv + c',
            expression: '3^2 - 6*3 + 8',
            result: '-1',
            unit: '',
          },
        ],
      },
      confidence: 0.99,
      svgGraphic: (
        <svg viewBox="0 0 320 120" className="w-full h-full bg-slate-900 rounded-lg p-2 font-mono select-none">
          <rect width="100%" height="100%" fill="#0f172a" />
          <line x1="20" y1="80" x2="300" y2="80" stroke="#334155" strokeWidth="1" />
          <line x1="160" y1="10" x2="160" y2="110" stroke="#334155" strokeWidth="1" />
          <path d="M 60 15 Q 160 140 260 15" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="120" cy="80" r="4" fill="#10b981" />
          <text x="114" y="72" fill="#10b981" fontSize="11" fontWeight="bold">x=2</text>
          <circle cx="200" cy="80" r="4" fill="#10b981" />
          <text x="194" y="72" fill="#10b981" fontSize="11" fontWeight="bold">x=4</text>
          <circle cx="160" cy="98" r="4" fill="#f59e0b" />
          <text x="168" y="106" fill="#f59e0b" fontSize="10" fontWeight="bold">V(3;-1)</text>
          <text x="25" y="30" fill="#94a3b8" fontSize="11">y = x² - 6x + 8</text>
        </svg>
      ),
    },
  ];
}

export const PhotoMathModal: React.FC<PhotoMathModalProps> = ({
  isOpen,
  onClose,
  onSolveExpression,
  onOpenInGraphs,
  lang,
  isDark,
}) => {
  const [tab, setTab] = useState<'camera' | 'upload' | 'text' | 'samples'>('camera');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [textProblemInput, setTextProblemInput] = useState<string>('');
  const [lastSubmittedImage, setLastSubmittedImage] = useState<string | null>(null);
  const [lastSubmittedText, setLastSubmittedText] = useState<string | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera high-definition state
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraResBadge, setCameraResBadge] = useState<string>('Full HD');
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  const localizedSamples = React.useMemo(() => getLocalizedSampleProblems(lang), [lang]);
  const [solvedProblem, setSolvedProblem] = useState<AiProblemSolution | null>(localizedSamples[0]);

  // Keep sample problem updated when language toggles
  useEffect(() => {
    setSolvedProblem((prev) => {
      if (!prev) return localizedSamples[0];
      const matching = localizedSamples.find((s) => s.id === prev.id);
      return matching || prev;
    });
  }, [lang, localizedSamples]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream with high-resolution constraints
  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setErrorMessage(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            const w = videoRef.current.videoWidth;
            const h = videoRef.current.videoHeight;
            if (w >= 1920) {
              setCameraResBadge('1080p HD');
            } else if (w >= 1280) {
              setCameraResBadge('720p HD');
            } else {
              setCameraResBadge(`${w}×${h}`);
            }
          }
        };
      }

      // Detect torch capabilities
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities?.() as { torch?: boolean }) || {};
        setHasTorch(Boolean(capabilities.torch));
      }
    } catch {
      setErrorMessage(getTranslation('cameraAccessDenied', lang));
    }
  }, [facingMode, lang]);

  useEffect(() => {
    if (isOpen && tab === 'camera' && !capturedPreview) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, tab, facingMode, startCamera, capturedPreview]);

  // Handle global paste event for screenshots / clipboard images
  useEffect(() => {
    if (!isOpen) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const dataUrl = evt.target?.result as string;
              setSelectedImage(dataUrl);
              setCapturedPreview(null);
              setTab('upload');
              solveProblemWithAi(dataUrl);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Camera Facing Mode (rear vs front)
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch/Flash if supported
  const handleToggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !torchOn;
        await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setTorchOn(nextTorch);
      } catch (err) {
        console.warn('Torch toggle not supported', err);
      }
    }
  };

  // Capture frame from video with contrast & math-text enhancement pass
  const snapCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trigger visual shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    // Draw frame onto canvas
    ctx.drawImage(video, 0, 0, width, height);

    // High-clarity contrast enhancement for handwritten equations & paper
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const d = imgData.data;
      const contrast = 1.15; // 15% text contrast stretch
      const intercept = 128 * (1 - contrast);
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, Math.max(0, d[i] * contrast + intercept));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * contrast + intercept));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * contrast + intercept));
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Fallback to raw canvas if security policy restricts pixel access
    }

    const highResDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPreview(highResDataUrl);
    setSelectedImage(highResDataUrl);
    solveProblemWithAi(highResDataUrl);
  };

  // Reset captured preview to retake
  const handleRetakeCamera = () => {
    setCapturedPreview(null);
    startCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setSelectedImage(dataUrl);
      setCapturedPreview(null);
      solveProblemWithAi(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Perform AI Multimodal Problem Solving (Image or Text)
  const solveProblemWithAi = async (
    imageBase64?: string,
    customPrompt?: string,
    problemTextParam?: string
  ) => {
    setIsSolving(true);
    setErrorMessage(null);

    const targetImage = imageBase64 !== undefined ? imageBase64 : selectedImage;
    const targetText = problemTextParam !== undefined ? problemTextParam : textProblemInput;

    if (targetImage) setLastSubmittedImage(targetImage);
    if (targetText) setLastSubmittedText(targetText);

    try {
      const response = await fetch('/api/solve-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImage || '',
          problemText: targetText || '',
          lang,
          promptText: customPrompt || userPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.problemStatement) {
          const resultSolution: AiProblemSolution = {
            id: 'solved_' + Date.now(),
            subject: data.subject || 'math',
            subjectTitle: data.subjectTitle || getTranslation('mathSubject', lang),
            topic: data.topic || (lang === 'uk' ? 'Академічний розвʼязок задачі' : 'Академическое решение задачи'),
            problemStatement: data.problemStatement,
            givenData: data.givenData || [],
            siConversions: data.siConversions || [],
            toFind: data.toFind || [],
            lawsAndFormulas: data.lawsAndFormulas || [],
            solutionSteps: data.solutionSteps || [],
            finalAnswer: data.finalAnswer || '',
            computationBlock: data.computationBlock || {
              primaryExpression: data.finalAnswer || '0',
              recommendedMode: 'standard',
              computations: [],
            },
            confidence: data.confidence || 0.98,
          };
          setSolvedProblem(resultSolution);
          setIsSolving(false);
          return;
        } else if (data.error) {
          setErrorMessage(data.error);
          setIsSolving(false);
          return;
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMessage(errData.error || getTranslation('ocrFailedDesc', lang));
        setIsSolving(false);
        return;
      }
    } catch {
      setErrorMessage(getTranslation('ocrFailedDesc', lang));
      setIsSolving(false);
      return;
    }

    setIsSolving(false);
  };

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 1800);
  };

  // Copy complete academic layout text
  const handleCopyFullAcademicSolution = () => {
    if (!solvedProblem) return;
    const lines: string[] = [];
    lines.push(`=== ${solvedProblem.subjectTitle.toUpperCase()} ===`);
    lines.push(`ТЕМА: ${solvedProblem.topic}`);
    lines.push('');
    lines.push(`УМОВА ЗАДАЧІ:\n${solvedProblem.problemStatement}`);
    lines.push('');
    lines.push('--- ДАНО ---');
    if (solvedProblem.givenData?.length) {
      solvedProblem.givenData.forEach((d) => {
        lines.push(`${d.symbol || d.label} = ${d.value}`);
      });
    }
    if (solvedProblem.siConversions?.length) {
      lines.push('');
      lines.push('--- СИСТЕМА СІ ---');
      solvedProblem.siConversions.forEach((c) => lines.push(c));
    }
    lines.push('');
    lines.push('--- ЗНАЙТИ ---');
    if (solvedProblem.toFind?.length) {
      solvedProblem.toFind.forEach((tf) => {
        lines.push(`${tf.symbol} - ? ${tf.description ? `(${tf.description})` : ''}`);
      });
    } else {
      lines.push(`${solvedProblem.finalAnswer ? solvedProblem.finalAnswer.split('=')[0]?.trim() || 'X' : 'X'} - ?`);
    }
    if (solvedProblem.lawsAndFormulas?.length) {
      lines.push('');
      lines.push('--- ЗАКОНИ ТА ФОРМУЛИ ---');
      solvedProblem.lawsAndFormulas.forEach((f) => lines.push(f));
    }
    lines.push('');
    lines.push('--- РОЗВ\'ЯЗАННЯ ---');
    solvedProblem.solutionSteps.forEach((s) => {
      lines.push(`${s.stepNumber}. ${s.title}`);
      lines.push(`   ${s.explanation}`);
      if (s.formula) lines.push(`   Формула: ${s.formula}`);
      if (s.calculation) lines.push(`   Обчислення: ${s.calculation}`);
      if (s.unitCheck) lines.push(`   Розмірність: ${s.unitCheck}`);
    });
    lines.push('');
    lines.push(`ВІДПОВІДЬ: ${solvedProblem.finalAnswer}`);
    lines.push('\n[Розв\'язано через VexCalculator AI]');

    handleCopyText(lines.join('\n'), 'full_solution');
  };

  // Send single computation to VexCalculator
  const handleSendToCalculator = (comp: ProblemComputationItem) => {
    const mode = solvedProblem?.computationBlock.recommendedMode || 'standard';
    const effectiveMode = mode === 'graphs' ? 'standard' : mode;
    onSolveExpression(
      comp.expression || comp.result,
      effectiveMode,
      `${comp.name} (${solvedProblem?.subjectTitle || 'Задача'})`
    );
    onClose();
  };

  // Send primary expression to VexCalculator
  const handleLoadPrimaryToCalculator = () => {
    if (!solvedProblem) return;
    const expr = solvedProblem.computationBlock.primaryExpression;
    const mode = solvedProblem.computationBlock.recommendedMode;
    const effectiveMode = mode === 'graphs' ? 'standard' : mode;
    onSolveExpression(
      expr,
      effectiveMode,
      `${solvedProblem.topic} — ${solvedProblem.finalAnswer}`
    );
    onClose();
  };

  // Open in Graphing Mode
  const handleOpenGraph = (graphExpr: string) => {
    if (onOpenInGraphs) {
      onOpenInGraphs(graphExpr);
      onClose();
    }
  };

  const subjectConfig =
    solvedProblem && SUBJECT_CONFIG[solvedProblem.subject]
      ? SUBJECT_CONFIG[solvedProblem.subject]
      : SUBJECT_CONFIG.math;
  const SubjectIcon = subjectConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border p-4 sm:p-5 select-none max-h-[92vh] flex flex-col ${
          isDark
            ? 'bg-slate-900/95 border-slate-700 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b mb-3 border-inherit/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base tracking-tight">
                  {getTranslation('aiProblemSolver', lang)}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xs">
                  Gemini 3.8 Flash Vision
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {getTranslation('aiProblemSolverDesc', lang)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={getTranslation('close', lang)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Samples / Upload / Camera */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-3 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              setTab('camera');
              setCapturedPreview(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'camera'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{getTranslation('takePhoto', lang)}</span>
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'upload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{getTranslation('uploadPhoto', lang)}</span>
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'text'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{getTranslation('textProblemTab', lang)}</span>
          </button>
          <button
            onClick={() => setTab('samples')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'samples'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation('samplePhotos', lang)}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* SAMPLES TAB: Multidisciplinary cards */}
          {tab === 'samples' && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {getTranslation('sampleSelectionHint', lang)}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
                {localizedSamples.map((sample) => {
                  const cfg = SUBJECT_CONFIG[sample.subject];
                  const IconComponent = cfg.icon;
                  const isSelected = solvedProblem?.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => {
                        setSolvedProblem(sample);
                        setSelectedImage(null);
                        setCapturedPreview(null);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                        isSelected
                          ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500'
                          : isDark
                          ? 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="h-20 mb-2 overflow-hidden rounded-lg">
                        {sample.svgGraphic}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${cfg.bg}`}>
                            <IconComponent className="w-3 h-3" />
                            <span>{getTranslation(cfg.labelKey, lang)}</span>
                          </span>
                        </div>
                        <div className="text-xs font-bold leading-snug line-clamp-1">
                          {getTranslation(sample.sampleTitleKey, lang)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {sample.topic}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* UPLOAD / PASTE TAB */}
          {tab === 'upload' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-800/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <ImageIcon className="w-9 h-9 text-blue-500 mb-2" />
                <span className="text-sm font-semibold mb-1">
                  {getTranslation('pasteOrUpload', lang)}
                </span>
                <span className="text-xs text-slate-400">
                  {getTranslation('supportedFormatsHint', lang)}
                </span>
              </label>

              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-52 flex items-center justify-center bg-black">
                  <img
                    src={selectedImage}
                    alt="Uploaded task"
                    className="max-h-52 object-contain"
                  />
                  {isSolving && (
                    <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                      <div className="w-full h-1 bg-cyan-400 shadow-lg shadow-cyan-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-black/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>{getTranslation('solvingWithAi', lang)}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CAMERA TAB: High-Definition Viewfinder with OCR Framing */}
          {tab === 'camera' && (
            <div className="space-y-3 flex flex-col items-center">
              <div className="relative w-full max-w-lg h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center shadow-xl">
                {/* Live video or captured preview */}
                {capturedPreview ? (
                  <img
                    src={capturedPreview}
                    alt="Captured photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Shutter visual flash animation */}
                {shutterFlash && (
                  <div className="absolute inset-0 bg-white transition-opacity duration-200 pointer-events-none" />
                )}

                {/* Framing Overlay & Optical Guides */}
                {!capturedPreview && (
                  <>
                    {/* Viewfinder Target Box */}
                    <div className="absolute inset-6 sm:inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
                        <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-[11px] font-mono bg-black/70 px-2.5 py-1 rounded-full text-white/90 shadow-md backdrop-blur-xs">
                          {getTranslation('aimCameraAtProblem', lang)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
                        <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />
                      </div>
                    </div>

                    {/* Top status bar inside viewfinder */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-auto">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                        {cameraResBadge}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {hasTorch && (
                          <button
                            onClick={handleToggleTorch}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                              torchOn ? 'bg-amber-500 text-black' : 'bg-black/60 text-white hover:bg-black/80'
                            }`}
                            title={getTranslation('torchOn', lang)}
                          >
                            {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={handleToggleFacingMode}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-all"
                          title={getTranslation('switchCamera', lang)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Scanning active laser effect */}
                {isSolving && (
                  <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                    <div className="w-full h-1 bg-cyan-400 shadow-lg shadow-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-black/85 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                      <span>{getTranslation('solvingWithAi', lang)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Camera Trigger Buttons */}
              <div className="flex items-center gap-3">
                {capturedPreview ? (
                  <>
                    <button
                      onClick={handleRetakeCamera}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{getTranslation('retakePhoto', lang)}</span>
                    </button>
                    <button
                      onClick={() => solveProblemWithAi(capturedPreview)}
                      disabled={isSolving}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{getTranslation('confirmAndSolvePhoto', lang)}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={snapCamera}
                    disabled={isSolving}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{getTranslation('takePhotoWithCam', lang)}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TEXT INPUT TAB: Type or paste ANY task statement directly */}
          {tab === 'text' && (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{getTranslation('textProblemTab', lang)}:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {lang === 'uk'
                      ? 'Фізика, Алгебра, Хімія, Геометрія, Економіка'
                      : 'Физика, Алгебра, Химия, Геометрия, Экономика'}
                  </span>
                </label>

                <textarea
                  value={textProblemInput}
                  onChange={(e) => setTextProblemInput(e.target.value)}
                  placeholder={getTranslation('textProblemPlaceholder', lang)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans resize-y leading-relaxed"
                />

                {/* Quick subject suggestion pills */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    {getTranslation('trySamples', lang)}
                  </span>
                  {[
                    {
                      label: lang === 'uk' ? 'Камінь вгору (h_max)' : 'Камень вверх (h_max)',
                      text:
                        lang === 'uk'
                          ? 'Камінь кинули вертикально вгору з початковою швидкістю v0 = 20 м/с. Прискорення g = 10 м/с². Знайдіть максимальну висоту підйому h та час польоту t.'
                          : 'Камень бросили вертикально вверх с начальной скоростью v0 = 20 м/с. Ускорение свободного падения g = 10 м/с². Найдите максимальную высоту подъема h и время полета t.',
                    },
                    {
                      label: '2x² - 8x + 6 = 0',
                      text:
                        lang === 'uk'
                          ? 'Розвʼяжіть квадратне рівняння 2x² - 8x + 6 = 0 через дискримінант D. Знайдіть корені x1 та x2.'
                          : 'Решите квадратное уравнение 2x² - 8x + 6 = 0 через дискриминант D. Найдите корни x1 и x2.',
                    },
                    {
                      label: lang === 'uk' ? 'Розчин солі (Хімія)' : 'Раствор соли (Химия)',
                      text:
                        lang === 'uk'
                          ? 'У воді масою 180 г розчинили сіль масою 20 г. Обчисліть масову частку солі w у розчині у відсотках.'
                          : 'В воде массой 180 г растворили соль массой 20 г. Вычислите массовую долю соли w в растворе в процентах.',
                    },
                    {
                      label: lang === 'uk' ? 'Кредит 15% (Економіка)' : 'Кредит 15% (Экономика)',
                      text:
                        lang === 'uk'
                          ? 'Взято кредит на суму 100 000 грн під 15% річних на 2 роки зі складною капіталізацією. Знайдіть загальну суму повернення та нараховані відсотки.'
                          : 'Взят кредит на сумму 100 000 ₽ под 15% годовых на 2 года со сложной капитализацией. Найдите итоговую сумму возврата и процентный доход.',
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTextProblemInput(item.text)}
                      className="px-2 py-1 rounded-md text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => solveProblemWithAi(undefined, undefined, textProblemInput)}
                    disabled={isSolving || !textProblemInput.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSolving ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                        <span>{getTranslation('solvingWithAi', lang)}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{getTranslation('solveTextProblemBtn', lang)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Error Notification with One-Click Retry */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() =>
                  solveProblemWithAi(
                    lastSubmittedImage || undefined,
                    undefined,
                    lastSubmittedText || undefined
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all self-end sm:self-auto shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{getTranslation('retryBtn', lang)}</span>
              </button>
            </div>
          )}

          {/* SOLVED PROBLEM VIEW: Classic Academic Board (Дано, СІ, Знайти || Закони, Розв'язання) + Dedicated Computation Block */}
          {solvedProblem && (
            <div className="space-y-3.5 pt-2 border-t border-slate-800">
              {/* 1. Problem Identification Header */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${subjectConfig.bg}`}
                  >
                    <SubjectIcon className="w-4 h-4" />
                    <span>{getTranslation(subjectConfig.labelKey, lang)}</span>
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100">{solvedProblem.topic}</h4>
                    <span className="text-[10px] text-slate-400">
                      {solvedProblem.subjectTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {solvedProblem.confidence && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {getTranslation('aiAccuracy', lang)}: {(solvedProblem.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                  <button
                    onClick={handleCopyFullAcademicSolution}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/80 hover:bg-slate-600 text-slate-200 border border-slate-600 flex items-center gap-1.5 transition-colors shadow-xs"
                    title={getTranslation('copyFormulaRow', lang)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copiedItemId === 'full_solution'
                        ? getTranslation('copied', lang)
                        : getTranslation('copy', lang)}
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Condition Statement Box */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{getTranslation('problemCondition', lang)}:</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(solvedProblem.problemStatement, 'problem')}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedItemId === 'problem' ? getTranslation('copied', lang) : getTranslation('copy', lang)}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                  {solvedProblem.problemStatement}
                </p>
              </div>

              {/* 3. ⭐ CLASSIC ACADEMIC NOTEBOOK CARD: [ДАНО, СІ, ЗНАЙТИ] || [ЗАКОНИ, РОЗВ'ЯЗАННЯ] ⭐ */}
              <div className="rounded-2xl border-2 border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-700/80">
                  
                  {/* LEFT COLUMN (md:col-span-4): Classic Notebook Condition Block */}
                  <div className="md:col-span-4 p-3.5 space-y-3.5 bg-slate-950/40">
                    {/* ДАНО */}
                    <div>
                      <div className="text-xs font-black tracking-wider text-amber-400 uppercase pb-1 border-b border-amber-500/30 flex items-center justify-between">
                        <span>{getTranslation('givenLabel', lang)}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">GIVEN</span>
                      </div>
                      <div className="mt-2 space-y-1.5 font-mono text-xs">
                        {solvedProblem.givenData && solvedProblem.givenData.length > 0 ? (
                          solvedProblem.givenData.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-baseline justify-between gap-1 p-1.5 rounded bg-slate-800/60 border border-slate-700/60"
                            >
                              <span className="font-bold text-amber-300">
                                {item.symbol || item.label}:
                              </span>
                              <span className="text-slate-100 font-semibold text-right">
                                {item.value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 text-xs italic">—</div>
                        )}
                      </div>
                    </div>

                    {/* СІ (Systeme International) */}
                    {solvedProblem.siConversions && solvedProblem.siConversions.length > 0 && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-xs font-black tracking-wider text-cyan-400 uppercase pb-1 border-b border-cyan-500/30 flex items-center justify-between">
                          <span>{getTranslation('siLabel', lang)}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">SI SYSTEM</span>
                        </div>
                        <div className="mt-2 space-y-1 font-mono text-[11px]">
                          {solvedProblem.siConversions.map((conv, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-200"
                            >
                              {conv}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Horizontal dividing line separating Given from To Find */}
                    <div className="pt-2 border-t-2 border-slate-700">
                      <div className="text-xs font-black tracking-wider text-rose-400 uppercase pb-1 border-b border-rose-500/30 flex items-center justify-between">
                        <span>{getTranslation('toFindLabel', lang)}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">FIND</span>
                      </div>
                      <div className="mt-2 space-y-1.5 font-mono text-xs">
                        {solvedProblem.toFind && solvedProblem.toFind.length > 0 ? (
                          solvedProblem.toFind.map((tf, idx) => (
                            <div
                              key={idx}
                              className="flex items-baseline justify-between gap-1 p-1.5 rounded bg-rose-950/25 border border-rose-500/30"
                            >
                              <span className="font-bold text-rose-300">
                                {tf.symbol} <span className="text-amber-400 font-bold">— ?</span>
                              </span>
                              {tf.description && (
                                <span
                                  className="text-[10px] text-slate-400 text-right truncate max-w-[130px]"
                                  title={tf.description}
                                >
                                  {tf.description}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-1.5 rounded bg-rose-950/20 border border-rose-500/20 font-bold text-rose-300">
                            {solvedProblem.finalAnswer ? solvedProblem.finalAnswer.split('=')[0]?.trim() || 'X' : 'X'} — ?
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (md:col-span-8): Formulas, Laws & Step-by-Step Derivation */}
                  <div className="md:col-span-8 p-3.5 space-y-3.5 bg-slate-900/60">
                    {/* ЗАКОНИ ТА ФОРМУЛИ */}
                    {solvedProblem.lawsAndFormulas && solvedProblem.lawsAndFormulas.length > 0 && (
                      <div>
                        <div className="text-xs font-black tracking-wider text-purple-400 uppercase pb-1 border-b border-purple-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Atom className="w-3.5 h-3.5" />
                            <span>{getTranslation('lawsAndFormulasLabel', lang)}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">FORMULAS</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {solvedProblem.lawsAndFormulas.map((formula, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-purple-950/40 text-purple-200 border border-purple-500/30 shadow-xs"
                            >
                              {formula}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* РОЗВ'ЯЗАННЯ / SOLUTION */}
                    <div>
                      <div className="text-xs font-black tracking-wider text-emerald-400 uppercase pb-1 border-b border-emerald-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{getTranslation('solutionLabel', lang)}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">STEP-BY-STEP DERIVATION</span>
                      </div>

                      <div className="mt-2.5 space-y-2.5">
                        {solvedProblem.solutionSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-500/40">
                                {step.stepNumber}
                              </span>
                              <h5 className="text-xs font-bold text-slate-100">{step.title}</h5>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pl-7">
                              {step.explanation}
                            </p>

                            {step.formula && (
                              <div className="ml-7 p-1.5 rounded bg-slate-900/80 font-mono text-xs text-blue-300 border border-slate-800 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Формула:</span>
                                <span className="font-semibold">{step.formula}</span>
                              </div>
                            )}

                            {step.calculation && (
                              <div className="ml-7 p-1.5 rounded bg-slate-900/90 font-mono text-xs text-emerald-300 font-bold border border-emerald-500/20 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Підстановка:</span>
                                <span>{step.calculation}</span>
                              </div>
                            )}

                            {step.unitCheck && (
                              <div className="ml-7 p-1.5 rounded bg-amber-950/20 font-mono text-[11px] text-amber-200 border border-amber-500/20 flex items-center justify-between">
                                <span className="text-[10px] text-amber-400 font-sans">{getTranslation('unitCheckLabel', lang)}:</span>
                                <span>{step.unitCheck}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. ВІДПОВІДЬ (FINAL ANSWER BANNER) */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border-t-2 border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
                      {getTranslation('finalAnswer', lang)}:
                    </span>
                    <div className="font-mono text-base sm:text-lg font-black text-emerald-300 drop-shadow-sm">
                      {solvedProblem.finalAnswer}
                    </div>
                  </div>

                  <button
                    onClick={handleLoadPrimaryToCalculator}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{getTranslation('loadAndSolve', lang)}</span>
                  </button>
                </div>
              </div>

              {/* 5. ⭐ DEDICATED COMPUTATION BLOCK FROM THE PROBLEM ⭐ */}
              <div className="p-3.5 rounded-xl border-2 border-blue-500/40 bg-gradient-to-b from-blue-950/25 to-slate-900/40 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-500/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-blue-400">
                        {getTranslation('computationBlock', lang)}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {getTranslation('computationBlockDesc', lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {solvedProblem.computationBlock.graphSuggestion && (
                      <button
                        onClick={() =>
                          handleOpenGraph(solvedProblem.computationBlock.graphSuggestion!)
                        }
                        className="px-2 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        title={getTranslation('plotThisFunction', lang)}
                      >
                        <LineChart className="w-3 h-3" />
                        <span>{getTranslation('openInGraphs', lang)}</span>
                      </button>
                    )}
                    <button
                      onClick={handleLoadPrimaryToCalculator}
                      className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{getTranslation('sendToCalc', lang)}</span>
                    </button>
                  </div>
                </div>

                {/* Computation Items List */}
                <div className="space-y-2">
                  {solvedProblem.computationBlock.computations.map((comp, idx) => (
                    <div
                      key={comp.id || idx}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-300">
                          {comp.name}
                        </div>
                        <div className="font-mono text-xs text-blue-400 font-semibold truncate mt-0.5">
                          {comp.formula} = {comp.expression} ={' '}
                          <span className="text-emerald-400 font-bold">
                            {comp.result} {comp.unit || ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() =>
                            handleCopyText(
                              `${comp.formula} = ${comp.expression} = ${comp.result} ${comp.unit || ''}`,
                              comp.id
                            )
                          }
                          className="px-2 py-1 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                          title={getTranslation('copyFormulaRow', lang)}
                        >
                          <Copy className="w-3 h-3" />
                          <span>
                            {copiedItemId === comp.id
                              ? getTranslation('copied', lang)
                              : getTranslation('copy', lang)}
                          </span>
                        </button>
                        <button
                          onClick={() => handleSendToCalculator(comp)}
                          className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 flex items-center gap-1 transition-all"
                          title={getTranslation('calcInMainCalc', lang)}
                        >
                          <span>{getTranslation('sendToCalc', lang)}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
