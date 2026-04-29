# Styleguide Study Guide

이 문서는 이 저장소를 처음 보는 사람이 실행 흐름 기준으로 차근차근 이해할 수 있도록 정리한 학습 노트입니다.

## 전체 학습 단계

1. 데모 앱의 시작점 이해
2. 문서 한 개가 어떤 구조인지 이해
3. 문서가 공통 형태로 normalize 되는 과정 이해
4. 뷰어 UI가 문서를 어떻게 보여주는지 이해
5. iframe preview 실행 흐름 이해
6. Vue/React 런타임 차이 이해
7. props, events, composition 편집 흐름 이해

---

## 1단계. 데모 앱의 시작점 이해

### 이번 단계의 목표

- 앱이 어디서 시작되는지 이해한다.
- 어떤 문서들이 스타일가이드 뷰어로 들어가는지 이해한다.
- Vue UI 셸과 React renderer가 어디서 연결되는지 이해한다.

### 이번 단계에서 볼 파일

- `apps/styleguide-demo/src/main.ts`
- `apps/styleguide-demo/src/App.vue`
- `apps/styleguide-demo/src/docs/index.ts`

### 먼저 큰 그림

이 단계에서는 아래 흐름만 잡으면 충분합니다.

1. `main.ts`가 앱을 시작한다.
2. `main.ts`가 `createStyleguideViewer(...)` 플러그인을 설치한다.
3. 이때 `componentDocs`와 React renderer를 함께 넘긴다.
4. `App.vue`는 토큰 화면 또는 컴포넌트 화면을 보여준다.
5. 컴포넌트 화면에서는 `StyleguideContainer`가 `componentDocs`를 렌더링한다.

즉, 데모 앱은 직접 복잡한 preview를 하지 않고, 필요한 문서와 renderer만 연결해주는 역할을 합니다.

### 1-1. `apps/styleguide-demo/src/main.ts`

이 파일은 앱의 진입점입니다.

```ts
import { createApp } from 'vue'
import { createReactRendererAdapter } from 'styleguide-runtime-react'
import App from './App.vue'
import './style.css'
import { createStyleguideViewer } from 'styleguide-viewer-vue'
import { componentDocs } from './docs'
import { reactRendererBridge } from './react/rendererBridge'

const app = createApp(App)

app.use(createStyleguideViewer({
  docs: componentDocs,
  renderers: [createReactRendererAdapter(reactRendererBridge)],
}))

app.mount('#app')
```

여기서 중요한 포인트는 4개입니다.

- `createApp(App)`
  - Vue 앱을 시작합니다.
- `createStyleguideViewer(...)`
  - 스타일가이드 UI 플러그인을 설치합니다.
- `docs: componentDocs`
  - 어떤 컴포넌트 문서들을 보여줄지 전달합니다.
- `renderers: [createReactRendererAdapter(reactRendererBridge)]`
  - 기본 Vue renderer 외에 React renderer도 추가 등록합니다.

### `main.ts`에서 각 패키지의 역할

- `styleguide-viewer-vue`
  - 사람이 보게 될 스타일가이드 UI를 제공합니다.
- `styleguide-runtime-react`
  - React 컴포넌트를 iframe 안에 렌더링할 수 있는 adapter를 제공합니다.
- `apps/styleguide-demo/src/docs`
  - 데모에서 보여줄 Vue/React 문서 목록을 제공합니다.
- `apps/styleguide-demo/src/react/rendererBridge.ts`
  - React adapter가 실제 React 컴포넌트를 mount 할 수 있도록 연결해줍니다.

즉, `main.ts`는 “데모용 데이터와 런타임을 뷰어에 꽂아 넣는 조립 지점”입니다.

### 1-2. `apps/styleguide-demo/src/docs/index.ts`

이 파일은 데모에서 보여줄 문서 배열을 하나로 합칩니다.

```ts
import { reactDocs } from '../react/docs'
import { vueDocs } from '../vue/docs'

export const componentDocs = [...vueDocs, ...reactDocs]
```

여기서 핵심은 아주 단순합니다.

- Vue 문서와 React 문서를 따로 관리한다.
- 마지막에는 하나의 배열 `componentDocs`로 합친다.
- 뷰어는 이 배열을 받아서 공통 UI에서 보여준다.

즉, 프레임워크별로 문서를 작성하지만, 뷰어 입장에서는 “하나의 문서 목록”으로 다루게 됩니다.

### 1-3. `apps/styleguide-demo/src/App.vue`

이 파일은 데모 화면의 상위 레이아웃입니다.

중요한 부분만 보면:

```vue
<main class="demo-main">
  <ColorTokensPage v-if="activeView === 'tokens'" />
  <section v-else class="demo-components-section">
    <StyleguideContainer :docs="componentDocs" />
  </section>
</main>
```

이 코드는 데모가 화면을 두 개로 나눈다는 뜻입니다.

- `ColorTokensPage`
  - 디자인 토큰 화면
- `StyleguideContainer`
  - 컴포넌트 스펙 화면

즉, 우리가 지금 공부하려는 스타일가이드 실행 흐름은 `StyleguideContainer`부터 본격적으로 시작됩니다.

### `App.vue`에서 각 요소의 역할

- `ColorTokensPage`
  - 프레임워크와 무관한 디자인 토큰 예시 화면
- `StyleguideContainer`
  - 스타일가이드의 메인 문서 UI
  - 좌측 목록, 우측 상세 문서, preview 영역을 보여줍니다.
- `componentDocs`
  - 실제로 렌더링할 문서 데이터

### 이번 단계에서 꼭 이해하면 좋은 문장

- `main.ts`는 앱을 시작하고 스타일가이드 플러그인을 설치한다.
- `docs/index.ts`는 Vue 문서와 React 문서를 하나로 합친다.
- `App.vue`는 토큰 화면과 컴포넌트 화면 중 하나를 보여준다.
- 컴포넌트 화면의 실제 시작점은 `StyleguideContainer`다.

### 지금 단계에서 머릿속에 남기면 좋은 실행 순서

1. 브라우저가 `main.ts`를 실행한다.
2. Vue 앱이 만들어진다.
3. 스타일가이드 플러그인이 설치된다.
4. 문서 목록과 React renderer가 등록된다.
5. `App.vue`가 렌더링된다.
6. 사용자가 `Component spec` 탭을 보면 `StyleguideContainer`가 문서를 출력한다.

### 1단계 요약

이 단계는 “앱이 어떻게 시작되고 어떤 재료가 뷰어로 들어가는지”를 이해하는 단계입니다.

- 데모 앱은 조립자 역할을 한다.
- 문서는 `componentDocs`로 모인다.
- 뷰어 UI는 `StyleguideContainer`가 시작점이다.
- React 지원은 `createReactRendererAdapter(...)`를 등록하는 방식으로 붙는다.

---

## 다음 단계 예고

2단계에서는 “문서 한 개가 실제로 어떻게 생겼는지”를 보게 됩니다.

그때는 아래 파일을 같이 보면 좋습니다.

- `packages/styleguide-schema/src/docs/component-docs.ts`
- `apps/styleguide-demo/src/vue/docs/button.doc.ts`
- `apps/styleguide-demo/src/react/docs/button.doc.ts`
- `apps/styleguide-demo/src/vue/components/Button.vue`
- `apps/styleguide-demo/src/react/components/ReactButton.ts`
