"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Animation context provides a way for components to check if they should
// use animated gradients based on each component's settings
type AnimationContextType = {
  isAnimated: (componentSetting: boolean) => boolean;
};

const AnimationContext = createContext<AnimationContextType>({
  isAnimated: () => false,
});

export const useAnimation = () => {
  return useContext(AnimationContext);
};

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  // Simple function that returns the component's animation setting
  const isAnimated = (componentSetting: boolean): boolean => {
    return componentSetting;
  };

  return (
    <AnimationContext.Provider value={{ isAnimated }}>
      {children}
    </AnimationContext.Provider>
  );
}; 