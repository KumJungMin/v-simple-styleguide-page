import { ref } from 'vue';

export type Device = 'mobile' | 'tablet' | 'desktop' | 'custom';

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
