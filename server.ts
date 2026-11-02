import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI server client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Photo Math Recognition Endpoint
// Photo Math Recognition Endpoint
app.post('/api/recognize-math', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const modelName = 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `You are an expert mathematical OCR and equation solver.
Analyze this image carefully to extract the handwritten or printed mathematical expression or problem.
Rules:
1. Return clean, standardized expression readable by a calculator (use standard arithmetic operators: +, -, *, /, ^, sqrt(), parentheses).
2. For fractions, format as "a/b" or "w a/b" (e.g. "3/4" or "1 1/2").
3. Determine mode: "standard" for normal arithmetic, "fractions" for fraction operations, "scientific" for trigonometry/roots/powers, or "finance" for financial receipts/percentages.
4. Output JSON matching the schema.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expression: {
              type: Type.STRING,
              description: 'The clean mathematical expression extracted from the image',
            },
            mode: {
              type: Type.STRING,
              description: 'One of standard, fractions, scientific, programmer, or finance',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0 and 1',
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief explanation of what was detected',
            },
          },
          required: ['expression', 'mode'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (err: unknown) {
    console.error('Error in /api/recognize-math:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error during recognition',
    });
  }
});

// Comprehensive AI Multidisciplinary Problem Solver with dedicated Computation Block
// Comprehensive AI Multidisciplinary Problem Solver with dedicated Computation Block
app.post('/api/solve-problem', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', lang = 'uk', promptText, problemText } = req.body;
    if (!imageBase64 && !problemText && !promptText) {
      return res.status(400).json({ success: false, error: 'Потрібно надати зображення або текст задачі' });
    }

    const systemPrompt = `You are a world-class AI STEM and multidisciplinary problem solver and academic tutor.
The user has photographed, uploaded an image of, or typed a problem, question, formula, or exercise from ANY discipline:
- Mathematics & Algebra (arithmetic, fractions, equations, systems of equations, trigonometry, calculus, matrices, probability)
- Physics (mechanics, kinematics, dynamics, statics, energy, thermodynamics, electricity, optics, nuclear, quantum)
- Chemistry (stoichiometry, solutions, molar mass, chemical equations, gas laws, pH, concentrations, thermochemistry)
- Geometry (planimetry, stereometry, areas, volumes, coordinate geometry, vectors, Pythagorean theorem, trigonometry)
- Economics & Finance (interest rates, compound interest, loans, inflation, profits, elasticity, NPV, payback period)
- Biology (genetics, population dynamics, bioenergetics, Hardy-Weinberg equilibrium)
- Computer Science & Logic (number bases, binary, hex, bitwise operations, algorithms, Big-O, data size)
- Any other school, university, or Olympiad STEM subject

Vision & Problem Processing Instructions:
1. If an image is provided:
   - Handle handwriting, printed textbooks, whiteboard notes, screen photos, perspective distortion, or shadow gradients.
   - Accurately disambiguate 'x' (variable) vs '×' (multiply), '0' vs 'O', '1' vs 'l' / '|', '+' vs 't', '2' vs 'Z', '5' vs 'S'.
2. If text is provided:
   - Solve the exact user-provided task faithfully and comprehensively.
3. Transcribe the problem statement faithfully into language "${lang}".

CRITICAL ACADEMIC NOTEBOOK FORMAT (ОФОРМЛЕННЯ ЗАДАЧІ):
You MUST structure the solution using the classic, rigorous academic format:
1. "ДАНО" (givenData): List each given parameter with standard physical/algebraic symbol (e.g. 'm', 'v0', 't', 'a', 'a, b, c'), descriptive label in "${lang}", formatted value with units (e.g. '4 кг', '54 км/год'), and raw numeric value.
2. "СІ" (siConversions): If any values need unit conversions to standard SI units (e.g., '54 км/год = 15 м/с', '15 хв = 900 с', '500 г = 0.5 кг', '20 см = 0.2 м'), provide them explicitly. If all units are already SI or dimensionless, leave empty array.
3. "ЗНАЙТИ" (toFind): List each target unknown quantity to find with standard notation ending in question mark (e.g., "Ek — ?", "A — ?", "x₁, x₂ — ?", "S — ?") and its description in "${lang}".
4. "ЗАКОНИ ТА ФОРМУЛИ" (lawsAndFormulas): List the key theoretical laws or equations used (e.g., "Ek = (m · v²) / 2", "A = ΔEk = -Ek", "D = b² - 4ac", "x = (-b ± √D)/(2a)").
5. "РОЗВ'ЯЗОК / РОЗВ'ЯЗАННЯ" (solutionSteps):
   - Derivation of the target variable in symbolic form (виведення формули).
   - Step-by-step substitution of numerical values with units.
   - Result calculation and dimensional check (перевірка розмірності, e.g. [Ek] = кг · (м/с)² = Дж).
6. "ВІДПОВІДЬ" (finalAnswer): Clear, concise final answer with correct units.
7. "БЛОК ОБЧИСЛЕНЬ" (computationBlock):
   - 'primaryExpression': The single most important formula or arithmetic expression ready to be fed into the calculator (e.g., "(4 * 15^2) / 2" or "sqrt(9^2 + 12^2)" or "(-(-6) + sqrt((-6)^2 - 4*1*8)) / (2*1)").
   - 'recommendedMode': 'standard' | 'scientific' | 'fractions' | 'finance' | 'graphs'.
   - 'computations': Array of individual calculation steps:
     - 'name': Descriptive name of the calculation in language "${lang}"
     - 'formula': Algebraic formula
     - 'expression': Formula with substituted numbers
     - 'result': Numeric result
     - 'unit': Measurement unit (e.g., 'м/с', 'Дж', 'г/моль', '%', 'см²')
   - 'graphSuggestion': If applicable, an equation f(x) for the Graphing mode (e.g., "x^2 - 6*x + 8" or "4 * x^2 / 2" or ""), otherwise empty string.

Respond in language code "${lang}".
Always return valid JSON according to the schema.`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const textParts = [
      systemPrompt,
      problemText ? `\n\n--- TEXT TASK PROVIDED BY USER ---\n${problemText}` : '',
      promptText ? `\n\n--- ADDITIONAL USER NOTE OR HINT ---\n${promptText}` : '',
    ].filter(Boolean).join('\n');

    parts.push({ text: textParts });

    const contents = { parts };

    // Fallback chain across available models to withstand 503 high demand spikes
    const CANDIDATE_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let responseText: string | null = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subject: {
                  type: Type.STRING,
                  description: 'One of math, physics, chemistry, geometry, economics, biology, cs, other',
                },
                subjectTitle: {
                  type: Type.STRING,
                  description: 'Localized subject name in language ' + lang,
                },
                topic: {
                  type: Type.STRING,
                  description: 'Specific topic or theorem',
                },
                problemStatement: {
                  type: Type.STRING,
                  description: 'Clear transcript or statement of the problem',
                },
                givenData: {
                  type: Type.ARRAY,
                  description: 'ДАНО: List of given parameters with symbols and units',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      symbol: { type: Type.STRING, description: 'Variable notation e.g. m, v, s' },
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                      raw: { type: Type.STRING },
                      unit: { type: Type.STRING },
                    },
                    required: ['label', 'value'],
                  },
                },
                siConversions: {
                  type: Type.ARRAY,
                  description: 'СІ: Unit conversions to standard SI units',
                  items: { type: Type.STRING },
                },
                toFind: {
                  type: Type.ARRAY,
                  description: 'ЗНАЙТИ: List of target unknowns with question marks',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      symbol: { type: Type.STRING, description: 'e.g. Ek — ? or a — ?' },
                      description: { type: Type.STRING },
                    },
                    required: ['symbol'],
                  },
                },
                lawsAndFormulas: {
                  type: Type.ARRAY,
                  description: 'Theoretical formulas and laws used',
                  items: { type: Type.STRING },
                },
                solutionSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      formula: { type: Type.STRING },
                      calculation: { type: Type.STRING },
                      unitCheck: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'title', 'explanation'],
                  },
                },
                finalAnswer: {
                  type: Type.STRING,
                  description: 'Final concise answer with units',
                },
                computationBlock: {
                  type: Type.OBJECT,
                  properties: {
                    primaryExpression: { type: Type.STRING },
                    recommendedMode: { type: Type.STRING },
                    computations: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          formula: { type: Type.STRING },
                          expression: { type: Type.STRING },
                          result: { type: Type.STRING },
                          unit: { type: Type.STRING },
                        },
                        required: ['name', 'formula', 'expression', 'result'],
                      },
                    },
                    graphSuggestion: { type: Type.STRING },
                  },
                  required: ['primaryExpression', 'recommendedMode', 'computations'],
                },
                confidence: {
                  type: Type.NUMBER,
                },
              },
              required: [
                'subject',
                'subjectTitle',
                'topic',
                'problemStatement',
                'solutionSteps',
                'finalAnswer',
                'computationBlock',
              ],
            },
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate:`, err?.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error('All model candidates failed to solve the problem');
    }

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (err: unknown) {
    console.error('Error in /api/solve-problem:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error during problem solving',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
