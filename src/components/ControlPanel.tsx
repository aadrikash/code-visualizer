import { useExecution } from '../hooks/useExecution'

export default function ControlPanel() {
  const { currentStep, totalSteps, isPlaying, executionSpeed, nextStep, previousStep, restart, togglePlay, fastForward, setExecutionSpeed } = useExecution()

  return (
    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
      <div className="flex gap-3">
        <button onClick={restart} className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-amber-500/30 text-amber-400 rounded-lg">⏮</button>
        <button onClick={previousStep} className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-blue-500/30 text-blue-400 rounded-lg">⏮</button>
        <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-green-500 text-black rounded-lg font-bold">{isPlaying ? '⏸' : '▶'}</button>
        <button onClick={nextStep} className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-blue-500/30 text-blue-400 rounded-lg">⏭</button>
        <button onClick={fastForward} className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-red-500/30 text-red-400 rounded-lg">⏩</button>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-400">Step <span className="text-cyan-400 font-semibold">{currentStep}</span> of <span className="text-cyan-400 font-semibold">{totalSteps}</span></span>
        <div className="w-48 h-1.5 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : '0%' }} />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase">Speed</span>
        <input type="range" min="0.5" max="10" step="0.5" value={executionSpeed} onChange={(e) => setExecutionSpeed(parseFloat(e.target.value))} className="w-24" />
        <span className="text-sm text-cyan-400 font-semibold">{executionSpeed}x</span>
      </label>
    </div>
  )
}
