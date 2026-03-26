import { useCallback, useEffect } from 'react'
import { useExecutionStore } from '../stores/executionStore'

export function useExecution() {
  const store = useExecutionStore()

  const nextStep = useCallback(() => {
    if (store.currentStep < store.totalSteps - 1) {
      store.setCurrentStep(store.currentStep + 1)
    }
  }, [store.currentStep, store.totalSteps, store])

  const previousStep = useCallback(() => {
    if (store.currentStep > 0) {
      store.setCurrentStep(store.currentStep - 1)
    }
  }, [store.currentStep, store])

  const restart = useCallback(() => {
    store.setCurrentStep(0)
    store.setIsPlaying(false)
  }, [store])

  const togglePlay = useCallback(() => {
    store.setIsPlaying(!store.isPlaying)
  }, [store.isPlaying, store])

  const fastForward = useCallback(() => {
    store.setCurrentStep(store.totalSteps - 1)
    store.setIsPlaying(false)
  }, [store.totalSteps, store])

  useEffect(() => {
    if (!store.isPlaying) return
    const interval = setInterval(() => {
      const next = store.currentStep + 1
      if (next >= store.totalSteps) {
        store.setIsPlaying(false)
        store.setCurrentStep(store.totalSteps - 1)
      } else {
        store.setCurrentStep(next)
      }
    }, 1000 / store.executionSpeed)
    return () => clearInterval(interval)
  }, [store.isPlaying, store.executionSpeed, store.totalSteps, store.currentStep, store])

  return { ...store, nextStep, previousStep, restart, togglePlay, fastForward }
}
