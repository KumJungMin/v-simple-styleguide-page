import type { ChangeEvent } from 'react'
import type { PropDefinition } from '../types'
import { getInputMode, getSelectOptions, type InputMode } from '../core'

interface PropsTabProps {
  props: PropDefinition[]
  currentProps: Record<string, unknown>
  onCurrentPropsChange: (props: Record<string, unknown>) => void
}

export function PropsTab({ props, currentProps, onCurrentPropsChange }: PropsTabProps) {
  function updateProp(name: string, value: unknown) {
    onCurrentPropsChange({
      ...currentProps,
      [name]: value,
    })
  }

  return (
    <div className="tab-content props-tab">
      <table className="props-table" aria-label="Component props">
        <thead>
          <tr>
            <th>name</th>
            <th>type</th>
            <th>default</th>
            <th>description</th>
            <th>edit</th>
          </tr>
        </thead>
        <tbody>
          {props.map(prop => (
            <tr key={prop.name}>
              <td>{prop.name}</td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>{formatDefaultValue(prop.default, prop.required)}</td>
              <td>{prop.description}</td>
              <td>{renderControl(prop, currentProps[prop.name], updateProp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderControl(
  prop: PropDefinition,
  value: unknown,
  updateProp: (name: string, value: unknown) => void
) {
  const mode = getMode(prop)

  if (mode === 'select') {
    return (
      <select
        id={`prop-${prop.name}`}
        className="prop-input"
        value={toInputValue(value)}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => updateProp(prop.name, event.target.value)}
      >
        {getSelectOptions(prop).map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  if (mode === 'boolean') {
    return (
      <input
        id={`prop-${prop.name}`}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => updateProp(prop.name, event.target.checked)}
      />
    )
  }

  if (mode === 'number') {
    return (
      <input
        id={`prop-${prop.name}`}
        className="prop-input"
        type="number"
        value={toInputValue(value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => updateProp(prop.name, Number(event.target.value))}
      />
    )
  }

  return (
    <input
      id={`prop-${prop.name}`}
      className="prop-input"
      type="text"
      value={toInputValue(value)}
      onChange={(event: ChangeEvent<HTMLInputElement>) => updateProp(prop.name, event.target.value)}
    />
  )
}

function toInputValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return ''
}

function getMode(prop: PropDefinition): InputMode {
  return getInputMode(prop)
}

function formatDefaultValue(value: unknown, required?: boolean) {
  if (value === undefined) {
    return required ? 'required' : '-'
  }

  if (typeof value === 'string') {
    return `"${value}"`
  }

  return String(value)
}
