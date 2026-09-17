/** Fixed page ground: a faint dot grid that fades out, plus one soft light source at the top. */
export default function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-light" />
      <div className="ambient-dots" />
    </div>
  )
}
