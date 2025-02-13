import { QuestionAnswerType, RoundType } from "@/types/InterviewData";
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

const getBasePromptForQuestionFeedback = (candidateDetails: candidateDetailsType, questionAnswerSets: QuestionAnswerType[]) => {
  return `
You are an expert interview feedback generator. You are provided with a candidate's detailed profile and a series of interview question sets along with the candidate's answers. Your task is to analyze the candidate's responses and generate actionable feedback.

For each question set, produce an object with the following structure:
- **feedback**: A string summarizing the overall quality of the candidate's answer, including strengths and weaknesses.
- **improvements**: An array of objects, where each object includes:
  - **measure**: A specific improvement recommendation (e.g., "Improve clarity in your explanations", "Provide more concrete examples").
  - **skill**: The related skill or area that needs improvement (e.g., "communication", "technical knowledge", "problem solving").

The final output should be an array of these objects, one for each question set.

**Input Data Structure:**

- **Candidate Details:**  ${JSON.stringify(candidateDetails)}

- **Question Sets:**  ${JSON.stringify(questionAnswerSets)}

**Example Output Format:**
[
  {
    "feedback": "Your answer to the first question was detailed but lacked a clear structure. You explained the technical details well but could benefit from providing a concise summary at the end.",
    "improvements": [
      {
        "measure": "Structure your answers with a brief summary and then dive into details.",
        "skill": "communication"
      },
      {
        "measure": "Practice summarizing complex topics in simple terms.",
        "skill": "clarity"
      }
    ]
  },
  {
    "feedback": "The second answer demonstrated strong problem-solving skills, but you missed providing concrete examples to back your claims.",
    "improvements": [
      {
        "measure": "Include real-world examples to support your problem-solving approach.",
        "skill": "analytical skills"
      }
    ]
  }
]
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

export async function generateFeedback(
  candidateDetails: candidateDetailsType,
  questionAnswerSets: QuestionAnswerType[]
): Promise<string | null> {
  try {
    const basePrompt = getBasePromptForQuestionFeedback(candidateDetails, questionAnswerSets);
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
