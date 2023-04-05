"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        className="rounded  mr-3 p-2 w-[450px]"
        type="text"
        placeholder="State, city or town"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <button
        className="rounded bg-red-600 px-9 py-2 text-white"
        onClick={() => {
          if (searchValue === "") return;
          router.push(`/search?city=${searchValue.trim().toLowerCase()}`);
          setSearchValue("");
        }}
      >
        Lets go
      </button>
    </div>
  );
}
