import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import WordDetector from './components/WordDetector'
import SavedWordsList from './components/SavedWordsList'
import { useState } from 'react'

function App() {
  // Danh sách từ đã lưu (demo: ["a","b","c","d"])
  const [savedWords, _setSavedWords] = useState<string[]>(["a", "b", "c", "d"]);
  const [showListPage, setShowListPage] = useState(false);

  return (
    <div className="bg-gradient-blue min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full min-h-[340px] bg-white rounded-2xl shadow-lg overflow-hidden">
        <Header />
        <main className="pt-14 pb-10 px-5 font-poppins">
          {showListPage
            ? <SavedWordsList savedWords={savedWords} onBack={() => setShowListPage(false)} />
            : <WordDetector onShowList={() => setShowListPage(true)} />}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
