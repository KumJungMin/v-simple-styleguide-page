import { ref, watch } from 'vue'

export type Tab = 'props' | 'events' | 'composition'

export interface TabManagerOptions {
  initialTab?: Tab
  onTabChange?: (tab: Tab) => void
  onCompositionTabLeave?: () => void
}

export function useTabManager(options: TabManagerOptions = {}) {
  const { initialTab = 'props', onTabChange, onCompositionTabLeave } = options
  const activeTab = ref<Tab>(initialTab)

  watch(activeTab, (newTab, oldTab) => {
    if (oldTab === 'composition' && newTab !== 'composition') {
      onCompositionTabLeave?.()
    }
  })

  function setActiveTab(tab: Tab) {
    activeTab.value = tab
    onTabChange?.(tab)
  }

  function tabClass(tab: Tab) {
    return ['tab-btn', { active: activeTab.value === tab }]
  }

  return {
    activeTab,
    setActiveTab,
    tabClass,
  }
}
