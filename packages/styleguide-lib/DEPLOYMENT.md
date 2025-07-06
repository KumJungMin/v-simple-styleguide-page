# 배포 가이드

## 📋 사전 준비

### 1. npm 계정 설정

```bash
# npm 로그인
npm login

# 현재 사용자 확인
npm whoami
```

### 2. 패키지 이름 확인

`package.json`에서 패키지 이름을 확인하고 필요시 수정하세요:

```json
{
  "name": "@lux/vue-styleguide-lib",
  "version": "1.0.0"
}
```

## 🚀 배포 과정

### 1. 빌드 및 테스트

```bash
# 의존성 설치
pnpm install

# 타입 체크
pnpm run type-check

# 빌드
pnpm run build
```

### 2. 배포

#### 방법 1: 수동 배포
```bash
# 패키지 버전 업데이트 (선택사항)
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 배포
npm publish
```

#### 방법 2: 스크립트 사용
```bash
# 패치 버전 배포 (1.0.0 → 1.0.1)
pnpm run publish:patch

# 마이너 버전 배포 (1.0.0 → 1.1.0)
pnpm run publish:minor

# 메이저 버전 배포 (1.0.0 → 2.0.0)
pnpm run publish:major
```

### 3. 배포 확인

```bash
# npm에서 패키지 확인
npm view @your-org/vue-styleguide-lib

# 설치 테스트
npm install @your-org/vue-styleguide-lib
```

## 📦 배포 파일 구조

배포 시 다음 파일들이 포함됩니다:

```
dist/
├── index.esm.js          # ES 모듈 메인 파일
├── index.js              # CommonJS 메인 파일
├── index.d.ts            # TypeScript 타입 정의
├── types.esm.js          # 타입 exports (ES 모듈)
├── types.js              # 타입 exports (CommonJS)
├── types.d.ts            # 타입 정의
├── core.esm.js           # 코어 exports (ES 모듈)
├── core.js               # 코어 exports (CommonJS)
├── core.d.ts             # 코어 타입 정의
README.md                 # 패키지 README
```

## 🔧 배포 설정

### package.json 주요 설정

```json
{
  "name": "@your-org/vue-styleguide-lib",
  "version": "1.0.0",
  "main": "./dist/index.js",           // CommonJS 진입점
  "module": "./dist/index.esm.js",     // ES 모듈 진입점
  "types": "./dist/index.d.ts",        // TypeScript 타입 정의
  "exports": {                         // 모듈 exports
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md"],      // 배포할 파일들
  "peerDependencies": {                // 피어 의존성
    "vue": "^3.3.0"
  }
}
```

### vite.config.ts 설정

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        // 개별 컴포넌트/컴포저블들...
      },
      formats: ['es', 'cjs'],          // ES 모듈 + CommonJS
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['vue', 'markdown-it', 'highlight.js'],  // 외부 의존성
    },
  },
})
```

## 🚨 주의사항

### 1. 버전 관리
- `npm version` 명령어는 자동으로 git tag를 생성합니다
- 배포 전에 모든 변경사항이 커밋되어 있는지 확인하세요

### 2. 의존성 관리
- `peerDependencies`에 Vue를 명시하여 사용자가 직접 설치하도록 합니다
- `dependencies`에는 라이브러리에서 직접 사용하는 패키지만 포함합니다

### 3. 타입 정의
- TypeScript 타입 정의가 올바르게 생성되는지 확인하세요
- `vite-plugin-dts`를 사용하여 자동으로 타입 정의를 생성합니다

### 4. 파일 크기
- 배포 전에 `dist` 폴더의 크기를 확인하세요
- 불필요한 파일이 포함되지 않도록 `.npmignore`를 설정하세요

## 🔄 업데이트 배포

기존 패키지를 업데이트할 때:

```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: add new feature"

# 2. 버전 업데이트 및 배포
pnpm run publish:patch  # 또는 minor, major

# 3. git tag 푸시
git push --tags
```

## 📞 문제 해결

### 배포 실패 시
```bash
# npm 캐시 정리
npm cache clean --force

# 다시 시도
npm publish
```

### 권한 오류 시
```bash
# npm 로그인 상태 확인
npm whoami

# 다시 로그인
npm login
```

### 스코프 권한 오류 시
```bash
# 조직 권한 확인
npm access ls-packages

# 조직 관리자에게 문의
```

## 📚 추가 리소스

- [npm 배포 가이드](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm 스코프 설정](https://docs.npmjs.com/about-scopes)
- [npm 버전 관리](https://docs.npmjs.com/cli/v8/commands/npm-version) 