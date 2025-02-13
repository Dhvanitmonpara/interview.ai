import "regenerator-runtime/runtime";
import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Module-level variable to store transcripts by question index.
export const previousTranscriptions: Record<number, string> = {};

export function useAutoSpeechRecognizer(questionAnswerIndex: number) {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const prevQuestionAnswerIndex = useRef<number | null>(null);
  // Ref to store the latest transcript value
  const transcriptRef = useRef<string>(transcript);

  // Update transcriptRef whenever transcript changes.
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Start listening once on mount.
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    console.log("Starting speech recognition");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    // Cleanup: stop listening on unmount.
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  // When the question changes, store the previous transcript and reset.
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    console.log("Question changed, storing transcript");

    // If a previous question exists, store its transcript using our ref.
    if (prevQuestionAnswerIndex.current !== null) {
      previousTranscriptions[prevQuestionAnswerIndex.current] = transcriptRef.current;
      console.log(
        `Stored transcript for question ${prevQuestionAnswerIndex.current}: ${transcriptRef.current}`
      );
    }

    // Reset transcript for the new question.
    resetTranscript();

    // Update our ref to the current question index.
    prevQuestionAnswerIndex.current = questionAnswerIndex;
  }, [questionAnswerIndex, browserSupportsSpeechRecognition, resetTranscript]);

  return { transcript };
}
