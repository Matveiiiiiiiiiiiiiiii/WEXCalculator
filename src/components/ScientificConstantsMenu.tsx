import React, { useState, useMemo } from 'react';
import {
  SCIENTIFIC_CONSTANTS,
  ScientificConstant,
} from '../utils/scientificConstants';
import { Atom, Search, X, Check, Copy } from 'lucide-react';
import { Language } from '../utils/i18n';

interface ScientificConstantsMenuProps {
  onInsertConstant: (value: string | number, symbol: string) => void;
  lang: Language;
  isDark: boolean;
  osTheme: 'windows' | 'macos';
}

type CategoryFilter = 'all' | 'fundamental' | 'atomic' | 'thermo' | 'electromagnetism' | 'astro';

export const ScientificConstantsMenu: React.FC<ScientificConstantsMenuProps> = ({
  onInsertConstant,
  lang,
  isDark,
  osTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: isUk ? 'Всі (31)' : isEn ? 'All (31)' : 'Все (31)' },
    { id: 'fundamental', label: isUk ? 'Фундаментальні' : isEn ? 'Fundamental' : 'Фундаментальные' },
    { id: 'atomic', label: isUk ? 'Атом & Ядро' : isEn ? 'Atomic & Nuclear' : 'Атом и Ядро' },
    { id: 'thermo', label: isUk ? 'Термодинаміка' : isEn ? 'Thermodynamics' : 'Термодинамика' },
    { id: 'electromagnetism', label: isUk ? 'Електромагнетизм' : isEn ? 'Electromagnetism' : 'Электромагнетизм' },
    { id: 'astro', label: isUk ? 'Астрономія' : isEn ? 'Astronomy' : 'Астрономия' },
  ];

  const filtered = useMemo(() => {
    let list = SCIENTIFIC_CONSTANTS;
    if (category !== 'all') {
      list = list.filter((c) => c.category === category);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (c) =>
          c.symbol.toLowerCase().includes(q) ||
          c.nameUk.toLowerCase().includes(q) ||
          c.nameRu.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  const handleCopy = (e: React.MouseEvent, c: ScientificConstant) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(c.valueStr);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleInsert = (c: ScientificConstant) => {
    onInsertConstant(c.valueStr, c.symbol);
    setIsOpen(false);
  };

  // Quick primary constants displayed on the sub-menu toolbar
  const quickConstants = [
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'c')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'G')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'Na')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'h')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'kB')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'e')!,
    SCIENTIFIC_CONSTANTS.find((c) => c.id === 'g')!,
  ].filter(Boolean);

  const roundedClass = osTheme === 'macos' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className="w-full">
      {/* Scientific Constants Sub-menu Bar */}
      <div
        className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-xl border text-xs ${
          isDark
            ? 'bg-slate-900/70 border-slate-700/60 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none flex-1">
          <span className="font-semibold text-[11px] text-blue-400 shrink-0 flex items-center gap-1 pl-1">
            <Atom className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isUk ? 'Константи:' : isEn ? 'Constants:' : 'Константы:'}
            </span>
          </span>

          {quickConstants.map((c) => (
            <button
              key={c.id}
              onClick={() => onInsertConstant(c.valueStr, c.symbol)}
              title={`${isUk ? c.nameUk : isEn ? c.nameEn : c.nameRu} = ${c.valueStr} ${c.unit}`}
              className={`px-2 py-1 text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${roundedClass} ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-200 border border-slate-700/50'
                  : 'bg-white hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-200 shadow-2xs'
              }`}
            >
              {c.symbol}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className={`px-2.5 py-1 text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${roundedClass} ${
            isDark
              ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
              : 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200'
          }`}
          title={isUk ? 'Відкрити всі наукові константи' : isEn ? 'Open all scientific constants' : 'Открыть все научные константы'}
        >
          <span>{isUk ? 'Всі константи ▾' : isEn ? 'All Constants ▾' : 'Все константы ▾'}</span>
        </button>
      </div>

      {/* Expanded Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border p-4 sm:p-5 flex flex-col ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-inherit/30 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Atom className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {isUk ? 'Наукові та фізичні константи' : isEn ? 'Scientific & Physical Constants' : 'Научные и физические константы'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isUk
                      ? 'Вставка точних значень у калькулятор одним кліком'
                      : isEn
                      ? 'Insert verified exact values into WexCalculator display with 1 click'
                      : 'Вставка точных значений в калькулятор одним кликом'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category Pills */}
            <div className="space-y-2 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    isUk
                      ? 'Пошук за символом, назвою чи одиницею (c, G, Na, Дж/К)...'
                      : isEn
                      ? 'Search by symbol, name, or unit (c, G, Na, J/K)...'
                      : 'Поиск по символу, названию или единице (c, G, Na, Дж/К)...'
                  }
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      category === cat.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of constants */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filtered.map((c) => {
                const isCopied = copiedId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleInsert(c)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isDark
                        ? 'bg-slate-800/40 hover:bg-slate-800/90 border-slate-700/60 hover:border-blue-500/60'
                        : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-blue-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                        {c.symbol}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            {isUk ? c.nameUk : isEn ? c.nameEn : c.nameRu}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 font-mono shrink-0">
                            {c.unit}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {isUk ? c.descriptionUk : isEn ? c.descriptionEn : c.descriptionRu}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-slate-500/10">
                        {c.valueStr}
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, c)}
                        className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isCopied ? 'Скопійовано' : 'Копіювати значення'}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  {isUk ? 'Констант не знайдено' : isEn ? 'No constants found' : 'Констант не найдено'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
