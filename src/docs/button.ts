import type { ComponentDoc } from '../types/component-docs'

export const buttonDoc: ComponentDoc = {
  title: 'Button',
  description: `
# Button 컴포넌트

Button 컴포넌트는 사용자 상호작용을 위한 기본적인 UI 요소입니다.

## 특징
- 다양한 스타일 변형 지원 (primary, secondary, outline)
- 비활성화 상태 지원
- 전체 너비 모드 지원
- 호버 효과
- 클릭 이벤트 발생
  `,
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline'",
      default: 'primary',
      description: '버튼의 스타일 변형을 지정합니다.'
    },
    {
      name: 'block',
      type: 'boolean',
      default: false,
      description: '버튼이 컨테이너의 전체 너비를 차지하도록 합니다.'
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: '버튼의 비활성화 상태를 지정합니다.'
    }
  ],
  emits: [
    {
      name: 'click',
      payload: 'MouseEvent',
      description: '버튼이 클릭되었을 때 발생하는 이벤트입니다. 비활성화된 버튼에서는 발생하지 않습니다.'
    }
  ],
  examples: [
    {
      title: '기본 버튼',
      description: '기본적인 primary 스타일의 버튼입니다.',
      code: '<Button>기본 버튼</Button>',
      props: {},
      emits: {
        click: true
      }
    },
    {
      title: 'Secondary 버튼',
      description: 'Secondary 스타일의 버튼입니다.',
      code: '<Button variant="secondary">Secondary 버튼</Button>',
      props: {
        variant: 'secondary'
      },
      emits: {
        click: true
      }
    },
    {
      title: 'Outline 버튼',
      description: '테두리만 있는 버튼입니다.',
      code: '<Button variant="outline">Outline 버튼</Button>',
      props: {
        variant: 'outline'
      },
      emits: {
        click: true
      }
    },
    {
      title: 'Block 버튼',
      description: '전체 너비를 차지하는 버튼입니다.',
      code: '<Button block>Block 버튼</Button>',
      props: {
        block: true
      },
      emits: {
        click: true
      }
    },
    {
      title: '비활성화된 버튼',
      description: '클릭할 수 없는 비활성화된 버튼입니다.',
      code: '<Button disabled>비활성화된 버튼</Button>',
      props: {
        disabled: true
      },
      emits: {
        click: true
      }
    }
  ]
} 