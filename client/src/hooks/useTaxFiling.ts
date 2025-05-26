import { useContext } from "react";

import { TaxDataContext } from "@/context/TaxDataProvider";

export const useTaxFiling = () => {
  const context = useContext(TaxDataContext);
  
  if (context === undefined) {
    throw new Error("useTaxFiling must be used within a TaxDataProvider");
  }
  
  return context;
};
