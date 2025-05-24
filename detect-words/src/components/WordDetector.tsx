import { useEffect, useState } from "react"
import Button from "./Button"
export default function WordDetector() {
    const [word, setWord] = useState('')
    const [words, setWords] = useState<string[]>([])
    const handleSave = async (word: string) => {
        if (!words.includes(word)) {
            const updatedWords = [...words, word];
            setWords(updatedWords);
            console.log({ updatedWords });
            localStorage.setItem('savedWords', JSON.stringify(updatedWords))
        } else {
            console.log("Duplicated!")
        }
    }
    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved) {
            const parsed = JSON.parse(saved);
            setWords(parsed);
            setWord('')
            console.log({initialWords:parsed});
        }
    }, [])
    return (
        <>
            <div className="flex flex-col gap-[6px] mb-[18px]">
                <label className="relative flex items-center gap-1 text-[14px] text-black font-medium align-center">
                    Enter the words
                    <span className="relative group cursor-pointer bg-primary-lightestBlue font-bold text-[8px] text-primary-darkBlue px-[5px] rounded-[100px] border-[1.25px] border-primary-darkBlue">
                        i

                        {/* Hover tool tips */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[175px] bg-beggieDark text-black text-[8px] font-normal px-3 py-2 rounded-[5px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            If you enter multiple words, please separate them with a semicolon (;).
                            {/* arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1 mb-1"></div>
                        </div>
                    </span>
                </label>

                <div className="w-full flex overflow-hidden">
                    <input
                        type="text"
                        name=""
                        id=""
                        placeholder="Eg: bad"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-[80%] px-[8px] py-[5px] font-normal rounded-tl-[5px] rounded-bl-[5px] border-t-[1.25px] border-l-[1.25px] border-b-[1.25px] border-gray"
                    />

                    <button className="w-[20%] bg-gradient-blueDark text-beggie font-semibold px-[18px] py-[5px] rounded-[5px] border-t-[1.25px] border-r-[1.25px] border-b-[1.25px] border-gray">
                        Find
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-1">
                <Button onClick={() => handleSave(word)} colorClass="bg-gradient-green" name="Save"></Button>
                <Button colorClass="bg-gradient-red" name="Hide comments"></Button>
                <Button colorClass="bg-gradient-orange" name="Generate"></Button>
                <Button colorClass="bg-gradient-grey" name="List"></Button>
            </div>
        </>
    )
}