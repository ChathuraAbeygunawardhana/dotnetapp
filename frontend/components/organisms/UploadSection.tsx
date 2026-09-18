'use client'
import { color, font, radius, shadow, space, transition } from '@/lib/tokens'
import { Button } from '@/components/atoms/Button'
import { FileDropzone } from '@/components/molecules/FileDropzone'
import { Divider } from '@/components/atoms/Divider'
import { useState } from 'react'
import { AnalysisResult } from '@/lib/types'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface Props { onResult: (r: AnalysisResult) => void }

export function UploadSection({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleFile = (f: File) => {
    setFile(f)
    setStatus('idle')
    setErrorMsg('')
  }

  const submit = async (f: File) => {
    setStatus('uploading')
    setErrorMsg('')
    const fd = new FormData()
    fd.append('file', f)
    try {
      const res = await fetch(`${API}/api/upload`, { method: 'POST', body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      onResult(await res.json() as AnalysisResult)
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed.')
    }
  }

  const handleSubmit = () => { if (file) submit(file) }

  const useSample = async () => {
    setStatus('uploading')
    setErrorMsg('')
    try {
      const res = await fetch('/sample-data.csv')
      if (!res.ok) throw new Error('Could not load sample file.')
      const blob = await res.blob()
      const f = new File([blob], 'sample-data.csv', { type: 'text/csv' })
      setFile(f)
      await submit(f)
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Failed to load sample.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>

      {/* Sample data shortcut */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${space[3]} ${space[4]}`,
        background: color.surface,
        border: `1px solid ${color.border}`,
        borderRadius: radius.md,
      }}>
        <div>
          <p style={{ fontFamily: font.family, fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.text }}>
            Try with sample data
          </p>
          <p style={{ fontFamily: font.family, fontSize: font.size.xs, color: color.muted, marginTop: space[1] }}>
            Sales dataset — dates, categories, revenue & units
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={useSample}
          disabled={status === 'uploading'}
        >
          {status === 'uploading' && file?.name === 'sample-data.csv' ? 'Loading…' : 'Use sample'}
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
        <Divider style={{ flex: 1 }} />
        <span style={{ fontFamily: font.family, fontSize: font.size.xs, color: color.muted, flexShrink: 0 }}>
          or upload your own
        </span>
        <Divider style={{ flex: 1 }} />
      </div>

      <FileDropzone onFile={handleFile} disabled={status === 'uploading'} />

      {file && file.name !== 'sample-data.csv' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[4]}`,
          background: color.surface,
          border: `1px solid ${color.border}`,
          borderRadius: radius.md,
          gap: space[3],
        }}>
          <span style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.text }}>
            <strong>{file.name}</strong>{' '}
            <span style={{ color: color.muted }}>({(file.size / 1024).toFixed(1)} KB)</span>
          </span>
          <Button onClick={handleSubmit} disabled={status === 'uploading'} size="sm">
            {status === 'uploading' ? 'Analysing…' : 'Analyse'}
          </Button>
        </div>
      )}

      {status === 'error' && (
        <p style={{
          fontFamily: font.family, fontSize: font.size.sm, color: color.error,
          padding: `${space[3]} ${space[4]}`,
          background: color.errorBg,
          borderRadius: radius.md,
          border: `1px solid #FECACA`,
        }}>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
