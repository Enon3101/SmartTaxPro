import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

import { determineITRForm } from '../utils/itrSelector';

// Define the state interface
interface WizardState {
  step: number;
  sources: string[];
  compulsory: Record<string, any>;
  itr: string | null;
}

// Define action types
type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SOURCES'; payload: string[] }
  | { type: 'SET_COMPULSORY'; payload: Record<string, any> }
  | { type: 'SET_ITR'; payload: string | null }
  | { type: 'RESET' };

// Define the context type
interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

// Initial state
const initialState: WizardState = {
  step: 1,
  sources: [],
  compulsory: {},
  itr: null
};

// Create context
const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Reducer function
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SOURCES':
      // Auto-determine ITR form based on sources
      const itr = determineITRForm(action.payload);
      return { ...state, sources: action.payload, itr };
    case 'SET_COMPULSORY':
      return { ...state, compulsory: action.payload };
    case 'SET_ITR':
      return { ...state, itr: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Provider component
interface ItrWizardProviderProps {
  children: ReactNode;
}

export function ItrWizardProvider({ children }: ItrWizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Effect to calculate ITR when sources change
  useEffect(() => {
    if (state.sources.length > 0) {
      const itr = determineITRForm(state.sources);
      if (itr !== state.itr) {
        dispatch({ type: 'SET_ITR', payload: itr });
      }
    }
  }, [state.sources]);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

// Custom hook to use the context
export function useItrWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useItrWizard must be used within an ItrWizardProvider');
  }
  return context;
}
