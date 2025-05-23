import { useState } from "react";

type SavedWordsListProps = {
  savedWords?: string[];
  onBack: () => void;
};

// Mock data: mapping từ 
const MOCK_WORDS: Record<string, string[]> = {
  a: ["apple", "a.p.p.l.e", "a_p_p_l_e", "a*pple"],
  b: ["banana", "b.a.n.a.n.a", "b_a_n_a_n_a"],
  c: ["cat", "c.a.t", "c_a_t"],
  d: ["dog", "d.o.g", "d_o_g"],
};

export default function SavedWordsList({ savedWords = [], onBack }: SavedWordsListProps) {
  // State: lưu chỉ số các dòng đang expand
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  // Toggle expand/collapse
  const toggleExpand = (idx: number) => {
    setOpenIndexes(openIndexes.includes(idx)
      ? openIndexes.filter(i => i !== idx)
      : [...openIndexes, idx]);
  };

  return (
    <div className="w-full h-full">
      {/* Header row */}
      <div className="flex items-center mb-3">
        <button
          className="bg-blue-200 hover:bg-blue-300 p-2 rounded-full mr-3"
          onClick={onBack}
        >
          <span className="text-xl font-bold">{'←'}</span>
        </button>
        <span className="text-xl font-bold">List of saved words</span>
        <span className="ml-2 group cursor-pointer text-[12px] text-primary-darkBlue bg-primary-lightestBlue rounded-full px-2">
          i
          <div className="absolute mt-6 left-1/2 -translate-x-1/2 w-max max-w-[175px] bg-beggieDark text-black text-[10px] font-normal px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            Here are the words you have saved.
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1"></div>
          </div>
        </span>
      </div>
      {/* List */}
      <div>
        {savedWords.map((word, idx) => (
          <div key={idx}>
            <div className="flex items-center border-b border-blue-200 px-2 py-2">
              <span className="flex-1 text-[16px] text-gray-800">{word}</span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700 transition"
                onClick={() => toggleExpand(idx)}
                aria-label={openIndexes.includes(idx) ? "Collapse" : "Expand"}
              >
                {openIndexes.includes(idx) ? "▲" : "▼"}
              </button>
            </div>
            {openIndexes.includes(idx) && (
              <div className="flex flex-wrap gap-2 px-2 py-2">
                {(MOCK_WORDS[word] || ["mock1", "mock2", "mock3"]).map((variant, vIdx) => (
                  <span
                    key={vIdx}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-lg border border-blue-300"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
