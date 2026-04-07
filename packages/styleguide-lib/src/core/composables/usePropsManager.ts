import { reactive, watch } from 'vue'
import type { PropDefinition } from '../../type/component-docs'
import { getDefaultPropsFromDefinitions } from '../../shared/props/propSchema'

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

  function resetProps() {
    replaceCurrentProps(getDefaultPropsFromDefinitions(options.getProps() ?? []))
  }

  function patchProps(nextProps: Record<string, any>) {
    Object.assign(currentProps, nextProps)
  }

  function replaceCurrentProps(nextProps: Record<string, any>) {
    Object.keys(currentProps).forEach(key => {
      delete currentProps[key]
    })

    Object.assign(currentProps, nextProps)
  }

  return {
    currentProps,
    patchProps,
    resetProps,
  }
}
