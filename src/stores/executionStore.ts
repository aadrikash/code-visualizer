import { create } from 'zustand'
import { ExecutionState, ExecutionSnapshot, Variable, CallStackFrame, Language, Theme } from '../types/execution'

interface ExecutionStore extends ExecutionState {
  setCode: (code: string) => void
  setLanguage: (language: Language) => void
  setCurrentStep: (step: number) => void
  setIsPlaying: (playing: boolean) => void
  setExecutionSpeed: (speed: number) => void
  setExecutionHistory: (history: ExecutionSnapshot[]) => void
  setVariables: (variables: Variable[]) => void
  setCallStack: (stack: CallStackFrame[]) => void
  addOutput: (output: string) => void
  addError: (error: string) => void
  clearOutput: () => void
  toggleBreakpoint: (line: number) => void
  setTheme: (theme: Theme) => void
  reset: () => void
}

const initialState: ExecutionState = {
  code: `// Welcome to Code Visualizer\n// Click "Execute" to run this code step by step\n\nlet n = 5;\nlet total = 0;\n\nfor (let i = 1; i <= n; i++) {\n  total = total + i;\n}\n\nconsole.log("Sum:", total);`,
  language: 'javascript',
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  executionSpeed: 1,
  executionHistory: [],
  variables: [],
  callStack: [],
  output: [],
  errors: [],
  breakpoints: new Set(),
  theme: 'dark',
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  ...initialState,
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setExecutionSpeed: (speed) => set({ executionSpeed: speed }),
  setExecutionHistory: (history) => set({ executionHistory: history, totalSteps: history.length }),
  setVariables: (variables) => set({ variables }),
  setCallStack: (stack) => set({ callStack: stack }),
  addOutput: (output) => set((state) => ({ output: [...state.output, output] })),
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  clearOutput: () => set({ output: [], errors: [] }),
  toggleBreakpoint: (line) => set((state) => {
    const newBreakpoints = new Set(state.breakpoints)
    if (newBreakpoints.has(line)) newBreakpoints.delete(line)
    else newBreakpoints.add(line)
    return { breakpoints: newBreakpoints }
  }),
  setTheme: (theme) => set({ theme }),
  reset: () => set(initialState),
}))
