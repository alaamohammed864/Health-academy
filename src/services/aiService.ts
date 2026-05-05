import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

const MODEL_NAME = "gemini-3-flash-preview";

export interface LearningPathItem {
  title: string;
  description: string;
  duration: string;
}

export interface LearningPath {
  pathTitle: string;
  summary: string;
  modules: LearningPathItem[];
}

export const aiService = {
  /**
   * Generates a personalized medical learning path based on user interests.
   */
  async generateLearningPath(interests: string): Promise<LearningPath> {
    const prompt = `أنت خبير في التعليم الطبي الرقمي. بناءً على اهتمامات المستخدم التالية: "${interests}"، قم بإنشاء مسار تعليمي مخصص.
    يجب أن يتضمن المسار عنواناً، ملخصاً، و٣-٥ وحدات تعليمية مع الوصف والمدة المقدرة باللغة العربية.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pathTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING }
                },
                required: ["title", "description", "duration"]
              }
            }
          },
          required: ["pathTitle", "summary", "modules"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI response as JSON", e);
      throw new Error("فشل في إنشاء مسار تعليمي مخصص.");
    }
  },

  /**
   * AI Tutor chat function with optional document context.
   */
  async chatWithTutor(message: string, context?: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const systemInstruction = `أنت 'مساعد مدار الصحة الذكي'، خبير في التعليم الطبي والتقنيات الصحية. 
    ${context ? `لديك سياق إضافي من مستند مرفوع: "${context}". استخدم هذا السياق للإجابة بدقة.` : ""}
    ردودك يجب أن تكون مهنية، دقيقة، وباللغة العربية الفصحى. ساعد المستخدمين في فهم المفاهيم الطبية المعقدة، السجلات الصحية، والذكاء الاصطناعي في الطب.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction
      }
    });

    return response.text;
  }
};
