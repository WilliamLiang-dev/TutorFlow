"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search(){
    return (
        <div className="flex rounded-xl bg-white">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <input 
                className="block w-full rounded-md py-[15px] pl-10 outline-none"
                placeholder="Search students..."
                />
                <MagnifyingGlassIcon className="absolute h-[18px] w-[18px] translate-y-4.5 translate-x-4 text-black" />
        </div>
)}