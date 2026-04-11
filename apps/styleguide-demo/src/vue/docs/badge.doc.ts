import Badge from '../components/Badge.vue'
import { defineVueComponentDoc } from 'styleguide-exporter-vue'

export default defineVueComponentDoc({
  title: 'Badge',
  description: '상태, 라벨, 중요도를 간결하게 표시하는 인라인 배지입니다.',
  component: Badge,
  props: [
    {
      name: 'tone',
      type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
      required: false,
      default: 'neutral',
      description: '상태를 표현하는 톤',
      control: 'select',
      options: ['neutral', 'success', 'warning', 'danger', 'info'],
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      required: false,
      default: 'md',
      description: '배지 크기',
      control: 'select',
      options: ['sm', 'md'],
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      default: 'Stable',
      description: '기본 슬롯을 사용하지 않을 때 노출할 텍스트',
    },
  ],
  events: [],
  composition: {
    kind: 'slots',
    entries: [
      {
        name: 'default',
        description: '배지 내부 텍스트',
      },
    ],
  },
  compositionExamples: {
    default: 'Stable',
  },
})
