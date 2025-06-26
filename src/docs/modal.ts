import type { ComponentDoc } from '../types/component-docs'

export const modalDoc: ComponentDoc = {
  title: 'Modal',
  description: `
# Modal 컴포넌트

화면 중앙에 표시되는 모달 다이얼로그입니다. 화면 사이즈에 따라 너비가 자동으로 조정됩니다.\n\n- 모바일: 90vw\n- 태블릿: 60vw\n- 데스크탑: 400px
\n닫기 버튼 또는 오버레이 클릭 시 닫기 이벤트가 발생합니다.
  `,
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      description: '모달 표시 여부'
    },
    {
      name: 'width',
      type: 'string | number',
      required: false,
      description: '모달의 너비(미지정 시 화면 크기에 따라 자동 조정)'
    }
  ],
  emits: [
    {
      name: 'close',
      description: '닫기 버튼 클릭 시 발생'
    },
    {
      name: 'overlayClick',
      description: '오버레이(배경) 클릭 시 발생'
    }
  ],
  examples: [
    {
      title: '기본 모달',
      description: 'slot을 활용해 내용을 자유롭게 넣을 수 있습니다.',
      code: `<template>\n  <Modal :visible="true" @close="onClose">\n    <h2>모달 타이틀</h2>\n    <p>이곳에 원하는 내용을 넣으세요.</p>\n    <button @click="onClose">닫기</button>\n  </Modal>\n</template>`,
      props: {
        visible: true
      },
      emits: {
        close: true,
        overlayClick: true
      }
    },
    {
      title: '너비 지정 모달',
      description: 'width props로 모달의 너비를 직접 지정할 수 있습니다.',
      code: `<Modal :visible="true" width="600px">\n  <div style="padding:2rem;">\n    <h3>넓은 모달</h3>\n    <p>width props로 600px로 지정</p>\n  </div>\n</Modal>`,
      props: {
        visible: true,
        width: '600px'
      },
      emits: {
        close: true,
        overlayClick: true
      }
    }
  ]
} 