# Multi-Framework Styleguide Monorepo

회사 서비스의 디자인 가이드를 한 곳에서 보여주기 위한 모노레포입니다.

이 저장소의 목표는 다음 두 가지를 동시에 만족하는 것입니다.

- 디자인 토큰, 사용 가이드, 컴포넌트 스펙을 한 화면에서 보여준다.
- Vue 프로젝트와 React 프로젝트의 실제 재사용 컴포넌트를 같은 방식으로 문서화한다.

지금 구조는 `가이드 UI`, `공통 스키마`, `iframe 렌더링 코어`, `프레임워크별 런타임`을 분리한 형태입니다.

## 한눈에 보기

### 큰 구조

- `apps/styleguide-demo`
  - React 기반으로 구동되는 데모 앱입니다.
  - Color token 화면과 Component spec 화면이 있습니다.
  - 현재 데모 화면은 React 컴포넌트 예시를 보여줍니다.
- `packages/styleguide-schema`
  - 문서 타입과 manifest 타입을 정의합니다.
- `packages/styleguide-core`
  - 문서 정규화, iframe 부트스트랩, 이벤트 브리지, renderer registry 같은 공통 로직이 들어 있습니다.
- `packages/styleguide-runtime-vue`
  - Vue 컴포넌트를 iframe 안에 mount/unmount 합니다.
- `packages/styleguide-runtime-react`
  - React 컴포넌트를 iframe 안에 mount/unmount 합니다.
- `packages/styleguide-viewer-vue`
  - 실제 스타일가이드 화면 UI입니다.
  - 좌측 컴포넌트 목록, props/events/composition 패널, preview iframe을 렌더링합니다.
- `packages/styleguide-viewer-react`
  - React에서 실행되는 스타일가이드 화면 UI입니다.
  - 데모 앱의 기본 뷰어입니다.
- `packages/styleguide-exporter-vue`
  - Vue 문서를 정의하고 manifest 형태로 모으는 도우미입니다.
- `packages/styleguide-exporter-react`
  - React 문서를 정의하고 manifest 형태로 모으는 도우미입니다.
- `packages/styleguide-cli`
  - 여러 프로젝트 manifest를 합치는 최소 CLI 유틸입니다.
- `packages/styleguide-lib`
  - 기존 Vue 전용 패키지와의 호환을 위한 facade입니다.
  - 내부적으로는 새 패키지들을 다시 export 합니다.

### 핵심 아이디어

이 저장소는 `문서 데이터`와 `실제 렌더링`을 분리합니다.

1. 각 프로젝트는 자기 프레임워크 방식으로 문서를 작성합니다.
2. 문서는 `styleguide-schema` 타입으로 정규화됩니다.
3. `styleguide-viewer-react` 또는 `styleguide-viewer-vue`가 공통 문서 UI를 렌더링합니다.
4. 실제 컴포넌트 preview는 iframe 안에서 실행됩니다.
5. iframe 안 마운트는 `runtime-vue` 또는 `runtime-react`가 담당합니다.

즉, 화면 껍데기는 하나지만 실제 컴포넌트 렌더링은 프레임워크별 런타임으로 분리되어 있습니다.

## 처음 보는 사람이 보면 좋은 순서

처음 코드를 읽을 때는 아래 순서가 가장 이해하기 쉽습니다.

1. `apps/styleguide-demo`
2. `packages/styleguide-viewer-react`
3. `packages/styleguide-core`
4. `packages/styleguide-runtime-vue`
5. `packages/styleguide-runtime-react`
6. `packages/styleguide-schema`

### 1. 데모 앱부터 보기

추천 시작 파일:

- [apps/styleguide-demo/src/main.tsx](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/main.tsx)
- [apps/styleguide-demo/src/App.tsx](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/App.tsx)
- [apps/styleguide-demo/src/docs/index.ts](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/docs/index.ts)

여기서 알 수 있는 것:

- React 앱에서 뷰어를 어떻게 렌더링하는지
- 문서 배열을 어떻게 전달하는지

### 2. 뷰어 UI 보기

추천 파일:

