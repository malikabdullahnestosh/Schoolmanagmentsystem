import { createContext, useContext, useState } from "react";

const PrintModalContext = createContext();

export function usePrintModal() {
  return useContext(PrintModalContext);
}

export function PrintModalProvider({ children }) {
  const [printModalOpen, setPrintModalOpen] = useState(false);

  return (
    <PrintModalContext.Provider value={{ printModalOpen, setPrintModalOpen }}>
      {children}
    </PrintModalContext.Provider>
  );
}