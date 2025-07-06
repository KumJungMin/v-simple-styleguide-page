import type { InjectionKey } from 'vue'
import type { ComponentDoc } from '../type/component-docs'

export const StyleguideDocsKey: InjectionKey<ComponentDoc[]> = Symbol('StyleguideDocs')