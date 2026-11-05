import React, { useState, useMemo } from 'react';
import {
  Zap,
  X,
  Percent,
  Divide,
  Activity,
  Triangle,
  Circle,
  Atom,
  Users,
  Fuel,
  HeartPulse,
  Download,
  Calendar,
  Binary,
  Layers,
  FileCode,
  DollarSign,
  Search,
  Copy,
  Check,
  CornerDownLeft,
  ArrowRight,
  Sparkles,
  Calculator,
  RefreshCw,
  Scale
} from 'lucide-react';
import { Language, getTranslation } from '../utils/i18n';
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
  PHYSICAL_CONSTANTS,
  PhysicalConstant,
  decodeResistor,
  RESISTOR_COLORS,
  vector3dOperations,
  solveProjectileMotion,
  solveIdealGas,
  calculateCombinatorics,
  solveProgressions,
  complexArithmetic,
  solveAnnuityLoan,
  calculateElectricityCost,
  calculateDilution,
} from '../utils/mathExtended';
import {
  CALCULATOR_FUNCTIONS_400,
  CalculatorFunctionDef,
  CalcCategory,
} from '../utils/calculatorFunctions400';

interface QuickAnswersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  lang: Language;
  onInsertToCalculator: (value: string, note?: string) => void;
}

type TabType =
  | 'functions100'
  | 'percent'
  | 'proportion'
  | 'quadratic'
  | 'triangle'
  | 'circle'
  | 'constants'
  | 'tips'
  | 'fuel'
  | 'bmi'
  | 'download'
  | 'dates'
  | 'bases'
  | 'factors'
  | 'roman'
  | 'vat'
  | 'ohm'
  | 'chemistry'
  | 'stats'
  | 'matrix'
  | 'resistor'
  | 'vectors'
  | 'ballistics'
  | 'idealGas'
  | 'combinatorics'
  | 'progressions'
  | 'complex'
  | 'loan'
  | 'power'
  | 'dilution';

