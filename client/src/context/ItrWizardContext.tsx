import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { pickITR } from '../utils/itrSelector';

// Define the types for our context
interface WizardState {
  step: number;
  sources: string[];
  compulsory: Record<string, any>;
  itr: string | null;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SOURCES'; payload: string[] }
  | { type: 'SET_COMPULSORY'; payload: Record<string, any> }
  | { type: 'SET_ITR'; payload: string | null }
  | { type: 'RESET' };

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

// Create the context
const ItrWizardContext = createContext<WizardContextType | undefined>(undefined);

// Initial state
const initialState: WizardState = {
  step: 1,
  sources: [],
  compulsory: {},
  itr: null,
};

// Reducer function
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SOURCES':
      const itr = pickITR(action.payload);
      return { ...state, sources: action.payload, itr };
    case 'SET_COMPULSORY':
      return { ...state, compulsory: { ...state.compulsory, ...action.payload } };
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

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('itrWizardState', JSON.stringify(state));
  }, [state]);

  // Load state from localStorage when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('itrWizardState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restore each piece of state individually to ensure type safety
        dispatch({ type: 'SET_STEP', payload: parsedState.step || 1 });
        dispatch({ type: 'SET_SOURCES', payload: parsedState.sources || [] });
        dispatch({ type: 'SET_COMPULSORY', payload: parsedState.compulsory || {} });
        dispatch({ type: 'SET_ITR', payload: parsedState.itr || null });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  const value = { state, dispatch };

  return (
    <ItrWizardContext.Provider value={value}>
      {children}
    </ItrWizardContext.Provider>
  );
}

// Custom hook to use the context
export function useItrWizard() {
  const context = useContext(ItrWizardContext);
  if (context === undefined) {
    throw new Error('useItrWizard must be used within an ItrWizardProvider');
  }
  return context;
}