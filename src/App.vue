<template>
  <div class="app">
    <nav class="sidebar">
      <h1>컴포넌트 문서</h1>
      <ul>
        <li v-for="component in components" :key="component.name">
          <a 
            href="#" 
            :class="{ active: currentComponent === component.name }"
            @click.prevent="currentComponent = component.name"
          >
            {{ component.name }}
          </a>
        </li>
      </ul>
    </nav>
    <main class="content" v-if="currentComponent">
      <ComponentDoc 
        :doc="currentDoc"
        :component="currentComponentInstance"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ComponentDoc from './components/ComponentDoc.vue'
import Button from './components/ui/Button.vue'
import { buttonDoc } from './docs/button'

const components = [
  { name: 'Button', component: Button, doc: buttonDoc },
]

const currentComponent = ref(components[0]?.name)

const currentDoc = computed(() => {
  return components.find(c => c.name === currentComponent.value)?.doc
})


const currentComponentInstance = computed(() => {
  return components.find(c => c.name === currentComponent.value)?.component
})
</script>

<style>
.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #f5f5f5;
  padding: 2rem;
  border-right: 1px solid #eee;
}

.sidebar h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 0.5rem;
}

.sidebar a {
  display: block;
  padding: 0.5rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
}

.sidebar a:hover {
  background: #eee;
}

.sidebar a.active {
  background: #2196F3;
  color: white;
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style> 