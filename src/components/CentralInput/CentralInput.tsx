import { useState } from "react"

import { HiOutlinePlus } from "react-icons/hi"
import { FaArrowUp } from "react-icons/fa6"
import { LuBrain, LuMic, LuCheck, LuX } from "react-icons/lu"

import useSpeechRecognition from "../../features/speech-to-text/useSpeechRecognition"

function CentralInput() {
    const [message, setMessage] = useState("")

    const {
        start,
        cancel,
        confirm,
        transcript,
        isRecording,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
    } = useSpeechRecognition()

    const handleConfirmSpeech = async () => {
        if (transcript.trim()) {
            setMessage(transcript)
        }

        await confirm()
    }

    const handleCancelSpeech = async () => {
        await cancel()
    }

    const handleStartSpeech = async () => {
        if (!browserSupportsSpeechRecognition) {
            console.error("Speech recognition is not supported in this browser.")
            return
        }

        if (isMicrophoneAvailable === false) {
            console.error("Microphone permission is not available.")
            return
        }

        await start()
    }

    return (
        <div className="flex flex-col justify-center items-center w-1/2 relative">
            <input
                type="text"
                value={isRecording ? transcript : message}
                onChange={(event) => {
                    setMessage(event.target.value)
                }}
                className="w-full bg-[#222] placeholder:text-[#999] text-slate-300 px-17 py-4.5 mt-10 pr-54 text-xl rounded-full focus:text-white focus:outline-none"
                placeholder="Ask anything..."
            />

            <span className="w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute left-3 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                <HiOutlinePlus className="text-2xl" />
            </span>

            {isRecording ? (
                <>
                    <span
                        onClick={handleCancelSpeech}
                        className="w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute right-16 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                        <LuX className="text-2xl" />
                    </span>

                    <span
                        onClick={handleConfirmSpeech}
                        className="w-12 h-12 flex justify-center items-center bg-[#2c67c5] hover:bg-[#2c67c5]/50 absolute right-2 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                        <LuCheck className="text-xl" />
                    </span>
                </>
            ) : (
                <>
                    <span className="w-12 h-12 flex justify-center items-center bg-[#2c67c5] hover:bg-[#2c67c5]/50 absolute right-2 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                        <FaArrowUp className="text-xl" />
                    </span>

                    <span
                        onClick={handleStartSpeech}
                        className="w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute right-16 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                        <LuMic className="text-2xl" />
                    </span>

                    <span className="w-26 h-10 px-3 flex text-xl justify-between text-slate-300 items-center hover:bg-[#444]/80 absolute right-26 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                        <LuBrain className="text-2xl" />
                        Think
                    </span>
                </>
            )}
        </div>
    )
}

export default CentralInput
