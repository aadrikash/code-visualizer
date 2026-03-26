import { useCallback } from 'react'
import { useExecutionStore } from '../stores/executionStore'
import { executeJavaScript } from '../utils/codeExecutor'

export function useCodeExecution() {
  const {
    code,
    language,
    setExecutionHistory,
    setCurrentStep,
    setIsPlaying,
    addError,
    clearOutput,
    addOutput,
    reset,
  } = useExecutionStore()

  const executeCode = useCallback(() => {
    // Only JavaScript execution is supported in the browser
    if (language !== 'javascript') {
      clearOutput()
      addError(`Browser execution is only supported for JavaScript. Please select JavaScript as the language.`)
      return
    }

    clearOutput()
    setCurrentStep(0)
    setIsPlaying(false)

    const { snapshots, errors } = executeJavaScript(code)

    if (errors.length > 0) {
      errors.forEach(e => addError(e))
    }

    if (snapshots.length === 0) {
      addOutput('No executable statements found.')
      return
    }

    // Populate the store with snapshots
    setExecutionHistory(snapshots)

    // Collect all unique output lines across snapshots and push them
    const seen = new Set<string>()
    snapshots.forEach(s => {
      if (s.output && !seen.has(s.output)) {
        seen.add(s.output)
        addOutput(s.output)
      }
    })
  }, [code, language, setExecutionHistory, setCurrentStep, setIsPlaying, addError, clearOutput, addOutput])

  const resetExecution = useCallback(() => {
    reset()
  }, [reset])

  return { executeCode, resetExecution }
}
