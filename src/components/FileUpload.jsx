import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, File as FileIcon, X } from 'lucide-react'
import { SUPPORTED_FILES, MAX_FILE_SIZES } from '../config'
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

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️'
    if (type?.startsWith('video/')) return '🎬'
    if (type?.startsWith('audio/')) return '🎵'
    if (type?.includes('pdf')) return '📄'
    if (type?.includes('text')) return '📝'
    return '📁'
  }

  if (file) {
    const isImage = file.type?.startsWith('image/')
    const imageUrl = isImage ? URL.createObjectURL(file) : null

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--color-base-50)] border border-[var(--color-border)]"
      >
        {isImage ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover border border-[var(--color-border)] bg-[var(--color-bg)]"
            onLoad={() => { if (imageUrl) URL.revokeObjectURL(imageUrl) }}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            {getFileIcon(file.type)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{file.name}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {file.type || 'Unknown type'} • {formatSize(file.size)}
          </div>
        </div>
        <button
          className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors"
          onClick={() => {
            setFile(null)
            if (onFileSelected) onFileSelected(null)
          }}
        >
          Change
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          dragover
            ? 'border-blue-500 bg-blue-500/5 scale-[1.01]'
            : 'border-[var(--color-border)] bg-[var(--color-base-50)] hover:border-blue-500/50 hover:bg-blue-500/5'
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
        onDragLeave={() => setDragover(false)}
        onClick={() => inputRef.current?.click()}
      >
        <motion.div
          animate={dragover ? { y: -4 } : { y: 0 }}
          className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4"
        >
          <UploadCloud size={26} />
        </motion.div>
        <div className="font-semibold text-sm mb-1.5 text-[var(--color-text)]">
          {label || 'Drop your file here, or click to browse'}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mb-4">
          Supports large images, videos, and documents (No size limits)
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Object.values(SUPPORTED_FILES).flatMap(cat =>
            cat.extensions.map(ext => (
              <span key={ext} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                {ext}
              </span>
            ))
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept || Object.values(SUPPORTED_FILES).map(f => f.accept).join(',')}
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <div className="flex gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <X size={16} className="flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
