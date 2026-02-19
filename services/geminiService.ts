
import { GoogleGenAI, Type } from "@google/genai";

/* Fix: Always use the exact environment variable and follow required initialization pattern */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseCitizenData = async (inputText: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse data KTP/Kependudukan berikut menjadi JSON terstruktur: "${inputText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nik: { type: Type.STRING },
          name: { type: Type.STRING },
          pob: { type: Type.STRING, description: "Tempat Lahir" },
          dob: { type: Type.STRING, description: "Tanggal Lahir (YYYY-MM-DD)" },
          gender: { type: Type.STRING, description: "Laki-laki atau Perempuan" },
          religion: { type: Type.STRING },
          maritalStatus: { type: Type.STRING },
          occupation: { type: Type.STRING },
          address: { type: Type.STRING }
        },
        required: ["nik", "name"]
      }
    }
  });

  try {
    /* Fix: Accessed .text property directly as per guidelines */
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const generateLetterContent = async (letterType: string, citizenName: string, purpose: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Buatkan draf isi surat resmi ${letterType} untuk warga bernama ${citizenName} dengan keperluan: ${purpose}. Gunakan bahasa Indonesia formal yang sangat sopan untuk standar administrasi RT/RW. Berikan hanya isi suratnya saja tanpa header/footer berlebihan.`,
    config: {
      temperature: 0.7,
    }
  });
  /* Fix: Accessed .text property directly as per guidelines */
  return response.text;
};

export const getDemographicInsight = async (stats: any) => {
  const ai = getAI();
  /* Fix: Upgraded to gemini-3-pro-preview for complex reasoning task (demographic analysis) */
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Berdasarkan data statistik RT berikut: ${JSON.stringify(stats)}. Berikan 3 poin analisis demografis singkat dan saran untuk pengurus RT (seperti program sosial atau kesehatan yang cocok).`,
  });
  /* Fix: Accessed .text property directly as per guidelines */
  return response.text;
};