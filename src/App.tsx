import CentralInput from "./components/CentralInput/CentralInput"

function App() {
    return (
        <div className="w-full">
            <div className="w-full flex flex-col justify-center items-center mt-80">
                <h1 className="text-3xl">Good to see you, arman.</h1>
                <div className="w-full flex justify-center items-center">
                    <CentralInput />
                </div>
            </div>
        </div>
    )
}
export default App
