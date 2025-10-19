// app/(marketing)/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"signup"|"login">("signup");
  const r = useRouter();
  const supabase = supabaseBrowser();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password: pw });
      if (error) return alert(error.message);
      // If confirmations are off, you now have a session.
      // If they were on, fall back to a direct login attempt:
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (loginErr) {
        alert("Check your email for a confirmation link, then log in.");
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) return alert(error.message);
    }

    r.push("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Kittie {mode === "signup" ? "Sign up" : "Log in"}</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        <button className="w-full rounded bg-black text-white py-2">
          {mode === "signup" ? "Create account" : "Log in"}
        </button>
        <button type="button" className="text-sm underline" onClick={()=>setMode(mode==="signup"?"login":"signup")}>
          {mode === "signup" ? "Have an account? Log in" : "New here? Sign up"}
        </button>
      </form>
    </main>
  );
}
