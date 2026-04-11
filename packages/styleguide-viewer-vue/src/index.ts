import './styles/styleguide-viewer.css'

export { default as WidgetComponentDoc } from './components/ComponentDoc.vue'
export { default as StyleguideContainer } from './components/StyleguideContainer.vue'
export { createStyleguideViewer } from './plugin'
export type { StyleguideViewerOptions, StyleguideViewerStyles } from './plugin'
export { StyleguideDocsKey, StyleguideRendererRegistryKey } from './symbols'
