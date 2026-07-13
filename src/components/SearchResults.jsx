/**
 * SearchResults.jsx — Displays verification/search results
 * 
 * Three visual states:
 * 1. Loading — skeleton pulse animation cards
 * 2. No results — empty state with success icon
 * 3. Results — match cards with colored indicators (exact = green, similar = orange)
 * 
 * Props:
 *   results   — array of match objects, or null (not searched yet)
 *   loading   — boolean, true while API call is in progress
 *   
 * Each result object shape (from the hash engine verify API):
 *   {
 *     matchType: "exact" | "similar",
 *     similarity: number (0-100),
 *     assetId: string,
 *     mediaType: string,
 *     registeredAt: string (ISO date),
 *   }
 */
import { ARBITRUM_SEPOLIA } from '../config'

export default function SearchResults({ results, loading }) {
  // ── State 1: Loading skeleton ──
  if (loading) {
    return (
      <div>
        {[1, 2, 3].map(i => (
          <div key={i} className="match-card animate-fade-in" style={{ marginBottom: '0.75rem' }}>
            <div className="match-card-indicator" style={{ background: 'var(--color-border)' }} />
            <div className="match-card-body">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text-sm" />
            </div>
            <div className="match-card-percentage">
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── State 2a: Not searched yet (null) ──
  if (!results) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div className="empty-state-title">Upload a file to search</div>
        <div className="empty-state-text">
          We'll check for exact SHA-256 matches and visually similar content in the registry.
        </div>
      </div>
    )
  }

  // ── State 2b: Searched but no matches ──
  if (results.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="empty-state-title">No matches found</div>
        <div className="empty-state-text">
          This content hasn't been registered yet. You can be the first to register it!
        </div>
      </div>
    )
  }

  // ── State 3: Render match cards ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {results.map((result, index) => (
        <MatchCard key={index} result={result} />
      ))}
    </div>
  )
}

/**
 * MatchCard — Individual match result card
 * 
 * Shows:
 * - Colored left border indicator (green = exact, orange = similar)
 * - Badge with match type
 * - Asset ID and media type
 * - Registration date
 * - Similarity percentage on the right
 */
function MatchCard({ result }) {
  const isExact = result.matchType === 'exact'
  const percentage = result.similarity || 0

  return (
    <div className="match-card animate-fade-in">
      {/* ── Left color indicator ── */}
      <div className={`match-card-indicator ${isExact ? 'exact' : 'similar'}`} />

      {/* ── Card body with match details ── */}
      <div className="match-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge ${isExact ? 'badge-success' : 'badge-warning'}`}>
            {isExact ? '✓ Exact Match' : '≈ Similar'}
          </span>
          <span className="text-cap">
            {result.mediaType || 'unknown'}
          </span>
        </div>

        {/* Asset ID from the hash engine */}
        {result.assetId && (
          <div style={{ fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Asset: </span>
            <span className="hash-tag">{result.assetId}</span>
          </div>
        )}

        {/* Creator address from the on-chain record */}
        {result.creator && (
          <div style={{ fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Creator: </span>
            <a
              href={`${ARBITRUM_SEPOLIA.explorer}/address/${result.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="address-tag"
            >
              {result.creator.slice(0, 10)}...{result.creator.slice(-6)}
            </a>
          </div>
        )}

        {/* Registration timestamp */}
        {result.registeredAt && (
          <div className="file-info-meta">
            Registered: {result.registeredAt}
          </div>
        )}
      </div>

      {/* ── Similarity percentage circle ── */}
      <div className="match-card-percentage">
        <div style={{ textAlign: 'center' }}>
          <div className="match-percentage-value" style={{
            color: isExact
              ? 'var(--color-success)'
              : percentage >= 80
                ? 'var(--color-warning)'
                : 'var(--color-text-muted)'
          }}>
            {percentage.toFixed(1)}%
          </div>
          <div className="match-percentage-label">match</div>
        </div>
      </div>
    </div>
  )
}
