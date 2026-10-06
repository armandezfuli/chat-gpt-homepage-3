import { useRef, useState } from "react"

type SpeechRecognitionResultEvent = {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string
            }
        }
    }
}

type SpeechRecognitionInstance = {
    lang: string
    continuous: boolean
    interimResults: boolean

    start: () => void
    stop: () => void

    onstart: (() => void) | null
    onresult: ((event: SpeechRecognitionResultEvent) => void) | null
    onerror: ((event: { error: string }) => void) | null
    onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type SpeechRecognitionWindow = Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
}

function useSpeechRecognition() {
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

    const [transcript, setTranscript] = useState("")
    const [isListening, setIsListening] = useState(false)

    const start = () => {
        const windowWithSpeech = window as SpeechRecognitionWindow

        const SpeechRecognitionAPI =
            windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition

        if (!SpeechRecognitionAPI) {
            console.error("Speech Recognition is not supported in this browser.")
            return
        }

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognitionAPI()

            recognition.lang = "en-US"
            recognition.continuous = false
            recognition.interimResults = false

            recognition.onstart = () => {
                setIsListening(true)
            }

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript

                setTranscript(text)
            }

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error)
                setIsListening(false)
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = recognition
        }

        recognitionRef.current.start()
    }

    const stop = () => {
        recognitionRef.current?.stop()
    }

    return {
        start,
        stop,
        transcript,
        isListening,
    }
}

export default useSpeechRecognition
