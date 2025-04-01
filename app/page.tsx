"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, Wand2 } from "lucide-react";
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-gray-800 shadow-lg border-gray-700">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center">
              <Image src="/assets/icons/logo.svg" alt="logo" width={70} height={70} />
            </div>
            <h1 className="text-4xl text-white font-bold">Build Websites with the builder</h1>
            <p className="text-gray-300 text-xl">
              Builder is your superhuman full stack engineer.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mt-5">
              <Input
                placeholder="Create a todo app..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-30 pl-4 pr-32 bg-gray-700 border-gray-600 text-white placeholder:text-white/50  placeholder:top-4 focus:border-blue-500 "
              />
              <div>
                <Button 
                  type="submit"
                  className="absolute right-1 top-20 rounded-full p-3 w-8 h-8 bg-blue-600 hover:bg-blue-700"
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}