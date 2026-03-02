import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .av-body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; background: #0f0f0f; color: #f5f0e8; }
        .av-nav { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #1e1e1e; background: rgba(15,15,15,0.94); backdrop-filter: blur(10px); }
        .av-nav-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
        .av-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .av-logo-icon { width: 28px; height: 28px; background: #d97706; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .av-logo-text { color: #f5f0e8; font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
        .av-nav-links { display: flex; gap: 28px; list-style: none; }
        .av-nav-links a { color: #6b6b6b; font-size: 14px; text-decoration: none; transition: color 0.15s; }
        .av-nav-links a:hover { color: #d97706; }
        .av-open-btn { background: #d97706; color: #0f0f0f; border-radius: 6px; padding: 8px 18px; font-size: 13px; text-decoration: none; font-weight: 700; letter-spacing: 0.01em; }
        .av-open-btn:hover { background: #b45309; }
        .av-hero { min-height: 90vh; display: flex; align-items: center; padding: 80px 24px; position: relative; overflow: hidden; }
        .av-hero::before { content: ''; position: absolute; top: 0; right: 0; width: 50%; height: 100%; background: radial-gradient(ellipse at 70% 50%, rgba(217,119,6,0.06) 0%, transparent 70%); pointer-events: none; }
        .av-hero-inner { max-width: 1080px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .av-hero-left {}
        .av-tag { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #2a2a2a; border-radius: 20px; padding: 4px 12px; margin-bottom: 32px; }
        .av-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #d97706; }
        .av-tag-text { color: #6b6b6b; font-size: 12px; font-weight: 500; letter-spacing: 0.03em; text-transform: uppercase; }
        .av-h1 { color: #f5f0e8; font-size: clamp(36px, 5vw, 60px); font-weight: 800; line-height: 1.08; letter-spacing: -0.04em; margin-bottom: 20px; }
        .av-h1-gold { color: #d97706; }
        .av-subtitle { color: #8a8a8a; font-size: 17px; line-height: 1.65; max-width: 480px; margin-bottom: 40px; }
        .av-ctas { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .av-cta-primary { background: #d97706; color: #0f0f0f; border-radius: 8px; padding: 13px 28px; font-size: 15px; text-decoration: none; font-weight: 700; }
        .av-cta-primary:hover { background: #b45309; }
        .av-cta-ghost { color: #6b6b6b; font-size: 14px; text-decoration: none; border: 1px solid #2a2a2a; border-radius: 8px; padding: 13px 20px; }
        .av-cta-ghost:hover { border-color: #404040; color: #9a9a9a; }
        .av-hero-right {}
        .av-vault-card { background: #141414; border: 1px solid #242424; border-radius: 12px; padding: 24px; }
        .av-vault-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .av-vault-title { color: #6b6b6b; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .av-vault-status { display: flex; align-items: center; gap: 6px; }
        .av-vault-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
        .av-vault-status-text { color: #22c55e; font-size: 11px; font-weight: 500; }
        .av-key-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 8px; margin-bottom: 8px; background: #0f0f0f; border: 1px solid #1e1e1e; }
        .av-key-item:last-child { margin-bottom: 0; }
        .av-key-left { display: flex; align-items: center; gap: 12px; }
        .av-key-icon { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .av-key-icon-amber { background: rgba(217,119,6,0.12); }
        .av-key-icon-green { background: rgba(34,197,94,0.1); }
        .av-key-icon-red { background: rgba(239,68,68,0.1); }
        .av-key-name { color: #e5e5e5; font-size: 13px; font-weight: 500; }
        .av-key-hash { color: #4b4b4b; font-size: 11px; font-family: 'SF Mono', 'Fira Code', monospace; margin-top: 1px; }
        .av-key-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .av-badge-active { color: #22c55e; background: rgba(34,197,94,0.1); }
        .av-badge-revoked { color: #ef4444; background: rgba(239,68,68,0.1); }
        .av-features { background: #0a0a0a; padding: 100px 24px; border-top: 1px solid #1a1a1a; }
        .av-section-inner { max-width: 1080px; margin: 0 auto; }
        .av-eyebrow { color: #d97706; font-size: 11px; letter-spacing: 0.15em; margin-bottom: 14px; text-transform: uppercase; font-weight: 600; }
        .av-h2 { color: #f5f0e8; font-size: clamp(28px, 4vw, 46px); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 64px; line-height: 1.1; }
        .av-h2 span { color: #d97706; }
        .av-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; border: 1px solid #1e1e1e; border-radius: 12px; overflow: hidden; }
        .av-feature-cell { background: #111; padding: 32px 28px; border-right: 1px solid #1e1e1e; border-bottom: 1px solid #1e1e1e; }
        .av-feature-num { color: #2a2a2a; font-size: 48px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 16px; line-height: 1; }
        .av-feature-title { color: #e5e5e5; font-size: 16px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.02em; }
        .av-feature-desc { color: #5a5a5a; font-size: 14px; line-height: 1.65; }
        .av-pricing { background: #0f0f0f; padding: 100px 24px; border-top: 1px solid #1a1a1a; }
        .av-pricing-inner { max-width: 820px; margin: 0 auto; }
        .av-pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2px; border: 1px solid #242424; border-radius: 12px; overflow: hidden; margin-top: 0; }
        .av-plan { padding: 40px 36px; background: #111; }
        .av-plan-featured { background: #141008; border-left: 2px solid #d97706; }
        .av-plan-label { color: #5a5a5a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; margin-bottom: 12px; }
        .av-plan-price { color: #f5f0e8; font-size: 48px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 4px; line-height: 1; }
        .av-plan-price span { font-size: 20px; color: #5a5a5a; font-weight: 400; }
        .av-plan-tagline { color: #4b4b4b; font-size: 13px; margin-bottom: 32px; }
        .av-plan-list { list-style: none; display: flex; flex-direction: column; gap: 11px; margin-bottom: 36px; }
        .av-plan-list li { color: #8a8a8a; font-size: 14px; display: flex; gap: 10px; align-items: flex-start; }
        .av-plan-list li span { color: #d97706; flex-shrink: 0; margin-top: 1px; }
        .av-plan-btn { display: block; text-align: center; border: 1px solid #2a2a2a; color: #8a8a8a; border-radius: 8px; padding: 12px 0; font-size: 14px; text-decoration: none; font-weight: 600; }
        .av-plan-btn:hover { border-color: #404040; color: #b0b0b0; }
        .av-plan-btn-primary { background: #d97706; color: #0f0f0f; border-color: #d97706; }
        .av-plan-btn-primary:hover { background: #b45309; border-color: #b45309; }
        .av-footer { background: #0a0a0a; border-top: 1px solid #1a1a1a; padding: 36px 24px; }
        .av-footer-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 16px; }
        .av-footer-brand { color: #3a3a3a; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
        .av-footer-links { display: flex; gap: 20px; }
        .av-footer-links a { color: #3a3a3a; font-size: 13px; text-decoration: none; }
        .av-footer-links a:hover { color: #5a5a5a; }
        @media (max-width: 768px) {
          .av-hero-inner { grid-template-columns: 1fr; }
          .av-hero-right { display: none; }
        }
      `}</style>

      <div className="av-body">
        {/* NAV */}
        <nav className="av-nav">
          <div className="av-nav-inner">
            <a href="/" className="av-logo">
              <div className="av-logo-icon">⬡</div>
              <span className="av-logo-text">APIVault</span>
            </a>
            <ul className="av-nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="https://github.com/SpencerStiles/apivault">GitHub</a></li>
            </ul>
            <Link href="/dashboard" className="av-open-btn">
              Open Dashboard
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="av-hero">
          <div className="av-hero-inner">
            <div className="av-hero-left">
              <div className="av-tag">
                <div className="av-tag-dot" />
                <span className="av-tag-text">MIT Open Source</span>
              </div>
              <h1 className="av-h1">
                Your keys.<br />
                <span className="av-h1-gold">Locked down.</span>
              </h1>
              <p className="av-subtitle">
                Generate, revoke, and monitor API keys with per-key analytics.
                Know exactly who is calling your API and when.
              </p>
              <div className="av-ctas">
                <Link href="/dashboard" className="av-cta-primary">
                  Get Started Free
                </Link>
                <a href="https://github.com/SpencerStiles/apivault" className="av-cta-ghost">
                  View Source
                </a>
              </div>
            </div>

            {/* Vault UI mockup */}
            <div className="av-hero-right">
              <div className="av-vault-card">
                <div className="av-vault-header">
                  <span className="av-vault-title">Production Keys</span>
                  <div className="av-vault-status">
                    <div className="av-vault-status-dot" />
                    <span className="av-vault-status-text">3 active</span>
                  </div>
                </div>

                {[
                  { icon: '⚡', iconClass: 'av-key-icon-amber', name: 'Production API', hash: 'sk_live_••••••••••••4f2a', badge: 'Active', badgeClass: 'av-badge-active' },
                  { icon: '⚗', iconClass: 'av-key-icon-green', name: 'Staging API', hash: 'sk_test_••••••••••••9c1d', badge: 'Active', badgeClass: 'av-badge-active' },
                  { icon: '⊘', iconClass: 'av-key-icon-red', name: 'Old Mobile App', hash: 'sk_live_••••••••••••7b3e', badge: 'Revoked', badgeClass: 'av-badge-revoked' },
                ].map((key) => (
                  <div key={key.name} className="av-key-item">
                    <div className="av-key-left">
                      <div className={`av-key-icon ${key.iconClass}`}>{key.icon}</div>
                      <div>
                        <div className="av-key-name">{key.name}</div>
                        <div className="av-key-hash">{key.hash}</div>
                      </div>
                    </div>
                    <span className={`av-key-badge ${key.badgeClass}`}>{key.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="av-features">
          <div className="av-section-inner">
            <p className="av-eyebrow">Why APIVault</p>
            <h2 className="av-h2">
              Every key, under<br />
              <span>your control.</span>
            </h2>
            <div className="av-grid-3">
              {[
                {
                  num: '01',
                  title: 'Project Isolation',
                  desc: 'Group keys by project. Revoke an entire project in one click without touching others.',
                },
                {
                  num: '02',
                  title: 'Per-Key Analytics',
                  desc: 'Request counts, last-seen timestamps, and usage trends per key — not just aggregate totals.',
                },
                {
                  num: '03',
                  title: 'Instant Revocation',
                  desc: 'Compromised key? Revoke it instantly. No propagation delay. No downtime for other keys.',
                },
                {
                  num: '04',
                  title: 'Secure Hashing',
                  desc: 'Keys are stored as bcrypt hashes. Even a database breach exposes nothing usable.',
                },
                {
                  num: '05',
                  title: 'Prefix Identifiers',
                  desc: 'Human-readable key prefixes (sk_live_, sk_test_) so you always know which key is which.',
                },
                {
                  num: '06',
                  title: 'Self-Hostable',
                  desc: 'Your infrastructure, your data. Deploy to any Postgres-backed host in minutes.',
                },
              ].map((f) => (
                <div key={f.num} className="av-feature-cell">
                  <div className="av-feature-num">{f.num}</div>
                  <h3 className="av-feature-title">{f.title}</h3>
                  <p className="av-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="av-pricing">
          <div className="av-pricing-inner">
            <p className="av-eyebrow">Pricing</p>
            <h2 className="av-h2">Start free. Scale when ready.</h2>
            <div className="av-pricing-grid">
              <div className="av-plan">
                <p className="av-plan-label">Self-Hosted</p>
                <div className="av-plan-price">$0</div>
                <p className="av-plan-tagline">MIT license. Forever.</p>
                <ul className="av-plan-list">
                  {[
                    'Full source code on GitHub',
                    'Unlimited projects & keys',
                    'Self-managed database',
                    'Community support',
                  ].map((item) => (
                    <li key={item}><span>→</span> {item}</li>
                  ))}
                </ul>
                <a href="https://github.com/SpencerStiles/apivault" className="av-plan-btn">
                  Clone on GitHub
                </a>
              </div>
              <div className="av-plan av-plan-featured">
                <p className="av-plan-label">Hosted</p>
                <div className="av-plan-price">$15<span>/mo</span></div>
                <p className="av-plan-tagline">We handle the ops.</p>
                <ul className="av-plan-list">
                  {[
                    'Everything in self-hosted',
                    'Managed PostgreSQL backup',
                    'Uptime monitoring',
                    'Email support',
                    'One-click deploy',
                  ].map((item) => (
                    <li key={item}><span>→</span> {item}</li>
                  ))}
                </ul>
                <Link href="/dashboard" className="av-plan-btn av-plan-btn-primary">
                  Get Started →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="av-footer">
          <div className="av-footer-inner">
            <span className="av-footer-brand">APIVault</span>
            <div className="av-footer-links">
              <a href="https://github.com/SpencerStiles/apivault">GitHub</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
