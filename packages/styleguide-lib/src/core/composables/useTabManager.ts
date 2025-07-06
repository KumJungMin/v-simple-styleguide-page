import { ref, watch } from 'vue'

export type Tab = 'props' | 'emits' | 'slots'

export interface TabManagerOptions {
  initialTab?: Tab
  onTabChange?: (tab: Tab) => void
  onSlotsTabLeave?: () => void
}

export function useTabManager(options: TabManagerOptions = {}) {
  const { initialTab = 'props', onTabChange, onSlotsTabLeave } = options

  const activeTab = ref<Tab>(initialTab)

  watch(
    activeTab,
    (newTab, oldTab) => {
      if (oldTab === 'slots' && newTab !== 'slots') {
        onSlotsTabLeave?.()
      }
    }
  )

  function setActiveTab(tab: Tab) {
    activeTab.value = tab
    onTabChange?.(tab)
  }

  function tabClass(tab: Tab) {
    const isActive = activeTab.value === tab
    return ['tab-btn', { active: isActive }]
  }

  return {
    activeTab,
    setActiveTab,
    tabClass
  }
} 