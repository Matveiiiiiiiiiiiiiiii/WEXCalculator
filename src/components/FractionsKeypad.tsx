import React, { useState, useEffect, useRef } from 'react';
import {
  FractionOperator,
  calculateFractionsWithSteps,
  simplifyFraction,
  toMixed,
  decimalToFraction,
  evaluateFractionStringWithSteps,
} from '../utils/fractionEngine';
import { CalculationRecord } from '../types/calculator';
import { ArrowLeftRight, Check, Sparkles, RefreshCw, Delete, Hash, AlignLeft, Info } from 'lucide-react';

interface FractionsKeypadProps {
  onAddRecord: (record: CalculationRecord) => void;
  triggerSound: (type: 'click' | 'operator' | 'equals' | 'clear' | 'error') => void;
  isDark: boolean;
  accentClass: string;
}

type FractionField = 'f1Whole' | 'f1Num' | 'f1Den' | 'f2Whole' | 'f2Num' | 'f2Den';

export const FractionsKeypad: React.FC<FractionsKeypadProps> = ({
  onAddRecord,
  triggerSound,
  isDark,
  accentClass,
}) => {
  // Input mode: 'blocks' (visual fraction slots) or 'expression' (free-form typed text)
  const [entryMode, setEntryMode] = useState<'blocks' | 'expression'>('blocks');

  // First fraction
  const [f1Whole, setF1Whole] = useState<string>('');
  const [f1Num, setF1Num] = useState<string>('3');
  const [f1Den, setF1Den] = useState<string>('4');

  // Operator
  const [op, setOp] = useState<FractionOperator>('+');

  // Second fraction
  const [f2Whole, setF2Whole] = useState<string>('');
  const [f2Num, setF2Num] = useState<string>('2');
  const [f2Den, setF2Den] = useState<string>('5');

  // Free-form expression bar input
  const [expressionInput, setExpressionInput] = useState<string>('3/4 + 2/5');

  // Active field in blocks mode
  const [activeField, setActiveField] = useState<FractionField>('f1Num');

  // Decimal to fraction helper input
  const [showDecimalTool, setShowDecimalTool] = useState(false);
  const [decimalInput, setDecimalInput] = useState('0.625');
  const [decimalResult, setDecimalResult] = useState<string | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Quick live result preview
  const [lastResult, setLastResult] = useState<{
    mixed: string;
    improper: string;
    decimal: number;
    expression: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize expression input when blocks change
  useEffect(() => {
    if (entryMode === 'blocks') {
      const f1Str = f1Whole ? `${f1Whole} ${f1Num || '0'}/${f1Den || '1'}` : `${f1Num || '0'}/${f1Den || '1'}`;
      const f2Str = f2Whole ? `${f2Whole} ${f2Num || '0'}/${f2Den || '1'}` : `${f2Num || '0'}/${f2Den || '1'}`;
      setExpressionInput(`${f1Str} ${op} ${f2Str}`);
    }
  }, [f1Whole, f1Num, f1Den, op, f2Whole, f2Num, f2Den, entryMode]);

  // Handle global keyboard typing when this view is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focused in another external input
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'frac-active-input' && target.id !== 'frac-expr-input') {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        cycleField(e.shiftKey ? -1 : 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (entryMode === 'blocks') {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          handleDigit(e.key);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleBackspace();
        } else if (['+', '-', '*', '/'].includes(e.key)) {
          e.preventDefault();
          const opMap: Record<string, FractionOperator> = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
          };
          setOp(opMap[e.key]);
          triggerSound('operator');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeField, entryMode, f1Whole, f1Num, f1Den, op, f2Whole, f2Num, f2Den, expressionInput]);

  const cycleField = (direction: 1 | -1 = 1) => {
    const fields: FractionField[] = ['f1Whole', 'f1Num', 'f1Den', 'f2Whole', 'f2Num', 'f2Den'];
    const curIdx = fields.indexOf(activeField);
    const nextIdx = (curIdx + direction + fields.length) % fields.length;
    setActiveField(fields[nextIdx]);
    triggerSound('click');
  };

  const calculate = () => {
    if (entryMode === 'expression') {
      // Calculate from free-form expression
      const evalRes = evaluateFractionStringWithSteps(expressionInput);
      if (evalRes.error) {
        triggerSound('error');
        setStatusMessage(evalRes.error);
        return;
      }

      triggerSound('equals');
      setStatusMessage(null);
      const mixedStr = evalRes.mixedResult || evalRes.resultText;
      const impStr = evalRes.improperResult || evalRes.resultText;
      const decVal = evalRes.decimalResult ?? evalRes.rawResult;

      setLastResult({
        mixed: mixedStr,
        improper: impStr,
        decimal: decVal,
        expression: expressionInput,
      });

      const newRecord: CalculationRecord = {
        id: `frac-${Date.now()}`,
        timestamp: Date.now(),
        expression: expressionInput,
        result: `${mixedStr} (≈ ${decVal.toFixed(4)})`,
        rawResult: decVal,
        steps: evalRes.steps,
        mode: 'fractions',
        note: 'Вычисление дробей',
      };
      onAddRecord(newRecord);
      return;
    }

    // Calculate from block state
    const d1 = parseInt(f1Den, 10);
    const d2 = parseInt(f2Den, 10);

    if (d1 === 0 || d2 === 0) {
      triggerSound('error');
      setStatusMessage('Знаменатель не может быть равен 0');
      return;
    }

    const f1 = {
      whole: f1Whole ? parseInt(f1Whole, 10) : undefined,
      n: parseInt(f1Num, 10) || 0,
      d: d1 || 1,
    };
    const f2 = {
      whole: f2Whole ? parseInt(f2Whole, 10) : undefined,
      n: parseInt(f2Num, 10) || 0,
      d: d2 || 1,
    };

    const res = calculateFractionsWithSteps(f1, op, f2);

    if (res.error) {
      triggerSound('error');
      setStatusMessage(res.error);
      return;
    }

    triggerSound('equals');
    setStatusMessage(null);

    const f1Str = f1.whole ? `${f1.whole} ${f1.n}/${f1.d}` : `${f1.n}/${f1.d}`;
    const f2Str = f2.whole ? `${f2.whole} ${f2.n}/${f2.d}` : `${f2.n}/${f2.d}`;
    const fullExpr = `${f1Str} ${op} ${f2Str}`;

    setLastResult({
      mixed: res.mixedResult,
      improper: res.improperResult,
      decimal: res.decimalResult,
      expression: fullExpr,
    });

    const newRecord: CalculationRecord = {
      id: `frac-${Date.now()}`,
      timestamp: Date.now(),
      expression: fullExpr,
      result: `${res.mixedResult} (≈ ${res.decimalResult.toFixed(4)})`,
      rawResult: res.decimalResult,
      steps: res.steps,
      mode: 'fractions',
      note: 'Дроби',
    };

    onAddRecord(newRecord);
  };

  const handleDigit = (digit: string) => {
    triggerSound('click');
    const setters: Record<FractionField, React.Dispatch<React.SetStateAction<string>>> = {
      f1Whole: setF1Whole,
      f1Num: setF1Num,
      f1Den: setF1Den,
      f2Whole: setF2Whole,
      f2Num: setF2Num,
      f2Den: setF2Den,
    };

    const setter = setters[activeField];
    setter((prev) => {
      if (prev === '0' || prev === '') return digit;
      if (prev.length >= 7) return prev;
      return prev + digit;
    });
  };

  const handleInputChange = (field: FractionField, val: string) => {
    // Only allow positive numbers
    const cleaned = val.replace(/[^0-9]/g, '');
    const setters: Record<FractionField, React.Dispatch<React.SetStateAction<string>>> = {
      f1Whole: setF1Whole,
      f1Num: setF1Num,
      f1Den: setF1Den,
      f2Whole: setF2Whole,
      f2Num: setF2Num,
      f2Den: setF2Den,
    };
    setters[field](cleaned);
  };

  const handleBackspace = () => {
    triggerSound('click');
    const setters: Record<FractionField, React.Dispatch<React.SetStateAction<string>>> = {
      f1Whole: setF1Whole,
      f1Num: setF1Num,
      f1Den: setF1Den,
      f2Whole: setF2Whole,
      f2Num: setF2Num,
      f2Den: setF2Den,
    };
    const setter = setters[activeField];
    setter((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
  };

  const handleClear = () => {
    triggerSound('clear');
    setF1Whole('');
    setF1Num('');
    setF1Den('');
    setF2Whole('');
    setF2Num('');
    setF2Den('');
    setExpressionInput('');
    setLastResult(null);
    setStatusMessage(null);
  };

  const swapFractions = () => {
    triggerSound('click');
    const tempWhole = f1Whole;
    const tempNum = f1Num;
    const tempDen = f1Den;

    setF1Whole(f2Whole);
    setF1Num(f2Num);
    setF1Den(f2Den);

    setF2Whole(tempWhole);
    setF2Num(tempNum);
    setF2Den(tempDen);
  };

  const setPresetFraction = (w: string, n: string, d: string, target: 'f1' | 'f2') => {
    triggerSound('click');
    if (target === 'f1') {
      setF1Whole(w);
      setF1Num(n);
      setF1Den(d);
    } else {
      setF2Whole(w);
      setF2Num(n);
      setF2Den(d);
    }
  };

  const handleConvertDecimal = () => {
    const val = parseFloat(decimalInput.replace(',', '.'));
    if (Number.isNaN(val)) {
      setDecimalResult('Некорректное число');
      return;
    }
    const frac = decimalToFraction(val);
    const mixed = toMixed(frac.n, frac.d);
    const mixedText = mixed.whole !== 0 && mixed.n !== 0 ? `${mixed.whole} ${mixed.n}/${mixed.d}` : `${frac.n}/${frac.d}`;
    setDecimalResult(`${mixedText} (${frac.n}/${frac.d})`);
    triggerSound('equals');
  };

  const applyDecimalToFraction = () => {
    const val = parseFloat(decimalInput.replace(',', '.'));
    if (!Number.isNaN(val)) {
      const frac = decimalToFraction(val);
      const mixed = toMixed(frac.n, frac.d);
      if (activeField.startsWith('f1')) {
        setF1Whole(mixed.whole !== 0 ? mixed.whole.toString() : '');
        setF1Num(mixed.n.toString());
        setF1Den(mixed.d.toString());
      } else {
        setF2Whole(mixed.whole !== 0 ? mixed.whole.toString() : '');
        setF2Num(mixed.n.toString());
        setF2Den(mixed.d.toString());
      }
      setShowDecimalTool(false);
      triggerSound('click');
    }
  };

  const inputClass = (field: FractionField) =>
    `text-center font-mono font-bold rounded-lg transition-all focus:outline-hidden ${
      activeField === field
        ? 'ring-2 ring-blue-500 bg-blue-500/15 text-blue-400 font-extrabold shadow-inner'
        : isDark
        ? 'bg-slate-800/90 hover:bg-slate-700/80 text-white border border-slate-700/60'
        : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 shadow-xs'
    }`;

  const btnClass = `h-10 sm:h-11 rounded-lg font-semibold text-sm flex items-center justify-center select-none transition-all active:scale-95 cursor-pointer ${
    isDark
      ? 'bg-slate-800 hover:bg-slate-700/90 text-white border border-slate-700/40'
      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs'
  }`;

  return (
    <div ref={containerRef} className="p-2 sm:p-4 space-y-3 max-w-full overflow-hidden">
      {/* Top Header Mode Toggle & Actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-500/15 text-xs font-medium">
          <button
            onClick={() => setEntryMode('blocks')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              entryMode === 'blocks'
                ? isDark
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-blue-600 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Блоки дробей</span>
          </button>
          <button
            onClick={() => setEntryMode('expression')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              entryMode === 'expression'
                ? isDark
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-blue-600 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Строка записи</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={swapFractions}
            className={`px-2 py-1 text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
            title="Поменять дроби местами"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Поменять</span>
          </button>
          <button
            onClick={() => setShowDecimalTool(!showDecimalTool)}
            className={`px-2 py-1 text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              showDecimalTool
                ? 'bg-amber-600 text-white font-bold'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
            }`}
            title="Перевод десятичной дроби в обыкновенную"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">0.5 ➔ 1/2</span>
          </button>
        </div>
      </div>

      {/* Decimal to Fraction Helper Drawer */}
      {showDecimalTool && (
        <div
          className={`p-3 rounded-xl border text-xs space-y-2 animate-in fade-in slide-in-from-top-2 ${
            isDark ? 'bg-slate-900/90 border-amber-500/40 text-slate-200' : 'bg-amber-50/90 border-amber-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span>Преобразование десятичной дроби</span>
            <button onClick={() => setShowDecimalTool(false)} className="text-slate-400 hover:text-slate-200">
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="e.g. 0.625"
              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-sm ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <button
              onClick={handleConvertDecimal}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Перевести
            </button>
            {decimalResult && (
              <button
                onClick={applyDecimalToFraction}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                title="Вставить в выбранную дробь"
              >
                Вставить
              </button>
            )}
          </div>
          {decimalResult && (
            <div className="font-mono font-bold text-sm text-emerald-400 pt-1">
              Результат: {decimalResult}
            </div>
          )}
        </div>
      )}

      {/* Main Fraction Input Area */}
      <div
        className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center transition-colors relative ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {entryMode === 'expression' ? (
          /* Free-form typed expression bar */
          <div className="w-full space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Введите формулу дробей (например, <span className="font-mono text-blue-400">1 3/4 + 2 1/6</span> или <span className="font-mono text-blue-400">5/8 * 3/4</span>):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="frac-expr-input"
                type="text"
                value={expressionInput}
                onChange={(e) => setExpressionInput(e.target.value)}
                placeholder="1 3/4 + 2 1/6"
                className={`w-full px-3 py-2.5 rounded-xl border font-mono text-base font-bold shadow-inner ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={calculate}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer shrink-0"
              >
                = Решить
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Fraction Blocks with Real Editable Inputs */
          <div className="flex items-center justify-center gap-2 sm:gap-4 select-none flex-wrap">
            {/* Fraction 1 */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <input
                id="frac-active-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={f1Whole}
                placeholder="Целое"
                onFocus={() => setActiveField('f1Whole')}
                onChange={(e) => handleInputChange('f1Whole', e.target.value)}
                className={`w-12 sm:w-14 h-12 text-sm sm:text-base ${inputClass('f1Whole')}`}
                title="Целая часть первой дроби"
              />
              <div className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={f1Num}
                  placeholder="Числ"
                  onFocus={() => setActiveField('f1Num')}
                  onChange={(e) => handleInputChange('f1Num', e.target.value)}
                  className={`w-12 sm:w-14 h-8 text-xs sm:text-sm ${inputClass('f1Num')}`}
                  title="Числитель первой дроби"
                />
                <div className="w-12 sm:w-14 h-0.5 bg-slate-400 rounded-full" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={f1Den}
                  placeholder="Знам"
                  onFocus={() => setActiveField('f1Den')}
                  onChange={(e) => handleInputChange('f1Den', e.target.value)}
                  className={`w-12 sm:w-14 h-8 text-xs sm:text-sm ${inputClass('f1Den')}`}
                  title="Знаменатель первой дроби"
                />
              </div>
            </div>

            {/* Operator Buttons */}
            <div className="grid grid-cols-2 gap-1 shrink-0">
              {(['+', '−', '×', '÷'] as FractionOperator[]).map((operator) => (
                <button
                  key={operator}
                  onClick={() => {
                    setOp(operator);
                    triggerSound('operator');
                  }}
                  className={`w-7 sm:w-8 h-7 sm:h-8 rounded-md font-bold text-sm sm:text-base transition-colors cursor-pointer ${
                    op === operator
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border'
                  }`}
                >
                  {operator}
                </button>
              ))}
            </div>

            {/* Fraction 2 */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={f2Whole}
                placeholder="Целое"
                onFocus={() => setActiveField('f2Whole')}
                onChange={(e) => handleInputChange('f2Whole', e.target.value)}
                className={`w-12 sm:w-14 h-12 text-sm sm:text-base ${inputClass('f2Whole')}`}
                title="Целая часть второй дроби"
              />
              <div className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={f2Num}
                  placeholder="Числ"
                  onFocus={() => setActiveField('f2Num')}
                  onChange={(e) => handleInputChange('f2Num', e.target.value)}
                  className={`w-12 sm:w-14 h-8 text-xs sm:text-sm ${inputClass('f2Num')}`}
                  title="Числитель второй дроби"
                />
                <div className="w-12 sm:w-14 h-0.5 bg-slate-400 rounded-full" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={f2Den}
                  placeholder="Знам"
                  onFocus={() => setActiveField('f2Den')}
                  onChange={(e) => handleInputChange('f2Den', e.target.value)}
                  className={`w-12 sm:w-14 h-8 text-xs sm:text-sm ${inputClass('f2Den')}`}
                  title="Знаменатель второй дроби"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status error message */}
        {statusMessage && (
          <div className="mt-2 text-rose-400 font-semibold text-xs flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Live / Last Result Banner */}
        {lastResult && (
          <div className="mt-3 pt-2.5 border-t border-slate-700/40 w-full flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="text-slate-400">{lastResult.expression} =</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono font-bold text-base sm:text-lg text-emerald-400">
                {lastResult.mixed}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                ({lastResult.improper} ≈ {lastResult.decimal.toFixed(4)})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Fractions Preset Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Пресеты:</span>
        {[
          { label: '1/2', w: '', n: '1', d: '2' },
          { label: '1/3', w: '', n: '1', d: '3' },
          { label: '2/3', w: '', n: '2', d: '3' },
          { label: '1/4', w: '', n: '1', d: '4' },
          { label: '3/4', w: '', n: '3', d: '4' },
          { label: '5/8', w: '', n: '5', d: '8' },
          { label: '1 1/2', w: '1', n: '1', d: '2' },
          { label: '2 1/4', w: '2', n: '1', d: '4' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (activeField.startsWith('f1')) {
                setPresetFraction(item.w, item.n, item.d, 'f1');
              } else {
                setPresetFraction(item.w, item.n, item.d, 'f2');
              }
            }}
            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0 transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Touch & Click Numerical Keypad */}
      <div className="grid grid-cols-4 gap-1.5">
        <button onClick={() => handleDigit('7')} className={btnClass}>7</button>
        <button onClick={() => handleDigit('8')} className={btnClass}>8</button>
        <button onClick={() => handleDigit('9')} className={btnClass}>9</button>
        <button onClick={handleBackspace} className={`${btnClass} text-rose-400`} title="Стереть символ">⌫</button>

        <button onClick={() => handleDigit('4')} className={btnClass}>4</button>
        <button onClick={() => handleDigit('5')} className={btnClass}>5</button>
        <button onClick={() => handleDigit('6')} className={btnClass}>6</button>
        <button onClick={handleClear} className={`${btnClass} text-amber-400 font-bold`} title="Очистить всё">C</button>

        <button onClick={() => handleDigit('1')} className={btnClass}>1</button>
        <button onClick={() => handleDigit('2')} className={btnClass}>2</button>
        <button onClick={() => handleDigit('3')} className={btnClass}>3</button>
        <button
          onClick={() => cycleField(1)}
          className={`${btnClass} text-xs text-blue-400 font-bold`}
          title="Перейти к следующему полю (Tab)"
        >
          Tab ➔
        </button>

        <button onClick={() => handleDigit('0')} className={btnClass}>0</button>
        <button
          onClick={() => {
            // Simplify current fraction
            const n = parseInt(activeField.startsWith('f1') ? f1Num : f2Num, 10) || 0;
            const d = parseInt(activeField.startsWith('f1') ? f1Den : f2Den, 10) || 1;
            const simp = simplifyFraction(n, d);
            if (activeField.startsWith('f1')) {
              setF1Num(simp.n.toString());
              setF1Den(simp.d.toString());
            } else {
              setF2Num(simp.n.toString());
              setF2Den(simp.d.toString());
            }
            triggerSound('click');
          }}
          className={`${btnClass} text-xs text-emerald-400 font-bold`}
          title="Сократить выбранную дробь"
        >
          Сократить
        </button>
        <button
          onClick={calculate}
          className={`col-span-2 ${btnClass} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-sm sm:text-base shadow-md`}
        >
          = Решить с шагами
        </button>
      </div>
    </div>
  );
};
