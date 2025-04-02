"use client";
import React, { createContext, useContext, useState } from "react";

// Define the type for your context state
interface MyContextType {
  state: string  | null;
  setState: (value: string) => void;


}

// Create the context with a default value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

// Create the provider component
export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<string | null>(null);


  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};
