import type { ExecutionSnapshot, Variable, CallStackFrame } from '../types/execution'

// Safe identifier pattern – only allow valid JS identifiers as variable names
const SAFE_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

// ─── helpers ──────────────────────────────────────────────────────────────────

function getType(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value
}

function formatArgs(args: unknown[]): string {
  return args.map(a => (typeof a === 'object' ? stringify(a) : String(a))).join(' ')
}

function stringify(value: unknown): string {
  if (typeof value === 'function') {
    const src = value.toString()
    // Arrow functions may not contain '{'; show the whole signature up to the body start
    const braceIdx = src.indexOf('{')
    return braceIdx !== -1 ? src.slice(0, braceIdx).trim() : src.slice(0, 60).trim()
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function generateExplanation(line: string, vars: Variable[], outputLine: string): string {
  const trimmed = line.trim()
  if (!trimmed) return ''

  if (/^\s*(\/\/|#)/.test(trimmed)) return `Comment: ${trimmed}`

  const declMatch = trimmed.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+)/)
  if (declMatch) {
    const [, name, expr] = declMatch
    const found = vars.find(v => v.name === name)
    const val = found ? stringify(found.value) : expr.replace(/;$/, '')
    return `Declare variable "${name}" = ${val}`
  }

  const assignMatch = trimmed.match(/^(\w+)\s*(?:\+=|-=|\*=|\/=|=)\s*(.+)/)
  if (assignMatch) {
    const [, name] = assignMatch
    const found = vars.find(v => v.name === name)
    if (found) {
      const prev = found.previousValue !== undefined ? ` (was ${stringify(found.previousValue)})` : ''
      return `Update "${name}" → ${stringify(found.value)}${prev}`
    }
  }

  if (/^\s*for\s*\(/.test(trimmed)) return `Loop iteration – evaluating for-loop`
  if (/^\s*while\s*\(/.test(trimmed)) return `Evaluating while condition`
  if (/^\s*if\s*\(/.test(trimmed)) return `Evaluating if condition`
  if (/^\s*return\s/.test(trimmed)) return `Returning from function`
  if (/^\s*function\s+(\w+)/.test(trimmed)) {
    const m = trimmed.match(/function\s+(\w+)/)
    return m ? `Define function "${m[1]}"` : 'Define function'
  }
  if (/console\.log/.test(trimmed)) {
    return outputLine ? `Output: ${outputLine}` : 'Print to console'
  }

  return `Execute: ${trimmed.replace(/;$/, '')}`
}

// ─── variable-name extraction ─────────────────────────────────────────────────

function extractVariableNames(code: string): string[] {
  const names = new Set<string>()
  const patterns = [
    /(?:var|let|const)\s+(\w+)/g,
    /function\s+(\w+)/g,
  ]
  for (const re of patterns) {
    let m: RegExpExecArray | null
    while ((m = re.exec(code)) !== null) {
      // Only include valid, safe identifier names to prevent injection
      if (SAFE_IDENTIFIER.test(m[1])) names.add(m[1])
    }
  }
  return Array.from(names)
}

// ─── code instrumentation ─────────────────────────────────────────────────────

function instrumentCode(code: string, varNames: string[]): string {
  const lines = code.split('\n')
  // varNames are already validated as safe identifiers by extractVariableNames
  const captureExpr = `{${varNames.map(n => `"${n}": (typeof ${n} !== 'undefined' ? ${n} : undefined)`).join(', ')}}`

  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      out.push(raw)
      continue
    }

    out.push(raw)
    // Instrumentation errors are intentionally swallowed so they never interrupt user code
    out.push(`try { __captureState__(${i}, ${captureExpr}); } catch(_instrumentErr) { /* instrumentation */ }`)
  }

  return out.join('\n')
}

// ─── main executor ────────────────────────────────────────────────────────────

export interface ExecutionResult {
  snapshots: ExecutionSnapshot[]
  errors: string[]
}

export function executeJavaScript(code: string): ExecutionResult {
  const snapshots: ExecutionSnapshot[] = []
  const errors: string[] = []
  const capturedOutput: string[] = []

  const lines = code.split('\n')
  const varNames = extractVariableNames(code)
  let prevVars: Variable[] = []

  const globalFrame = { functionName: '<global>', lineNumber: 0, params: {} as Record<string, unknown> }

  const captureState = (lineNumber: number, rawState: Record<string, unknown>) => {
    const variables: Variable[] = Object.entries(rawState)
      .filter(([, v]) => v !== undefined)
      .map(([name, value]) => {
        const prev = prevVars.find(p => p.name === name)
        const updated = prev !== undefined && JSON.stringify(prev.value) !== JSON.stringify(value)
        return {
          name,
          value,
          type: getType(value),
          scope: 'global' as const,
          previousValue: prev?.value,
          isUpdated: updated,
        }
      })

    const currentOutput = capturedOutput[capturedOutput.length - 1] ?? ''
    globalFrame.lineNumber = lineNumber

    const callStack: CallStackFrame[] = [{
      functionName: globalFrame.functionName,
      parameters: globalFrame.params,
      depth: 0,
      lineNumber: globalFrame.lineNumber,
    }]

    snapshots.push({
      step: snapshots.length,
      lineNumber,
      code: lines[lineNumber] ?? '',
      variables,
      callStack,
      output: currentOutput,
      explanation: generateExplanation(lines[lineNumber] ?? '', variables, currentOutput),
    })

    prevVars = variables
  }

  const mockConsole = {
    log: (...args: unknown[]) => { capturedOutput.push(formatArgs(args)) },
    error: (...args: unknown[]) => {
      const msg = formatArgs(args)
      errors.push(msg)
      capturedOutput.push(`[error] ${msg}`)
    },
    warn: (...args: unknown[]) => { capturedOutput.push('[warn] ' + formatArgs(args)) },
    info: (...args: unknown[]) => { capturedOutput.push(formatArgs(args)) },
  }

  const instrumented = instrumentCode(code, varNames)

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('__captureState__', 'console', instrumented)
    fn(captureState, mockConsole)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    errors.push(msg)
    snapshots.push({
      step: snapshots.length,
      lineNumber: lines.length - 1,
      code: '',
      variables: prevVars,
      callStack: [{ functionName: '<global>', parameters: {}, depth: 0, lineNumber: lines.length - 1 }],
      output: `Error: ${msg}`,
      explanation: `Runtime error: ${msg}`,
    })
  }

  return { snapshots, errors }
}

