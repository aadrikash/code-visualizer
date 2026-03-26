import { useState } from 'react'
import { useExecutionStore } from '../stores/executionStore'
import { useTheme } from '../hooks/useTheme'
import { useCodeExecution } from '../hooks/useCodeExecution'
import { CODE_EXAMPLES } from '../examples/codeExamples'

export default function Toolbar() {
  const { language, setLanguage, setCode } = useExecutionStore()
  const { theme, changeTheme } = useTheme()
  const { executeCode, resetExecution } = useCodeExecution()
  const [selectedExample, setSelectedExample] = useState('')

  const handleExampleLoad = (exampleKey: string) => {
    if (exampleKey && CODE_EXAMPLES[exampleKey as keyof typeof CODE_EXAMPLES]) {
      const example = CODE_EXAMPLES[exampleKey as keyof typeof CODE_EXAMPLES]
      const code = example[language as keyof typeof example] ?? example.javascript
      setCode(code as string)
      setSelectedExample(exampleKey)
    }
  }

  const shareCode = () => {
    const code = useExecutionStore.getState().code
    const encoded = encodeURIComponent(code)
    const url = `${window.location.origin}?code=${encoded}`
    navigator.clipboard.writeText(url)
    alert('Share link copied!')
  }

  return (
    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Language</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-gray-900 border border-cyan-500/30 rounded px-3 py-1.5 text-sm text-cyan-400">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Theme</span>
          <select value={theme} onChange={(e) => changeTheme(e.target.value as any)} className="bg-gray-900 border border-cyan-500/30 rounded px-3 py-1.5 text-sm text-cyan-400">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="cyberpunk">Cyberpunk</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Example</span>
          <select value={selectedExample} onChange={(e) => handleExampleLoad(e.target.value)} className="bg-gray-900 border border-cyan-500/30 rounded px-3 py-1.5 text-sm text-cyan-400">
            <option value="">-- Load Example --</option>
            <option value="sum-loop">Sum Loop</option>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="binary-search">Binary Search</option>
            <option value="fibonacci">Fibonacci</option>
            <option value="factorial">Factorial</option>
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={executeCode} className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all">▶ Execute</button>
        <button onClick={shareCode} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold rounded-lg">📤 Share</button>
        <button onClick={resetExecution} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold rounded-lg">🔄 Reset</button>
      </div>
    </div>
  )
}
