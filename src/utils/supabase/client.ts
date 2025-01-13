import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

// Mock Supabase Client
function createMockClient() {
  return {
    from: (table: string) => ({
      select: () =>
        Promise.resolve({
          data: [
            { id: 1, name: "Mock Data 1" },
            { id: 2, name: "Mock Data 2" },
          ],
          error: null,
        }),
      insert: (data: any) =>
        Promise.resolve({
          data: { ...data, id: Math.floor(Math.random() * 1000) },
          error: null,
        }),
      delete: () =>
        Promise.resolve({
          data: { success: true },
          error: null,
        }),
    }),
  };
}

export function createClient() {
  // Check if Supabase environment variables are available
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn("Supabase environment variables are missing. Using mock client.");
    return createMockClient();
  }

  // Create the actual Supabase client when environment variables are available
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase;
}
