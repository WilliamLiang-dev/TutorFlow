"use client"

import LoginBundle from "../ui/login/login-bundle";


export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f2eadf] px-4">
      <div >
        <LoginBundle />
      </div>
    </main>
  );
}