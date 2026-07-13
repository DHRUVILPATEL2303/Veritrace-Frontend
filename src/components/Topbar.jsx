/**
 * Topbar.jsx — Network status indicator + faucet marquee
 * 
 * Shows "Arbitrum Sepolia Testnet" badge with a green pulse dot,
 * and a scrolling banner linking to the Lampros DAO Faucet for
 * free testnet ETH (no mainnet ETH required).
 */
export default function Topbar() {
  return (
    <>
      {/* ── Dark topbar showing active network ── */}
      <section className="topbar">
        <div className="container">
          <div className="topbar-badge">
            <span className="dot"></span>
            Arbitrum Sepolia Testnet
          </div>
          <div className="topbar-right">
            <span>VeriTrace Content Registry</span>
          </div>
        </div>
      </section>

      {/* ── Scrolling faucet banner ──
          Uses 3 copies of the message for a seamless infinite loop.
          CSS animation translates by -33.33% (1 copy width) to loop.
          Hovering pauses the scroll so users can click the link. */}
      <div className="marquee-banner">
        <div className="marquee-track">
          <span className="marquee-content">
            🚰 Need free testnet ETH? Get 0.01 Arbitrum Sepolia ETH from the&nbsp;
            <a href="https://faucet.lamprosdao.com/" target="_blank" rel="noopener noreferrer">Lampros DAO Faucet</a>
            &nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
            🚰 Need free testnet ETH? Get 0.01 Arbitrum Sepolia ETH from the&nbsp;
            <a href="https://faucet.lamprosdao.com/" target="_blank" rel="noopener noreferrer">Lampros DAO Faucet</a>
            &nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
            🚰 Need free testnet ETH? Get 0.01 Arbitrum Sepolia ETH from the&nbsp;
            <a href="https://faucet.lamprosdao.com/" target="_blank" rel="noopener noreferrer">Lampros DAO Faucet</a>
            &nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </>
  )
}
