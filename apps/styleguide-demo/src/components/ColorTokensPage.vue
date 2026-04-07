<template>
  <div class="tokens-page">
    <div class="tokens-tabs" role="tablist" aria-label="Color token domains">
      <button
        v-for="domain in colorTokenDomains"
        :key="domain.id"
        :class="['tokens-tab', { 'tokens-tab--active': domain.id === activeDomainId }]"
        @click="activeDomainId = domain.id"
      >
        {{ domain.label }}
      </button>
    </div>

    <section v-if="activeDomain" class="tokens-domain">
      <header class="tokens-domain-header">
        <h2>{{ activeDomain.label }}</h2>
        <p>{{ activeDomain.description }}</p>
      </header>

      <section v-for="section in activeDomain.sections" :key="section.title" class="token-section">
        <h3>{{ section.title }}</h3>
        <div class="token-grid">
          <button
            v-for="token in section.tokens"
            :key="token.name"
            class="token-card"
            type="button"
            @click="copyToken(token)"
          >
            <span class="token-swatch" :style="{ backgroundColor: token.value }"></span>
            <span class="token-copy-state">{{ copiedTokenName === token.name ? 'copied' : 'click to copy' }}</span>
            <span class="token-name">{{ token.name }}</span>
            <span class="token-value">{{ token.value }}</span>
            <span class="token-description">{{ token.description }}</span>
          </button>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { colorTokenDomains, type ColorTokenItem } from '../data/colorTokens'

const activeDomainId = ref(colorTokenDomains[0]?.id ?? '')
const copiedTokenName = ref('')

const activeDomain = computed(() => {
  return colorTokenDomains.find(domain => domain.id === activeDomainId.value) ?? colorTokenDomains[0]
})

async function copyToken(token: ColorTokenItem) {
  const copiedText = `${token.name}: ${token.value};`

  try {
    await navigator.clipboard.writeText(copiedText)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = copiedText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  copiedTokenName.value = token.name

  window.setTimeout(() => {
    if (copiedTokenName.value === token.name) {
      copiedTokenName.value = ''
    }
  }, 1600)
}
</script>

<style scoped>
.tokens-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tokens-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.tokens-tab {
  border: 1px solid rgba(248, 244, 234, 0.55);
  border-radius: 18px;
  background: transparent;
  color: #f4efe3;
  cursor: pointer;
  font: inherit;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  padding: 0.95rem 1.4rem;
  transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease;
}

.tokens-tab:hover,
.tokens-tab--active {
  background: #141412;
  border-color: #f8f4ea;
  transform: translateY(-1px);
}

.tokens-domain {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tokens-domain-header h2 {
  margin: 0;
  color: #f8f4ea;
  font-size: clamp(2rem, 3vw, 2.7rem);
  letter-spacing: -0.04em;
}

.tokens-domain-header p {
  margin: 0.75rem 0 0;
  max-width: 48rem;
  color: #b4aea1;
  font-size: 1.08rem;
  line-height: 1.7;
}

.token-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.token-section h3 {
  margin: 0;
  color: #b8b0a0;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.token-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.token-card {
  position: relative;
  display: grid;
  gap: 0.15rem;
  border: 1px solid rgba(248, 244, 234, 0.18);
  border-radius: 22px;
  background: #2f2e2a;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  padding: 8.25rem 1.35rem 1.35rem;
  text-align: left;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.token-card:hover {
  border-color: rgba(248, 244, 234, 0.45);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  transform: translateY(-2px);
}

.token-swatch {
  position: absolute;
  inset: 0 0 auto;
  height: 7rem;
}

.token-copy-state {
  position: absolute;
  right: 1.2rem;
  top: 1rem;
  color: rgba(248, 244, 234, 0.78);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.token-name {
  color: #f4efe3;
  font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 0.98rem;
  font-weight: 600;
}

.token-value {
  color: #f0e7d4;
  font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 0.9rem;
}

.token-description {
  color: #aaa391;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: 0.2rem;
}

@media (max-width: 720px) {
  .token-card {
    padding-top: 7.4rem;
  }
}
</style>
