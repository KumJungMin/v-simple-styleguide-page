import { useEffect, useMemo, useState } from 'react'
import type { ComponentDocsSource, NormalizedComponentDoc } from 'styleguide-schema'
import { createRendererRegistry, normalizeDocs, type StyleguideRendererAdapter } from 'styleguide-core'
import { createDefaultRendererAdapter } from '../renderer'
import type { Device } from './DeviceControls'
import { WidgetComponentDoc } from './WidgetComponentDoc'
import { cx } from '../utils'

interface StyleguideContainerProps {
  docs?: ComponentDocsSource
  renderers?: StyleguideRendererAdapter[]
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}

export function StyleguideContainer({
  docs,
  renderers = [],
  deviceBreakpoints,
}: StyleguideContainerProps) {
  const [activeDocIndex, setActiveDocIndex] = useState(0)
  const effectiveDocs = useMemo(() => normalizeStyleguideDocs(docs), [docs])
  const activeDoc = effectiveDocs[activeDocIndex] ?? effectiveDocs[0]
  const rendererRegistry = useMemo(() => {
    return createRendererRegistry([createDefaultRendererAdapter(), ...renderers])
  }, [renderers])

  useEffect(() => {
    if (effectiveDocs.length === 0 || activeDocIndex >= effectiveDocs.length) {
      setActiveDocIndex(0)
    }
  }, [activeDocIndex, effectiveDocs.length])

  return (
    <div className="styleguide-container">
      {effectiveDocs.length > 0 && (
        <nav className="styleguide-nav">
          <p className="styleguide-nav-label">Components</p>
          <div className="nav-tabs">
            {effectiveDocs.map((doc, index) => (
              <button
                key={`${doc.id}-${index}`}
                className={cx('nav-tab', activeDocIndex === index && 'nav-tab--active')}
                onClick={() => setActiveDocIndex(index)}
              >
                <span className="nav-tab-dot" aria-hidden="true"></span>
                <span className="nav-tab-copy">
                  <span className="nav-tab-title">{doc.title}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="styleguide-content">
        {effectiveDocs.length === 0 ? (
          <div className="no-docs">
            <h2>문서가 없습니다</h2>
            <p>문서를 추가해주세요. (로드된 문서: 0개)</p>
          </div>
        ) : (
          activeDoc && (
            <WidgetComponentDoc
              component={activeDoc.component}
              deviceBreakpoints={deviceBreakpoints}
              doc={activeDoc}
              rendererRegistry={rendererRegistry}
            />
          )
        )}
      </main>
    </div>
  )
}

function normalizeStyleguideDocs(docs?: ComponentDocsSource): NormalizedComponentDoc[] {
  return docs ? normalizeDocs(docs) : []
}
