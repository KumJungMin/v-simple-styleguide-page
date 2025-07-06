<template>
  <div class="demo-app">
    <section class="demo-section">
      <h2>문서화 위젯 사용</h2>
      <StyleguideContainer />
    </section>
  </div>
</template>


<style scoped>
.demo-app {
  max-width: 1500px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.demo-section {
  margin-bottom: 3rem;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  background: #fafbfc;
}

.demo-section h2 {
  color: #34495e;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.component-demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style> 