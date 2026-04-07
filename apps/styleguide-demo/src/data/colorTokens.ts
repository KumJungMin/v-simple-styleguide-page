export interface ColorTokenItem {
  name: string
  value: string
  description: string
}

export interface ColorTokenSection {
  title: string
  tokens: ColorTokenItem[]
}

export interface ColorTokenDomain {
  id: string
  label: string
  description: string
  sections: ColorTokenSection[]
}

export const colorTokenDomains: ColorTokenDomain[] = [
  {
    id: 'global',
    label: 'Global',
    description: '모든 도메인에서 공통으로 사용하는 기본 색상 토큰',
    sections: [
      {
        title: 'Primary',
        tokens: [
          { name: '--color-primary-default', value: '#1A1A2E', description: '주 브랜드 색상' },
          { name: '--color-primary-hover', value: '#2D2D4E', description: '호버 상태' },
          { name: '--color-primary-subtle', value: '#EEEDFE', description: '약한 배경 강조' },
        ],
      },
      {
        title: 'Neutral',
        tokens: [
          { name: '--color-neutral-100', value: '#F1EFE8', description: '최외곽 배경' },
          { name: '--color-neutral-400', value: '#888780', description: '보조 텍스트, 아이콘' },
          { name: '--color-neutral-900', value: '#2C2C2A', description: '기본 텍스트' },
        ],
      },
      {
        title: 'Semantic',
        tokens: [
          { name: '--color-success', value: '#1D9E75', description: '성공, 완료 상태' },
          { name: '--color-warning', value: '#EF9F27', description: '경고, 주의 상태' },
          { name: '--color-danger', value: '#E24B4A', description: '오류, 위험 상태' },
          { name: '--color-info', value: '#378ADD', description: '정보, 안내 상태' },
        ],
      },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    description: '구매 플로우와 혜택 노출을 위한 커머스 전용 토큰',
    sections: [
      {
        title: 'Brand Accent',
        tokens: [
          { name: '--commerce-accent-sale', value: '#FF6B57', description: '할인, 특가 배지' },
          { name: '--commerce-accent-point', value: '#F3B441', description: '포인트, 리워드' },
          { name: '--commerce-accent-delivery', value: '#48A0E8', description: '배송 상태 표시' },
        ],
      },
      {
        title: 'Surface',
        tokens: [
          { name: '--commerce-surface-card', value: '#242422', description: '상품 카드 배경' },
          { name: '--commerce-surface-elevated', value: '#32302B', description: '툴팁, 드롭다운' },
          { name: '--commerce-surface-border', value: '#58554D', description: '컨테이너 경계' },
        ],
      },
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: '신뢰와 안정감을 전달하는 의료 서비스 전용 토큰',
    sections: [
      {
        title: 'Care',
        tokens: [
          { name: '--healthcare-primary', value: '#216C9E', description: '핵심 CTA, 링크' },
          { name: '--healthcare-assist', value: '#B7E0F4', description: '부드러운 강조 배경' },
          { name: '--healthcare-positive', value: '#3A9A5B', description: '예약 가능, 정상 수치' },
        ],
      },
      {
        title: 'Alert',
        tokens: [
          { name: '--healthcare-attention', value: '#EFAB35', description: '주의 안내' },
          { name: '--healthcare-emergency', value: '#C84D58', description: '긴급, 경고 상태' },
          { name: '--healthcare-divider', value: '#6B7981', description: '구분선, 표 보조선' },
        ],
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    description: '금융 상품의 안정성과 리스크 표현을 위한 색상 토큰',
    sections: [
      {
        title: 'Market',
        tokens: [
          { name: '--finance-profit', value: '#15A46E', description: '수익, 상승 상태' },
          { name: '--finance-loss', value: '#E25B5B', description: '손실, 하락 상태' },
          { name: '--finance-hold', value: '#9F9788', description: '보유, 중립 상태' },
        ],
      },
      {
        title: 'Dashboard',
        tokens: [
          { name: '--finance-surface', value: '#1A1916', description: '대시보드 패널 배경' },
          { name: '--finance-outline', value: '#4F4B42', description: '차트, 카드 테두리' },
          { name: '--finance-highlight', value: '#D4C3A3', description: '요약 수치 강조' },
        ],
      },
    ],
  },
]
