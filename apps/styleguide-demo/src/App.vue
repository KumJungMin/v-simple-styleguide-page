<template>
  <div class="demo-shell">
    <header class="demo-header">
      <p class="demo-breadcrumb">{{ activeViewMeta.breadcrumb }}</p>
      <h1>{{ activeViewMeta.title }}</h1>
      <p class="demo-summary">{{ activeViewMeta.summary }}</p>

      <nav class="demo-view-tabs" aria-label="Demo sections">
        <button
          :class="['demo-view-tab', { 'demo-view-tab--active': activeView === 'tokens' }]"
          @click="activeView = 'tokens'"
        >
          Color tokens
        </button>
        <button
          :class="['demo-view-tab', { 'demo-view-tab--active': activeView === 'components' }]"
          @click="activeView = 'components'"
        >
          Component spec
        </button>
      </nav>
    </header>

    <main class="demo-main">
      <ColorTokensPage v-if="activeView === 'tokens'" />
      <section v-else class="demo-components-section">
        <StyleguideContainer :docs="componentDocs" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { StyleguideContainer } from '../../../packages/styleguide-lib/src'
import ColorTokensPage from './components/ColorTokensPage.vue'
import { componentDocs } from './docs'

const activeView = ref<'tokens' | 'components'>('tokens')

const activeViewMeta = computed(() => {
  if (activeView.value === 'tokens') {
    return {
      breadcrumb: 'Design System / Tokens / Color',
      title: 'Color tokens',
      summary: '도메인별로 정의된 색상 토큰 목록입니다. 각 토큰을 클릭하면 값이 복사됩니다.',
    }
  }

  return {
    breadcrumb: 'Design System / Components',
    title: 'Component spec',
    summary: '컴포넌트별 스펙, Props, 이벤트, 프리뷰 사이즈를 한 화면에서 확인합니다.',
  }
})
</script>

<style scoped>
.demo-shell {
  width: min(1280px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 40px 0 72px;
}

.demo-header {
  padding-bottom: 2.25rem;
  border-bottom: 1px solid rgba(248, 244, 234, 0.72);
}

.demo-breadcrumb {
  margin: 0;
  color: #b6b0a4;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.demo-header h1 {
  margin: 1.1rem 0 0;
  color: #f8f4ea;
  font-size: clamp(2.35rem, 4vw, 3.3rem);
  letter-spacing: -0.06em;
  line-height: 1;
}

.demo-summary {
  max-width: 52rem;
  margin: 1rem 0 0;
  color: #bbb4a6;
  font-size: 1.1rem;
  line-height: 1.8;
}

.demo-view-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.demo-view-tab {
  border: 1px solid rgba(248, 244, 234, 0.22);
  border-radius: 999px;
  background: rgba(248, 244, 234, 0.04);
  color: #d2cbbb;
  cursor: pointer;
  padding: 0.78rem 1.15rem;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.demo-view-tab:hover,
.demo-view-tab--active {
  border-color: rgba(248, 244, 234, 0.74);
  background: #131310;
  color: #f8f4ea;
  transform: translateY(-1px);
}

.demo-main {
  padding-top: 2.5rem;
}

.demo-components-section {
  min-height: 720px;
}

@media (max-width: 720px) {
  .demo-shell {
    width: min(100vw - 32px, 1280px);
    padding-top: 28px;
  }

  .demo-summary {
    font-size: 1rem;
  }
}
</style>
