# Vue 3 Styleguide Library

Vue 3 컴포넌트를 위한 인터랙티브 스타일가이드 모듈입니다. 컴포넌트의 Props, Emits, Slots를 실시간으로 편집하고 미리보기할 수 있는 플레이그라운드를 제공합니다. (<a href="https://style-guide-list-demo.netlify.app/">demo</a>)

## 🚀 주요 기능

- **실시간 컴포넌트 미리보기**: iframe을 통한 격리된 환경에서 컴포넌트 렌더링
- **Props 편집**: 타입별 입력 컨트롤 (text, number, boolean, select)
- **Emits 로깅**: 컴포넌트에서 발생하는 이벤트를 실시간으로 캡처
- **Slots 편집**: Named slots와 default slot을 실시간으로 편집
- **반응형 디바이스 미리보기**: 모바일, 태블릿, 데스크톱 뷰 지원
- **마크다운 문서화**: 컴포넌트 설명을 마크다운으로 작성


## 🎯 기본 사용법

### 1. 라이브러리 설정

```typescript
// main.ts
import { createApp } from 'vue'
import { createStyleguide } from 'vue-styleguide-lib'
import App from './App.vue'

const app = createApp(App)

// 스타일가이드 설정
app.use(createStyleguide({
  docs: [
    // 컴포넌트 문서들...
  ]
}))

app.mount('#app')
```

### 2. 컴포넌트 문서 작성

```typescript
// docs/Button.doc.ts
import Button from '../components/Button.vue'

export default {
  title: 'Button',
  description: `
# Button 컴포넌트

클릭 가능한 버튼 컴포넌트입니다.

## 사용법

\`\`\`vue
<Button variant="primary" size="large" @click="handleClick">
  클릭하세요
</Button>
\`\`\`
  `,
  component: Button,
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      default: 'primary',
      description: '버튼 스타일 변형',
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      default: 'medium',
      description: '버튼 크기',
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: '비활성화 상태'
    }
  ],
  emits: [
    {
      name: 'click',
      payload: 'MouseEvent',
      description: '버튼 클릭 시 발생하는 이벤트'
    }
  ],
  // Named slots 예제
  slotExamples: {
    default: '<span>기본 버튼 텍스트</span>',
    icon: '<svg>...</svg>'
  },
  slots: [
    {
      name: 'default',
      description: '버튼 내용'
    },
    {
      name: 'icon',
      description: '버튼 아이콘'
    }
  ]
}
```

### 3. 스타일가이드 페이지에서 사용

#### 방법 1: StyleguideContainer 사용

```vue
<!-- StyleguidePage.vue -->
<template>
  <div class="styleguide-page">
    <StyleguideContainer :docs="docs" />
  </div>
</template>

<script setup lang="ts">
import { StyleguideContainer } from 'vue-styleguide-lib'
import buttonDoc from './docs/Button.doc.ts'
import modalDoc from './docs/Modal.doc.ts'

const docs = [buttonDoc, modalDoc]
</script>
```

#### 방법 2: 개별 ComponentDoc 사용

```vue
<template>
  <div class="styleguide-page">
    <WidgetComponentDoc 
      :doc="buttonDoc"
      :component="Button"
    />
  </div>
</template>

<script setup lang="ts">
import { WidgetComponentDoc } from 'vue-styleguide-lib'
import buttonDoc from './docs/Button.doc.ts'
import Button from './components/Button.vue'
</script>
```

#### 방법 3: Plugin을 통한 전역 설정

```typescript
// main.ts
import { createApp } from 'vue'
import { createStyleguide } from 'vue-styleguide-lib'
import App from './App.vue'

const app = createApp(App)

// 스타일가이드 설정
app.use(createStyleguide({
  docs: [
    // 컴포넌트 문서들...
  ]
}))

app.mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <StyleguideContainer />
  </div>
</template>

<script setup lang="ts">
</script>
```

### 타입 정의

```typescript
// type/component-docs.ts
export interface ComponentDoc {
  title: string
  description?: string
  component: any
  props?: PropDefinition[]
  emits?: EmitDefinition[]
  slots?: SlotDefinition[]
  slotExamples?: Record<string, string>
}

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: any
  description?: string
  control?: 'string' | 'number' | 'boolean' | 'select'
  options?: string[]
}

export interface EmitDefinition {
  name: string
  payload: string
  description?: string
}

export interface SlotDefinition {
  name: string
  description?: string
}
```

## 🔧 고급 사용법

### 커스텀 Props 컨트롤

```typescript
{
  name: 'color',
  type: 'string',
  control: 'select',
  options: ['red', 'blue', 'green'],
  description: '색상 선택'
}
```

### Named Slots 예제

```typescript
{
  slotExamples: {
    header: '<h3 style="color: #2563eb;">커스텀 헤더</h3>',
    default: '<p>기본 내용</p>',
    footer: '<button>확인</button>'
  }
}
```

### 이벤트 로깅

컴포넌트에서 발생하는 이벤트는 자동으로 캡처되어 Emits 탭에 표시됩니다:

```vue
<!-- 컴포넌트 내부 -->
<button @click="$emit('click', { id: 1, value: 'test' })">
  클릭
</button>
```

### 반응형 미리보기

```typescript
const deviceBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1200
}
```

## 🎨 스타일링

라이브러리는 기본 스타일을 제공하지만, 필요에 따라 커스터마이징할 수 있습니다:

```css
/* 커스텀 스타일 */
.component-doc {
  --primary-color: #2563eb;
  --border-color: #e5e7eb;
  --background-color: #f9fafb;
}

.props-table th {
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.slot-editor {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}
```

## 🔍 디버깅

### 이벤트 로그 확인

Emits 탭에서 실시간으로 이벤트를 확인할 수 있습니다:

```
[12:34:56] click: { id: 1, value: "test" }
[12:34:57] submit: { formData: {...} }
```

### Props 변경 추적

Props 변경 시 자동으로 iframe이 업데이트되어 실시간으로 결과를 확인할 수 있습니다.