- [packages/styleguide-viewer-vue/src/plugin.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-viewer-vue/src/plugin.ts)
- [packages/styleguide-viewer-vue/src/components/StyleguideContainer.vue](/Users/gjm/v-simple-styleguide-page/packages/styleguide-viewer-vue/src/components/StyleguideContainer.vue)
- [packages/styleguide-viewer-vue/src/components/ComponentDoc.vue](/Users/gjm/v-simple-styleguide-page/packages/styleguide-viewer-vue/src/components/ComponentDoc.vue)
- [packages/styleguide-viewer-react/src/components/StyleguideContainer.tsx](/Users/gjm/v-simple-styleguide-page/packages/styleguide-viewer-react/src/components/StyleguideContainer.tsx)
- [packages/styleguide-viewer-react/src/components/WidgetComponentDoc.tsx](/Users/gjm/v-simple-styleguide-page/packages/styleguide-viewer-react/src/components/WidgetComponentDoc.tsx)

여기서 알 수 있는 것:

- 문서를 주입하고 normalize 하는 방식
- 좌측 목록과 우측 문서 상세 UI가 어떻게 구성되는지
- props, events, composition 편집이 preview와 어떻게 연결되는지

### 3. 공통 코어 보기

추천 파일:

- [packages/styleguide-core/src/docs/normalizeComponentDoc.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-core/src/docs/normalizeComponentDoc.ts)
- [packages/styleguide-core/src/preview/rendererAdapter.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-core/src/preview/rendererAdapter.ts)
- [packages/styleguide-core/src/preview/rendererRegistry.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-core/src/preview/rendererRegistry.ts)
- [packages/styleguide-core/src/events/eventBridge.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-core/src/events/eventBridge.ts)

여기서 알 수 있는 것:

- 레거시 Vue 문서 구조를 현재 공통 구조로 바꾸는 방식
- renderer adapter 계약
- 이벤트를 props handler로 바꾸는 방식

### 4. 프레임워크 런타임 보기

추천 파일:

- [packages/styleguide-runtime-vue/src/vueRendererAdapter.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-runtime-vue/src/vueRendererAdapter.ts)
- [packages/styleguide-runtime-react/src/reactRendererAdapter.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-runtime-react/src/reactRendererAdapter.ts)

여기서 알 수 있는 것:

- 같은 문서 모델을 가지고 Vue와 React가 어떻게 다르게 mount 되는지
- Vue는 `slots`, React는 `children`을 어떻게 처리하는지

### 5. 타입 구조 보기

추천 파일:

- [packages/styleguide-schema/src/docs/component-docs.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-schema/src/docs/component-docs.ts)
- [packages/styleguide-schema/src/manifest/component-manifest.ts](/Users/gjm/v-simple-styleguide-page/packages/styleguide-schema/src/manifest/component-manifest.ts)

여기서 알 수 있는 것:

- 공통 문서 타입
- `framework`, `props`, `events`, `composition` 개념
- 나중에 manifest 기반으로 확장할 때의 기준점

## 현재 데모 구조

`apps/styleguide-demo/src`는 지금 아래처럼 나뉘어 있습니다.

```text
src/
  App.tsx
  main.tsx
  style.css
  env.d.ts
  data/
    colorTokens.ts
  docs/
    index.ts
  react/
    components/
      ColorTokensPage.tsx
      ReactButton.ts
    docs/
      button.doc.ts
      index.ts
  vue/
    components/
      Badge.vue
      Button.vue
      ColorTokensPage.vue
      Input.vue
      Modal.vue
    docs/
      badge.doc.ts
      button.doc.ts
      input.doc.ts
      modal.doc.ts
      index.ts
```

의도는 단순합니다.

- `src/vue`
  - Vue 예제 컴포넌트와 Vue 문서
  - 현재 React 데모 앱에서는 로드하지 않습니다.
- `src/react`
  - React 예제 컴포넌트와 React 문서
- `src/docs/index.ts`
  - React 데모에서 로드할 문서를 모으는 entry
- `src/data`
  - 프레임워크와 무관한 공통 데모 데이터

## 실제 동작 흐름

컴포넌트 하나를 화면에 띄우는 흐름은 아래와 같습니다.

