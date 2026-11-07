import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  CornerDownLeft,
  ArrowRight,
  BookOpen,
  Zap,
  Code,
  Calculator,
  ChevronDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { WexAIEngine, WexAISolution } from '../utils/wexAI';
import { AiProblemSolution, CalculatorMode } from '../types/calculator';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  solution?: WexAISolution;
  academicSolution?: AiProblemSolution;
  primaryExpression?: string;
  primaryResult?: string;
  recommendedMode?: CalculatorMode;
  error?: boolean;
}

interface AiChatBlockProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isDark: boolean;
  onInsertToCalculator: (expr: string, mode?: CalculatorMode) => void;
  onOpenAcademicBoard?: (sol: AiProblemSolution) => void;
}

export const AiChatBlock: React.FC<AiChatBlockProps> = ({
  isOpen,
  onClose,
  lang,
  isDark,
  onInsertToCalculator,
  onOpenAcademicBoard,
}) => {
  const isUk = lang === 'uk';
  const isEn = lang === 'en';

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome-msg',
    sender: 'assistant',
    text: isUk
      ? 'Привіт! Я ваш персональний WexAI асистент. Напишіть мені будь-яку математичну, фізичну чи хімічну задачу, рівняння чи формулу. Я розвʼяжу її покроково за 0 мс та допоможу перенести розрахунки в калькулятор.'
      : isEn
      ? 'Hello! I am your personal WexAI assistant. Ask me any math, physics, or chemistry problem, equation, or formula. I will provide step-by-step reasoning instantly and help you insert values into the calculator.'
      : 'Привет! Я ваш персональный WexAI ассистент. Напишите мне любую математическую, физическую или химическую задачу, уравнение или формулу. Я решу её пошагово за 0 мс и помогу вставить вычисления в калькулятор.',
    timestamp: Date.now(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('wex_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [defaultWelcomeMessage];
  });

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Save messages in localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('wex_ai_chat_history', JSON.stringify(messages.slice(-30)));
      }
    } catch {
      // ignore
    }
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const quickPrompts = [
    { label: '⚡ 2x² - 5x + 2 = 0', prompt: 'Розвʼяжи квадратне рівняння: 2x^2 - 5x + 2 = 0' },
    { label: '🚗 v = 72 км/год, t = 15 хв, s = ?', prompt: 'Автомобіль рухається зі швидкістю 72 км/год протягом 15 хвилин. Знайди шлях s.' },
    { label: '💧 Молярна маса H₂SO₄', prompt: 'Знайди молярну масу та кількість речовини для H2SO4' },
    { label: '📐 Катети 6 і 8', prompt: 'Прямокутний трикутник з катетами 6 і 8. Знайди гіпотенузу та площу.' },
    { label: '🥧 Спростити 24/36', prompt: 'Спростити дріб 24/36 і знайти десятковий дріб' },
    { label: '💰 Кредит 100 000 грн', prompt: 'Розрахуй аннуїтетний кредит 100000 під 14% річних на 24 місяці' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isProcessing) return;

    const userMsgId = 'usr_' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // 1. Solve with deterministic 0ms offline WexAI first
      const langCode = lang === 'uk' ? 'uk' : lang === 'en' ? 'en' : 'ru';
      const offlineSol = WexAIEngine.solve(text, langCode);
      const academicSol = WexAIEngine.toAcademicSolution(offlineSol, text);

      // 2. Try online API call if it's an open-ended question or for enriched response
      let botResponseText = '';
      let serverEnriched: any = null;

      try {
        const response = await fetch('/api/solve-problem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemText: text,
            lang: langCode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            serverEnriched = data;
          }
        }
      } catch {
        // Offline / server unavailable - continue with 0ms offline solution
      }

      const activeSolution = serverEnriched || academicSol;
      const primaryExpr = activeSolution.computationBlock?.primaryExpression || offlineSol.calcSteps[0]?.expression || offlineSol.answer;
      const primaryRes = activeSolution.finalAnswer || offlineSol.answer;

      // Construct a pleasant explanatory text
      botResponseText = isUk
        ? `Розвʼязано: ${activeSolution.topic || offlineSol.title}\nВідповідь: ${activeSolution.finalAnswer || offlineSol.answer}`
        : isEn
        ? `Solved: ${activeSolution.topic || offlineSol.title}\nAnswer: ${activeSolution.finalAnswer || offlineSol.answer}`
        : `Решено: ${activeSolution.topic || offlineSol.title}\nОтвет: ${activeSolution.finalAnswer || offlineSol.answer}`;

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: botResponseText,
        timestamp: Date.now(),
        solution: offlineSol,
        academicSolution: activeSolution,
        primaryExpression: primaryExpr,
        primaryResult: primaryRes,
        recommendedMode: activeSolution.computationBlock?.recommendedMode || 'scientific',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'bot_err_' + Date.now(),
        sender: 'assistant',
        text: isUk
          ? `Виникла помилка під час обробки: ${err?.message || 'Спробуйте переформулювати'}`
          : `Error during processing: ${err?.message || 'Please retry'}`,
        timestamp: Date.now(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    let copyText = msg.text;
    if (msg.academicSolution) {
      const s = msg.academicSolution;
      copyText = `[${s.subjectTitle}] ${s.topic}\nУмова: ${s.problemStatement}\nВідповідь: ${s.finalAnswer}`;
    }
    navigator.clipboard.writeText(copyText);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = msg.academicSolution
      ? `${msg.academicSolution.problemStatement}. Відповідь: ${msg.academicSolution.finalAnswer}`
      : msg.text;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'uk' ? 'uk-UA' : lang === 'en' ? 'en-US' : 'ru-RU';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    setMessages([defaultWelcomeMessage]);
    localStorage.removeItem('wex_ai_chat_history');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl h-[92vh] max-h-[820px] rounded-3xl shadow-2xl border flex flex-col select-none relative overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white shadow-purple-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-inherit/20 shrink-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  WexAI Чат
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  0ms Offline + Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isUk
                  ? 'Пишіть задачі, формули та отримуйте покрокові розвʼязки'
                  : 'Задавайте вопросы и получайте пошаговые решения'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
              title={isUk ? 'Очистити історію' : 'Очистить историю'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-b border-inherit/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-slate-500/5">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            {isUk ? 'Швидко:' : 'Быстро:'}
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 hover:bg-purple-600/20 hover:border-purple-500 text-slate-300'
                  : 'bg-white border-slate-200 hover:bg-purple-50 hover:border-purple-400 text-slate-700'
              }`}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const sol = msg.solution;
            const acad = msg.academicSolution;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 shadow-sm relative ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isDark
                      ? 'bg-slate-800/90 border border-slate-700 text-slate-100 rounded-tl-none'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  {/* User message */}
                  {isUser ? (
                    <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-text font-medium">
                      {msg.text}
                    </div>
                  ) : (
                    /* Assistant message with rich academic / calculation block */
                    <div className="space-y-3">
                      {/* Topic & Confidence Badge */}
                      {acad && (
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-inherit/20">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400 shrink-0">
                              {acad.subjectTitle || sol?.subject}
                            </span>
                            <span className="text-xs font-bold truncate">
                              {acad.topic || sol?.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                            WexAI 100%
                          </span>
                        </div>
                      )}

                      {/* Formulas & Step Summary */}
                      {acad && acad.solutionSteps && acad.solutionSteps.length > 0 && (
                        <div className="space-y-1.5 text-xs">
                          {acad.solutionSteps.slice(0, 3).map((st) => (
                            <div
                              key={st.stepNumber}
                              className={`p-2 rounded-xl border text-[11px] ${
                                isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="font-semibold text-blue-400 mb-0.5">
                                #{st.stepNumber} {st.title}
                              </div>
                              <div className="text-slate-300">{st.explanation}</div>
                              {st.calculation && (
                                <div className="font-mono text-emerald-400 mt-1 select-text">
                                  {st.calculation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Final Answer Banner */}
                      {acad && acad.finalAnswer && (
                        <div
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            isDark
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-500 block">
                              {isUk ? 'Відповідь:' : 'Ответ:'}
                            </span>
                            <span className="font-bold text-sm select-text">
                              {acad.finalAnswer}
                            </span>
                          </div>

                          {/* Quick Insert into Calculator Button */}
                          <button
                            onClick={() => {
                              const targetVal =
                                acad.computationBlock?.primaryExpression ||
                                acad.finalAnswer.replace(/[^0-9.,\-+*/()^]/g, '') ||
                                '0';
                              onInsertToCalculator(targetVal, msg.recommendedMode);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                            title={isUk ? 'Вставити значення в калькулятор' : 'Вставить в калькулятор'}
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>{isUk ? 'В калькулятор' : 'В калькулятор'}</span>
                          </button>
                        </div>
                      )}

                      {/* Plain text if no rich solution */}
                      {!acad && (
                        <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-text">
                          {msg.text}
                        </div>
                      )}

                      {/* Bottom action toolbar */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-inherit/10">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(msg)}
                            className={`p-1.5 rounded-md hover:text-blue-400 transition-colors flex items-center gap-1 ${
                              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
                            }`}
                            title="Копіювати"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleSpeak(msg)}
                            className={`p-1.5 rounded-md hover:text-blue-400 transition-colors flex items-center gap-1 ${
                              speakingId === msg.id ? 'text-blue-400' : ''
                            } ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                            title="Озвучити"
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {acad && onOpenAcademicBoard && (
                            <button
                              onClick={() => {
                                onOpenAcademicBoard(acad);
                                onClose();
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                                isDark
                                  ? 'hover:bg-slate-700 text-purple-300'
                                  : 'hover:bg-slate-200 text-purple-700'
                              }`}
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{isUk ? 'Повний зошит' : 'Тетрадь разбора'}</span>
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] opacity-60">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3 items-center text-xs text-purple-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
              </div>
              <span>
                {isUk
                  ? 'WexAI розвʼязує задачу та виводить формули...'
                  : 'WexAI решает задачу и выводит формулы...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-inherit/20 shrink-0 bg-slate-500/5 relative z-10">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isUk
                  ? 'Напишіть формулу чи задачу (наприклад: 3x^2 - 6x + 2 = 0 або m=4кг v=10м/с)...'
                  : 'Напишите формулу или задачу (например: 3x^2 - 6x + 2 = 0 или m=4кг v=10м/с)...'
              }
              className={`flex-1 p-3 rounded-2xl border text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isProcessing}
              className={`p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transition-all cursor-pointer flex items-center justify-center ${
                !inputValue.trim() || isProcessing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-purple-500 hover:to-pink-500 active:scale-95'
              }`}
              title="Надіслати (Enter)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>
              {isUk
                ? 'Натисніть Enter для відправки, Shift+Enter для нового рядка'
                : 'Нажмите Enter для отправки, Shift+Enter для новой строки'}
            </span>
            <span className="font-mono text-purple-400">
              WexAI Personal Offline Core
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
