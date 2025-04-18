"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/builder?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Light Gradient Glow Effect */}
      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-br from-blue-600/30 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Center Content */}
      <div className="text-center max-w-2xl mt-24">
        <h1 className="text-5xl font-bold mb-4">
          What do <span className="text-white">you</span> want to build?
        </h1>
        <p className="text-gray-400 text-xl">
          Prompt, run, edit, and deploy full-stack <span className="text-white font-medium">web</span> apps.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-8">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can Builder help you today?"
            className="bg-neutral-800 border border-neutral-800 text-white placeholder:text-neutral-400 pl-4 pr-16 py-6 rounded-lg w-full text-lg"
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 cursor-pointer"
            disabled={!prompt.trim()}
          >
            <ArrowUp />
          </Button>
        </form>

        {/* Preset Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {["Build a todo app"].map((preset, idx) => (
            <Button
              key={idx}
              onClick={() => setPrompt(preset)}
              variant="ghost"
              className="text-sm border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:text-white px-4 py-2 rounded-full cursor-pointer transition"
            >
              {preset}
            </Button>
          ))}
        </div>

        <p className="text-gray-600 mt-6">Let's connect and build something</p>
         <div className="flex gap-3 justify-center items-center mt-5">
           <Link href="https://x.com/gaurav_nardia" target="_blank">
            <Image src="/assets/icons/x-logo.svg" alt="x" width={25} height={25} />
           </Link> 
           <div className="h-6 w-[2px] bg-neutral-600 " /> 
           <Link href="https://www.linkedin.com/in/gauravnardia/" target="_blank">
            <Image src="/assets/icons/linkedin-logo.svg" alt="x" width={25} height={25} />
           </Link>
         </div>
      </div>
    </div>
  );
}
