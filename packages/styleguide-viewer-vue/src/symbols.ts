import type { InjectionKey } from 'vue'
import type { NormalizedComponentDoc } from 'styleguide-schema'
import type { StyleguideRendererRegistry } from 'styleguide-core'

export const StyleguideDocsKey: InjectionKey<NormalizedComponentDoc[]> = Symbol('StyleguideDocs')
export const StyleguideRendererRegistryKey: InjectionKey<StyleguideRendererRegistry> = Symbol('StyleguideRendererRegistry')
