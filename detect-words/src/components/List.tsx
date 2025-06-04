import { useState } from "react";

type WordVariants = {
    word: string;
    variants: string[];
};

type ListProps = {
    savedWords: WordVariants[];
    handleBack: () => void;
    handleDeleteWord: (word: string) => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function List({ savedWords, handleBack, handleDeleteWord }: ListProps) {
    const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({});

    const groupedWords = ALPHABET.reduce((acc, char) => {
        acc[char] = savedWords
            .filter((item) => item.word[0]?.toLowerCase() === char)
            .sort((a, b) => a.word.localeCompare(b.word));
        return acc;
    }, {} as { [key: string]: WordVariants[] });

    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={handleBack} className="text-[22px] font-bold text-primary-darkBlue hover:bg-[#d6eaff] rounded-full px-2 py-0.5 transition">
                    ←
                </button>
                <div className="flex-1 text-center flex justify-center items-center gap-2">
                    <span className="font-bold text-[18px] text-black">
                        List of saved words
                    </span>
                    <span className="relative group cursor-pointer bg-primary-lightestBlue font-bold text-[8px] text-primary-darkBlue px-[5px] rounded-[100px] border-[1.25px] border-primary-darkBlue"
                    >
                        i
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[175px] bg-beggieDark text-black text-[8px] font-normal px-3 py-2 rounded-[5px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            Hover on the words to delete them.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1 mb-1"></div>
                        </div>
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {ALPHABET.filter((char) => groupedWords[char] && groupedWords[char].length > 0).map((char) => (
                    <div key={char}>
                        <div
                            className="flex items-center py-2 cursor-pointer select-none"
                            onClick={() =>
                                setAccordion((prev) => ({
                                    ...prev,
                                    [char]: !prev[char],
                                }))
                            }
                        >
                            <span className="font-bold text-[16px] text-primary-darkBlue lowercase w-6">{char}</span>
                            <div className="flex-1 border-b border-[#b0cbea] ml-2"></div>
                            <span className="ml-1 text-[16px] text-primary-darkBlue transition-transform"
                                style={{
                                    transform: accordion[char] ? "rotate(180deg)" : "rotate(0deg)",
                                    display: "inline-block",
                                }}>
                                ▼
                            </span>
                        </div>
                        {accordion[char] && (
                            <div className="pl-8 pt-1 pb-2 flex flex-wrap gap-2">
                                {groupedWords[char].map((w) => (
                                    <div
                                        key={w.word}
                                        className="flex gap-2 items-center mb-1 flex-wrap group relative"
                                    >
                                        <span className="px-3 py-1 rounded-[8px] border border-[#b0cbea] bg-white text-[15px] font-semibold relative">
                                            {w.word}
                                            <button
                                                onClick={() => handleDeleteWord(w.word)}
                                                className="absolute -top-2 -right-2 hidden group-hover:inline-block text-red-500 bg-white border border-red-200 rounded-full px-2 py-0.5 text-xs shadow hover:bg-red-100 transition"
                                                title="Delete word"
                                            >
                                                🗑
                                            </button>
                                        </span>
                                        {w.variants.map((v, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-[8px] border border-[#c3d6f7] bg-[#f5f8fc] text-[14px] font-normal"
                                            >
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
