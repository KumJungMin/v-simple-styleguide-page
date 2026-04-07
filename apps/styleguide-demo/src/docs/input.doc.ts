import Input from '../components/Input.vue'

export default {
  title: 'Input',
  description: '텍스트 입력, 검색, 필터 인터랙션에 사용하는 기본 필드입니다.',
  component: Input,
  props: [
    {
      name: 'modelValue',
      type: 'string',
      required: false,
      default: '',
      description: '입력값',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: 'Search keyword',
      description: '플레이스홀더 문구',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      default: 'Field label',
      description: '필드 라벨 텍스트',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: 'md',
      description: '필드 높이와 내부 여백',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: '비활성화 상태',
    },
  ],
  emits: [
    {
      name: 'update:modelValue',
      payload: 'string',
      description: '입력값 변경 시 발생',
    },
    {
      name: 'focus',
      payload: 'void',
      description: '포커스 진입 시 발생',
    },
  ],
}
