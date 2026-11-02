import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpressionWithSteps } from '../src/utils/calculatorEngine.ts';
import { evaluateFractionStringWithSteps } from '../src/utils/fractionEngine.ts';
import { convertUnitsWithSteps } from '../src/utils/converterEngine.ts';
import { getTranslation, localizeSeedText } from '../src/utils/i18n.ts';

test('evaluateExpressionWithSteps correctly calculates basic arithmetic', () => {
  const res = evaluateExpressionWithSteps('(250 + 150) * 4 - 300', 'DEG');
  assert.equal(res.result, 1300);
  assert.equal(res.error, undefined);
  assert.ok(res.steps.length > 0);
});

test('evaluateExpressionWithSteps handles trigonometry in DEG', () => {
  const res = evaluateExpressionWithSteps('sin(90)', 'DEG');
  assert.equal(Math.round(res.result * 1000) / 1000, 1);
});

test('evaluateFractionStringWithSteps correctly adds mixed fractions', () => {
  const res = evaluateFractionStringWithSteps('1 3/4 + 2 1/6');
  assert.ok(res.resultText.includes('3 11/12'));
  assert.ok(res.rawResult > 3.91 && res.rawResult < 3.92);
  assert.equal(res.steps.length, 5);
});

test('convertUnitsWithSteps converts meters to feet accurately', () => {
  const res = convertUnitsWithSteps('length', 'm', 'ft', 10);
  assert.ok(res.result > 32.8 && res.result < 32.9);
  assert.ok(res.formattedResult.includes('32.808'));
});

test('i18n returns authentic Ukrainian translations for solutions and empty state', () => {
  assert.equal(getTranslation('allSolutions', 'uk'), 'Усі розвʼязки');
  assert.equal(getTranslation('noSolutionsYet', 'uk'), 'Ще немає обчислень');
  assert.equal(getTranslation('trySamples', 'uk'), 'Спробувати приклади:');
  assert.equal(getTranslation('aiProblemSolver', 'uk'), 'ШІ Розвʼязання задач з фото');
});

test('localizeSeedText correctly translates seed notes and steps into Ukrainian and English', () => {
  assert.equal(localizeSeedText('Сложение дробей', 'uk'), 'Додавання дробів');
  assert.equal(localizeSeedText('Сложение дробей', 'en'), 'Addition of fractions');
  assert.equal(localizeSeedText('Теорема Пифагора', 'uk'), 'Теорема Піфагора');
  assert.equal(localizeSeedText('Вычисление выражения в скобках', 'uk'), 'Обчислення виразу в дужках');
});

test('brand name VexCalculator is never translated into Cyrillic', () => {
  assert.equal(getTranslation('appTitle', 'uk'), 'VexCalculator');
  assert.equal(getTranslation('appTitle', 'ru'), 'VexCalculator');
  assert.equal(getTranslation('appTitle', 'en'), 'VexCalculator');
  assert.equal(getTranslation('appTitle', 'es'), 'VexCalculator');
  assert.equal(getTranslation('appTitle', 'de'), 'VexCalculator');
});

test('academic notebook layout keys (Дано, СІ, Знайти, Розв\'язання) exist and are accurate', () => {
  assert.equal(getTranslation('givenLabel', 'uk'), 'Дано');
  assert.equal(getTranslation('toFindLabel', 'uk'), 'Знайти');
  assert.equal(getTranslation('solutionLabel', 'uk'), "Розв'язання");
  assert.ok(getTranslation('siLabel', 'uk').startsWith('СІ'));
  assert.equal(getTranslation('lawsAndFormulasLabel', 'uk'), 'Закони та формули');

  assert.equal(getTranslation('givenLabel', 'ru'), 'Дано');
  assert.equal(getTranslation('toFindLabel', 'ru'), 'Найти');
  assert.equal(getTranslation('solutionLabel', 'ru'), 'Решение');
  assert.ok(getTranslation('siLabel', 'ru').startsWith('СИ'));

  // Multi-input problem solving keys
  assert.ok(getTranslation('textProblemTab', 'uk'));
  assert.ok(getTranslation('solveTextProblemBtn', 'uk'));
  assert.ok(getTranslation('retryBtn', 'uk'));
  assert.ok(getTranslation('textProblemTab', 'ru'));
  assert.ok(getTranslation('retryBtn', 'ru'));
});
