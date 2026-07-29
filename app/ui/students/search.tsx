"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LiquidGlass from '../liquid-glass';

export default function Search(){
    return (
        <LiquidGlass className="rounded-xl">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <input 
                className="block w-full rounded-md py-[15px] pl-10 outline-none"
                placeholder="Search students..."
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
    </LiquidGlass>
)}