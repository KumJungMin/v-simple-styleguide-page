import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ComponentDoc, NormalizedComponentDoc } from 'styleguide-schema'
import {
  createInitialCompositionEdits,
  createRendererRegistry,
  getDefaultCompositionExample,
  getDefaultPropsFromDefinitions,
  getResolvedCompositionContent,
  normalizeComponentDoc,
  type CompositionEditMap,
  type StyleguideRendererRegistry,
} from 'styleguide-core'
import { createDefaultReactRendererAdapter } from '../reactRenderer'
import { renderMarkdown } from '../hooks/useMarkdown'
import { usePreviewFrame } from '../hooks/usePreviewFrame'
import { cx } from '../utils'
import { CompositionTab } from './CompositionTab'
import { type Device, type DeviceBreakpoints, DeviceControls } from './DeviceControls'
import { EventsTab } from './EventsTab'
import { PropsTab } from './PropsTab'

const DEFAULT_BREAKPOINTS: DeviceBreakpoints = {
  custom: 375,
  mobile: 375,
  tablet: 768,
  desktop: 1200,
}

type Tab = 'props' | 'events' | 'composition'

interface WidgetComponentDocProps {
  doc?: ComponentDoc | NormalizedComponentDoc
  component?: unknown
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
  rendererRegistry?: StyleguideRendererRegistry
}

