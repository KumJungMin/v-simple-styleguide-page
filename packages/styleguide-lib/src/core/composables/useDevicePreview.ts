import { ref, watch } from 'vue'

export type Device = 'mobile' | 'tablet' | 'desktop' | 'custom'
export type DeviceBreakpoints = Record<Device, number>

export interface DevicePreviewOptions {
  getBreakpoints: () => DeviceBreakpoints
}

export function useDevicePreview(options: DevicePreviewOptions) {
  const selectedDevice = ref<Device>('mobile')
  const previewWidth = ref(0)
  const customWidth = ref(0)

  watch(
    () => options.getBreakpoints(),
    breakpoints => {
      if (!customWidth.value) {
        customWidth.value = breakpoints.custom || breakpoints.mobile
      }

      previewWidth.value = getWidthForDevice(selectedDevice.value, breakpoints, customWidth.value)
    },
    { immediate: true, deep: true }
  )

  function setPreviewWidth(device: Device) {
    selectedDevice.value = device
    previewWidth.value = getWidthForDevice(device, options.getBreakpoints(), customWidth.value)
  }

  function updateCustomWidth(width: number) {
    const fallbackWidth = options.getBreakpoints().mobile
    customWidth.value = Number.isFinite(width) && width > 0 ? width : fallbackWidth

    if (selectedDevice.value === 'custom') {
      previewWidth.value = customWidth.value
    }
  }

  function applyCustomWidth() {
    setPreviewWidth('custom')
  }

  return {
    previewWidth,
    customWidth,
    selectedDevice,
    setPreviewWidth,
    updateCustomWidth,
    applyCustomWidth,
  }
}

function getWidthForDevice(device: Device, breakpoints: DeviceBreakpoints, customWidth: number) {
  if (device === 'custom') {
    return customWidth || breakpoints.custom || breakpoints.mobile
  }

  return breakpoints[device]
}
