#!/bin/bash

# 배포 전 빌드
echo "🔨 Building package..."
npm run clean
npm run build

# 타입 체크
echo "🔍 Type checking..."
npm run type-check

# 배포
echo "📦 Publishing to npm..."
npm publish

echo "✅ Published successfully!" 