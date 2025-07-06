import Button from '../components/Button.vue'

export default {
  title: 'Button',
  description: `
# Button Component

A button component that supports various styles and states.

## Usage

\`\`\`vue
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
\`\`\`

## Features

- Supports 3 variants: primary, secondary, outline
- Supports disabled state
- Supports block mode (full width)
- Keyboard accessibility
  `,
  component: Button,
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline'",
      required: true,
      default: 'primary',
      description: 'Button style variant',
      control: 'select',
      options: ['primary', 'secondary', 'outline']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the button is disabled'
    },
    {
      name: 'block',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the button takes up full width'
    }
  ],
  emits: [
    {
      name: 'click',
      payload: 'void',
      description: 'Emitted when the button is clicked'
    }
  ],
  slotExamples: {
    default: '<h1>Hello! I am a button</h1>'
  },
  slots: [
    { name: 'default', description: 'Button content' }
  ]
}
