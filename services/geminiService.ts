
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Suggest a program structure based on context
  async suggestProgramStructure(context: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `بصفتك مستشاراً في "مختبرات الإبداع" لمكافحة الهجرة غير النظامية، صمم هيكلاً لبرنامج يهدف لتحويل "ثقافة اليأس" إلى "ثقافة الاحتمال". السياق: ${context}. 
      يجب أن تركز في ردك على: الربط بين الموارد المحلية والمهارات الرقمية، وخلق "ذاكرة حية للمكان". استخدم لغة الوثيقة الرسمية (اقتصاد المعنى، التمكين الرمزي).`,
      config: { temperature: 0.7 }
    });
    return response.text;
  }

  // Plan a podcast episode based on a topic
  async planPodcastEpisode(topic: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `خطط لحلقة بودكاست إبداعية حول الموضوع التالي: ${topic}. 
      اتبع الهيكلة الكلاسيكية:
      1. المقدمة (دقيقة): جذب الانتباه وبيان الأهمية.
      2. التطوير: جوهر المحتوى (مقابلات، سرد، تحليل) مع الحفاظ على إيقاع متوازن.
      3. الخاتمة (دقيقة): تلخيص ودعوة للعمل (Call to Action).
      اجعل النبرة متعاطفة، محفزة، وبعيدة عن الخطاب "الأخلاقوي" المتعالي كما تنصح الوثيقة.`,
      config: { temperature: 0.8 }
    });
    return response.text;
  }

  // Generate a strategic communication plan for cultural projects
  async generateCommunicationPlan(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `صمم خطة تواصل استراتيجية للمشروع التالي: ${prompt}. 
      ركز على: القيمة المضافة للمشروع، القنوات الرقمية المقترحة، والرسائل المفتاحية التي تستهدف الشباب للحد من الهجرة غير النظامية عبر تعزيز الانتماء المحلي. استخدم لغة مهنية تتماشى مع "اقتصاد المعنى" والتمكين الرمزي.`,
      config: { temperature: 0.7 }
    });
    return response.text;
  }

  // Generate a detailed creative circuit itinerary
  async generateCircuitItinerary(theme: string, location: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `صمم مساراً سياحياً إبداعياً في منطقة "${location}" تحت شعار "${theme}". 
      يجب أن يشمل المسار 3 إلى 5 نقاط اهتمام تجمع بين التراث المحلي والتكنولوجيا الحديثة (مثل الواقع المعزز)، مع التركيز على خلق تجربة غامرة للزائر تدعم الاقتصاد المحلي وتثمن المعارف التقليدية.`,
      config: { temperature: 0.7 }
    });
    return response.text;
  }
}

export const geminiService = new GeminiService();
