import { useState } from "react"

import SpeechRecognition, {
    useSpeechRecognition as useSpeechRecognitionLibrary,
} from "react-speech-recognition"

function useSpeechRecognition() {
    const [isRecordingMode, setIsRecordingMode] = useState(false)

    const {
        transcript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        resetTranscript,
    } = useSpeechRecognitionLibrary({
        clearTranscriptOnListen: true,
    })

    const start = async () => {
        setIsRecordingMode(true)

        await SpeechRecognition.startListening({
            continuous: true,
            language: "fa-IR",
        })
    }

    const cancel = async () => {
        await SpeechRecognition.abortListening()

        resetTranscript()
        setIsRecordingMode(false)
    }

    const confirm = async () => {
        await SpeechRecognition.stopListening()

        setIsRecordingMode(false)
    }

    return {
        transcript,
        isRecording: isRecordingMode,
        start,
        cancel,
        confirm,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
    }
}

export default useSpeechRecognition
