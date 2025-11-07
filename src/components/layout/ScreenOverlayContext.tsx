import React from 'react';

export type ScreenOverlayContextValue = {
  setOverlay: (id: string, content: React.ReactNode | null) => void;
};

export const ScreenOverlayContext = React.createContext<ScreenOverlayContextValue | null>(null);

export function useScreenOverlay() {
  const context = React.useContext(ScreenOverlayContext);
  return context;
}
