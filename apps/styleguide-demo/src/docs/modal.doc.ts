import Modal from '../components/Modal.vue'

export default {
  title: 'Modal',
  description: `
# Modal Component

A modal dialog component displayed with an overlay.

## Usage

\`\`\`vue
<Modal :visible="true" @close="handleClose">
  <template #header>
    <h3>Custom Header</h3>
  </template>
  
  <p>This is the modal content.</p>
  
  <template #footer>
    <button @click="handleClose">Cancel</button>
    <button @click="handleConfirm">Confirm</button>
  </template>
</Modal>
\`\`\`

## Features

- Supports 3 named slots: header, default, footer
- Close with ESC key
- Click overlay to close
- Responsive design
- Smooth animations
  `,
  component: Modal,
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      default: true,
      description: 'Whether the modal is visible'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '500px',
      description: 'Width of the modal'
    }
  ],
  emits: [
    {
      name: 'close',
      payload: 'void',
      description: 'Emitted when the modal is closed'
    }
  ],
  // named slot examples
  slotExamples: {
    header: '<h3 style="color: #2563eb; margin: 0;">🎉 Welcome!</h3>',
    default: `
      <div style="text-align: center;">
        <p style="margin-bottom: 1rem;">This is a modal example using named slots.</p>
        <p style="color: #6b7280; font-size: 0.875rem;">
          By using the header, default, and footer slots,<br>
          you can fully customize the modal.
        </p>
      </div>
    `,
    footer: `
      <button style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; cursor: pointer; margin-right: 0.5rem;">
        Cancel
      </button>
      <button style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #2563eb; color: white; cursor: pointer;">
        Confirm
      </button>
    `
  },
  slots: [
    { 
      name: 'header', 
      description: 'Modal header area (default: "Modal Title")'
    },
    { 
      name: 'default', 
      description: 'Main content of the modal'
    },
    { 
      name: 'footer', 
      description: 'Modal footer area (e.g., action buttons)'
    }
  ]
}
