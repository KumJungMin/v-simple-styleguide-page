import Button from '../components/Button.vue'
import { defineVueComponentDoc } from 'styleguide-exporter-vue'

export default defineVueComponentDoc({
  title: 'Button',
  description: '사용자의 액션을 유도하는 기본 인터랙션 요소입니다. variant와 size 조합으로 계층과 밀도를 표현합니다.',
  component: Button,
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'danger' | 'ghost'",
      required: false,
      default: 'primary',
      description: '버튼의 계층과 강조 정도를 결정합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: 'md',
      description: '버튼 높이와 내부 여백을 조절합니다.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: '비활성화 상태를 표시하고 클릭을 차단합니다.',
    },
    {
      name: 'block',
      type: 'boolean',
      required: false,
      default: false,
      description: '부모 너비를 가득 채우는 레이아웃입니다.',
    },
  ],
  events: [
    {
      name: 'click',
      payload: 'void',
      description: '사용자가 버튼을 눌렀을 때 발생합니다.',
    },
  ],
  composition: {
    kind: 'slots',
    entries: [
      {
        name: 'default',
        description: '버튼 내부 레이블',
      },
    ],
  },
  compositionExamples: {
    default: 'Primary',
  },
})
