import { useMemo, useState } from 'react'
import { colorTokenDomains, type ColorTokenItem } from '../data/colorTokens'

export default function ColorTokensPage() {
  const [activeDomainId, setActiveDomainId] = useState(colorTokenDomains[0]?.id ?? '')
  const [copiedTokenName, setCopiedTokenName] = useState('')
  const activeDomain = useMemo(() => {
    return colorTokenDomains.find(domain => domain.id === activeDomainId) ?? colorTokenDomains[0]
  }, [activeDomainId])

  async function copyToken(token: ColorTokenItem) {
    const copiedText = `${token.name}: ${token.value};`

    try {
      await navigator.clipboard.writeText(copiedText)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = copiedText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    setCopiedTokenName(token.name)

    window.setTimeout(() => {
      setCopiedTokenName(currentName => (currentName === token.name ? '' : currentName))
    }, 1600)
  }

  return (
    <div className="tokens-page">
      <div className="tokens-tabs" role="tablist" aria-label="Color token domains">
        {colorTokenDomains.map(domain => (
          <button
            key={domain.id}
            className={`tokens-tab${domain.id === activeDomainId ? ' tokens-tab--active' : ''}`}
            onClick={() => setActiveDomainId(domain.id)}
          >
            {domain.label}
          </button>
        ))}
      </div>

      {activeDomain && (
        <section className="tokens-domain">
          <header className="tokens-domain-header">
            <h2>{activeDomain.label}</h2>
            <p>{activeDomain.description}</p>
          </header>

          {activeDomain.sections.map(section => (
            <section key={section.title} className="token-section">
              <h3>{section.title}</h3>
              <div className="token-grid">
                {section.tokens.map(token => (
                  <button key={token.name} className="token-card" type="button" onClick={() => copyToken(token)}>
                    <span className="token-swatch" style={{ backgroundColor: token.value }}></span>
                    <span className="token-copy-state">
                      {copiedTokenName === token.name ? 'copied' : 'click to copy'}
                    </span>
                    <span className="token-name">{token.name}</span>
                    <span className="token-value">{token.value}</span>
                    <span className="token-description">{token.description}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </section>
      )}
    </div>
  )
}
