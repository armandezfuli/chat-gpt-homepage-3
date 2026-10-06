import { useEffect, useState } from "react"

import { HiOutlinePlus } from "react-icons/hi"
import { FaArrowUp } from "react-icons/fa6"
import { LuBrain, LuMic } from "react-icons/lu"

import useSpeechRecognition from "../../features/speech-to-text/useSpeechRecognition"

function CentralInput() {
    const [message, setMessage] = useState("")

    const { start, stop, transcript, isListening } = useSpeechRecognition()

    useEffect(() => {
        if (transcript) {
            setMessage(transcript)
        }
    }, [transcript])

    return (
        <div className="flex flex-col justify-center items-center w-1/2 relative">
            <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full bg-[#222] placeholder:text-[#999] text-slate-300 px-17 py-4.5 mt-10 text-xl rounded-full focus:text-white focus:outline-none"
                placeholder="Ask anything..."
            />

            <span className="w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute left-3 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                <HiOutlinePlus className="text-2xl" />
            </span>

            <span className="w-12 h-12 flex justify-center items-center bg-[#2c67c5] hover:bg-[#2c67c5]/50 absolute right-2 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                <FaArrowUp className="text-xl" />
            </span>

            <span
                onClick={isListening ? stop : start}
                className={`w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute right-16 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer ${
                    isListening ? "bg-[#444]" : ""
                }`}>
                <LuMic className="text-2xl" />
            </span>

            <span className="w-26 h-10 px-3 flex text-xl justify-between text-slate-300 items-center hover:bg-[#444]/80 absolute right-26 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
                <LuBrain className="text-2xl" />
                Think
            </span>
        </div>
    )
}

export default CentralInput
