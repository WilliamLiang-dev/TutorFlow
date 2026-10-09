"use client";

import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function LoginBundle() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div key={mode} className="form-enter">
      {mode === "login" ? (
        <LoginForm onRegister={() => setMode("register")} />
      ) : (
        <RegisterForm onSignIn={() => setMode("login")} />
      )}
    </div>
  );
}