import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Video, Music, FileText, File } from 'lucide-react'
import { SUPPORTED_FILES } from '../config'
import { cn } from '@/lib/utils'

export default function FileUpload({ onFileSelected, accept, label }) {
  const [dragover, setDragover] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    setError(null)
    setFile(f)
    if (onFileSelected) onFileSelected(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    handleFile(e.dataTransfer.files[0])
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const FileIcon = (type) => {
    if (type?.startsWith('image/')) return ImageIcon
    if (type?.startsWith('video/')) return Video
    if (type?.startsWith('audio/')) return Music
    if (type?.includes('pdf') || type?.includes('text')) return FileText
    return File
  }

  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!file || !file.type?.startsWith('image/')) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => { URL.revokeObjectURL(url) }
  }, [file])

  if (file) {
    const isImage = file.type?.startsWith('image/')
    const Icon = FileIcon(file.type)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 p-3 rounded-[6px] bg-[var(--surface)] border border-[var(--border-2)]"
      >
        {isImage && previewUrl ? (
          <img src={previewUrl} alt="" className="w-12 h-12 rounded-[4px] object-cover border border-[var(--border)]" />
        ) : (
          <div className="w-12 h-12 rounded-[4px] flex items-center justify-center bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-2)]">
            <Icon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate text-[var(--text)]">{file.name}</div>
          <div className="font-mono text-[11px] text-[var(--text-3)] mt-0.5">{file.type || 'Unknown type'} · {formatSize(file.size)}</div>
        </div>
        <button
          type="button"
          className="btn btn-outline text-xs px-3 py-1.5"
          onClick={() => { setFile(null); if (onFileSelected) onFileSelected(null) }}
        >
          Change
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'border border-dashed rounded-[6px] p-7 text-center cursor-pointer transition-colors',
          dragover ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border-2)] bg-[var(--surface-2)] hover:border-[var(--accent)]'
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
        onDragLeave={() => setDragover(false)}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      >
        <div className="w-11 h-11 rounded-[8px] border border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center mx-auto mb-3">
          <Upload size={20} />
        </div>
        <div className="font-medium text-sm mb-1 text-[var(--text)]">{label || 'Drop your file here, or click to browse'}</div>
        <div className="text-xs text-[var(--text-3)] mb-4">Supports images, videos, and documents (No size limits)</div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Object.values(SUPPORTED_FILES).flatMap(cat => cat.extensions.map(ext => (
            <span key={ext} className="chip">{ext}</span>
          )))}
        </div>
        <input ref={inputRef} type="file" accept={accept || Object.values(SUPPORTED_FILES).map(f => f.accept).join(',')} onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
            <div className="flex gap-2 p-3 rounded-[5px] bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] text-sm">
              <X size={16} className="flex-shrink-0 mt-0.5" /><div>{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
