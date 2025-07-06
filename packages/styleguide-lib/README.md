
# Vue 3 Styleguide Library

An interactive styleguide module for Vue 3 components. It provides a playground to edit and preview component **Props**, **Emits**, and **Slots** in real time.
- demo(https://prismatic-brioche-395ab1.netlify.app/)

## 🚀 Features

- **Live Component Preview**: Render components in an isolated iframe environment
- **Props Editor**: Input controls by type (text, number, boolean, select)
- **Emits Logging**: Capture component events in real time
- **Slots Editor**: Live editing of default and named slots
- **Responsive Preview**: Support for mobile, tablet, and desktop views
- **Markdown Documentation**: Write component docs in Markdown

## 📦 Installation

```bash
npm install vue-styleguide-lib
# or
yarn add vue-styleguide-lib
```

## 🎯 Getting Started

### 1. Library Setup

```ts
// main.ts
import { createApp } from 'vue'
import { createStyleguide } from 'vue-styleguide-lib'
import App from './App.vue'

const app = createApp(App)

app.use(createStyleguide(app, {
  docs: [
    // Component docs...
  ]
}))

app.mount('#app')
```

### 2. Writing Component Docs

```ts
// docs/Button.doc.ts
import Button from '../components/Button.vue'

export default {
  title: 'Button',
  description: `
# Button Component

A clickable button component.

## Usage

\`\`\`vue
<Button variant="primary" size="large" @click="handleClick">
  Click Me
</Button>
\`\`\`
  `,
  component: Button,
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      default: 'primary',
      description: 'Button style variant',
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      default: 'medium',
      description: 'Button size',
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disabled state'
    }
  ],
  emits: [
    {
      name: 'click',
      payload: 'MouseEvent',
      description: 'Emitted on button click'
    }
  ],
  namedSlots: {
    default: '<span>Default Button Text</span>',
    icon: '<svg>...</svg>'
  },
  slots: [
    {
      name: 'default',
      description: 'Main button content'
    },
    {
      name: 'icon',
      description: 'Icon slot'
    }
  ]
}
```

### 3. Using in Styleguide Page

#### Method 1: Using StyleguideContainer

```vue
<template>
  <div class="styleguide-page">
    <StyleguideContainer :docs="docs" />
  </div>
</template>

<script setup lang="ts">
import { StyleguideContainer } from 'vue-styleguide-lib'
import buttonDoc from './docs/Button.doc.ts'
import modalDoc from './docs/Modal.doc.ts'

const docs = [buttonDoc, modalDoc]
</script>
```

#### Method 2: Using Individual WidgetComponentDoc

```vue
<template>
  <div class="styleguide-page">
    <WidgetComponentDoc 
      :doc="buttonDoc"
      :component="Button"
    />
  </div>
</template>

<script setup lang="ts">
import { WidgetComponentDoc } from 'vue-styleguide-lib'
import buttonDoc from './docs/Button.doc.ts'
import Button from './components/Button.vue'
</script>
```

#### Method 3: Global Setup via Plugin

```typescript
// main.ts
import { createApp } from 'vue'
import { createStyleguide } from 'vue-styleguide-lib'
import App from './App.vue'

const app = createApp(App)

// Styleguide configuration
app.use(createStyleguide(app, {
  docs: [
    // Component docs...
  ]
}))

app.mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <StyleguideContainer />
  </div>
</template>

<script setup lang="ts">
</script>
```

## 📘 Type Definitions

```ts
export interface ComponentDoc {
  title: string
  description?: string
  component: any
  props?: PropDefinition[]
  emits?: EmitDefinition[]
  slots?: SlotDefinition[]
  namedSlots?: Record<string, string>
  examples?: any[]
}

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: any
  description?: string
  control?: 'string' | 'number' | 'boolean' | 'select'
  options?: string[]
}

export interface EmitDefinition {
  name: string
  payload: string
  description?: string
}

export interface SlotDefinition {
  name: string
  description?: string
}
```

## 🔧 Advanced Usage

### Custom Prop Controls

```ts
{
  name: 'color',
  type: 'string',
  control: 'select',
  options: ['red', 'blue', 'green'],
  description: 'Color options'
}
```

### Named Slot Examples

```ts
{
  namedSlots: {
    header: '<h3 style="color: #2563eb;">Custom Header</h3>',
    default: '<p>Default Content</p>',
    footer: '<button>Confirm</button>'
  }
}
```

### Event Logging

```vue
<!-- Inside the component -->
<button @click="$emit('click', { id: 1, value: 'test' })">
  Click
</button>
```

### Responsive Preview

```ts
const deviceBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1200
}
```

## 🎨 Styling

```css
.component-doc {
  --primary-color: #2563eb;
  --border-color: #e5e7eb;
  --background-color: #f9fafb;
}

.props-table th {
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.slot-editor {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}
```

## 🔍 Debugging

### Event Logs

```
[12:34:56] click: { id: 1, value: "test" }
[12:34:57] submit: { formData: {...} }
```

### Prop Change Tracking

Prop changes trigger iframe updates automatically for live feedback.

## 🚀 Performance Optimizations

- **Iframe Isolation**: Prevents component interference with the main app
- **Lazy Rendering**: Uses `nextTick` for efficient rendering
- **Memory Cleanup**: Destroys old components when switching
- **Efficient Reactivity**: Powered by `computed` and `watch`

## 📝 License

MIT License
