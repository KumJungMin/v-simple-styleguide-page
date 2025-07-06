<template>
  <div class="component-doc">
    <div class="description" v-html="renderedDescription"></div>

    <!-- Playground ----------------------------------------------------------------->
    <section class="playground-section">
      <h2 class="sr-only">Playground</h2>
      <DeviceControls
        :preview-width="previewWidth"
        :custom-width="customWidth"
        @select="onSelect"
        @update:custom-width="updateCustomWidth"
        @apply="onApply"
      />

      <iframe
        ref="iframeRef"
        class="playground-iframe"
        :style="{ width: previewWidth + 'px', height: iframeHeight + 'px' }"
      ></iframe>
    </section>

    <!-- Tabs ------------------------------------------------------------------------>
    <section class="doc-tabs-section">
      <div class="tabs">
        <button :class="tabClass('props')" @click="activeTab='props'">Props</button>
        <button :class="tabClass('emits')" @click="activeTab='emits'">Emits</button>
        <button :class="tabClass('slots')" @click="activeTab='slots'">Slots</button>
      </div>

      <!-- Props Tab Content -->
      <div v-if="activeTab==='props'" class="tab-content props-tab">
        <table class="props-table" aria-label="Component props">
          <thead>
            <tr>
              <th>이름</th>
              <th>타입</th>
              <th>필수</th>
              <th>설명</th>
              <th>값 편집</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in effectiveDoc?.props" :key="prop.name">
              <td>{{ prop.name }}</td>
              <td><code>{{ prop.type }}</code></td>
              <td class="text-center">{{ prop.required ? '✓' : '' }}</td>
              <td>{{ prop?.description }}</td>
              <td>
                <div class="flex flex-col gap-1">
                  <template v-if="getMode(prop)==='select'">
                    <select class="prop-input" v-model="currentProps[prop.name]" :id="'prop-' + prop.name">
                      <option v-for="val in getSelectOptions(prop)" :key="val" :value="val">{{ val }}</option>
                    </select>
                  </template>
                  <template v-else-if="getMode(prop)==='boolean'">
                    <input type="checkbox" :id="'prop-' + prop.name" v-model="currentProps[prop.name]" />
                  </template>
                  <template v-else-if="getMode(prop)==='number'">
                    <input type="number" class="prop-input" v-model.number="currentProps[prop.name]" :id="'prop-' + prop.name" />
                  </template>
                  <template v-else>
                    <input type="text" class="prop-input" v-model="currentProps[prop.name]" :id="'prop-' + prop.name" />
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Emits Tab Content -->
      <div v-else-if="activeTab==='emits'" class="tab-content emits-tab">
        <table class="props-table" aria-label="Component emits">
          <thead>
            <tr>
              <th>이벤트</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emit in effectiveDoc?.emits" :key="emit.name">
              <td><code>{{ emit.name }}</code></td>
              <td><code>{{ emit.payload }}</code></td>
              <td>{{ emit.description }}</td>
            </tr>
          </tbody>
        </table>

        <div class="emits-log" v-if="emitLogs.length">
          <h3>이벤트 로그</h3>
          <div class="log-container">
            <div v-for="(log, idx) in emitLogs" :key="idx" class="log-entry">
              <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
              <span class="event-name">{{ log.event }}</span>
              <pre class="event-payload">{{ JSON.stringify(log.payload, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Slots Tab Content -->
      <div v-else class="tab-content slots-tab">
        <h3>Slots</h3>
        <div v-if="effectiveDoc && effectiveDoc.slots && effectiveDoc.slots.length">
          <table class="slot-table" aria-label="Component slots">
            <thead>
              <tr>
                <th>이름</th>
                <th>설명</th>
                <th class="action-cell">액션</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in effectiveDoc.slots" :key="slot.name">
                <td><code>{{ slot.name }}</code></td>
                <td>{{ slot.description || '-' }}</td>
                <td>
                  <button 
                    @click="startEditSlot(slot.name)"
                    class="edit-btn"
                  >
                    수정
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Slot 에디터 (단일) -->
          <div v-if="editingSlot" class="slot-editor">
            <div class="editor-container">
              <div class="editor-header">
                <div class="editor-title">
                  <div class="editor-indicator"></div>
                  <h4>{{ editingSlot }} slot 편집</h4>
                </div>
                <div class="editor-actions">
                  <button 
                    @click="applySlotEdit"
                    class="btn btn-apply"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    반영
                  </button>
                  <button 
                    @click="cancelSlotEdit"
                    class="btn btn-cancel"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    취소
                  </button>
                </div>
              </div>
              <div class="textarea-container">
                <textarea 
                  v-model="currentSlotEdit"
                  class="slot-textarea"
                  :placeholder="`${editingSlot} slot 내용을 입력하세요...`"
                ></textarea>
                <div class="char-counter">
                  {{ currentSlotEdit.length }} chars
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <table class="slot-table" aria-label="Component slots">
            <thead>
              <tr>
                <th>이름</th>
                <th>설명</th>
                <th class="action-cell">액션</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>default</code></td>
                <td>기본 슬롯 (children)</td>
                <td>
                  <button 
                    @click="startEditSlot('default')"
                    class="edit-btn"
                  >
                    수정
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Default slot 에디터 (단일) -->
          <div v-if="editingSlot === 'default'" class="slot-editor">
            <div class="editor-container">
              <div class="editor-header">
                <div class="editor-title">
                  <div class="editor-indicator"></div>
                  <h4>default slot 편집</h4>
                </div>
                <div class="editor-actions">
                  <button 
                    @click="applySlotEdit"
                    class="btn btn-apply"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    반영
                  </button>
                  <button 
                    @click="cancelSlotEdit"
                    class="btn btn-cancel"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    취소
                  </button>
                </div>
              </div>
              <div class="textarea-container">
                <textarea 
                  v-model="currentSlotEdit"
                  class="slot-textarea"
                  placeholder="default slot 내용을 입력하세요..."
                ></textarea>
                <div class="char-counter">
                  {{ currentSlotEdit.length }} chars
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, nextTick, inject, withDefaults } from 'vue'
import { useMarkdown } from '../composables/useMarkdown'
import type { ComponentDoc, PropDefinition } from '../../type/component-docs'
import { StyleguideDocsKey } from '../symbols'
import { useDevicePreview, Device } from '../composables/useDevicePreview'
import { isBoolean, isNumber, enumValues } from '../utils/typeUtils'
import { formatTimestamp } from '../utils/dateUtils'
import { useIframeRenderer } from '../composables/useIframeRenderer'
import DeviceControls from './DeviceControls.vue'

const defaultBreakpoints: Record<Device, number> = {
  custom: 375,
  mobile: 375,
  tablet: 768,
  desktop: 1200
}

const props = withDefaults(defineProps<{
  doc?: ComponentDoc
  component?: any
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}>(), {})

const injectedDocs = inject<ComponentDoc[]>(StyleguideDocsKey, [])


const { renderMarkdown } = useMarkdown()

const effectiveDoc = computed<ComponentDoc | undefined>(() => props.doc ?? injectedDocs[0])


if (!effectiveDoc.value) {
  throw new Error('No doc available for WidgetComponentDoc. Please pass `doc` prop or provide docs via createStyleguide().')
}

const effectiveComponent = computed<any>(() => props.component ?? (effectiveDoc.value as any)?.component)
const renderedDescription = computed(() => renderMarkdown(effectiveDoc.value?.description))
const deviceBreakpoints = computed(() => ({ ...defaultBreakpoints, ...props.deviceBreakpoints })) 

const { previewWidth, customWidth, setPreviewWidth, updateCustomWidth, applyCustomWidth } = useDevicePreview(deviceBreakpoints.value);


type Tab = 'props' | 'emits' | 'slots'
const activeTab = ref<Tab>('props')

function tabClass(tab: Tab) {
  const isActive = activeTab.value === tab
  return [ 'tab-btn', { active: isActive } ]
}

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeHeight = 500


const currentProps = reactive<Record<string, any>>(getDefaultPropsFromDefinitions(effectiveDoc.value?.props))

function getDefaultPropsFromDefinitions(props?: PropDefinition[]): Record<string, any> {
  const out: Record<string, any> = {}
  if (!props) return out
  for (const p of props) {
    if (p.default !== undefined) {
      out[p.name] = p.default
    } else if (p.required) {
      if (isBoolean(p.type)) {
        out[p.name] = false
      } else if (isNumber(p.type)) {
        out[p.name] = 0
      } else if (p.type.includes('string') || p.type.includes('String')) {
        out[p.name] = ''
      } else {
        out[p.name] = ''
      }
    }
  }
  return out
}

type InputMode = 'string' | 'number' | 'select' | 'boolean'

function getMode(prop: PropDefinition): InputMode {
  const ctrl = (prop as any).control as InputMode | undefined

  if (ctrl) return ctrl
  if (isBoolean(prop.type)) return 'boolean'
  if (isNumber(prop.type)) return 'number'
  if (enumValues(prop.type).length) return 'select'
  return 'string'
}

function getSelectOptions(prop: PropDefinition): string[] {
  const explicit = (prop as any).options as string[] | undefined
  if (explicit?.length) return explicit
  return enumValues(prop.type)
}

// 예제값 덮어쓰기(있다면)
if (effectiveDoc.value?.examples?.length && effectiveDoc.value.examples[0].props) {
  Object.assign(currentProps, effectiveDoc.value.examples[0].props)
}

// Slot edits 초기화
const slotEdits = reactive<Record<string, string>>({})

// slotEdits 초기화 함수
function initializeSlotEdits() {
  // 기존 값들 초기화
  Object.keys(slotEdits).forEach(key => delete slotEdits[key])
  
  // 1. namedSlots 객체에서 값 가져오기 (docs에서 직접 선언한 named slot들)
  if (effectiveDoc.value?.namedSlots) {
    Object.entries(effectiveDoc.value.namedSlots).forEach(([name, content]) => {
      slotEdits[name] = content
    })
  }
  
  // 2. slots 배열에서 값 가져오기 (기본값 설정용)
  if (effectiveDoc.value?.slots) {
    effectiveDoc.value.slots.forEach(slot => {
      // 이미 namedSlots에서 설정된 값이 있으면 건너뛰기
      if (!slotEdits[slot.name]) {
        slotEdits[slot.name] = ''
      }
    })
  }
  
  // 3. legacy 지원 (default slot만 있는 경우)
  if (!Object.keys(slotEdits).length) {
    const defaultValue = effectiveDoc.value?.slot || effectiveDoc.value?.defaultSlot || ''
    if (defaultValue) {
      slotEdits['default'] = defaultValue
    }
  }
}

// effectiveDoc 변경시 slotEdits 초기화 및 이벤트 로그 초기화
watch(
  effectiveDoc,
  () => {
    initializeSlotEdits()
    // 편집 상태도 초기화
    editingSlot.value = null
    currentSlotEdit.value = ''
    // 다른 컴포넌트로 이동시 이벤트 로그 초기화
    clearEmitLogs()
  }
)

// -----------------------------------------------------------------------------
// Render to iframe -------------------------------------------------------------
// -----------------------------------------------------------------------------

const { renderToIframe, emitLogs, clearEmitLogs } = useIframeRenderer(iframeRef, {
  effectiveComponent,
  currentProps,
  emitDefs: effectiveDoc.value?.emits ?? [],
  slotContent: computed(() => getSlotContent())
})

function getSlotContent(): string | Record<string, string> {
  // 1. 사용자가 편집한 값이 있는지 확인
  const editedSlots = getEditedSlots()
  if (Object.keys(editedSlots).length > 0) {
    return editedSlots
  }
  
  // 2. docs에서 선언한 named slot 기본값들 반환
  const namedSlots = getNamedSlots()
  if (Object.keys(namedSlots).length > 0) {
    return namedSlots
  }
  
  // 3. legacy slot 속성 확인
  if (effectiveDoc.value?.slot) {
    return effectiveDoc.value.slot
  }
  
  // 4. defaultSlot 속성 확인
  if (effectiveDoc.value?.defaultSlot) {
    return effectiveDoc.value.defaultSlot
  }
  
  return ''
}

function getEditedSlots(): Record<string, string> {
  const editedSlots: Record<string, string> = {}
  
  Object.entries(slotEdits).forEach(([name, content]) => {
    // 실제로 내용이 있는 경우만 포함 (빈 문자열이나 공백만 있는 경우 제외)
    if (content && content.trim()) {
      editedSlots[name] = content
    }
  })
  
  return editedSlots
}

function getNamedSlots(): Record<string, string> {
  const namedSlots: Record<string, string> = {}
  
  // namedSlots 객체 확인 (docs에서 직접 선언한 named slot들)
  if (effectiveDoc.value?.namedSlots) {
    Object.entries(effectiveDoc.value.namedSlots).forEach(([name, content]) => {
      if (content && content.trim()) {
        namedSlots[name] = content
      }
    })
  }
  
  return namedSlots
}

// Slot editing logic
const editingSlot = ref<string | null>(null)
const currentSlotEdit = ref('')

function startEditSlot(slotName: string) {
  editingSlot.value = slotName
  // 현재 slotEdits의 값 또는 docs의 기본값을 가져오기
  const currentValue = slotEdits[slotName] || getDefaultSlotValue(slotName)
  currentSlotEdit.value = currentValue
}

function getDefaultSlotValue(slotName: string): string {
  // namedSlots에서 기본값 가져오기
  if (effectiveDoc.value?.namedSlots && effectiveDoc.value.namedSlots[slotName]) {
    return effectiveDoc.value.namedSlots[slotName]
  }
  
  // legacy 지원
  if (slotName === 'default') {
    return effectiveDoc.value?.slot || effectiveDoc.value?.defaultSlot || ''
  }
  
  return ''
}

function applySlotEdit() {
  if (editingSlot.value) {
    slotEdits[editingSlot.value] = currentSlotEdit.value
    editingSlot.value = null
    currentSlotEdit.value = ''
    // 즉시 iframe 업데이트
    nextTick(() => {
      renderToIframe()
    })
  }
}

function cancelSlotEdit() {
  editingSlot.value = null
  currentSlotEdit.value = ''
}

function onSelect(device: Device) {
  setPreviewWidth(device);
  nextTick(renderToIframe);
}
function onApply() {
  applyCustomWidth();
  nextTick(renderToIframe);
}

onMounted(() => {
  // 초기화 실행
  initializeSlotEdits()
  nextTick(renderToIframe)
})

watch(
  currentProps,
  () => {
    nextTick(renderToIframe)
  },
  { deep: true }
)

// 탭 변경시 slot 편집 상태 초기화
watch(
  activeTab,
  (newTab) => {
    if (newTab !== 'slots') {
      // slots 탭이 아닌 다른 탭으로 변경시 편집 상태 초기화
      editingSlot.value = null
      currentSlotEdit.value = ''
    }
  }
)
</script>