1. 데모 앱이 `componentDocs`를 React 뷰어 컴포넌트에 전달합니다.
2. `styleguide-viewer-react`가 문서를 normalize 하고 renderer registry를 만듭니다.
3. 사용자가 컴포넌트를 선택하면 `WidgetComponentDoc.tsx`가 현재 문서를 기준으로 preview를 요청합니다.
4. `usePreviewFrame.ts`가 iframe 문서를 초기화합니다.
5. 현재 문서의 `framework` 값으로 renderer를 찾습니다.
6. Vue 문서면 `runtime-vue`, React 문서면 `runtime-react`가 mount 합니다.
7. props 변경, composition 변경, event log 수집이 같은 UI 안에서 일어납니다.

## 문서 모델

현재 공통 문서 모델의 핵심은 아래 네 가지입니다.

- `framework`
  - `vue` 또는 `react`
- `props`
  - 편집 가능한 속성 정의
- `events`
  - 로그를 수집할 이벤트 정의
- `composition`
  - Vue의 slots 또는 React의 children 정의

이 덕분에 UI는 공통으로 유지하고, 런타임만 프레임워크별로 분리할 수 있습니다.

예를 들면:

- Vue 문서
  - `framework: 'vue'`
  - `composition.kind: 'slots'`
- React 문서
  - `framework: 'react'`
  - `composition.kind: 'children'`

## 자주 보는 패키지별 역할

### `styleguide-schema`

이 패키지는 “우리가 어떤 문서 구조를 공통으로 쓸 것인가”를 정의합니다.

- 문서 타입
- prop/event/composition 타입
- manifest 타입

### `styleguide-core`

이 패키지는 프레임워크 비의존 로직만 담습니다.

- 문서 정규화
- iframe preview 부트스트랩
- renderer registry
- event handler 변환
- composition 상태 계산

### `styleguide-runtime-vue`

이 패키지는 Vue 컴포넌트를 실제로 렌더링하는 어댑터입니다.

- `createApp`
- slot 주입
- event handler 연결

### `styleguide-runtime-react`

이 패키지는 React 컴포넌트를 실제로 렌더링하는 어댑터입니다.

- React bridge 주입
- `children` 전달
- event handler 연결

### `styleguide-viewer-vue`

이 패키지는 사람이 보는 문서 UI입니다.

- 컴포넌트 목록
- 문서 헤더
- props/events/composition 패널
- iframe preview

### `styleguide-viewer-react`

이 패키지는 React 앱에서 사람이 보는 문서 UI를 렌더링합니다.

- 컴포넌트 목록
- 문서 헤더
- props/events/composition 패널
- iframe preview
- React preview renderer 기본 등록

## 실행 방법

### 설치

```bash
pnpm install
```

### 데모 실행

```bash
pnpm --dir apps/styleguide-demo dev
```

### 데모 빌드

```bash
pnpm --dir apps/styleguide-demo build
```

### 전체 타입체크/빌드

```bash
pnpm type-check
pnpm build
```

## 새 예시를 추가하는 방법

### React 컴포넌트 예시 추가

1. `apps/styleguide-demo/src/react/components`에 컴포넌트를 추가합니다.
2. `apps/styleguide-demo/src/react/docs`에 문서를 작성합니다.
3. `apps/styleguide-demo/src/react/docs/index.ts`에 export를 추가합니다.

### 문서 통합 지점

React 데모 문서는 최종적으로 [apps/styleguide-demo/src/docs/index.ts](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/docs/index.ts)에서 모읍니다.

## 호환 패키지

기존 `vue-styleguide-lib` 사용 코드를 한 번에 없애지 않기 위해 [packages/styleguide-lib](/Users/gjm/v-simple-styleguide-page/packages/styleguide-lib)는 유지하고 있습니다.

현재 이 패키지는:

- 독자적인 핵심 구현체라기보다
- `styleguide-schema`, `styleguide-core`, `styleguide-runtime-vue`, `styleguide-viewer-vue`를 다시 export 하는 호환 계층

으로 보는 편이 맞습니다.

## 참고 메모

- 현재 데모는 React UI 셸 위에서 React preview를 보여줍니다.
- preview 자체는 iframe 안에서 분리 실행됩니다.
- `apps/styleguide-demo type-check`는 `tsc --noEmit`으로 실행됩니다.

---

짧게 요약하면, 이 저장소는 `하나의 스타일가이드 UI + 여러 프레임워크 런타임` 구조입니다.  
처음 볼 때는 데모 앱에서 시작해서 `viewer -> core -> runtime -> schema` 순서로 따라가면 가장 빠르게 이해할 수 있습니다.
