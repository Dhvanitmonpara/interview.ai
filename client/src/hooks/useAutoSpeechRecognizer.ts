import "regenerator-runtime/runtime";
import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Module-level variable to store transcripts by question index.
export const previousTranscriptions: Record<number, string> = {};

export function useAutoSpeechRecognizer(questionAnswerIndex: number) {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const prevQuestionAnswerIndex = useRef<number | null>(null);

  // Start listening once on mount.
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    // Start listening continuously.
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    // Cleanup: stop listening on unmount.
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  // When the question changes, store the previous transcript and reset.
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    // If there's a previous question, store its transcript.
    if (prevQuestionAnswerIndex.current !== null) {
      previousTranscriptions[prevQuestionAnswerIndex.current] = transcript;
      console.log(
        `Stored transcript for question ${prevQuestionAnswerIndex.current}: ${transcript}`
      );
    }
    // Reset transcript for the new question.
    resetTranscript();
    // Update our ref to the current question index.
    prevQuestionAnswerIndex.current = questionAnswerIndex;
  }, [questionAnswerIndex, browserSupportsSpeechRecognition, transcript, resetTranscript]);

  return { transcript };
}
