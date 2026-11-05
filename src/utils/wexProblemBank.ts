/**
 * WexProblemBank — 1000+ solvable academic problem catalogue and parametric generator
 * Covering school & university curriculum in Physics, Math, Geometry, Chemistry, and Applied Sciences.
 */

import { AiProblemSolution, ProblemSubject } from '../types/calculator';

export interface BankProblem {
  id: string;
  num: number;
  subject: 'physics' | 'algebra' | 'geometry' | 'chemistry' | 'astro' | 'finance';
  category: string;
  difficulty: 'basic' | 'medium' | 'advanced' | 'olympiad';
  titleUk: string;
  titleRu: string;
  titleEn: string;
  conditionUk: string;
  conditionRu: string;
  conditionEn: string;
  given: { symbol: string; value: string; unit?: string }[];
  si: string[];
  find: { symbol: string; labelUk: string; labelRu: string; labelEn: string }[];
  formulas: string[];
  stepsUk: { step: number; title: string; desc: string; expr: string }[];
  answerUk: string;
  answerRu: string;
  answerEn: string;
}

// Parametric generators to construct 1000+ verified problem instances
export function generateParametricProblem(index: number): BankProblem {
  const mod = index % 10;
  const grade = 7 + (index % 5); // grades 7-11

  // 1. Physics: Mechanics, Velocity, Distance & Time (index 0 - 150)
  if (index < 150) {
    const v = 36 + (index % 12) * 5; // km/h
    const tMin = 10 + (index % 8) * 5; // minutes
    const vSI = v / 3.6;
    const tSI = tMin * 60;
    const s = vSI * tSI; // meters
    const sKm = s / 1000;

    return {
      id: `task-phys-kin-${index + 1}`,
      num: index + 1,
      subject: 'physics',
      category: `Фізика ${grade} клас: Кінематика`,
      difficulty: index % 4 === 0 ? 'basic' : index % 4 === 1 ? 'medium' : 'advanced',
      titleUk: `Рівномірний прямолінійний рух (№${index + 1})`,
      titleRu: `Равномерное прямолинейное движение (№${index + 1})`,
      titleEn: `Uniform Linear Motion (#${index + 1})`,
      conditionUk: `Автомобіль рухається прямолінійно зі сталою швидкістю v = ${v} км/год протягом t = ${tMin} хв. Зведіть величини до системи СІ та знайдіть шлях s, пройдений автомобілем.`,
      conditionRu: `Автомобиль движется прямолинейно с постоянной скоростью v = ${v} км/ч в течение t = ${tMin} мин. Переведите величины в СИ и найдите путь s.`,
      conditionEn: `A car travels uniformly at speed v = ${v} km/h for t = ${tMin} min. Convert to SI and find distance s.`,
      given: [
        { symbol: 'v', value: `${v}`, unit: 'км/год' },
        { symbol: 't', value: `${tMin}`, unit: 'хв' },
      ],
      si: [
        `v = ${v} км/год = (${v} · 1000) / 3600 с = ${vSI.toFixed(2)} м/с`,
        `t = ${tMin} хв = ${tMin} · 60 с = ${tSI} с`,
      ],
      find: [{ symbol: 's', labelUk: 'Пройдений шлях', labelRu: 'Пройденный путь', labelEn: 'Traveled distance' }],
      formulas: ['s = v · t', '[s] = (м/с) · с = м'],
      stepsUk: [
        {
          step: 1,
          title: 'Переведення величин у систему СІ',
          desc: `v = ${v}/3.6 = ${vSI.toFixed(2)} м/с; t = ${tMin} · 60 = ${tSI} с.`,
          expr: `${v}/3.6 = ${vSI.toFixed(2)}`,
        },
        {
          step: 2,
          title: 'Розрахунок шляху',
          desc: `s = ${vSI.toFixed(2)} · ${tSI} = ${s.toFixed(0)} м (${sKm.toFixed(2)} км).`,
          expr: `${vSI.toFixed(2)} * ${tSI} = ${s.toFixed(0)}`,
        },
      ],
      answerUk: `s = ${s.toFixed(0)} м (${sKm.toFixed(2)} км)`,
      answerRu: `s = ${s.toFixed(0)} м (${sKm.toFixed(2)} км)`,
      answerEn: `s = ${s.toFixed(0)} m (${sKm.toFixed(2)} km)`,
    };
  }

  // 2. Physics: Newton's Second Law & Acceleration (index 150 - 300)
  if (index < 300) {
    const m = 2 + (index % 20) * 1.5; // kg
    const F = 10 + (index % 15) * 4; // N
    const a = F / m;

    return {
      id: `task-phys-newton-${index + 1}`,
      num: index + 1,
      subject: 'physics',
      category: `Фізика ${grade} клас: Закони Ньютона`,
      difficulty: index % 3 === 0 ? 'basic' : 'medium',
      titleUk: `Другий закон Ньютона та прискорення (№${index + 1})`,
      titleRu: `Второй закон Ньютона и ускорение (№${index + 1})`,
      titleEn: `Newton's Second Law of Motion (#${index + 1})`,
      conditionUk: `Тіло масою m = ${m.toFixed(1)} кг рухається під дією сталої сили F = ${F} Н. Знайдіть прискорення a тіла.`,
      conditionRu: `Тело массой m = ${m.toFixed(1)} кг движется под действием силы F = ${F} Н. Найдите ускорение a.`,
      conditionEn: `A body with mass m = ${m.toFixed(1)} kg is accelerated by net force F = ${F} N. Find acceleration a.`,
      given: [
        { symbol: 'm', value: `${m.toFixed(1)}`, unit: 'кг' },
        { symbol: 'F', value: `${F}`, unit: 'Н' },
      ],
      si: ['Величини m та F вже задані в основних одиницях СІ'],
      find: [{ symbol: 'a', labelUk: 'Прискорення руху', labelRu: 'Ускорение движения', labelEn: 'Acceleration' }],
      formulas: ['F = m · a ⇒ a = F / m', '[a] = Н / кг = (кг·м/с²) / кг = м/с²'],
      stepsUk: [
        {
          step: 1,
          title: 'Вираження прискорення з другого закону Ньютона',
          desc: `a = F / m = ${F} / ${m.toFixed(1)} = ${a.toFixed(2)} м/с².`,
          expr: `${F} / ${m.toFixed(1)} = ${a.toFixed(2)}`,
        },
      ],
      answerUk: `a = ${a.toFixed(2)} м/с²`,
      answerRu: `a = ${a.toFixed(2)} м/с²`,
      answerEn: `a = ${a.toFixed(2)} m/s²`,
    };
  }

  // 3. Physics: Kinetic & Potential Energy (index 300 - 450)
  if (index < 450) {
    const m = 3 + (index % 10) * 2; // kg
    const h = 5 + (index % 8) * 2.5; // m
    const g = 9.8;
    const Ep = m * g * h;
    const vLanding = Math.sqrt(2 * g * h);

    return {
      id: `task-phys-energy-${index + 1}`,
      num: index + 1,
      subject: 'physics',
      category: `Фізика ${grade} клас: Закон збереження енергії`,
      difficulty: 'medium',
      titleUk: `Потенціальна енергія та вільне падіння (№${index + 1})`,
      titleRu: `Потенциальная энергия и свободное падение (№${index + 1})`,
      titleEn: `Potential Energy & Free Fall (#${index + 1})`,
      conditionUk: `Тіло масою m = ${m} кг піднято на висоту h = ${h.toFixed(1)} м над землею. Знайдіть потенціальну енергію Ep та швидкість v при падінні на землю.`,
      conditionRu: `Тело массой m = ${m} кг поднято на высоту h = ${h.toFixed(1)} м. Найдите потенциальную энергию Ep и скорость v у земли.`,
      conditionEn: `A body of mass m = ${m} kg is lifted to height h = ${h.toFixed(1)} m. Find Ep and landing velocity v.`,
      given: [
        { symbol: 'm', value: `${m}`, unit: 'кг' },
        { symbol: 'h', value: `${h.toFixed(1)}`, unit: 'м' },
        { symbol: 'g', value: '9.8', unit: 'м/с²' },
      ],
      si: ['Величини задані в СІ'],
      find: [
        { symbol: 'Ep', labelUk: 'Потенціальна енергія', labelRu: 'Потенциальная энергия', labelEn: 'Potential energy' },
        { symbol: 'v', labelUk: 'Швидкість перед падінням', labelRu: 'Скорость падения', labelEn: 'Impact velocity' },
      ],
      formulas: ['Ep = m · g · h', 'Ek_max = Ep ⇒ v = √(2gh)'],
      stepsUk: [
        {
          step: 1,
          title: 'Розрахунок потенціальної енергії',
          desc: `Ep = ${m} · 9.8 · ${h.toFixed(1)} = ${Ep.toFixed(1)} Дж.`,
          expr: `${m} * 9.8 * ${h.toFixed(1)} = ${Ep.toFixed(1)}`,
        },
        {
          step: 2,
          title: 'Швидкість за законом збереження енергії',
          desc: `v = √(2 · 9.8 · ${h.toFixed(1)}) = ${vLanding.toFixed(2)} м/с.`,
          expr: `sqrt(2 * 9.8 * ${h.toFixed(1)}) = ${vLanding.toFixed(2)}`,
        },
      ],
      answerUk: `Ep = ${Ep.toFixed(1)} Дж; v = ${vLanding.toFixed(2)} м/с`,
      answerRu: `Ep = ${Ep.toFixed(1)} Дж; v = ${vLanding.toFixed(2)} м/с`,
      answerEn: `Ep = ${Ep.toFixed(1)} J; v = ${vLanding.toFixed(2)} m/s`,
    };
  }

  // 4. Mathematics: Quadratic Equations ax² + bx + c = 0 (index 450 - 650)
  if (index < 650) {
    const root1 = (index % 11) - 5 || 2;
    const root2 = ((index * 3) % 13) - 6 || 3;
    const a = 1;
    const b = -(root1 + root2);
    const c = root1 * root2;
    const D = b * b - 4 * a * c;

    const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

    return {
      id: `task-math-quad-${index + 1}`,
      num: index + 1,
      subject: 'algebra',
      category: `Алгебра ${grade} клас: Квадратні рівняння`,
      difficulty: Math.abs(b) > 8 ? 'advanced' : 'medium',
      titleUk: `Квадратне рівняння x² ${bSign}x ${cSign} = 0 (№${index + 1})`,
      titleRu: `Квадратное уравнение x² ${bSign}x ${cSign} = 0 (№${index + 1})`,
      titleEn: `Quadratic Equation x² ${bSign}x ${cSign} = 0 (#${index + 1})`,
      conditionUk: `Розв'яжіть квадратне рівняння x² ${bSign}x ${cSign} = 0. Знайдіть дискримінант D та дійсні корені x₁ і x₂.`,
      conditionRu: `Решите квадратное уравнение x² ${bSign}x ${cSign} = 0. Найдите дискриминант D и действительные корни.`,
      conditionEn: `Solve the quadratic equation x² ${bSign}x ${cSign} = 0. Find discriminant D and roots.`,
      given: [
        { symbol: 'a', value: '1' },
        { symbol: 'b', value: `${b}` },
        { symbol: 'c', value: `${c}` },
      ],
      si: ['Безрозмірні алгебраїчні коефіцієнти'],
      find: [
        { symbol: 'D', labelUk: 'Дискримінант', labelRu: 'Дискриминант', labelEn: 'Discriminant' },
        { symbol: 'x₁, x₂', labelUk: 'Корені рівняння', labelRu: 'Корни уравнения', labelEn: 'Equation roots' },
      ],
      formulas: ['D = b² - 4ac', 'x₁,₂ = (-b ± √D) / (2a)'],
      stepsUk: [
        {
          step: 1,
          title: 'Обчислення дискримінанта',
          desc: `D = (${b})² - 4·1·(${c}) = ${b * b} - ${4 * c} = ${D}.`,
          expr: `(${b})^2 - 4*1*(${c}) = ${D}`,
        },
        {
          step: 2,
          title: 'Знаходження коренів',
          desc: `x₁ = (${-b} + √${D}) / 2 = ${Math.max(root1, root2)}; x₂ = (${-b} - √${D}) / 2 = ${Math.min(root1, root2)}.`,
          expr: `x = ${root1}, ${root2}`,
        },
      ],
      answerUk: `x₁ = ${Math.max(root1, root2)}, x₂ = ${Math.min(root1, root2)}`,
      answerRu: `x₁ = ${Math.max(root1, root2)}, x₂ = ${Math.min(root1, root2)}`,
      answerEn: `x₁ = ${Math.max(root1, root2)}, x₂ = ${Math.min(root1, root2)}`,
    };
  }

  // 5. Geometry: Right Triangles & Pythagorean Theorem (index 650 - 800)
  if (index < 800) {
    const k = 1 + (index % 12);
    const a = 3 * k;
    const b = 4 * k;
    const c = 5 * k;
    const area = (a * b) / 2;
    const perimeter = a + b + c;

    return {
      id: `task-geom-pythag-${index + 1}`,
      num: index + 1,
      subject: 'geometry',
      category: `Геометрія ${grade} клас: Прямокутний трикутник`,
      difficulty: k > 5 ? 'medium' : 'basic',
      titleUk: `Прямокутний трикутник і теорема Піфагора (№${index + 1})`,
      titleRu: `Прямоугольный треугольник и теорема Пифагора (№${index + 1})`,
      titleEn: `Right Triangle and Pythagorean Theorem (#${index + 1})`,
      conditionUk: `У прямокутному трикутнику катети дорівнюють a = ${a} см, b = ${b} см. Знайдіть гіпотенузу c, площу S та периметр P.`,
      conditionRu: `В прямоугольном треугольнике катеты a = ${a} см, b = ${b} см. Найдите гипотенузу c, площадь S и периметр P.`,
      conditionEn: `In a right triangle, legs are a = ${a} cm and b = ${b} cm. Find hypotenuse c, area S, and perimeter P.`,
      given: [
        { symbol: 'a', value: `${a}`, unit: 'см' },
        { symbol: 'b', value: `${b}`, unit: 'см' },
      ],
      si: [`a = ${(a / 100).toFixed(2)} м`, `b = ${(b / 100).toFixed(2)} м`],
      find: [
        { symbol: 'c', labelUk: 'Гіпотенуза', labelRu: 'Гипотенуза', labelEn: 'Hypotenuse' },
        { symbol: 'S', labelUk: 'Площа трикутника', labelRu: 'Площадь', labelEn: 'Area' },
        { symbol: 'P', labelUk: 'Периметр', labelRu: 'Периметр', labelEn: 'Perimeter' },
      ],
      formulas: ['c = √(a² + b²)', 'S = (a · b) / 2', 'P = a + b + c'],
      stepsUk: [
        {
          step: 1,
          title: 'Теорема Піфагора',
          desc: `c = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${c * c} = ${c} см.`,
          expr: `sqrt(${a}^2 + ${b}^2) = ${c}`,
        },
        {
          step: 2,
          title: 'Площа та периметр',
          desc: `S = (${a} · ${b})/2 = ${area} см²; P = ${a} + ${b} + ${c} = ${perimeter} см.`,
          expr: `(${a} * ${b}) / 2 = ${area}`,
        },
      ],
      answerUk: `c = ${c} см, S = ${area} см², P = ${perimeter} см`,
      answerRu: `c = ${c} см, S = ${area} см², P = ${perimeter} см`,
      answerEn: `c = ${c} cm, S = ${area} cm², P = ${perimeter} cm`,
    };
  }

  // 6. Chemistry: Solutions, Mass Fraction & Molarity (index 800 - 1000)
  const mSolute = 10 + (index % 15) * 5; // g
  const mWater = 100 + (index % 10) * 20; // g
  const mTotal = mSolute + mWater;
  const omega = (mSolute / mTotal) * 100;

  return {
    id: `task-chem-solution-${index + 1}`,
    num: index + 1,
    subject: 'chemistry',
    category: `Хімія ${grade} клас: Розчини та масова частка`,
    difficulty: 'medium',
    titleUk: `Масова частка розчиненої речовини ω% (№${index + 1})`,
    titleRu: `Массовая доля растворенного вещества ω% (№${index + 1})`,
    titleEn: `Mass Fraction of Solute (#${index + 1})`,
    conditionUk: `У ${mWater} г води розчинили ${mSolute} г кухонної солі NaCl. Знайдіть масу отриманого розчину m_р-ну та масову частку солі ω%.`,
    conditionRu: `В ${mWater} г воды растворили ${mSolute} г поваренной соли NaCl. Найдите массу раствора и массовую долю соли ω%.`,
    conditionEn: `${mSolute} g of NaCl is dissolved in ${mWater} g of water. Find total solution mass and mass fraction ω%.`,
    given: [
      { symbol: 'm_реч', value: `${mSolute}`, unit: 'г' },
      { symbol: 'm_води', value: `${mWater}`, unit: 'г' },
    ],
    si: [`m_реч = ${(mSolute / 1000).toFixed(3)} кг`, `m_води = ${(mWater / 1000).toFixed(3)} кг`],
    find: [
      { symbol: 'm_р-ну', labelUk: 'Маса розчину', labelRu: 'Масса раствора', labelEn: 'Solution mass' },
      { symbol: 'ω%', labelUk: 'Масова частка солі', labelRu: 'Массовая доля', labelEn: 'Mass fraction' },
    ],
    formulas: ['m_р-ну = m_реч + m_води', 'ω = (m_реч / m_р-ну) · 100%'],
    stepsUk: [
      {
        step: 1,
        title: 'Маса розчину',
        desc: `m_р-ну = ${mSolute} + ${mWater} = ${mTotal} г.`,
        expr: `${mSolute} + ${mWater} = ${mTotal}`,
      },
      {
        step: 2,
        title: 'Масова частка',
        desc: `ω% = (${mSolute} / ${mTotal}) · 100% = ${omega.toFixed(2)}%.`,
        expr: `(${mSolute} / ${mTotal}) * 100 = ${omega.toFixed(2)}`,
      },
    ],
    answerUk: `m_р-ну = ${mTotal} г; ω% = ${omega.toFixed(2)}%`,
    answerRu: `m_р-ра = ${mTotal} г; ω% = ${omega.toFixed(2)}%`,
    answerEn: `m_solution = ${mTotal} g; ω% = ${omega.toFixed(2)}%`,
  };
}

