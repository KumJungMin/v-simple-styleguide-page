import { ref } from 'vue';

export type Device = 'mobile' | 'tablet' | 'desktop' | 'custom';


/**
 * 컴포넌트 preview 공간의 너비를 결정하는 컴포저블입니다.
 * 
 * @param breakpoints 각 디바이스별 너비를 나타내는 객체입니다. (예: { mobile: 375, tablet: 768, desktop: 1200 })
 * @returns 
 * - `previewWidth`: 현재 선택된 디바이스의 프리뷰 너비를 나타내는 ref입니다.
 * - `customWidth`: 커스텀 프리뷰 너비를 나타내는 ref입니다.
 * - `setPreviewWidth(device: Device)`: 디바이스를 선택하여 프리뷰 너비를 변경하는 함수입니다.
 * - `updateCustomWidth(width: number)`: 커스텀 프리뷰 너비를 업데이트하는 함수입니다.
 * - `applyCustomWidth()`: 커스텀 프리뷰 너비를 적용하는 함수입니다.
 */
export function useDevicePreview(breakpoints: Record<Device, number>) {
  const previewWidth = ref(breakpoints.mobile);
  const customWidth  = ref(breakpoints.mobile);

  function setPreviewWidth(device: Device) {
    if (device === 'custom') previewWidth.value = customWidth.value || breakpoints.mobile;
    else previewWidth.value = breakpoints[device];
  }

  function updateCustomWidth(width: number) {
    customWidth.value = width;
  }

  function applyCustomWidth() {
    setPreviewWidth('custom');
  }

  return {
    previewWidth,
    customWidth,
    setPreviewWidth,
    updateCustomWidth,
    applyCustomWidth,
  };
}
