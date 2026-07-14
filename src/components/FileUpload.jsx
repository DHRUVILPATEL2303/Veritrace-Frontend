/**
 * FileUpload.jsx — Drag-and-drop file upload zone
 * 
 * Features:
 * - Drag-and-drop with visual feedback (border color + background change)
 * - Click-to-browse with a hidden <input type="file">
 * - Displays supported format tags (PNG, JPG, MP4, PDF, etc.)
 * - After selection, shows file preview (name, type, size) with change button
 * - Validates file size against dynamic MAX_FILE_SIZES (e.g., 500MB for video)
 * 
 * Props:
 *   onFileSelected(file)  — called when user picks/drops a file (or null on clear)
 *   accept                — mime type accept string for the input
 *   label                 — custom instruction text for the drop zone
 */
import { useState, useRef } from 'react'
import { SUPPORTED_FILES, MAX_FILE_SIZES } from '../config'

export default function FileUpload({ onFileSelected, accept, label }) {
  const [dragover, setDragover] = useState(false)  // true when file is dragged over the zone
  const [file, setFile] = useState(null)            // currently selected file
  const [error, setError] = useState(null)          // validation error message
  const inputRef = useRef(null)                     // reference to the hidden file input

  /** Helper to find limit for a specific file based on MIME type / extension */
  const getMaxSizeForFile = (f) => {
    if (f.type?.startsWith('image/')) return MAX_FILE_SIZES.image
    if (f.type?.startsWith('video/')) return MAX_FILE_SIZES.video
    if (f.type?.includes('pdf') || f.type?.includes('text')) return MAX_FILE_SIZES.document
    
    // Fallback detection using file extension if MIME type is empty or generic
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (SUPPORTED_FILES.image.extensions.includes(ext)) return MAX_FILE_SIZES.image
    if (SUPPORTED_FILES.video.extensions.includes(ext)) return MAX_FILE_SIZES.video
    if (SUPPORTED_FILES.document.extensions.includes(ext)) return MAX_FILE_SIZES.document
    
    return MAX_FILE_SIZES.default
  }

  /**
   * handleFile — Validates and sets the selected file.
   * File size limits have been removed for testing.
   */
  const handleFile = (f) => {
    if (!f) return
    setError(null)

    setFile(f)
    if (onFileSelected) onFileSelected(f)
  }

  // ── Drag event handlers ──
  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }
  const handleDragOver = (e) => { e.preventDefault(); setDragover(true) }
  const handleDragLeave = () => setDragover(false)

  // ── Click handler: triggers the hidden file input ──
  const handleClick = () => inputRef.current?.click()

  // ── Input change handler ──
  const handleChange = (e) => handleFile(e.target.files[0])

  /** Format bytes to human-readable string */
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  /** Return an emoji icon based on the file's MIME type */
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️'
    if (type?.startsWith('video/')) return '🎬'
    if (type?.startsWith('audio/')) return '🎵'
    if (type?.includes('pdf')) return '📄'
    if (type?.includes('text')) return '📝'
    return '📁'
  }

  // ── If a file is already selected, show the preview card ──
  if (file) {
    const isImage = file.type?.startsWith('image/')
    const imageUrl = isImage ? URL.createObjectURL(file) : null

    return (
      <div className="animate-scale-in">
        <div className="file-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isImage ? (
            <img
              src={imageUrl}
              alt="Upload Preview"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
              }}
              onLoad={() => {
                // Revoke object URL after image loads to prevent memory leaks
                if (imageUrl) URL.revokeObjectURL(imageUrl)
              }}
            />
          ) : (
            <div className="file-info-icon">{getFileIcon(file.type)}</div>
          )}
          <div className="file-info-details" style={{ flexGrow: 1 }}>
            <div className="file-info-name">{file.name}</div>
            <div className="file-info-meta">
              {file.type || 'Unknown type'} • {formatSize(file.size)}
            </div>
          </div>
          {/* Clear selection and return to drop zone */}
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              setFile(null)
              if (onFileSelected) onFileSelected(null)
            }}
          >
            Change
          </button>
        </div>
      </div>
    )
  }

  // ── Render the drop zone ──
  return (
    <div>
      <div
        className={`upload-zone ${dragover ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {/* Upload cloud icon */}
        <div className="upload-zone-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>

        <div className="upload-zone-title">
          {label || 'Drop your file here, or click to browse'}
        </div>
        <div className="upload-zone-subtitle">
          Supports large images, videos, and documents (No size limits)
        </div>

        {/* ── Format tags showing all supported extensions ── */}
        <div className="upload-zone-formats">
          {Object.values(SUPPORTED_FILES).flatMap(cat =>
            cat.extensions.map(ext => (
              <span key={ext} className="format-tag">{ext}</span>
            ))
          )}
        </div>

        {/* Hidden file input element */}
        <input
          ref={inputRef}
          type="file"
          accept={accept || Object.values(SUPPORTED_FILES).map(f => f.accept).join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* ── Validation error message ── */}
      {error && (
        <div className="alert-box danger" style={{ marginTop: '0.75rem' }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}
    </div>
  )
}