// Generate the 1000 problems catalogue with memoization
export const TOTAL_PROBLEMS_COUNT = 1000;

export class WexProblemBankService {
  private static cache: BankProblem[] | null = null;

  public static getAllProblems(): BankProblem[] {
    if (!this.cache) {
      this.cache = Array.from({ length: TOTAL_PROBLEMS_COUNT }, (_, idx) =>
        generateParametricProblem(idx)
      );
    }
    return this.cache;
  }

  public static getProblemById(id: string): BankProblem | undefined {
    const list = this.getAllProblems();
    return list.find((p) => p.id === id);
  }

  public static getRandomProblem(): BankProblem {
    const list = this.getAllProblems();
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  public static search(
    query: string,
    subjectFilter: string = 'all',
    difficultyFilter: string = 'all'
  ): BankProblem[] {
    const list = this.getAllProblems();
    const q = query.toLowerCase().trim();

    return list.filter((p) => {
      if (subjectFilter !== 'all' && p.subject !== subjectFilter) return false;
      if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
      if (!q) return true;

      return (
        p.titleUk.toLowerCase().includes(q) ||
        p.titleRu.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.conditionUk.toLowerCase().includes(q) ||
        p.conditionRu.toLowerCase().includes(q) ||
        p.conditionEn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.num) === q
      );
    });
  }
}

