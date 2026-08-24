import { useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
        relative flex items-center w-full max-w-2xl 
        bg-neutral-900 rounded-lg 
        ${
          isFocused
            ? "ring-2 ring-orange-500"
            : "hover:ring-1 hover:ring-orange-500/50"
        }
        transition-all duration-200
      `}
    >
      <div className="absolute left-4">
        <BiSearch
          size={20}
          className={`${isFocused ? "text-orange-500" : "text-gray-400"}`}
        />
      </div>

      <input
        type="text"
        placeholder="Search for wallet address, assets on any blockchain"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
          w-full py-3 pl-12 pr-4
          bg-transparent
          text-white placeholder-gray-400
          focus:outline-none
          text-sm md:text-base
        "
      />
    </div>
  );
};

export default SearchInput;
