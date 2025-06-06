import { useState, useEffect } from "react";

type WordVariants = {
  word: string;
  variants: string[];
};

type ListProps = {
  savedWords: WordVariants[];
  handleBack: () => void;
  handleDeleteWord: (word: string) => void;
  handleDeleteVariant: (word: string, variant: string) => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function List({
  savedWords,
  handleBack,
  handleDeleteWord,
  handleDeleteVariant,
}: ListProps) {
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({});
  const [showMessage, setShowMessage] = useState(false);

  const groupedWords = ALPHABET.reduce((acc, char) => {
    acc[char] = savedWords
      .filter((item) => item.word[0]?.toLowerCase() === char)
      .sort((a, b) => a.word.localeCompare(b.word));
    return acc;
  }, {} as { [key: string]: WordVariants[] });

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="p-4 pb-10 min-h-[100vh] flex flex-col items-center relative">
      {showMessage && (
        <div className="absolute top-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm">
          Deleted successfully
        </div>
      )}

      <div className="w-full max-w-[500px]">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="w-9 h-9 bg-gradient-to-r from-[#4fc3f7] to-[#1e88e5] text-white text-xl rounded-[8px] flex items-center justify-center shadow hover:opacity-90 transition"
            title="Back Home"
          >
            ←
          </button>
          <div className="flex-1 text-center flex justify-center items-center gap-2">
            <span className="font-bold text-[18px] text-black">
              List of saved words
            </span>
            <span className="relative group cursor-pointer bg-white font-bold text-[10px] text-primary-darkBlue px-[6px] rounded-full border border-primary-darkBlue">
              i
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[175px] bg-beggieDark text-black text-[8px] font-normal px-3 py-2 rounded-[5px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                Hover on words/variants to delete them.
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1 mb-1"></div>
              </div>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {ALPHABET.filter((char) => groupedWords[char]?.length > 0).map((char) => (
            <div key={char}>
              <div
                className="cursor-pointer select-none"
                onClick={() =>
                  setAccordion((prev) => ({
                    ...prev,
                    [char]: !prev[char],
                  }))
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#102c86] lowercase">
                    {char}
                  </span>
                  <span className="text-[14px] text-[#102c86]">
                    {accordion[char] ? "▲" : "▼"}
                  </span>
                </div>
                <div className="border-b border-[#9dbff2] mt-1 mb-1 w-full"></div>
              </div>

              {accordion[char] && (
                <div className="pl-2 pt-1 pb-3 flex flex-wrap gap-2">
                  {groupedWords[char].map((w) => (
                    <div key={w.word} className="flex flex-col gap-1 group relative">
                      <div className="relative inline-block group">
                        <span className="px-3 py-1 rounded-[6px] bg-white border border-[#c3d6f7] text-[14px] font-semibold shadow-sm relative inline-block">
                          {w.word}
                          <button
                            onClick={() => {
                              handleDeleteWord(w.word);
                              setShowMessage(true);
                            }}
                            className="absolute -top-2 -right-2 hidden group-hover:inline-block text-red-500 bg-white border border-red-200 rounded-full px-2 py-0.5 text-xs shadow hover:bg-red-100 transition"
                            title="Delete word"
                          >
                            🗑
                          </button>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {w.variants.map((v, idx) => (
                          <div key={idx} className="relative inline-block group">
                            <span className="px-3 py-1 rounded-[6px] bg-[#e0ecfb] border border-[#c3d6f7] text-[13px] font-normal inline-block relative">
                              {v}
                              <button
                                onClick={() => {
                                  handleDeleteVariant(w.word, v);
                                  setShowMessage(true);
                                }}
                                className="absolute -top-2 -right-2 hidden group-hover:inline-block text-red-500 bg-white border border-red-200 rounded-full px-2 py-0.5 text-xs shadow hover:bg-red-100 transition"
                                title="Delete variant"
                              >
                                🗑
                              </button>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
