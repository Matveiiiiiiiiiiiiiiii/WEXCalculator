import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Camera,
  BookOpen,
  Palette,
  Calculator,
  Check,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { DeviceMode } from '../types/calculator';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isDark: boolean;
  onSelectDeviceMode?: (mode: DeviceMode) => void;
  currentDeviceMode?: DeviceMode;
  onOpenAiChat?: () => void;
  onOpenPhotoMath?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  lang,
  isDark,
  onSelectDeviceMode,
  currentDeviceMode = 'phone',
  onOpenAiChat,
  onOpenPhotoMath,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  const steps = [
    {
      id: 'welcome',
      title: isUk
        ? 'Ласкаво просимо до WexCalculator!'
        : isEn
        ? 'Welcome to WexCalculator!'
        : 'Добро пожаловать в WexCalculator!',
      badge: isUk ? 'Огляд можливостей' : isEn ? 'Overview' : 'Обзор возможностей',
      icon: Calculator,
      color: 'from-blue-600 to-indigo-600',
      description: isUk
        ? 'Універсальний науковий робочий простір з 7 режимами: звичайний, дроби, інженерний, інтерактивні графіки функцій, програміст, конвертер 100+ одиниць та фінансові розрахунки.'
        : isEn
        ? 'All-in-one scientific workstation with 7 modes: standard, exact fractions, engineering, interactive graphing, programmer, 100+ unit converter, and financial tools.'
        : 'Универсальное научное рабочее пространство с 7 режимами: обычный, дроби, инженерный, интерактивные графики функций, программист, конвертер 100+ единиц и финансы.',
      features: [
        isUk ? '7 режимів калькулятора з формульним рядком' : '7 calculator modes with formula tape',
        isUk ? 'Повний покроковий журнал розвʼязків' : 'Step-by-step derivation history',
        isUk ? '100% офлайн швидкість та нульова затримка' : '100% offline 0ms calculation speed',
      ],
    },
    {
      id: 'device-mode',
      title: isUk
        ? 'Формати: Телефон / Планшет / ПК'
        : isEn
        ? 'Device Modes: Phone / Tablet / PC'
        : 'Форматы: Телефон / Планшет / ПК',
      badge: isUk ? 'За замовчуванням: Телефон' : isEn ? 'Default: Phone' : 'По умолчанию: Телефон',
      icon: Smartphone,
      color: 'from-emerald-600 to-teal-600',
      description: isUk
        ? 'За вашим бажанням калькулятор за замовчуванням оптимізовано під мобільний телефон. Ви можете у будь-який момент перемкнути режим на Планшет або широкий ПК у Налаштуваннях чи на верхній панелі.'
        : isEn
        ? 'By default, the calculator launches in sleek Mobile Phone mode. You can instantly switch between Phone, Tablet, and wide PC layouts via Settings or top bar.'
        : 'По умолчанию калькулятор оптимизирован под мобильный телефон. Вы можете в любой момент переключить режим на Планшет или широкий ПК в Настройках или верхней панели.',
      interactiveDevice: true,
      features: [
        isUk ? '📱 Телефон (430px) — зручний ергономічний мобільний вигляд' : '📱 Phone (430px) — compact mobile reach',
        isUk ? '📟 Планшет (880px) — простора клавіатура та бічний екран' : '📟 Tablet (880px) — wide keypad & side display',
        isUk ? '💻 ПК — класичне віконне оформлення' : '💻 PC — full desktop window',
      ],
    },
    {
      id: 'ai-chat',
      title: isUk
        ? 'WexAI Чат в окремому блоці'
        : isEn
        ? 'WexAI Chat in Dedicated Block'
        : 'WexAI Чат в отдельном блоке',
      badge: isUk ? 'Пишіть ШІ текстом' : isEn ? 'Text AI Assistant' : 'Пишите ИИ текстом',
      icon: MessageSquare,
      color: 'from-purple-600 to-pink-600',
      description: isUk
        ? 'Новий окремий блок діалогу з персональним ШІ-помічником: пишіть задачі текстом, розвʼязуйте рівняння, знаходьте молярні маси чи закони фізики та вставляйте отримані результати прямо в калькулятор!'
        : isEn
        ? 'Dedicated interactive AI assistant block: type any STEM problem, quadratic equation, physics law, or chemistry formula in text, get instant answers, and insert values into the calculator.'
        : 'Новый отдельный блок диалога с персональным ИИ-помощником: пишите задачи текстом, решайте уравнения, находите молярные массы или законы физики и вставляйте ответы прямо в калькулятор!',
      features: [
        isUk ? 'Миттєве розвʼязання за 0 мс без серверів' : 'Instant 0ms offline intelligence without servers',
        isUk ? 'Кнопка «Вставити в калькулятор» для розрахунків' : 'Insert formula or result directly into calculator',
        isUk ? 'Готові швидкі шаблони для фізики, хімії та алгебри' : 'Quick prompts for physics, algebra, chemistry',
      ],
    },
    {
      id: 'photo-scanner',
      title: isUk
        ? 'AI Фото-сканер та лазерна камера'
        : isEn
        ? 'AI Photo-Scanner & Laser Camera'
        : 'AI Фото-сканер и лазерная камера',
      badge: isUk ? 'Окремий блок розвʼязку' : isEn ? 'Isolated Solution Board' : 'Отдельный блок решения',
      icon: Camera,
      color: 'from-amber-500 to-orange-600',
      description: isUk
        ? 'Наведіть камеру на формулу чи задачу в конспекті або завантажте фото: лазерний промінь відсканує текст, а розвʼязок відкриється у виділеному академічному блоці з «Дано», «СІ» та виведенням формул.'
        : isEn
        ? 'Point your camera at handwritten textbook notes: the scanning laser detects the equation, and the solution appears in a dedicated academic notebook board.'
        : 'Наведите камеру на формулу или задачу в тетради: лазерный луч отсканирует текст, а решение откроется в отдельном академическом блоке с «Дано», «СИ» и формулами.',
      features: [
        isUk ? 'Запит дозволу камери з надійним видошукачем HUD' : 'Interactive camera permission with HUD reticle',
        isUk ? 'Зум 1x-5x, ліхтарик та контраст для конспектів' : '1x-5x digital zoom, torch, notebook contrast',
        isUk ? 'Рішення винесено окремо від екрана камери' : 'Clean viewfinder with solutions in dedicated tab',
      ],
    },
    {
      id: 'bank-9000',
      title: isUk
        ? 'Банк 9000+ навчальних задач'
        : isEn
        ? 'Bank of 9,000+ STEM Tasks'
        : 'Банк 9000+ учебных задач',
      badge: isUk ? '20 навчальних модулів' : isEn ? '20 Curriculum Modules' : '20 учебных модулей',
      icon: BookOpen,
      color: 'from-cyan-600 to-blue-700',
      description: isUk
        ? 'Гігантська вбудована база 9000+ задач з фізики, алгебри, планіметрії, тригонометрії, похідних, хімії та фінансів. Миттєвий пошук, фільтрація за класами та покроковий розбір за 0 мс.'
        : isEn
        ? 'Comprehensive built-in bank of 9,000+ curriculum problems across physics, algebra, trigonometry, chemistry, and finance with 0ms offline step-by-step solutions.'
        : 'Огромная встроенная база 9000+ задач по физике, алгебре, геометрии, тригонометрии, химии и финансам с мгновенным поиском и пошаговым разбором за 0 мс.',
      features: [
        isUk ? 'Миттєвий пошук за темою, формулою чи номером' : 'Instant search by keyword, formula, or problem number',
        isUk ? 'Кнопка випадкової задачі для тренування' : 'Random problem picker for exam practice',
        isUk ? 'Швидкі відповіді та бліц-розрахунки' : 'Quick Answers drawer with step-by-step accordion',
      ],
    },
    {
      id: 'customization',
      title: isUk
        ? 'Персоналізація та живий фон'
        : isEn
        ? 'Personalization & Live Ambient'
        : 'Персонализация и живой фон',
      badge: isUk ? '14 стилів оформлення' : isEn ? '14 Visual Themes' : '14 тем оформления',
      icon: Palette,
      color: 'from-violet-600 to-indigo-700',
      description: isUk
        ? 'Обирайте теми Windows 11, macOS Sonoma, Cyberpunk або Retro Win98. Увімкніть динамічний живий фон Aurora чи Matrix та насолоджуйтеся тактильним клацанням механічних клавіш.'
        : isEn
        ? 'Choose between Windows 11, macOS Sonoma, Cyberpunk, or Retro Win98 themes. Enable dynamic live ambient backgrounds (Aurora, Matrix) and satisfying mechanical key click sounds.'
        : 'Выбирайте темы Windows 11, macOS Sonoma, Cyberpunk или Retro Win98. Включите динамичный живой фон Aurora или Matrix и наслаждайтесь щелчками механических клавиш.',
      features: [
        isUk ? '14 адаптивних колірних тем' : '14 adaptive visual themes',
        isUk ? '4 анімовані фони (Aurora, Matrix, Particles, Waves)' : '4 animated live backgrounds',
        isUk ? 'Механічний звук клавіш з регулюванням' : 'Realistic key tap sound effects',
      ],
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('wex_tutorial_seen', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border p-5 sm:p-6 select-none flex flex-col relative overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white shadow-blue-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient color glow */}
        <div
          className={`absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-3xl pointer-events-none transition-all duration-700`}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-inherit/20 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md shadow-blue-500/20`}
            >
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {step.badge}
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <h3 className="font-bold text-base leading-tight mt-0.5">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 py-1 space-y-4 relative z-10">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* Device mode interactive switcher inside tutorial step 2 */}
          {step.interactiveDevice && onSelectDeviceMode && (
            <div
              className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                {isUk ? 'Спробуйте перемкнути формат прямо зараз:' : 'Попробуйте переключить прямо сейчас:'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'phone' as DeviceMode, label: isUk ? 'Телефон' : 'Телефон', icon: Smartphone, tag: 'Default' },
                  { id: 'tablet' as DeviceMode, label: isUk ? 'Планшет' : 'Планшет', icon: Tablet, tag: '880px' },
                  { id: 'pc' as DeviceMode, label: isUk ? 'ПК' : 'ПК', icon: Monitor, tag: 'Full' },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = currentDeviceMode === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectDeviceMode(item.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40'
                          : isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <span className="text-[9px] opacity-70 font-mono">{item.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Features list */}
          <div className="space-y-2">
            {step.features.map((feat, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Quick jump actions if on respective step */}
          {step.id === 'ai-chat' && onOpenAiChat && (
            <button
              onClick={() => {
                handleClose();
                onOpenAiChat();
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUk ? 'Відкрити WexAI Чат зараз' : 'Открыть WexAI Чат сейчас'}</span>
            </button>
          )}

          {step.id === 'photo-scanner' && onOpenPhotoMath && (
            <button
              onClick={() => {
                handleClose();
                onOpenPhotoMath();
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isUk ? 'Спробувати Фото-сканер' : 'Попробовать Фото-сканер'}</span>
            </button>
          )}
        </div>

        {/* Step dots & Navigation */}
        <div className="mt-5 pt-3 border-t border-inherit/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
            />
            <span>{isUk ? 'Більше не показувати' : isEn ? "Don't show again" : 'Больше не показывать'}</span>
          </label>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-blue-500'
                    : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isDark
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isUk ? 'Назад' : isEn ? 'Back' : 'Назад'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>
                {currentStep === steps.length - 1
                  ? isUk
                    ? 'Розпочати!'
                    : isEn
                    ? 'Get Started!'
                    : 'Начать!'
                  : isUk
                  ? 'Далі'
                  : isEn
                  ? 'Next'
                  : 'Далее'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
