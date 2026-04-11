import Modal from '../components/Modal.vue'
import { defineVueComponentDoc } from 'styleguide-exporter-vue'

export default defineVueComponentDoc({
  title: 'Modal',
  description: '오버레이 위에 주요 의사결정을 띄우는 대화형 모달입니다.',
  component: Modal,
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      default: true,
      description: '모달 노출 여부'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '500px',
      description: '모달 너비'
    }
  ],
  events: [
    {
      name: 'close',
      payload: 'void',
      description: '모달이 닫힐 때 발생'
    }
  ],
  composition: {
    kind: 'slots',
    entries: [
      {
        name: 'header',
        description: '모달 헤더 영역'
      },
      {
        name: 'default',
        description: '본문 콘텐츠 영역'
      },
      {
        name: 'footer',
        description: '하단 액션 버튼 영역'
      }
    ]
  },
  compositionExamples: {
    header: '<h3 style="color: #2563eb; margin: 0;">예약 확인</h3>',
    default: `
      <div style="text-align: center;">
        <p style="margin-bottom: 1rem;">슬롯 조합으로 헤더, 본문, 푸터를 유연하게 구성할 수 있습니다.</p>
        <p style="color: #6b7280; font-size: 0.875rem;">
          서비스 상황에 맞는 문구와 액션 버튼을<br>
          자유롭게 배치해보세요.
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
})
