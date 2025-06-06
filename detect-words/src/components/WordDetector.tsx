import { useEffect, useState } from "react";
import Button from "./Button";
import List from "./List";

type WordVariants = {
    word: string;
    variants: string[];
};

// const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

// Generate - Hàm sinh biến thể
function generateVariants(word: string): string[] {
    if (!word) return [];
    let dot = word.split("").join(".");
    let alternating = word
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join("");
    let lower = word.toLowerCase();
    let upper = word.toUpperCase();
    return [dot, alternating, lower, upper];
}

export default function WordDetector() {
    const [word, setWord] = useState("");
    const [savedWords, setSavedWords] = useState<WordVariants[]>([]);
    const [showGenerated, setShowGenerated] = useState(false);
    const [generatedWords, setGeneratedWords] = useState<string[]>([]);
    const [mode, setMode] = useState<"main" | "list">("main");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [wordCount, setWordCount] = useState<number>(0)

    useEffect(() => {
        const stored = localStorage.getItem("savedWords_v2");
        if (stored) {
            setSavedWords(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (savedWords.length > 0) {
            localStorage.setItem("savedWords_v2", JSON.stringify(savedWords));
            chrome.storage.sync.set({ savedWords_v2: savedWords });
        }
    }, [savedWords]);

    // auto-disappear statusMesage after 3s
    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => {
                setStatusMessage(null)
            }, 2000);

            return () => clearTimeout(timer)
        }
    }, [statusMessage])

    const handleGenerate = () => {
        if (!word.trim()) {
            setStatusMessage("Please enter the word.");
            return;
        }

        if (!showGenerated) {
            setGeneratedWords(generateVariants(word));
            setShowGenerated(true);
        } else {
            setShowGenerated(false);
        }
    };

    const handleHideWords = async () => {
        const allWords = savedWords.flatMap(w => [w.word, ...w.variants]);
        if (allWords.length === 0) return;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.runtime.sendMessage({
            action: "injectAndHide",
            tabId: tab.id,
            words: allWords
        });

        setStatusMessage("Hide successfully!");
    };

    const handleFindWords = async () => {


        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const res = await chrome.runtime.sendMessage({
            action: "injectAndFind",
            tabId: tab.id,
            words: [word]
        });
        console.log({ count: res.count });
        setWordCount(res.count)
    };

    const handleSaveGenerated = () => {
        if (!word) return;
        const exist = savedWords.find(
            (item) => item.word.toLowerCase() === word.toLowerCase()
        );
        if (exist) {
            let merged = Array.from(new Set([...exist.variants, ...generatedWords]));
            setSavedWords(
                savedWords.map((item) =>
                    item.word.toLowerCase() === word.toLowerCase()
                        ? { ...item, variants: merged }
                        : item
                )
            );
        } else {
            setSavedWords([
                ...savedWords,
                { word, variants: generatedWords },
            ]);
        }
        setStatusMessage("Save successfully!");
        setShowGenerated(false);
        setGeneratedWords([]);
    };

    const handleSaveWord = () => {
        if (!word) return;
        const exist = savedWords.find(
            (item) => item.word.toLowerCase() === word.toLowerCase()
        );
        if (!exist) {
            setSavedWords([
                ...savedWords,
                { word, variants: [] }
            ]);
            setStatusMessage("Save successfully!");
        } else {
            setStatusMessage("Duplicate words!");
        }
        // setWord("");
    };

    const handleShowList = () => {
        setMode("list");
        setShowGenerated(false);
    };

    const handleBack = () => setMode("main");

    const handleDeleteWord = (wordToDelete: string) => {
        setSavedWords((prev) => {
            const updatedWords = prev.filter((item) => item.word !== wordToDelete)
            chrome.storage.sync.set({ savedWords_v2: updatedWords });
                    document.querySelectorAll('[data-original-display]').forEach((el) => {
              const htmlEl = el as HTMLElement; 
  htmlEl.style.display = htmlEl.dataset.originalDisplay || '';
        });
        });
    };

    if (mode === "list") {
        return <List savedWords={savedWords} handleBack={handleBack} handleDeleteWord={handleDeleteWord} />;
    }

    return (
        <>
            <div className="flex flex-col gap-[6px] mb-[18px]">
                <label className="relative flex items-center gap-1 text-[14px] text-black font-medium align-center">
                    Enter the words
                    <span className="relative group cursor-pointer bg-primary-lightestBlue font-bold text-[8px] text-primary-darkBlue px-[5px] rounded-[100px] border-[1.25px] border-primary-darkBlue">
                        i
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[175px] bg-beggieDark text-black text-[8px] font-normal px-3 py-2 rounded-[5px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            If you enter multiple words, please separate them with a semicolon (;).
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1 mb-1"></div>
                        </div>
                    </span>
                </label>
                <div className="w-full flex overflow-hidden">
                    <input
                        type="text"
                        placeholder="Eg: banana"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-[80%] px-[8px] py-[5px] font-normal rounded-tl-[5px] rounded-bl-[5px] border-t-[1.25px] border-l-[1.25px] border-b-[1.25px] border-gray"
                    />
                    <button
                        onClick={handleFindWords}
                        className="w-[20%] bg-gradient-blueDark text-beggie font-semibold px-[18px] py-[5px] rounded-[5px] border-t-[1.25px] border-r-[1.25px] border-b-[1.25px] border-gray"
                    >
                        Find
                    </button>
                    {(wordCount > 0) && <p>{wordCount} words</p>}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-1">
                <Button
                    onClick={handleSaveWord}
                    colorClass="bg-gradient-green"
                    name="Save"
                />
                <Button
                    id="hideWords"
                    colorClass="bg-gradient-red"
                    name="Hide comments"
                    onClick={handleHideWords}
                />
                <Button
                    colorClass="bg-gradient-orange"
                    name="Generate"
                    onClick={handleGenerate}
                />
                <Button
                    colorClass="bg-gradient-grey"
                    name="List"
                    onClick={handleShowList}
                />
            </div>

            {/* Status message */}
            {statusMessage && (
                <div className={`mt-2 text-[15px] text-center font-semibold ${statusMessage.includes("successfully") ? "text-green-700" : "text-red-600"}`}>
                    {statusMessage}
                </div>
            )}

            {/* Frame Generate */}
            {showGenerated && (
                <div className="bg-gradient-blue max-w-[600px] min-w-[450px] min-h-[255px] max-h-[450px] overflow-y-auto px-4 py-4 rounded-[5px] shadow-md mx-auto">
                    <hr className="border-gray-300 mb-3" />
                    <div className="font-semibold text-[16px] text-black mb-2">Generated words</div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {generatedWords.map((gw, idx) => (
                            <input
                                key={idx}
                                value={gw}
                                readOnly
                                className="px-3 py-2 rounded bg-white border text-[14px] shadow-sm w-full"
                            />
                        ))}
                    </div>
                    <Button
                        name="Save generated words"
                        colorClass="bg-gradient-blueLight w-full"
                        onClick={handleSaveGenerated}
                    />
                </div>
            )}
        </>
    );
}
