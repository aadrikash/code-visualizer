import { useExecutionStore } from '../stores/executionStore'
import { useEffect, useRef } from 'react'

export default function Console() {
  const { output, errors, clearOutput } = useExecutionStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [output, errors])

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex justify-between">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase">Output</h3>
        <button onClick={() => clearOutput()} className="text-xs px-2 py-1 text-red-400">Clear</button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm space-y-0.5">
        {output.length === 0 && errors.length === 0 ? (
          <div className="text-gray-600">Press ▶ Execute to run your code…</div>
        ) : (
          <>
            {output.map((line, idx) => (
              <div key={`out-${idx}`} className="text-green-400">{line}</div>
            ))}
            {errors.map((line, idx) => (
              <div key={`err-${idx}`} className="text-red-400">⚠ {line}</div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
