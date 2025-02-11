import { AboutCandidateType } from "@/types/InterviewData";
import { create } from "zustand";

interface interviewState {
  candidate: AboutCandidateType | null
  setCandidate: (candidate: AboutCandidateType | null) => void
}

const useInterviewStore = create<interviewState>((set) => ({
  candidate: null,
  setCandidate: (candidate) => set({ candidate }),
}));

export default useInterviewStore;
