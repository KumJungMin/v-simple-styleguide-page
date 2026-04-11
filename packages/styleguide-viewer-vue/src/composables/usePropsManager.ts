import { reactive, watch } from 'vue'
import type { PropDefinition } from 'styleguide-schema'
import { getDefaultPropsFromDefinitions } from 'styleguide-core'

export interface PropsManagerOptions {
  getProps: () => PropDefinition[] | undefined
}

export function usePropsManager(options: PropsManagerOptions) {
  const currentProps = reactive<Record<string, any>>({})

  watch(
    () => options.getProps(),
    props => {
      replaceCurrentProps(getDefaultPropsFromDefinitions(props ?? []))
    },
    { immediate: true }
  )

  function patchProps(nextProps: Record<string, any>) {
    Object.assign(currentProps, nextProps)
  }

  function replaceCurrentProps(nextProps: Record<string, unknown>) {
    Object.keys(currentProps).forEach(key => {
      delete currentProps[key]
    })

    Object.assign(currentProps, nextProps)
  }

  return {
    currentProps,
    patchProps,
  }
}