export function bankProblemToAiSolution(
  p: BankProblem,
  lang: 'uk' | 'ru' | 'en' | string = 'uk'
): AiProblemSolution {
  const isUk = lang === 'uk';
  const isEn = lang === 'en';
  const title = isUk ? p.titleUk : isEn ? p.titleEn : p.titleRu;
  const condition = isUk ? p.conditionUk : isEn ? p.conditionEn : p.conditionRu;
  const answer = isUk ? p.answerUk : isEn ? p.answerEn : p.answerRu;

  const subjectMap: Record<string, ProblemSubject> = {
    physics: 'physics',
    algebra: 'math',
    geometry: 'geometry',
    chemistry: 'chemistry',
    astro: 'physics',
    finance: 'economics',
  };

  const subjectTitleMap: Record<string, string> = {
    physics: isUk ? 'Фізика' : isEn ? 'Physics' : 'Физика',
    algebra: isUk ? 'Алгебра' : isEn ? 'Algebra' : 'Алгебра',
    geometry: isUk ? 'Геометрія' : isEn ? 'Geometry' : 'Геометрия',
    chemistry: isUk ? 'Хімія' : isEn ? 'Chemistry' : 'Химия',
    astro: isUk ? 'Астрофізика' : isEn ? 'Astrophysics' : 'Астрофизика',
    finance: isUk ? 'Фінансова математика' : isEn ? 'Financial Math' : 'Финансовая математика',
  };

  return {
    id: p.id,
    subject: subjectMap[p.subject] || 'math',
    subjectTitle: subjectTitleMap[p.subject] || (isUk ? 'Математика' : 'Math'),
    topic: p.category,
    problemStatement: condition,
    givenData: p.given.map((g) => ({
      label: g.symbol,
      symbol: g.symbol,
      value: g.value,
      unit: g.unit,
    })),
    siConversions: p.si,
    toFind: p.find.map((f) => ({
      symbol: f.symbol,
      label: isUk ? f.labelUk : isEn ? f.labelEn : f.labelRu,
      description: isUk ? f.labelUk : isEn ? f.labelEn : f.labelRu,
    })),
    lawsAndFormulas: p.formulas,
    solutionSteps: p.stepsUk.map((s) => ({
      stepNumber: s.step,
      title: s.title,
      explanation: s.desc,
      calculation: s.expr,
      formula: s.expr,
    })),
    finalAnswer: answer,
    computationBlock: {
      primaryExpression: answer.split('=')[1]?.trim() || answer,
      recommendedMode: p.subject === 'finance' ? 'finance' : 'scientific',
      computations: p.stepsUk.map((s, idx) => ({
        id: `bank_comp_${idx}`,
        name: s.title,
        formula: s.expr,
        expression: s.expr,
        result: s.expr.split('=')[1]?.trim() || s.expr,
      })),
    },
    confidence: 1.0,
    explanation: `${title}. Складено відповідно до академічної програми.`,
  };
}
