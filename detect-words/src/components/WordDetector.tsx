import { useState } from "react";

type WordDetectorProps = {
  onShowList: () => void;
};

export default function WordDetector({ onShowList }: WordDetectorProps) {
  const [word, setWord] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [generatedWords, setGeneratedWords] = useState('');

  // Xử lý khi nhấn Generate
  const handleGenerate = () => {
    if (showGenerated) {
      setShowGenerated(false);
    } else {
      // Tạo ví dụ generate words từ từ nhập vào
      let input = word || "banana";
      let alt1 = input.split('').join('.');
      let alt2 = input
        .split('')
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join('');
      setGeneratedWords(`${alt1}, ${alt2}`);
      setShowGenerated(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-5">
        <label className="relative flex items-center gap-1 text-[14px] text-black font-semibold">
          Enter the words
          <span className="relative group cursor-pointer bg-primary-lightestBlue font-bold text-[10px] text-primary-darkBlue px-[6px] rounded-full border border-primary-darkBlue flex items-center justify-center h-5 w-5 ml-1">
            i
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[175px] bg-beggieDark text-black text-[10px] font-normal px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              If you enter multiple words, please separate them with a semicolon (;).
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-beggieDark rotate-45 -mt-1"></div>
            </div>
          </span>
        </label>
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Eg: banana"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-[80%] px-3 py-2 font-normal rounded-tl rounded-bl border border-gray focus:outline-none"
          />
          <button
            className="w-[20%] bg-[#4A90E2] text-white font-semibold px-4 py-2 rounded-tr rounded-br border-t border-r border-b border-gray hover:opacity-90"
            type="button"
          >
            Find
          </button>
        </div>
      </div>

      {/* Các nút chức năng  */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded shadow" 
        type="button">
          Save
        </button>
        <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded shadow" 
        type="button">
          Hide comments
        </button>
        <button
          className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded shadow"
          type="button"
          onClick={handleGenerate}
        >
          Generate
        </button>
        <button
          className="bg-gray-500 !important text-white font-semibold px-4 py-2 rounded shadow"
          style={{ backgroundColor: "#6b7280" }}
          type="button"
          onClick={onShowList}
        >
          List
        </button>
      </div>

      {/* Divider line */}
      {showGenerated && <hr className="border-gray-300 my-4" />}

      {/* Generated words */}
      {showGenerated && (
        <div className="mb-4">
          <div className="mb-2 text-[16px] font-semibold text-black">Generated words</div>
          <input
            type="text"
            readOnly
            value={generatedWords}
            className="w-full px-3 py-2 font-normal rounded border border-gray-300 mb-3 bg-[#F8FAFF]"
          />
          <button
            className="w-full bg-[#4A90E2] text-white font-semibold px-4 py-2 rounded shadow"
            type="button"
          >
            Save generated words
          </button>
        </div>
      )}
    </>
  );
}
