"use client";

import React from "react";
import { useAnimation } from "../layout/animation-context";

export function TitleAnimationToggle() {
  const { animatedTitles, toggleAnimatedTitles } = useAnimation();

  return (
    <button
      onClick={toggleAnimatedTitles}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-black/80 dark:bg-white/20 backdrop-blur-md rounded-full text-white dark:text-white shadow-lg transition-all hover:scale-105"
      title={animatedTitles ? "Disable title animations" : "Enable title animations"}
    >
      <span className="text-xs font-medium">
        {animatedTitles ? "Animations ON" : "Animations OFF"}
      </span>
      <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${animatedTitles ? 'bg-green-500' : 'bg-gray-500'}`}>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            animatedTitles ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
} 