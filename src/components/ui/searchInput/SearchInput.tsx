"use client";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchInput = () => {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search/${search.trim()}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };


  return (
    <div className="relative">
      {open ? (
        <div className="p-2 rounded-md transition-all hover:bg-gray-100" onClick={() => setOpen(false)}>
          <IoSearchOutline className="w-5 h-5" />
        </div>
        
      ) : (
        <>
          <label htmlFor="Search" className="sr-only">
            {" "}
            Search{" "}
          </label>

          <input
            type="text"
            id="Search"
            value={search}
            placeholder="Buscar producto..."
            className="w-full bg-transparent border-b-2 border-gray-900 py-2.5 pe-10 sm:text-sm focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>

              <IoSearchOutline className="w-5 h-5" />
            </button>
          </span>
        </>
      )}
    </div>
  );
};
