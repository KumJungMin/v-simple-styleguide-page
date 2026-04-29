import type { ChangeEvent } from 'react'
import type { CompositionDefinition, CompositionEntryDefinition } from 'styleguide-schema'

interface CompositionTabProps {
  composition?: CompositionDefinition
  entries?: CompositionEntryDefinition[]
  activeEntry: string | null
  currentEntryEdit: string
  onEditEntry: (entryName: string) => void
  onApplyEntryEdit: () => void
  onCancelEntryEdit: () => void
  onCurrentEntryEditChange: (value: string) => void
}

export function CompositionTab({
  composition,
  entries,
  activeEntry,
  currentEntryEdit,
  onEditEntry,
  onApplyEntryEdit,
  onCancelEntryEdit,
  onCurrentEntryEditChange,
}: CompositionTabProps) {
  const entryLabel = composition?.kind === 'children' ? 'children' : 'slot'
  const headingLabel = composition?.kind === 'children' ? 'Children' : 'Slots'

  function handleCurrentEntryEditChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onCurrentEntryEditChange(event.target.value)
  }

  return (
    <div className="tab-content composition-tab">
      <h3>{headingLabel}</h3>
      {entries?.length ? (
        <>
          <table className="slot-table" aria-label="Component composition">
            <thead>
              <tr>
                <th>name</th>
                <th>description</th>
                <th className="action-cell">action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.name}>
                  <td>
                    <code>{entry.name}</code>
                  </td>
                  <td>{entry.description || '-'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => onEditEntry(entry.name)}>
                      edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeEntry && (
            <div className="slot-editor">
              <div className="editor-container">
                <div className="editor-header">
                  <div className="editor-title">
                    <div className="editor-indicator"></div>
                    <h4>
                      {activeEntry} {entryLabel} edit
                    </h4>
                  </div>
                  <div className="editor-actions">
                    <button className="btn btn-apply" onClick={onApplyEntryEdit}>
                      apply
                    </button>
                    <button className="btn btn-cancel" onClick={onCancelEntryEdit}>
                      cancel
                    </button>
                  </div>
                </div>
                <div className="textarea-container">
                  <textarea
                    value={currentEntryEdit}
                    onChange={handleCurrentEntryEditChange}
                    className="slot-textarea"
                    placeholder={`${activeEntry} ${entryLabel} content...`}
                  />
                  <div className="char-counter">{currentEntryEdit.length} chars</div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="no-slots">This component does not expose editable composition content.</p>
      )}
    </div>
  )
}
