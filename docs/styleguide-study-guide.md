# Styleguide Study Guide

이 문서는 현재 구조를 처음 보는 사람이 실행 흐름을 따라가기 위한 짧은 학습 노트입니다.

## 1. 데모 앱 시작점

먼저 아래 파일을 봅니다.

- `apps/styleguide-demo/src/main.tsx`
- `apps/styleguide-demo/src/App.tsx`
- `apps/styleguide-demo/src/docs/index.ts`

흐름은 단순합니다.

1. `main.tsx`가 root를 만들고 `App`을 렌더링합니다.
2. `App.tsx`가 토큰 화면과 컴포넌트 스펙 화면을 전환합니다.
3. 컴포넌트 스펙 화면은 `StyleguideContainer`에 `componentDocs`를 전달합니다.
4. `componentDocs`는 문서 배열입니다.

## 2. 문서 한 개 보기

추천 파일:

- `apps/styleguide-demo/src/component-docs/button.doc.ts`
- `apps/styleguide-demo/src/components/Button.ts`
- `packages/styleguide-viewer/src/types/docs/component-docs.ts`

문서는 컴포넌트, props, events, children 예시를 하나의 객체로 설명합니다.

## 3. 뷰어 UI 보기

추천 파일:

- `packages/styleguide-viewer/src/components/StyleguideContainer.tsx`
- `packages/styleguide-viewer/src/components/WidgetComponentDoc.tsx`
- `packages/styleguide-viewer/src/hooks/usePreviewFrame.ts`

`StyleguideContainer`는 문서를 normalize 하고, 선택된 문서를 `WidgetComponentDoc`에 넘깁니다. `WidgetComponentDoc`는 props 편집, event log, children 편집, iframe preview를 관리합니다.

## 4. iframe 렌더링 보기

추천 파일:

- `packages/styleguide-viewer/src/core/preview/bootstrapHtml.ts`
- `packages/styleguide-viewer/src/core/preview/rendererRegistry.ts`
- `packages/styleguide-viewer/src/rendererAdapter.ts`

preview는 iframe 안에서 분리 실행됩니다. 공통 코어가 iframe 문서를 준비하고, runtime adapter가 실제 컴포넌트를 mount 합니다.
