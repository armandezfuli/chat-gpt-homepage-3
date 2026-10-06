import { useRef, useState } from "react"

import { HiOutlinePlus } from "react-icons/hi"

import { FaArrowUp } from "react-icons/fa6"

import { LuBrain, LuMic, LuCheck, LuX, LuFileText } from "react-icons/lu"

import useSpeechRecognition from "../../features/speech-to-text/useSpeechRecognition"

function CentralInput() {
    const [message, setMessage] = useState("")

    const [files, setFiles] = useState<File[]>([])

    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const fileInputRef = useRef<HTMLInputElement | null>(null)

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? [])

        const remainingSlots = 5 - files.length

        if (remainingSlots <= 0) {
            event.target.value = ""
            return
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots)

        setFiles((currentFiles) => [...currentFiles, ...filesToAdd])

        event.target.value = ""
    }

    const handleRemoveFile = (index: number) => {
        setFiles((currentFiles) =>
            currentFiles.filter((_, fileIndex) => fileIndex !== index),
        )
    }

    const getFileExtension = (file: File) => {
        const parts = file.name.split(".")

        return parts.length > 1 ? `.${parts.pop()}` : ""
    }

    return (
        <div className="flex flex-col justify-center items-center w-1/2 relative">
            {files.length > 0 && (
                <div className="absolute bottom-full mb-3 left-0 right-0 flex gap-2 overflow-x-auto px-1 pb-1">
                    {files.map((file, index) => {
                        const isImage = file.type.startsWith("image/")

                        return (
                            <div
                                key={`${file.name}-${index}`}
                                className="relative flex-shrink-0 w-28 h-28 overflow-hidden rounded-2xl border border-[#444] bg-[#2a2a2a] shadow-lg">
                                {isImage ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        onClick={() => setSelectedImage(file)}
                                        className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#292929]">
                                        <LuFileText className="text-3xl text-slate-300" />

                                        <span className="text-xs font-medium text-slate-300">
                                            {getFileExtension(file).toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors z-10">
                                    <LuX className="text-sm" />
                                </button>

                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                    <p className="truncate text-xs text-white">
                                        {file.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <input
                type="text"
                value={isRecording ? transcript : message}
                onChange={(event) => {
                    setMessage(event.target.value)
                }}
                className="w-full bg-[#222] placeholder:text-[#999] text-slate-300 px-17 py-4.5 mt-10 pr-54 text-xl rounded-full focus:text-white focus:outline-none"
                placeholder="Ask anything..."
            />

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
            />

            <span
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex justify-center items-center hover:bg-[#444]/80 absolute left-3 top-[70%] transform -translate-y-1/2 rounded-full cursor-pointer">
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

            {/* Fullscreen Image Preview */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 p-6 cursor-zoom-out">
                    <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <LuX className="text-2xl" />
                    </button>

                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt={selectedImage.name}
                        onClick={(event) => event.stopPropagation()}
                        className="max-w-full max-h-full object-contain rounded-lg cursor-default"
                    />
                </div>
            )}
        </div>
    )
}

export default CentralInput
