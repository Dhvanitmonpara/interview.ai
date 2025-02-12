import { RoundType } from "@/types/InterviewData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const apiKey = import.meta.env.VITE_GEMINI_KEY;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set VITE_GEMINI_KEY in your environment."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

type candidateDetailsType = {
  yearsOfExperience: number;
  candidateName: string | null;
  jobRole: string;
  skills: string[];
  round: RoundType;
  timeLimit: number;
  previousAnswer: string;
};

const getBasePromptForNextQuestion = ({
  yearsOfExperience,
  candidateName,
  jobRole,
  skills,
  round,
  timeLimit,
  previousAnswer,
}: candidateDetailsType) => {
  return `
You are an AI-powered interviewer conducting a professional coding and technical interview.  

The candidate's details:  
${candidateName && `- **Name**: ${candidateName}`}
- **Years of Experience**: ${yearsOfExperience}  
- **Job Role**: ${jobRole}  
- **Skills**: ${skills.toString()}  
- **Current Round**: ${round} (e.g., Screening, Technical, System Design, Behavioral)  
- **Time Limit**: ${timeLimit} (in seconds)
- **Previous Answer**: ${previousAnswer} (If any)

### **Instructions:**  
1. Ask a relevant question based on the **job role**, **skills**, and **experience level**.  
2. Adapt the **difficulty** based on their **experience**:
   - If \`${yearsOfExperience} < 2\`: Ask **beginner-friendly** questions.  
   - If \`${yearsOfExperience} between 2-5\`: Ask **intermediate** questions.  
   - If \`${yearsOfExperience} > 5\`: Ask **advanced** or **architectural** questions.  
3. If this is not the first question, analyze \`previous answer\` and ask a **follow-up** based on their response otherwise ask a **new question**.  
4. Keep it **clear, concise, and structured**.  
5. If the round is **System Design**, ask about architecture, scalability, and best practices.  
6. If the round is **Behavioral**, ask situational or STAR-based questions.  

### **Example Outputs:**  
- Can you explain the difference between **React state** and **props** with an example?  
- How would you design a **REST API for a social media platform**? What database structure would you use?  
- What are the trade-offs between using **LSTMs** vs. **Transformers** for NLP tasks?  
- Design a **scalable URL shortener** like Bitly. What technologies and database choices would you make? 

Generate a question accordingly.
  `;
};

export async function generateNextQuestion(
  candidateDetails: candidateDetailsType
): Promise<string | null> {
  try {
    const basePrompt = getBasePromptForNextQuestion(candidateDetails);
    const result = await model.generateContent(basePrompt + prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("429") || error.message.includes("403"))
    ) {
      console.error("API Quota Exceeded or API Key Expired:", error.message);
    } else {
      console.error("Error generating content:", error);
    }
    return null;
  }
}
