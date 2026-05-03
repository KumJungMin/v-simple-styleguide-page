import { useMemo, useState } from 'react'
import { StyleguideContainer } from 'styleguide-viewer'
import { componentDocs } from './docs'
import ColorTokensPage from './components/ColorTokensPage'

type DemoView = 'tokens' | 'components'

export default function App() {
  const [activeView, setActiveView] = useState<DemoView>('tokens')
  const activeViewMeta = useMemo(() => {
    if (activeView === 'tokens') {
      return {
        breadcrumb: 'Design System / Tokens / Color',
        title: 'Color tokens',
        summary: '도메인별로 정의된 색상 토큰 목록입니다. 각 토큰을 클릭하면 값이 복사됩니다.',
      }
    }

    return {
      breadcrumb: 'Design System / Components',
      title: 'Component spec',
      summary: '컴포넌트 스펙을 확인하고 Props, 이벤트, 프리뷰 사이즈를 함께 조정합니다.',
    }
  }, [activeView])

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <p className="demo-breadcrumb">{activeViewMeta.breadcrumb}</p>
        <h1>{activeViewMeta.title}</h1>
        <p className="demo-summary">{activeViewMeta.summary}</p>

        <nav className="demo-view-tabs" aria-label="Demo sections">
          <button
            className={`demo-view-tab${activeView === 'tokens' ? ' demo-view-tab--active' : ''}`}
            onClick={() => setActiveView('tokens')}
          >
            Color tokens
          </button>
          <button
            className={`demo-view-tab${activeView === 'components' ? ' demo-view-tab--active' : ''}`}
            onClick={() => setActiveView('components')}
          >
            Component spec
          </button>
        </nav>
      </header>

      <main className="demo-main">
        {activeView === 'tokens' ? (
          <ColorTokensPage />
        ) : (
          <section className="demo-components-section">
            <StyleguideContainer docs={componentDocs} />
          </section>
        )}
      </main>
    </div>
  )
}
