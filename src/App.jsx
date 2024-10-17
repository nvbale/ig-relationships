import { useState } from "react"
import ZipUpload from "./ZipUpload"
import './index.css'
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Instagram Follow Checker
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition duration-300"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </header>
          <ZipUpload />
        </div>
      </div>
    </div>
  )
}

export default App
