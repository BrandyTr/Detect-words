// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import WordDetector from './components/WordDetector'


function App() {

  return (
    <div className='bg-gradient-blue max-w-[700px] min-w-[450px] min-h-[255px]'>
      <Header></Header>
      <main className='pt-16 px-5 font-poppins'>
        <WordDetector></WordDetector>
      </main>
      <Footer></Footer>
    </div>
  )
}

export default App
