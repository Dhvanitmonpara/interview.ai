import { AboutCandidateType, QuestionAnswerType } from "@/types/InterviewData";
import { create } from "zustand";

interface interviewState {
  questionAnswerSets: QuestionAnswerType[] | null
  candidate: AboutCandidateType | null
  addQuestionAnswerSet: (questionAnswerSet: QuestionAnswerType) => void
  setQuestionAnswerSets: (questionAnswerSets: QuestionAnswerType[] | null) => void
  setCandidate: (candidate: AboutCandidateType | null) => void
}

const useInterviewStore = create<interviewState>((set) => ({
  questionAnswerSets: null,
  candidate: null,
  addQuestionAnswerSet: (questionAnswerSet) => set((state) => ({ questionAnswerSets: [...(state.questionAnswerSets || []), questionAnswerSet] })),
  setQuestionAnswerSets: (questionAnswerSets) => set({ questionAnswerSets }),
  setCandidate: (candidate) => set({ candidate }),
}));

export default useInterviewStore;
