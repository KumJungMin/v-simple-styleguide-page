# Styleguide Monorepo

회사 서비스의 디자인 토큰과 컴포넌트 스펙을 한 곳에서 보여주기 위한 모노레포입니다.

현재 저장소는 단일 프레임워크만 대상으로 합니다. 그래서 패키지명과 문서 모델에는 프레임워크 접미사나 `framework` 필드를 두지 않습니다.

## 구조

- `apps/styleguide-demo`
  - 데모 앱입니다.
  - Color token 화면과 Component spec 화면이 있습니다.
- `packages/styleguide-schema`
  - 문서 타입과 manifest 타입을 정의합니다.
- `packages/styleguide-core`
  - 문서 정규화, iframe preview, 이벤트 브리지, renderer registry 같은 공통 로직을 담습니다.
- `packages/styleguide-runtime`
  - 컴포넌트를 iframe 안에 mount/unmount 하는 renderer adapter를 제공합니다.
- `packages/styleguide-viewer`
  - 스타일가이드 화면 UI입니다.
- `packages/styleguide-exporter`
  - 컴포넌트 문서를 정의하고 manifest 형태로 모으는 도우미입니다.

## 데모 앱

추천 시작 파일:

- [apps/styleguide-demo/src/main.tsx](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/main.tsx)
- [apps/styleguide-demo/src/App.tsx](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/App.tsx)
- [apps/styleguide-demo/src/docs/index.ts](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/docs/index.ts)

현재 `apps/styleguide-demo/src` 구조:

```text
src/
  App.tsx
  main.tsx
  style.css
  env.d.ts
  components/
    Button.ts
    ColorTokensPage.tsx
  component-docs/
    button.doc.ts
    index.ts
  data/
    colorTokens.ts
  docs/
    index.ts
```

## 동작 흐름

1. 데모 앱이 `componentDocs`를 `StyleguideContainer`에 전달합니다.
2. `styleguide-viewer`가 문서를 normalize 하고 renderer registry를 만듭니다.
3. 사용자가 컴포넌트를 선택하면 `WidgetComponentDoc`가 preview iframe 렌더링을 요청합니다.
4. `styleguide-runtime`이 iframe 안에 실제 컴포넌트를 mount 합니다.
5. props 변경, children 편집, event log 수집이 같은 UI 안에서 일어납니다.

## 실행

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

## 새 예시 추가

1. `apps/styleguide-demo/src/components`에 컴포넌트를 추가합니다.
2. `apps/styleguide-demo/src/component-docs`에 문서를 작성합니다.
3. `apps/styleguide-demo/src/component-docs/index.ts`에 export를 추가합니다.
4. 최종 문서 목록은 [apps/styleguide-demo/src/docs/index.ts](/Users/gjm/v-simple-styleguide-page/apps/styleguide-demo/src/docs/index.ts)에서 모읍니다.

## 다른 레포에서 사용

개발 중인 패키지를 다른 레포에서 안정적으로 쓰려면 private registry에 prerelease 또는 `develop` dist-tag로 publish 하는 방식을 권장합니다.

외부 앱에서는 보통 아래 패키지를 설치하면 됩니다.

```bash
pnpm add styleguide-viewer styleguide-exporter
```

로컬 테스트만 필요하면 `link:` 또는 `pnpm link`를 사용할 수 있습니다.