export function WidgetComponentDoc({
  doc,
  component,
  deviceBreakpoints,
  rendererRegistry,
}: WidgetComponentDocProps) {
  const effectiveDoc = useMemo(() => (doc ? normalizeComponentDoc(doc as ComponentDoc) : undefined), [doc])
  const effectiveComponent = component ?? effectiveDoc?.component
  const effectiveRegistry = useMemo(() => {
    return rendererRegistry ?? createRendererRegistry([createDefaultReactRendererAdapter()])
  }, [rendererRegistry])
  const renderedDescription = useMemo(() => renderMarkdown(effectiveDoc?.description), [effectiveDoc?.description])
  const compositionTabLabel = effectiveDoc?.composition?.kind === 'children' ? 'Children' : 'Slots'
  const resolvedBreakpoints = useMemo<DeviceBreakpoints>(() => {
    const merged = {
      mobile: DEFAULT_BREAKPOINTS.mobile,
      tablet: DEFAULT_BREAKPOINTS.tablet,
      desktop: DEFAULT_BREAKPOINTS.desktop,
      ...deviceBreakpoints,
    }

    return {
      ...merged,
      custom: merged.mobile,
    }
  }, [deviceBreakpoints])

  const [selectedDevice, setSelectedDevice] = useState<Device>('desktop')
  const [previewWidth, setPreviewWidthValue] = useState(DEFAULT_BREAKPOINTS.desktop)
  const [customWidth, setCustomWidth] = useState(DEFAULT_BREAKPOINTS.custom)
  const [currentProps, setCurrentProps] = useState<Record<string, unknown>>({})
  const [compositionEdits, setCompositionEdits] = useState<CompositionEditMap>({})
  const [activeEntry, setActiveEntry] = useState<string | null>(null)
  const [currentEntryEdit, setCurrentEntryEdit] = useState('')
  const [activeTab, setActiveTabState] = useState<Tab>('props')

  const compositionContent = useMemo(() => {
    return getResolvedCompositionContent(effectiveDoc?.composition?.kind, compositionEdits)
  }, [compositionEdits, effectiveDoc?.composition?.kind])

  const previewDoc = useMemo(() => {
    if (!effectiveDoc || !effectiveComponent) {
      return undefined
    }

    return {
      ...effectiveDoc,
      component: effectiveComponent,
    }
  }, [effectiveComponent, effectiveDoc])

  const { iframeRef, renderToIframe, eventLogs, clearEventLogs } = usePreviewFrame({
    doc: previewDoc,
    props: currentProps,
    composition: compositionContent,
    rendererRegistry: effectiveRegistry,
  })

  useEffect(() => {
    setCurrentProps(getDefaultPropsFromDefinitions(effectiveDoc?.props ?? []))
  }, [effectiveDoc])

  useEffect(() => {
    setCompositionEdits(createInitialCompositionEdits(effectiveDoc))
    setActiveEntry(null)
    setCurrentEntryEdit('')
  }, [effectiveDoc])

  useEffect(() => {
    clearEventLogs()
  }, [clearEventLogs, effectiveDoc?.id])

  useEffect(() => {
    const nextCustomWidth = customWidth || resolvedBreakpoints.custom || resolvedBreakpoints.mobile
    setPreviewWidthValue(getWidthForDevice(selectedDevice, resolvedBreakpoints, nextCustomWidth))
  }, [customWidth, resolvedBreakpoints, selectedDevice])

  useEffect(() => {
    renderToIframe()
  }, [renderToIframe])

  const handlePropsUpdate = useCallback((newProps: Record<string, unknown>) => {
    setCurrentProps(newProps)
  }, [])

  const setPreviewWidth = useCallback((device: Device) => {
    setSelectedDevice(device)
    setPreviewWidthValue(getWidthForDevice(device, resolvedBreakpoints, customWidth))
  }, [customWidth, resolvedBreakpoints])

  const updateCustomWidth = useCallback((width: number) => {
    const fallbackWidth = resolvedBreakpoints.mobile
    const nextWidth = Number.isFinite(width) && width > 0 ? width : fallbackWidth

    setCustomWidth(nextWidth)
    setPreviewWidthValue(currentWidth => (selectedDevice === 'custom' ? nextWidth : currentWidth))
  }, [resolvedBreakpoints.mobile, selectedDevice])

  const applyCustomWidth = useCallback(() => {
    setPreviewWidth('custom')
  }, [setPreviewWidth])

  const startEditEntry = useCallback((entryName: string) => {
    setActiveEntry(entryName)
    setCurrentEntryEdit(compositionEdits[entryName] ?? getDefaultCompositionExample(effectiveDoc, entryName))
  }, [compositionEdits, effectiveDoc])

  const applyEntryEdit = useCallback(() => {
    if (!activeEntry) {
      return
    }

    setCompositionEdits(previousEdits => ({
      ...previousEdits,
      [activeEntry]: currentEntryEdit,
    }))
    setActiveEntry(null)
    setCurrentEntryEdit('')
  }, [activeEntry, currentEntryEdit])

  const cancelEntryEdit = useCallback(() => {
    setActiveEntry(null)
    setCurrentEntryEdit('')
  }, [])

  const setActiveTab = useCallback((tab: Tab) => {
    setActiveTabState(previousTab => {
      if (previousTab === 'composition' && tab !== 'composition') {
        setActiveEntry(null)
        setCurrentEntryEdit('')
      }

      return tab
    })
  }, [])

  if (!effectiveDoc) {
    return null
  }

  return (
    <div className="component-doc">
      <header className="component-doc-header">
        <p className="component-doc-eyebrow">{effectiveDoc.framework} component</p>
        <h2 className="component-doc-title">{effectiveDoc.title}</h2>
        <div className="component-doc-meta">
          <span className="component-doc-badge">props {effectiveDoc.props.length}</span>
          <span className="component-doc-badge">events {effectiveDoc.events.length}</span>
          <span className="component-doc-badge">
            {effectiveDoc.composition?.kind === 'children' ? 'children' : 'slots'}{' '}
            {effectiveDoc.composition?.entries.length ?? 0}
          </span>
        </div>
      </header>

      <div className="description" dangerouslySetInnerHTML={{ __html: renderedDescription }}></div>

      <section className="playground-section">
        <h2 className="sr-only">Playground</h2>
        <DeviceControls
          customWidth={customWidth}
          previewWidth={previewWidth}
          selectedDevice={selectedDevice}
          onApply={applyCustomWidth}
          onCustomWidthChange={updateCustomWidth}
          onSelect={setPreviewWidth}
        />
        <iframe
          ref={iframeRef}
          style={{ width: `${previewWidth}px`, height: '500px' }}
          className="playground-iframe"
        ></iframe>
      </section>

      <section className="doc-tabs-section">
        <div className="tabs">
          <button className={tabClass(activeTab, 'props')} onClick={() => setActiveTab('props')}>
            Props
          </button>
          <button className={tabClass(activeTab, 'events')} onClick={() => setActiveTab('events')}>
            Events
          </button>
          <button className={tabClass(activeTab, 'composition')} onClick={() => setActiveTab('composition')}>
            {compositionTabLabel}
          </button>
        </div>

        {activeTab === 'props' && (
          <PropsTab
            currentProps={currentProps}
            props={effectiveDoc.props}
            onCurrentPropsChange={handlePropsUpdate}
          />
        )}
        {activeTab === 'events' && <EventsTab eventLogs={eventLogs} events={effectiveDoc.events} />}
        {activeTab === 'composition' && (
          <CompositionTab
            activeEntry={activeEntry}
            composition={effectiveDoc.composition}
            currentEntryEdit={currentEntryEdit}
            entries={effectiveDoc.composition?.entries}
            onApplyEntryEdit={applyEntryEdit}
            onCancelEntryEdit={cancelEntryEdit}
            onCurrentEntryEditChange={setCurrentEntryEdit}
            onEditEntry={startEditEntry}
          />
        )}
      </section>
    </div>
  )
}

function tabClass(activeTab: Tab, tab: Tab) {
  return cx('tab-btn', activeTab === tab && 'active')
}

function getWidthForDevice(device: Device, breakpoints: DeviceBreakpoints, customWidth: number) {
  if (device === 'custom') {
    return customWidth || breakpoints.custom || breakpoints.mobile
  }

  return breakpoints[device]
}
