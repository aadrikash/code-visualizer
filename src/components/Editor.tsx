import { useExecutionStore } from '../stores/executionStore'
import { useEffect, useRef } from 'react'

export default function Editor() {
  const { code, setCode, executionHistory, currentStep } = useExecutionStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('code')) setCode(decodeURIComponent(params.get('code')!))
  }, [setCode])

  // Sync overlay scroll with textarea scroll
  useEffect(() => {
    const ta = textareaRef.current
    const ov = overlayRef.current
    if (!ta || !ov) return
    const onScroll = () => { ov.scrollTop = ta.scrollTop }
    ta.addEventListener('scroll', onScroll)
    return () => ta.removeEventListener('scroll', onScroll)
  }, [])

  const currentSnapshot = executionHistory[currentStep]
  const activeLine = currentSnapshot?.lineNumber ?? -1
  const lines = code.split('\n')

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase">Code Editor</h3>
        {activeLine >= 0 && (
          <span className="text-xs text-yellow-400">Line {activeLine + 1}</span>
        )}
      </div>
      <div className="flex-1 relative overflow-hidden">
        {/* Highlight overlay */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 font-mono text-sm p-4 overflow-hidden pointer-events-none whitespace-pre leading-6"
          style={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={idx === activeLine ? 'bg-yellow-400/20 rounded' : ''}
            >
              {line || ' '}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute inset-0 w-full h-full bg-gray-900 text-white font-mono p-4 resize-none border-none outline-none leading-6"
          style={{ caretColor: 'white', color: 'white', background: 'transparent' }}
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}
