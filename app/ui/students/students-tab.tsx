"use client"

import Search from "./search";


export default function StudentTab(){
  return (
  <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <Search />
        </div>

        <button
          type="button"
          aria-label="Add student"
          title="Add student"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xl font-semibold text-white transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
         <span className="-translate-y-[1px]"> + </span> 
        </button>
      </div>
    </div>
)}