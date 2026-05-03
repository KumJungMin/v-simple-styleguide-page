import type { ChangeEvent } from 'react'
import { cx } from '../utils'

export type Device = 'mobile' | 'tablet' | 'desktop' | 'custom'
export type DeviceBreakpoints = Record<Device, number>

interface DeviceControlsProps {
  previewWidth: number
  customWidth: number
  selectedDevice: Device
  onSelect: (device: Device) => void
  onCustomWidthChange: (width: number) => void
  onApply: () => void
}

export function DeviceControls({
  previewWidth,
  customWidth,
  selectedDevice,
  onSelect,
  onCustomWidthChange,
  onApply,
}: DeviceControlsProps) {
  function handleCustomWidthChange(event: ChangeEvent<HTMLInputElement>) {
    onCustomWidthChange(Number(event.target.value))
  }

  return (
    <div className="device-controls">
      <div className="device-controls__group">
        <button className={deviceButtonClass(selectedDevice, 'mobile')} onClick={() => onSelect('mobile')}>
          mobile
        </button>
        <button className={deviceButtonClass(selectedDevice, 'tablet')} onClick={() => onSelect('tablet')}>
          tablet
        </button>
        <button className={deviceButtonClass(selectedDevice, 'desktop')} onClick={() => onSelect('desktop')}>
          desktop
        </button>
      </div>
      <span className="label">custom:</span>
      <input
        className="device-controls__input"
        type="number"
        value={customWidth}
        onChange={handleCustomWidthChange}
      />
      <button className={deviceButtonClass(selectedDevice, 'custom')} onClick={onApply}>
        apply
      </button>
      <span className="px">{previewWidth}px</span>
    </div>
  )
}

function deviceButtonClass(selectedDevice: Device, device: Device) {
  return cx('device-controls__button', selectedDevice === device && 'device-controls__button--active')
}
