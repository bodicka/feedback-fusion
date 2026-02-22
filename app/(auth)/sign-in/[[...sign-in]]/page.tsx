"use client";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-center min-h-screen">
      <SignIn
        appearance={{ baseTheme: theme === "light" ? dark : undefined }}
      />
    </div>
  );
}
