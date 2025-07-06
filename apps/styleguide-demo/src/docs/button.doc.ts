import Button from '../components/Button.vue'

export default {
  title: 'Button',
  description: `
# Button 컴포넌트

다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다.

## 사용법

\`\`\`vue
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
\`\`\`

## 특징

- 3가지 variant 지원 (primary, secondary, outline)
- disabled 상태 지원
- block 모드 지원
- 키보드 접근성 지원
  `,
  component: Button,
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline'",
      required: true,
      default: 'primary',
      description: '버튼의 스타일 variant',
      control: 'select',
      options: ['primary', 'secondary', 'outline']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: '버튼 비활성화 여부'
    },
    {
      name: 'block',
      type: 'boolean',
      required: false,
      default: false,
      description: '전체 너비 사용 여부'
    }
  ],
  emits: [
    {
      name: 'click',
      payload: 'void',
      description: '버튼 클릭 시 발생하는 이벤트'
    }
  ],
  namedSlots: {
    default: '<h1>안녕! 난 버튼</h1>'
  },
  slots: [
    { name: 'default', description: '버튼 내용' }
  ]
} 