// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use in Server Components (read-only) */
export const supabaseServer = async () => {
  const c = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) { return c.get(name)?.value; },
      set() {}, // no-ops in read-only contexts
      remove() {},
    },
  });
};

/** Use ONLY in Route Handlers / Server Actions (mutating auth) */
export const supabaseServerMutating = async () => {
  const c = await cookies(); // has .set at runtime in handlers/actions
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) { return c.get(name)?.value; },
      // Next exposes .set only in mutating contexts; silence TS here.
      set(name: string, value: string, options: unknown) { c.set({ name, value, ...(options as Record<string, unknown>) }); },
      remove(name: string, options: unknown) { c.set({ name, value: "", ...(options as Record<string, unknown>), expires: new Date(0) }); },
    },
  });
};
