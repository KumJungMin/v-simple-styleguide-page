import Modal from '../components/Modal.vue'

export default {
  title: 'Modal',
  description: `
# Modal 컴포넌트

오버레이와 함께 표시되는 모달 다이얼로그 컴포넌트입니다.

## 사용법

\`\`\`vue
<Modal :visible="true" @close="handleClose">
  <template #header>
    <h3>커스텀 헤더</h3>
  </template>
  
  <p>모달 내용입니다.</p>
  
  <template #footer>
    <button @click="handleClose">취소</button>
    <button @click="handleConfirm">확인</button>
  </template>
</Modal>
\`\`\`

## 특징

- 3개의 named slot 지원 (header, default, footer)
- ESC 키로 닫기 지원
- 오버레이 클릭으로 닫기 지원
- 반응형 디자인
- 부드러운 애니메이션
  `,
  component: Modal,
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      default: true,
      description: '모달 표시 여부'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '500px',
      description: '모달 너비'
    }
  ],
  emits: [
    {
      name: 'close',
      payload: 'void',
      description: '모달 닫기 시 발생하는 이벤트'
    }
  ],
  // named slot 예제
  namedSlots: {
    header: '<h3 style="color: #2563eb; margin: 0;">🎉 환영합니다!</h3>',
    default: `
      <div style="text-align: center;">
        <p style="margin-bottom: 1rem;">이것은 named slot을 사용한 모달 예제입니다.</p>
        <p style="color: #6b7280; font-size: 0.875rem;">
          header, default, footer slot을 모두 사용하여<br>
          완전히 커스터마이징된 모달을 만들 수 있습니다.
        </p>
      </div>
    `,
    footer: `
      <button style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; cursor: pointer; margin-right: 0.5rem;">
        취소
      </button>
      <button style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #2563eb; color: white; cursor: pointer;">
        확인
      </button>
    `
  },
  slots: [
    { 
      name: 'header', 
      description: '모달 헤더 영역 (기본값: "모달 제목")'
    },
    { 
      name: 'default', 
      description: '모달 본문 내용'
    },
    { 
      name: 'footer', 
      description: '모달 푸터 영역 (버튼 등을 배치)'
    }
  ]
} 