export const QuickAnswersDrawer: React.FC<QuickAnswersDrawerProps> = ({
  isOpen,
  onClose,
  isDark,
  lang,
  onInsertToCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('functions100');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 100+ Functions Catalogue state
  const [funcSearch, setFuncSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CalcCategory | 'all'>('all');
  const [selectedFuncId, setSelectedFuncId] = useState<string>('gcd_lcm');
  const [customFuncInputs, setCustomFuncInputs] = useState<Record<string, any>>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // State 1: Percentages
  const [pctX, setPctX] = useState<number>(15);
  const [pctY, setPctY] = useState<number>(200);

  // State 2: Proportions a / b = c / x
  const [propA, setPropA] = useState<number>(4);
  const [propB, setPropB] = useState<number>(8);
  const [propC, setPropC] = useState<number>(12);

  // State 3: Quadratic
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // State 4: Right Triangle
  const [triA, setTriA] = useState<number>(3);
  const [triB, setTriB] = useState<number>(4);

  // State 5: Circle
  const [circleR, setCircleR] = useState<number>(5);

  // State 6: Constants Search
  const [constSearch, setConstSearch] = useState<string>('');

  // State 7: Tips & Split
  const [tipBill, setTipBill] = useState<number>(600);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [tipPeople, setTipPeople] = useState<number>(3);

  // State 8: Fuel
  const [fuelDist, setFuelDist] = useState<number>(350);
  const [fuelCons, setFuelCons] = useState<number>(7.5);
  const [fuelPrice, setFuelPrice] = useState<number>(55);

  // State 9: BMI
  const [bmiWeight, setBmiWeight] = useState<number>(70);
  const [bmiHeight, setBmiHeight] = useState<number>(175);

  // State 10: Download ETA
  const [downSizeGb, setDownSizeGb] = useState<number>(25);
  const [downSpeedMbps, setDownSpeedMbps] = useState<number>(100);

  // State 11: Date Diff
  const [dateStart, setDateStart] = useState<string>('2026-01-01');
  const [dateEnd, setDateEnd] = useState<string>('2026-11-03');

  // State 12: Base converter
  const [baseDec, setBaseDec] = useState<number>(255);

  // State 13: Factorization & GCD/LCM
  const [factorNum, setFactorNum] = useState<number>(360);
  const [gcdA, setGcdA] = useState<number>(48);
  const [gcdB, setGcdB] = useState<number>(180);

  // State 14: Roman
  const [romanDec, setRomanDec] = useState<number>(2026);
  const [romanStr, setRomanStr] = useState<string>('MMXXVI');

  // State 15: VAT
  const [vatAmount, setVatAmount] = useState<number>(1200);
  const [vatRate, setVatRate] = useState<number>(20);

  // State 16: Ohm's law
  const [ohmU, setOhmU] = useState<number>(220);
  const [ohmR, setOhmR] = useState<number>(44);

  // State 17: Chemistry Molar Mass
  const [chemFormula, setChemFormula] = useState<string>('H2SO4');

  // State 18: Statistics
  const [statsInput, setStatsInput] = useState<string>('12, 15, 18, 22, 15, 30, 25, 18');

  // State 19: Matrix 2x2
  const [m11, setM11] = useState<number>(4);
  const [m12, setM12] = useState<number>(7);
  const [m21, setM21] = useState<number>(2);
  const [m22, setM22] = useState<number>(6);

  // State 20: Resistor
  const [resBand1, setResBand1] = useState<number>(4);
  const [resBand2, setResBand2] = useState<number>(7);
  const [resMult, setResMult] = useState<number>(3);
  const [resTol, setResTol] = useState<number>(10);

  // State 21: Vectors 3D
  const [v1x, setV1x] = useState<number>(1);
  const [v1y, setV1y] = useState<number>(2);
  const [v1z, setV1z] = useState<number>(3);
  const [v2x, setV2x] = useState<number>(4);
  const [v2y, setV2y] = useState<number>(5);
  const [v2z, setV2z] = useState<number>(6);

  // State 22: Ballistics
  const [ballV0, setBallV0] = useState<number>(20);
  const [ballAngle, setBallAngle] = useState<number>(45);

  // State 23: Ideal Gas
  const [gasP, setGasP] = useState<number>(101.325);
  const [gasV, setGasV] = useState<number>(22.4);
  const [gasN, setGasN] = useState<number>(1);
  const [gasT, setGasT] = useState<number>(20);

  // State 24: Combinatorics
  const [combN, setCombN] = useState<number>(5);
  const [combK, setCombK] = useState<number>(2);

  // State 25: Progressions
  const [progType, setProgType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [progA1, setProgA1] = useState<number>(2);
  const [progStep, setProgStep] = useState<number>(3);
  const [progN, setProgN] = useState<number>(10);

  // State 26: Complex
  const [compR1, setCompR1] = useState<number>(3);
  const [compI1, setCompI1] = useState<number>(4);
  const [compR2, setCompR2] = useState<number>(1);
  const [compI2, setCompI2] = useState<number>(-2);
  const [compOp, setCompOp] = useState<'+' | '-' | '*' | '/'>('+');

  // State 27: Loan
  const [loanPrincipal, setLoanPrincipal] = useState<number>(100000);
  const [loanRate, setLoanRate] = useState<number>(12);
  const [loanMonths, setLoanMonths] = useState<number>(12);

  // State 28: Power
  const [powerWatts, setPowerWatts] = useState<number>(1500);
  const [powerHours, setPowerHours] = useState<number>(4);
  const [powerRate, setPowerRate] = useState<number>(4.32);

  // State 29: Dilution
  const [dilC1, setDilC1] = useState<number>(70);
  const [dilV1, setDilV1] = useState<number>(100);
  const [dilC2, setDilC2] = useState<number>(40);

  // Computations
  const quadraticRes = useMemo(() => solveQuadratic(quadA, quadB, quadC), [quadA, quadB, quadC]);
  const triangleRes = useMemo(() => solveRightTriangle(triA, triB), [triA, triB]);
  const circleRes = useMemo(() => solveCircleAndSphere(circleR), [circleR]);
  const tipRes = useMemo(() => calculateTipSplit(tipBill, tipPercent, tipPeople), [tipBill, tipPercent, tipPeople]);
  const fuelRes = useMemo(() => calculateFuelTrip(fuelDist, fuelCons, fuelPrice), [fuelDist, fuelCons, fuelPrice]);
  const bmiRes = useMemo(() => calculateBMI(bmiWeight, bmiHeight), [bmiWeight, bmiHeight]);

  const chemRes = useMemo(() => calculateMolarMass(chemFormula), [chemFormula]);
  const statsRes = useMemo(() => {
    const arr = statsInput.split(/[\s,;]+/).map(Number).filter(Number.isFinite);
    return calculateDatasetStats(arr);
  }, [statsInput]);

  const matDet = useMemo(() => determinant2x2(m11, m12, m21, m22), [m11, m12, m21, m22]);
  const matInv = useMemo(() => inverse2x2(m11, m12, m21, m22), [m11, m12, m21, m22]);

  const resistorRes = useMemo(() => decodeResistor(resBand1, resBand2, resMult, resTol), [resBand1, resBand2, resMult, resTol]);
  const vectorRes = useMemo(() => vector3dOperations({ x: v1x, y: v1y, z: v1z }, { x: v2x, y: v2y, z: v2z }), [v1x, v1y, v1z, v2x, v2y, v2z]);
  const ballisticsRes = useMemo(() => solveProjectileMotion(ballV0, ballAngle), [ballV0, ballAngle]);
  const gasRes = useMemo(() => solveIdealGas(gasP, gasV, gasN, gasT), [gasP, gasV, gasN, gasT]);
  const combinatoricsRes = useMemo(() => calculateCombinatorics(combN, combK), [combN, combK]);
  const progressionsRes = useMemo(() => solveProgressions(progType, progA1, progStep, progN), [progType, progA1, progStep, progN]);
  const complexRes = useMemo(() => complexArithmetic(compR1, compI1, compR2, compI2, compOp), [compR1, compI1, compR2, compI2, compOp]);
  const loanRes = useMemo(() => solveAnnuityLoan(loanPrincipal, loanRate, loanMonths), [loanPrincipal, loanRate, loanMonths]);
  const powerRes = useMemo(() => calculateElectricityCost(powerWatts, powerHours, powerRate), [powerWatts, powerHours, powerRate]);
  const dilutionRes = useMemo(() => calculateDilution(dilC1, dilV1, dilC2), [dilC1, dilV1, dilC2]);

  const filteredConstants = useMemo(() => {
    const q = constSearch.toLowerCase().trim();
    if (!q) return PHYSICAL_CONSTANTS;
    return PHYSICAL_CONSTANTS.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) ||
        c.nameUk.toLowerCase().includes(q) ||
        c.nameRu.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.value.includes(q)
    );
  }, [constSearch]);

  // Filter 400+ functions
  const filteredFunctions = useMemo(() => {
    let list = CALCULATOR_FUNCTIONS_400;
    if (selectedCategory !== 'all') {
      list = list.filter((f) => f.category === selectedCategory);
    }
    const q = funcSearch.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (f) =>
          f.nameUk.toLowerCase().includes(q) ||
          f.nameRu.toLowerCase().includes(q) ||
          f.nameEn.toLowerCase().includes(q) ||
          f.formula.toLowerCase().includes(q) ||
          f.descriptionUk.toLowerCase().includes(q) ||
          f.descriptionRu.toLowerCase().includes(q) ||
          f.descriptionEn.toLowerCase().includes(q) ||
          String(f.num) === q
      );
    }
    return list;
  }, [selectedCategory, funcSearch]);

  // Active selected function from 400+ catalogue
  const activeFunction = useMemo(() => {
    return (
      CALCULATOR_FUNCTIONS_400.find((f) => f.id === selectedFuncId) ||
      CALCULATOR_FUNCTIONS_400[0]
    );
  }, [selectedFuncId]);

  // Combined inputs for active function
  const currentInputs = useMemo(() => {
    const res: Record<string, any> = {};
    activeFunction.inputs.forEach((inp) => {
      res[inp.key] =
        customFuncInputs[activeFunction.id]?.[inp.key] !== undefined
          ? customFuncInputs[activeFunction.id][inp.key]
          : inp.defaultValue;
    });
    return res;
  }, [activeFunction, customFuncInputs]);

  // Computed result of active function
  const activeFuncResult = useMemo(() => {
    try {
      return activeFunction.calculate(currentInputs);
    } catch {
      return {
        resultFormatted: 'Помилка обчислення',
        insertValue: '',
        steps: ['Перевірте коректність введених даних'],
      };
    }
  }, [activeFunction, currentInputs]);

  const handleInputChange = (key: string, value: any) => {
    setCustomFuncInputs((prev) => ({
      ...prev,
      [activeFunction.id]: {
        ...(prev[activeFunction.id] || {}),
        [key]: value,
      },
    }));
  };

  if (!isOpen) return null;

  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  const categoriesList: { id: CalcCategory | 'all'; label: string }[] = [
    { id: 'all', label: isUk ? `Всі (${CALCULATOR_FUNCTIONS_400.length})` : isEn ? `All (${CALCULATOR_FUNCTIONS_400.length})` : `Все (${CALCULATOR_FUNCTIONS_400.length})` },
    { id: 'algebra', label: isUk ? 'Алгебра & Числа' : isEn ? 'Algebra & Numbers' : 'Алгебра и числа' },
    { id: 'geometry', label: isUk ? 'Геометрія' : isEn ? 'Geometry' : 'Геометрия' },
    { id: 'physics', label: isUk ? 'Фізика' : isEn ? 'Physics' : 'Физика' },
    { id: 'electronics', label: isUk ? 'Електроніка' : isEn ? 'Electronics' : 'Электроника' },
    { id: 'chemistry', label: isUk ? 'Хімія' : isEn ? 'Chemistry' : 'Химия' },
    { id: 'finance', label: isUk ? 'Фінанси' : isEn ? 'Finance' : 'Финансы' },
    { id: 'stats', label: isUk ? 'Статистика & Вектори' : isEn ? 'Statistics' : 'Статистика' },
    { id: 'daily', label: isUk ? 'Побут & IT' : isEn ? 'Daily & IT' : 'Быт и IT' },
  ];

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'functions100',
      label: isUk ? '400+ Функцій' : isEn ? '400+ Functions' : '400+ Функций',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
    },
    { id: 'percent', label: isUk ? 'Відсотки' : isEn ? 'Percentages' : 'Проценты', icon: <Percent className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'proportion', label: isUk ? 'Пропорція' : isEn ? 'Proportions' : 'Пропорция', icon: <Divide className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'quadratic', label: isUk ? 'ax² + bx + c = 0' : 'ax² + bx + c = 0', icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'triangle', label: isUk ? 'Трикутник (Піфагор)' : isEn ? 'Right Triangle' : 'Треугольник (Пифагор)', icon: <Triangle className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'circle', label: isUk ? 'Коло та сфера' : isEn ? 'Circle & Sphere' : 'Круг и сфера', icon: <Circle className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'constants', label: isUk ? 'Фізичні сталі' : isEn ? 'Constants' : 'Физ. константы', icon: <Atom className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'tips', label: isUk ? 'Чайові та поділ' : isEn ? 'Tip & Split' : 'Чаевые и счёт', icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'fuel', label: isUk ? 'Пальне та поїздка' : isEn ? 'Fuel & Trip' : 'Топливо и поездка', icon: <Fuel className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'bmi', label: isUk ? 'ІМТ (Здоровʼя)' : isEn ? 'BMI' : 'ИМТ (Здоровье)', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'download', label: isUk ? 'Швидкість завантаження' : isEn ? 'Download ETA' : 'Скорость загрузки', icon: <Download className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'dates', label: isUk ? 'Різниця дат' : isEn ? 'Date Diff' : 'Разница дат', icon: <Calendar className="w-3.5 h-3.5 text-violet-400" /> },
    { id: 'bases', label: isUk ? 'Системи числення' : isEn ? 'Bases (Hex/Bin)' : 'Системы счисления', icon: <Binary className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'factors', label: isUk ? 'НСД / НСК та множники' : isEn ? 'GCD / LCM & Factors' : 'НОД / НОК и множители', icon: <Layers className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'roman', label: isUk ? 'Римські числа' : isEn ? 'Roman Numerals' : 'Римские числа', icon: <FileCode className="w-3.5 h-3.5 text-yellow-400" /> },
    { id: 'vat', label: isUk ? 'ПДВ 20% / Податки' : isEn ? 'VAT / Taxes' : 'НДС 20% / Налоги', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'ohm', label: isUk ? 'Закон Ома (U, I, R, P)' : isEn ? "Ohm's Law" : 'Закон Ома', icon: <Activity className="w-3.5 h-3.5 text-orange-400" /> },
    { id: 'chemistry', label: isUk ? 'Хімія: Молярна маса' : isEn ? 'Molar Mass' : 'Химия: Молярная масса', icon: <Atom className="w-3.5 h-3.5 text-teal-400" /> },
    { id: 'stats', label: isUk ? 'Статистика (x̄, Me, σ)' : isEn ? 'Statistics' : 'Статистика', icon: <Scale className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'matrix', label: isUk ? 'Матриця 2×2' : isEn ? '2×2 Matrix' : 'Матрица 2×2', icon: <Calculator className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'resistor', label: isUk ? 'Маркування резисторів' : isEn ? 'Resistors' : 'Маркировка резисторов', icon: <Activity className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'vectors', label: isUk ? '3D Вектори' : isEn ? '3D Vectors' : '3D Векторы', icon: <ArrowRight className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'ballistics', label: isUk ? 'Балістика (Траєкторія)' : isEn ? 'Ballistics' : 'Баллистика (Траектория)', icon: <Sparkles className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'idealGas', label: isUk ? 'Газ (PV=nRT)' : isEn ? 'Gas (PV=nRT)' : 'Газ (PV=nRT)', icon: <Atom className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'combinatorics', label: isUk ? 'Комбінаторика (n!, C)' : isEn ? 'Combinatorics' : 'Комбинаторика', icon: <Layers className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'progressions', label: isUk ? 'Прогресії' : isEn ? 'Progressions' : 'Прогрессии', icon: <Divide className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'complex', label: isUk ? 'Комплексні числа' : isEn ? 'Complex Numbers' : 'Комплексные числа', icon: <Calculator className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'loan', label: isUk ? 'Кредит / Ануїтет' : isEn ? 'Loan & Annuity' : 'Кредит / Аннуитет', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'power', label: isUk ? 'Електроенергія' : isEn ? 'Electricity Cost' : 'Электроэнергия', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'dilution', label: isUk ? 'Розведення розчинів' : isEn ? 'Dilution' : 'Разбавление растворов', icon: <Atom className="w-3.5 h-3.5 text-teal-400" /> },
  ];

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base tracking-tight">
                  {isUk ? 'Швидкі відповіді та бліц-розрахунки' : isEn ? 'Quick Answers & Instant Solvers' : 'Быстрые ответы и блиц-расчёты'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  400+ {isUk ? 'функцій' : isEn ? 'functions' : 'функций'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isUk
                  ? 'Миттєві точні відповіді без введення довгих формул з можливістю копіювання та вставки в WexCalculator'
                  : isEn
                  ? 'Instant verified answers without typing long expressions, with 1-click copy & insert to WexCalculator'
                  : 'Мгновенные точные ответы без ввода длинных формул с возможностью копирования и вставки в WexCalculator'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons Scrollable Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-3 text-xs font-semibold overflow-x-auto shrink-0 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 0: 100+ Functions Master Catalogue */}
          {activeTab === 'functions100' && (
            <div className="space-y-4">
              {/* Search & Filter Header */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={funcSearch}
                    onChange={(e) => setFuncSearch(e.target.value)}
                    placeholder={
                      isUk
                        ? 'Швидкий пошук серед 400+ функцій (назва, формула, №)...'
                        : isEn
                        ? 'Quick search across 400+ functions (name, formula, #)...'
                        : 'Быстрый поиск среди 400+ функций (название, формула, №)...'
                    }
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs outline-none focus:border-blue-500 transition-all font-mono"
                  />
                  {funcSearch && (
                    <button
                      onClick={() => setFuncSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Function Interactive Solver Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/70 to-slate-900/90 border border-blue-500/30 shadow-xl space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                        #{activeFunction.num}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {activeFunction.category}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {isUk ? activeFunction.nameUk : isEn ? activeFunction.nameEn : activeFunction.nameRu}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isUk ? activeFunction.descriptionUk : isEn ? activeFunction.descriptionEn : activeFunction.descriptionRu}
                    </p>
                  </div>

                  {/* Formula Box */}
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-sans">
                      {isUk ? 'Формула' : 'Formula'}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {activeFunction.formula}
                    </span>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {activeFunction.inputs.map((inp) => (
                    <div key={inp.key} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        {isUk ? inp.labelUk : isEn ? inp.labelEn : inp.labelRu}
                        {inp.unit ? ` (${inp.unit})` : ''}
                      </label>
                      {inp.type === 'select' && inp.options ? (
                        <select
                          value={currentInputs[inp.key]}
                          onChange={(e) => handleInputChange(inp.key, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-blue-500"
                        >
                          {inp.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {isUk ? opt.labelUk : isEn ? opt.labelEn : opt.labelRu}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={inp.type === 'text' ? 'text' : 'number'}
                          value={currentInputs[inp.key]}
                          onChange={(e) =>
                            handleInputChange(
                              inp.key,
                              inp.type === 'text' ? e.target.value : Number(e.target.value)
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Output & Action Buttons */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                      {isUk ? 'Результат обчислення' : isEn ? 'Calculated Result' : 'Результат вычисления'}
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                      {activeFuncResult.resultFormatted}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(activeFuncResult.resultFormatted, `func_${activeFunction.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedKey === `func_${activeFunction.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{isUk ? 'Копіювати' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() =>
                        onInsertToCalculator(
                          activeFuncResult.insertValue || activeFuncResult.resultFormatted,
                          `${isUk ? activeFunction.nameUk : activeFunction.nameEn}: ${activeFuncResult.resultFormatted}`
                        )
                      }
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                      <span>{isUk ? 'Вставити в калькулятор' : 'Insert to Calc'}</span>
                    </button>
                  </div>
                </div>

                {/* Steps Breakdown */}
                {activeFuncResult.steps?.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                      {isUk ? 'Покроковий хід обчислень' : isEn ? 'Step-by-step breakdown' : 'Пошаговый ход вычислений'}:
                    </span>
                    {activeFuncResult.steps.map((st, i) => (
                      <div key={i} className="text-slate-300 font-mono text-[11px] flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid of All Functions in Catalogue */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold">
                    {isUk ? 'Каталог 400+ функцій' : isEn ? '400+ Functions Catalogue' : 'Каталог 400+ функций'}
                  </span>
                  <span className="text-[11px]">
                    {isUk ? 'Знайдено:' : isEn ? 'Found:' : 'Найдено:'} {filteredFunctions.length} / {CALCULATOR_FUNCTIONS_400.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredFunctions.map((fn) => {
                    const isSelected = fn.id === activeFunction.id;
                    return (
                      <div
                        key={fn.id}
                        onClick={() => setSelectedFuncId(fn.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 border border-slate-700 text-cyan-400">
                              #{fn.num}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400">
                              {fn.category}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white line-clamp-1">
                            {isUk ? fn.nameUk : isEn ? fn.nameEn : fn.nameRu}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            {fn.formula}
                          </div>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-inherit/20 flex items-center justify-between text-[10px]">
                          <span className="text-cyan-400 font-semibold">
                            {isSelected ? (isUk ? '● Обрано' : '● Selected') : (isUk ? 'Вибрати' : 'Select')}
                          </span>
                          <span className="text-slate-400">
                            {fn.inputs.length} {isUk ? 'параметрів' : 'inputs'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Percentages */}
          {activeTab === 'percent' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {isUk ? 'Відсоток (%)' : isEn ? 'Percentage (%)' : 'Процент (%)'}
                  </label>
                  <input
                    type="number"
                    value={pctX}
                    onChange={(e) => setPctX(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {isUk ? 'Базове число (Y)' : isEn ? 'Base number (Y)' : 'Базовое число (Y)'}
                  </label>
                  <input
                    type="number"
                    value={pctY}
                    onChange={(e) => setPctY(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {/* Calculated Results Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. X% of Y */}
                <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/30 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">
                      {pctX}% {isUk ? 'від' : isEn ? 'of' : 'от'} {pctY}
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">
                      {((pctX * pctY) / 100).toFixed(4).replace(/\.?0+$/, '')}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-blue-500/20">
                    <button
                      onClick={() => handleCopy(((pctX * pctY) / 100).toString(), 'pct1')}
                      className="text-xs text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pct1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isUk ? 'Копіювати' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onInsertToCalculator(((pctX * pctY) / 100).toString(), `${pctX}% від ${pctY}`)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>{isUk ? 'Вставити' : 'Insert'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Y with X% Discount */}
                <div className="p-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                      {pctY} {isUk ? 'зі знижкою' : isEn ? 'with discount' : 'со скидкой'} {pctX}%
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                      {(pctY * (1 - pctX / 100)).toFixed(4).replace(/\.?0+$/, '')}
                    </div>
                    <div className="text-[10px] text-emerald-400/80 mt-0.5">
                      {isUk ? 'Економія:' : isEn ? 'Savings:' : 'Экономия:'} {((pctX * pctY) / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-500/20">
                    <button
                      onClick={() => handleCopy((pctY * (1 - pctX / 100)).toString(), 'pct2')}
                      className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pct2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isUk ? 'Копіювати' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onInsertToCalculator((pctY * (1 - pctX / 100)).toString(), `${pctY} - ${pctX}%`)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>{isUk ? 'Вставити' : 'Insert'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Y with X% Markup */}
                <div className="p-3.5 rounded-xl bg-amber-600/10 border border-amber-500/30 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                      {pctY} {isUk ? 'з націнкою' : isEn ? 'with markup' : 'с наценкой'} +{pctX}%
                    </div>
                    <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                      {(pctY * (1 + pctX / 100)).toFixed(4).replace(/\.?0+$/, '')}
                    </div>
                    <div className="text-[10px] text-amber-400/80 mt-0.5">
                      +{((pctX * pctY) / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-500/20">
                    <button
                      onClick={() => handleCopy((pctY * (1 + pctX / 100)).toString(), 'pct3')}
                      className="text-xs text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pct3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isUk ? 'Копіювати' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onInsertToCalculator((pctY * (1 + pctX / 100)).toString(), `${pctY} + ${pctX}%`)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>{isUk ? 'Вставити' : 'Insert'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Proportions */}
          {activeTab === 'proportion' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="text-xs text-slate-300 font-semibold mb-3">
                  {isUk ? 'Основна властивість пропорції: a / b = c / x => x = (b · c) / a' : 'a / b = c / x => x = (b · c) / a'}
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      value={propA}
                      onChange={(e) => setPropA(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                      title="a"
                    />
                    <div className="w-16 h-0.5 bg-slate-600 my-1" />
                    <input
                      type="number"
                      value={propB}
                      onChange={(e) => setPropB(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                      title="b"
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-400">=</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      value={propC}
                      onChange={(e) => setPropC(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                      title="c"
                    />
                    <div className="w-16 h-0.5 bg-slate-600 my-1" />
                    <div className="w-16 py-1 rounded bg-blue-600/30 border border-blue-500/50 text-center font-bold text-blue-300">
                      x
                    </div>
                  </div>
                  <span className="text-xl font-bold text-slate-400">➔</span>
                  <div className="flex-1 min-w-[200px] p-3 rounded-xl bg-blue-600/10 border border-blue-500/30">
                    <div className="text-[10px] text-blue-400 uppercase font-bold">
                      {isUk ? 'Знайдене значення x:' : isEn ? 'Calculated x value:' : 'Найденное значение x:'}
                    </div>
                    <div className="text-2xl font-bold text-white mt-0.5">
                      {propA !== 0 ? ((propB * propC) / propA).toFixed(4).replace(/\.?0+$/, '') : 'Помилка (a = 0)'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      x = ({propB} × {propC}) ÷ {propA}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Quadratic */}
          {activeTab === 'quadratic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Коефіцієнт a</label>
                  <input
                    type="number"
                    value={quadA}
                    onChange={(e) => setQuadA(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Коефіцієнт b</label>
                  <input
                    type="number"
                    value={quadB}
                    onChange={(e) => setQuadB(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Коефіцієнт c</label>
                  <input
                    type="number"
                    value={quadC}
                    onChange={(e) => setQuadC(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {/* Quadratic Output */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                  <div className="text-xs text-blue-400 font-bold">
                    {quadA}x² {quadB >= 0 ? `+ ${quadB}` : `- ${Math.abs(quadB)}`}x {quadC >= 0 ? `+ ${quadC}` : `- ${Math.abs(quadC)}`} = 0
                  </div>
                  <div className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                    D = {quadraticRes.d}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Корінь x₁</span>
                    <span className="text-lg font-bold text-emerald-400">{quadraticRes.x1}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Корінь x₂</span>
                    <span className="text-lg font-bold text-cyan-400">{quadraticRes.x2}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-1 font-sans">
                  {quadraticRes.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                  <div className="text-[11px] text-amber-400 font-medium">
                    Вершина параболи: ({quadraticRes.vertexX}; {quadraticRes.vertexY})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Right Triangle */}
          {activeTab === 'triangle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Катет a</label>
                  <input
                    type="number"
                    value={triA}
                    onChange={(e) => setTriA(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Катет b</label>
                  <input
                    type="number"
                    value={triB}
                    onChange={(e) => setTriB(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Гіпотенуза c = √(a²+b²)</span>
                  <span className="text-lg font-bold text-emerald-400">{triangleRes.hypotenuse}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Площа S = (a·b)/2</span>
                  <span className="text-lg font-bold text-amber-400">{triangleRes.area}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Периметр P = a+b+c</span>
                  <span className="text-lg font-bold text-cyan-400">{triangleRes.perimeter}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Висота hc = (a·b)/c</span>
                  <span className="text-lg font-bold text-purple-400">{triangleRes.heightH}</span>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Кути: α = {triangleRes.angleAlphaDeg}°, β = {triangleRes.angleBetaDeg}°, γ = 90°
              </div>
            </div>
          )}

          {/* TAB 5: Circle & Sphere */}
          {activeTab === 'circle' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Радіус r</label>
                <input
                  type="number"
                  value={circleR}
                  onChange={(e) => setCircleR(Number(e.target.value))}
                  className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Довжина кола C = 2πr</span>
                  <span className="text-xl font-bold text-sky-400">{circleRes.circumference}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Площа круга S = πr²</span>
                  <span className="text-xl font-bold text-emerald-400">{circleRes.circleArea}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Обʼєм кулі V = 4/3 πr³</span>
                  <span className="text-xl font-bold text-amber-400">{circleRes.sphereVolume}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Площа поверхні сфери S = 4πr²</span>
                  <span className="text-xl font-bold text-pink-400">{circleRes.sphereSurface}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Constants */}
          {activeTab === 'constants' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Пошук константи (світло, гравітація, планк, е, кулон)..."
                  value={constSearch}
                  onChange={(e) => setConstSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredConstants.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-400 text-sm">{c.symbol}</span>
                        <span className="text-xs text-slate-200 font-medium truncate">
                          {isUk ? c.nameUk : isEn ? c.nameEn : c.nameRu}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {c.value} {c.unit}
                      </div>
                    </div>
                    <button
                      onClick={() => onInsertToCalculator(c.numericVal.toString(), `${c.symbol} (${c.nameUk})`)}
                      className="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[10px] font-bold border border-blue-500/40 flex items-center gap-1 shrink-0 cursor-pointer"
                      title="Вставити в калькулятор"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>{isUk ? 'Вставити' : 'Insert'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Tips & Split */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Рахунок</label>
                  <input
                    type="number"
                    value={tipBill}
                    onChange={(e) => setTipBill(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Чайові (%)</label>
                  <input
                    type="number"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">К-сть людей</label>
                  <input
                    type="number"
                    value={tipPeople}
                    onChange={(e) => setTipPeople(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Чайові всього</span>
                  <span className="text-lg font-bold text-emerald-400">{tipRes.tipTotal} ₴</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Разом до сплати</span>
                  <span className="text-lg font-bold text-white">{tipRes.billWithTip} ₴</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/40">
                  <span className="text-[10px] text-blue-300 block font-bold">З кожної особи</span>
                  <span className="text-xl font-bold text-blue-200">{tipRes.perPerson} ₴</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Чайові з особи</span>
                  <span className="text-lg font-bold text-amber-400">{tipRes.tipPerPerson} ₴</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Fuel */}
          {activeTab === 'fuel' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Дистанція (км)</label>
                  <input
                    type="number"
                    value={fuelDist}
                    onChange={(e) => setFuelDist(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Витрата (л/100км)</label>
                  <input
                    type="number"
                    value={fuelCons}
                    onChange={(e) => setFuelCons(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ціна за 1 л (₴)</label>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Потрібно пального</span>
                  <span className="text-xl font-bold text-amber-400">{fuelRes.litersNeeded} л</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-300 font-bold block">Вартість поїздки</span>
                  <span className="text-2xl font-bold text-emerald-200">{fuelRes.totalCost} ₴</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Вартість 1 км</span>
                  <span className="text-xl font-bold text-cyan-400">{fuelRes.costPerKm} ₴/км</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BMI */}
          {activeTab === 'bmi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Вага (кг)</label>
                  <input
                    type="number"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Зріст (см)</label>
                  <input
                    type="number"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Індекс маси тіла (ІМТ)</span>
                  <span className="text-3xl font-extrabold text-white mt-1 font-mono">{bmiRes.bmi}</span>
                  <div className="text-xs font-semibold mt-1">
                    {bmiRes.category === 'normal' && <span className="text-emerald-400">Нормальна вага</span>}
                    {bmiRes.category === 'underweight' && <span className="text-amber-400">Дефіцит маси тіла</span>}
                    {bmiRes.category === 'overweight' && <span className="text-orange-400">Надлишкова вага</span>}
                    {bmiRes.category === 'obese' && <span className="text-rose-400">Ожиріння</span>}
                  </div>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  <div>Діапазон здорової ваги:</div>
                  <div className="text-emerald-400 font-bold text-sm">
                    {bmiRes.idealWeightMin} кг – {bmiRes.idealWeightMax} кг
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: Download ETA */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Розмір файлу (ГБ)</label>
                  <input
                    type="number"
                    value={downSizeGb}
                    onChange={(e) => setDownSizeGb(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Швидкість інтернету (Мбіт/с)</label>
                  <input
                    type="number"
                    value={downSpeedMbps}
                    onChange={(e) => setDownSpeedMbps(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {(() => {
                const totalMbits = downSizeGb * 1024 * 8;
                const totalSeconds = downSpeedMbps > 0 ? totalMbits / downSpeedMbps : 0;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = Math.round(totalSeconds % 60);
                const speedMBs = (downSpeedMbps / 8).toFixed(1);
                return (
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30">
                    <span className="text-xs text-blue-300 font-bold block">Приблизний час завантаження:</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">
                      {minutes} хв {seconds} с ({totalSeconds.toFixed(0)} секунд)
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Реальна швидкість у провіднику: ≈ {speedMBs} МБ/с
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 11: Date Diff */}
          {activeTab === 'dates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Початкова дата</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Кінцева дата</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {(() => {
                const d1 = new Date(dateStart).getTime();
                const d2 = new Date(dateEnd).getTime();
                const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
                const weeks = Math.floor(diffDays / 7);
                const remDays = diffDays % 7;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Всього днів</span>
                      <span className="text-2xl font-bold text-emerald-400">{diffDays}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Тижнів і днів</span>
                      <span className="text-lg font-bold text-white">{weeks} т {remDays} д</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Всього годин</span>
                      <span className="text-lg font-bold text-cyan-400">{diffDays * 24}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 12: Bases Hex/Bin */}
          {activeTab === 'bases' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Десяткове число (DEC)</label>
                <input
                  type="number"
                  value={baseDec}
                  onChange={(e) => setBaseDec(Number(e.target.value))}
                  className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Шістнадцяткове (HEX)</span>
                  <span className="text-xl font-bold text-amber-400">0x{(baseDec >>> 0).toString(16).toUpperCase()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Двійкове (BIN)</span>
                  <span className="text-xl font-bold text-emerald-400">{(baseDec >>> 0).toString(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Вісімкове (OCT)</span>
                  <span className="text-xl font-bold text-cyan-400">0o{(baseDec >>> 0).toString(8)}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: Factors & GCD/LCM */}
          {activeTab === 'factors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <label className="text-xs font-bold text-blue-400 block">Розклад на прості множники</label>
                <input
                  type="number"
                  value={factorNum}
                  onChange={(e) => setFactorNum(Number(e.target.value))}
                  className="w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                />
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                  <span className="text-lg font-bold text-emerald-400">
                    {factorNum} = {primeFactorization(factorNum).formula}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <label className="text-xs font-bold text-cyan-400 block">НСД та НСК для двох чисел</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={gcdA}
                    onChange={(e) => setGcdA(Number(e.target.value))}
                    className="w-32 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                    title="Число 1"
                  />
                  <input
                    type="number"
                    value={gcdB}
                    onChange={(e) => setGcdB(Number(e.target.value))}
                    className="w-32 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                    title="Число 2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">НСД (Найбільший спільний дільник)</span>
                    <span className="text-xl font-bold text-amber-400">{gcd(gcdA, gcdB)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">НСК (Найменше спільне кратне)</span>
                    <span className="text-xl font-bold text-cyan-400">{lcm(gcdA, gcdB)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: Roman Numerals */}
          {activeTab === 'roman' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <label className="text-xs font-bold text-amber-400 block">З десяткового в римське</label>
                  <input
                    type="number"
                    value={romanDec}
                    onChange={(e) => setRomanDec(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                  <div className="text-2xl font-bold font-mono text-white pt-2">
                    {toRoman(romanDec)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <label className="text-xs font-bold text-cyan-400 block">З римського в десяткове</label>
                  <input
                    type="text"
                    value={romanStr}
                    onChange={(e) => setRomanStr(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                  <div className="text-2xl font-bold font-mono text-white pt-2">
                    {fromRoman(romanStr)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: VAT & Taxes */}
          {activeTab === 'vat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Сума (₴)</label>
                  <input
                    type="number"
                    value={vatAmount}
                    onChange={(e) => setVatAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ставка ПДВ (%)</label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {/* Mode A: Add VAT */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <span className="text-xs text-blue-400 font-bold block">1. Нарахувати ПДВ зверху (+{vatRate}%)</span>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Сума ПДВ:</span>
                    <span className="text-lg font-bold text-amber-400">{((vatAmount * vatRate) / 100).toFixed(2)} ₴</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Підсумок з ПДВ:</span>
                    <span className="text-xl font-bold text-white">{(vatAmount * (1 + vatRate / 100)).toFixed(2)} ₴</span>
                  </div>
                </div>

                {/* Mode B: Extract VAT */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <span className="text-xs text-emerald-400 font-bold block">2. Виділити ПДВ із загальної суми</span>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Чиста ціна без ПДВ:</span>
                    <span className="text-lg font-bold text-white">{(vatAmount / (1 + vatRate / 100)).toFixed(2)} ₴</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">В т.ч. ПДВ:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {(vatAmount - vatAmount / (1 + vatRate / 100)).toFixed(2)} ₴
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 16: Ohm's Law */}
          {activeTab === 'ohm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Напруга U (Вольт)</label>
                  <input
                    type="number"
                    value={ohmU}
                    onChange={(e) => setOhmU(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Опір R (Ом)</label>
                  <input
                    type="number"
                    value={ohmR}
                    onChange={(e) => setOhmR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {(() => {
                const currentI = ohmR > 0 ? ohmU / ohmR : 0;
                const powerP = ohmU * currentI;
                return (
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Сила струму I = U / R</span>
                      <span className="text-2xl font-bold text-amber-400">{currentI.toFixed(3)} А</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Потужність P = U · I = U² / R</span>
                      <span className="text-2xl font-bold text-emerald-400">{powerP.toFixed(2)} Вт</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 17: Chemistry Molar Mass */}
          {activeTab === 'chemistry' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Формула сполуки (наприклад: H2SO4, Ca(OH)2, C6H12O6, NaCl, KMnO4)
                </label>
                <input
                  type="text"
                  value={chemFormula}
                  onChange={(e) => setChemFormula(e.target.value)}
                  className="w-full sm:w-80 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                />
              </div>

              {chemRes.error ? (
                <div className="p-3 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-mono">
                  {chemRes.error}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <span className="text-xs text-slate-400 uppercase font-bold">Молярна маса M:</span>
                    <span className="text-2xl font-bold font-mono text-teal-300">{chemRes.molarMass} г/моль</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-bold block">Масові частки елементів (%):</span>
                    {chemRes.elements.map((el) => (
                      <div key={el.symbol} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">
                          {el.symbol} ({el.count} × {el.atomicMass} г/моль)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-teal-400 font-bold">{el.totalMass} г/моль</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                            {el.massPercent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 18: Statistics */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Набір чисел (через кому або пробіл)
                </label>
                <input
                  type="text"
                  value={statsInput}
                  onChange={(e) => setStatsInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Кількість (n)</span>
                  <span className="text-lg font-bold text-white">{statsRes.count}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Середнє (x̄)</span>
                  <span className="text-lg font-bold text-blue-400">{statsRes.mean}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Медіана (Me)</span>
                  <span className="text-lg font-bold text-emerald-400">{statsRes.median}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Станд. відхилення (σ)</span>
                  <span className="text-lg font-bold text-purple-400">{statsRes.stdDev}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 19: Matrix 2x2 */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Елементи матриці [ [a, b], [c, d] ]
              </label>
              <div className="flex items-center gap-2 font-mono">
                <div className="border-l-2 border-r-2 border-slate-600 px-3 py-2 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={m11}
                    onChange={(e) => setM11(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                  />
                  <input
                    type="number"
                    value={m12}
                    onChange={(e) => setM12(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                  />
                  <input
                    type="number"
                    value={m21}
                    onChange={(e) => setM21(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                  />
                  <input
                    type="number"
                    value={m22}
                    onChange={(e) => setM22(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center text-white"
                  />
                </div>

                <div className="flex-1 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono">
                  <span className="text-xs text-slate-400 block">Визначник det(A) = a·d - b·c:</span>
                  <span className="text-2xl font-bold text-amber-400">{matDet}</span>
                  {matInv.inv ? (
                    <div className="mt-2 text-xs text-slate-300">
                      Обернена матриця A⁻¹:
                      <div className="text-emerald-400 font-bold mt-0.5">
                        [ [{matInv.inv[0][0]}, {matInv.inv[0][1]}], [{matInv.inv[1][0]}, {matInv.inv[1][1]}] ]
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-400 mt-1">Оберненої матриці не існує (det = 0)</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 20: Resistor Color Code */}
          {activeTab === 'resistor' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col items-center gap-3">
                <div className="w-full max-w-sm h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 border-4 border-amber-600/40 flex items-center justify-around px-8 shadow-inner relative">
                  <div className="w-4 h-full" style={{ backgroundColor: RESISTOR_COLORS[resBand1]?.hex }} title={RESISTOR_COLORS[resBand1]?.nameUk} />
                  <div className="w-4 h-full" style={{ backgroundColor: RESISTOR_COLORS[resBand2]?.hex }} title={RESISTOR_COLORS[resBand2]?.nameUk} />
                  <div className="w-4 h-full" style={{ backgroundColor: RESISTOR_COLORS[resMult]?.hex }} title={RESISTOR_COLORS[resMult]?.nameUk} />
                  <div className="w-4 h-full ml-4" style={{ backgroundColor: RESISTOR_COLORS[resTol]?.hex }} title={RESISTOR_COLORS[resTol]?.nameUk} />
                </div>
                <div className="text-center font-mono">
                  <div className="text-2xl font-bold text-amber-400">{resistorRes.formatted} ±{resistorRes.tolerancePercent}%</div>
                  <div className="text-xs text-slate-400">{resistorRes.resistanceOhms} Ω</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">1-а смуга (Десятки)</label>
                  <select
                    value={resBand1}
                    onChange={(e) => setResBand1(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {RESISTOR_COLORS.filter(c => c.digit >= 1).map((c, i) => (
                      <option key={i} value={c.digit}>{c.digit} - {c.nameUk}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">2-а смуга (Одиниці)</label>
                  <select
                    value={resBand2}
                    onChange={(e) => setResBand2(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {RESISTOR_COLORS.filter(c => c.digit >= 0).map((c, i) => (
                      <option key={i} value={c.digit}>{c.digit} - {c.nameUk}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">3-я смуга (Множник)</label>
                  <select
                    value={resMult}
                    onChange={(e) => setResMult(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {RESISTOR_COLORS.map((c, i) => (
                      <option key={i} value={i}>×{c.mult} ({c.nameUk})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">4-а смуга (Точність)</label>
                  <select
                    value={resTol}
                    onChange={(e) => setResTol(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {RESISTOR_COLORS.filter(c => c.tol !== null).map((c, i) => (
                      <option key={i} value={RESISTOR_COLORS.indexOf(c)}>±{c.tol}% ({c.nameUk})</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => onInsertToCalculator(String(resistorRes.resistanceOhms), `Резистор ${resistorRes.formatted}`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
              >
                Вставити {resistorRes.resistanceOhms} Ω в калькулятор
              </button>
            </div>
          )}

          {/* TAB 21: 3D Vectors */}
          {activeTab === 'vectors' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <div className="font-bold text-cyan-400">Вектор A (x, y, z)</div>
                  <div className="grid grid-cols-3 gap-1">
                    <input type="number" value={v1x} onChange={e => setV1x(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <input type="number" value={v1y} onChange={e => setV1y(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <input type="number" value={v1z} onChange={e => setV1z(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                  </div>
                  <div className="text-slate-400 text-[10px]">|A| = {vectorRes.mag1}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                  <div className="font-bold text-pink-400">Вектор B (x, y, z)</div>
                  <div className="grid grid-cols-3 gap-1">
                    <input type="number" value={v2x} onChange={e => setV2x(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <input type="number" value={v2y} onChange={e => setV2y(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <input type="number" value={v2z} onChange={e => setV2z(Number(e.target.value))} className="p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                  </div>
                  <div className="text-slate-400 text-[10px]">|B| = {vectorRes.mag2}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Скалярний добуток A·B</div>
                  <div className="text-base font-bold text-amber-400">{vectorRes.dotProduct}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Кут між векторами</div>
                  <div className="text-base font-bold text-emerald-400">{vectorRes.angleDeg}°</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Векторний добуток A×B</div>
                  <div className="text-xs font-bold text-purple-400">({vectorRes.crossProduct.x}, {vectorRes.crossProduct.y}, {vectorRes.crossProduct.z})</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 22: Ballistics / Projectile */}
          {activeTab === 'ballistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Початкова швидкість v₀ (м/с)</label>
                  <input type="number" value={ballV0} onChange={e => setBallV0(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Кут до горизонту α (°)</label>
                  <input type="number" value={ballAngle} onChange={e => setBallAngle(Number(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Макс. висота H_max</div>
                  <div className="text-lg font-bold text-cyan-400">{ballisticsRes.maxHeight} м</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Дальність польоту L</div>
                  <div className="text-lg font-bold text-emerald-400">{ballisticsRes.totalRange} м</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Час у повітрі t</div>
                  <div className="text-lg font-bold text-amber-400">{ballisticsRes.flightTime} с</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 23: Ideal Gas Law */}
          {activeTab === 'idealGas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Тиск P (кПа)</label>
                  <input type="number" value={gasP} onChange={e => setGasP(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Об'єм V (л)</label>
                  <input type="number" value={gasV} onChange={e => setGasV(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Кількість n (моль)</label>
                  <input type="number" value={gasN} onChange={e => setGasN(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Температура T (°C)</label>
                  <input type="number" value={gasT} onChange={e => setGasT(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs font-mono space-y-1">
                <div className="text-slate-400">Формула Менделєєва-Клапейрона: <span className="text-white">P·V = n·R·T (R = 8.314 Дж/(моль·К))</span></div>
                <div className="text-emerald-400 font-bold">T = {gasRes.t_K} K | P·V = {(gasRes.p_kPa * gasRes.v_L).toFixed(1)} кПа·л | n·R·T = {(gasRes.n_mol * 8.31446 * gasRes.t_K).toFixed(1)} Дж</div>
              </div>
            </div>
          )}

          {/* TAB 24: Combinatorics */}
          {activeTab === 'combinatorics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Загальна кількість n</label>
                  <input type="number" value={combN} onChange={e => setCombN(Number(e.target.value))} className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white text-base" />
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Вибірка k</label>
                  <input type="number" value={combK} onChange={e => setCombK(Number(e.target.value))} className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white text-base" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Факторіал n!</div>
                  <div className="text-lg font-bold text-cyan-400">{combinatoricsRes.factorialN}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Сполучення C(n, k)</div>
                  <div className="text-lg font-bold text-emerald-400">{combinatoricsRes.combinations}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Розміщення P(n, k)</div>
                  <div className="text-lg font-bold text-amber-400">{combinatoricsRes.permutations}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 25: Progressions */}
          {activeTab === 'progressions' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setProgType('arithmetic')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${progType === 'arithmetic' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  Арифметична (d)
                </button>
                <button onClick={() => setProgType('geometric')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${progType === 'geometric' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  Геометрична (q)
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Перший член a₁</label>
                  <input type="number" value={progA1} onChange={e => setProgA1(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">{progType === 'arithmetic' ? 'Різниця d' : 'Знаменник q'}</label>
                  <input type="number" value={progStep} onChange={e => setProgStep(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Номер n</label>
                  <input type="number" value={progN} onChange={e => setProgN(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">n-й член (a_{progN})</div>
                  <div className="text-xl font-bold text-cyan-400">{progressionsRes.an}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Сума перших n членів (S_{progN})</div>
                  <div className="text-xl font-bold text-emerald-400">{progressionsRes.sumSn}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 26: Complex Numbers */}
          {activeTab === 'complex' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] mb-1">Число z₁ = a + bi</span>
                  <div className="flex gap-1 items-center">
                    <input type="number" value={compR1} onChange={e => setCompR1(Number(e.target.value))} className="w-16 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <span>+</span>
                    <input type="number" value={compI1} onChange={e => setCompI1(Number(e.target.value))} className="w-16 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <span>i</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] mb-1">Число z₂ = c + di</span>
                  <div className="flex gap-1 items-center">
                    <input type="number" value={compR2} onChange={e => setCompR2(Number(e.target.value))} className="w-16 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <span>+</span>
                    <input type="number" value={compI2} onChange={e => setCompI2(Number(e.target.value))} className="w-16 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white" />
                    <span>i</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                {(['+', '-', '*', '/'] as const).map(op => (
                  <button key={op} onClick={() => setCompOp(op)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${compOp === op ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {op}
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
                <div className="text-[10px] text-slate-400">Результат операції z₁ {compOp} z₂</div>
                <div className="text-2xl font-bold text-amber-400 my-1">{complexRes.formatted}</div>
                <div className="text-slate-400 text-[11px]">Модуль |z| = {complexRes.magnitude} | Фаза φ = {complexRes.phaseDeg}°</div>
              </div>
            </div>
          )}

          {/* TAB 27: Loan & Annuity */}
          {activeTab === 'loan' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Сума кредиту</label>
                  <input type="number" value={loanPrincipal} onChange={e => setLoanPrincipal(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Річна ставка (%)</label>
                  <input type="number" value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Термін (місяців)</label>
                  <input type="number" value={loanMonths} onChange={e => setLoanMonths(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Щомісячний платіж</div>
                  <div className="text-lg font-bold text-emerald-400">{loanRes.monthlyPayment} ₴</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Переплата за відсотками</div>
                  <div className="text-lg font-bold text-rose-400">{loanRes.totalInterest} ₴</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Всього до сплати</div>
                  <div className="text-lg font-bold text-amber-400">{loanRes.totalPayment} ₴</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 28: Electricity Cost */}
          {activeTab === 'power' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Потужність (Вт)</label>
                  <input type="number" value={powerWatts} onChange={e => setPowerWatts(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Годин на добу</label>
                  <input type="number" value={powerHours} onChange={e => setPowerHours(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Тариф (₴/кВт·год)</label>
                  <input type="number" value={powerRate} onChange={e => setPowerRate(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">На добу ({powerRes.dailyKWh} кВт)</div>
                  <div className="text-base font-bold text-amber-400">{powerRes.dailyCost} ₴</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">На місяць ({powerRes.monthlyKWh} кВт)</div>
                  <div className="text-base font-bold text-emerald-400">{powerRes.monthlyCost} ₴</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">На рік (365 днів)</div>
                  <div className="text-base font-bold text-cyan-400">{powerRes.yearlyCost} ₴</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 29: Dilution */}
          {activeTab === 'dilution' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Початкова конц. C₁ (%)</label>
                  <input type="number" value={dilC1} onChange={e => setDilC1(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Початковий об'єм V₁ (мл)</label>
                  <input type="number" value={dilV1} onChange={e => setDilV1(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <label className="text-[10px] text-slate-400 block mb-1">Бажана конц. C₂ (%)</label>
                  <input type="number" value={dilC2} onChange={e => setDilC2(Number(e.target.value))} className="w-full p-1 rounded bg-slate-900 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Кінцевий об'єм V₂ = (C₁·V₁)/C₂</div>
                  <div className="text-xl font-bold text-cyan-400">{dilutionRes.requiredV2} мл</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">Додати чистої води</div>
                  <div className="text-xl font-bold text-emerald-400">+{dilutionRes.waterToAdd} мл</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

