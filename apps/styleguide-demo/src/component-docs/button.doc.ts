import { defineComponentDoc } from 'styleguide-exporter'
import Button from '../components/Button'

export default defineComponentDoc({
  title: 'Button',
  description: 'Props, 이벤트, children 편집을 같은 스펙 화면에서 확인할 수 있는 버튼 예시입니다.',
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
      name: 'onClick',
      payload: 'void',
      description: '사용자가 버튼을 눌렀을 때 발생합니다.',
    },
  ],
  composition: {
    entries: [
      {
        name: 'default',
        description: '버튼 내부 레이블',
      },
    ],
  },
  compositionExamples: {
    default: 'CTA',
  },
})
