import React from 'react';
import { ChecklistItem } from '../hooks/use-сhecklist';
import '../styles/checklist.css';

interface ChecklistComponentProps {
  checklist: ChecklistItem[];
  newItemText: string;
  editingItemId: string | null;
  editItemText: string;
  onNewItemChange: (text: string) => void;
  onEditItemChange: (text: string) => void;
  onAddItem: () => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onStartEditing: (item: ChecklistItem) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChecklistComponent: React.FC<ChecklistComponentProps> = ({
  checklist,
  newItemText,
  editingItemId,
  editItemText,
  onNewItemChange,
  onEditItemChange,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onKeyPress,
}) => {
  const totalItems = checklist.length;
  const completedItems = checklist.filter(item => item.completed).length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <section className="trip-section">
      <h2>Чек-лист сборов</h2>

      {/* прогресс-бар */}
      {totalItems > 0 && (
        <div className="checklist-progress">
          <div className="checklist-progress-text">
            <span>Прогресс:</span>
            <span>
              {completedItems}/{totalItems} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div className="checklist-progress-bar">
            <div
              className="checklist-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="checklist-add-form">
        <input
          type="text"
          value={newItemText}
          onChange={e => onNewItemChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Что нужно  сделать? "
          className="checklist-input"
        />
        <button
          onClick={onAddItem}
          disabled={!newItemText.trim()}
          className="checklist-add-btn"
        >
          Добавить
        </button>
      </div>

      <div className="checklist-items">
        {checklist && checklist.length > 0 ? (
          checklist.map(item => (
            <div key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(item.id)}
                className="checklist-checkbox"
              />

              {editingItemId === item.id ? (
                <div className="checklist-edit-form">
                  <input
                    type="text"
                    value={editItemText}
                    onChange={e => onEditItemChange(e.target.value)}
                    className="checklist-edit-input"
                    onKeyPress={e => e.key === 'Enter' && onSaveEditing()}
                    autoFocus
                  />
                  <button
                    onClick={onSaveEditing}
                    className="checklist-save-btn"
                    title="Сохранить"
                  >
                    ✔️
                  </button>
                  <button
                    onClick={onCancelEditing}
                    className="checklist-cancel-btn"
                    title="Отмена"
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <div className="checklist-item-content">
                  <span
                    className={`checklist-item-text ${item.completed ? 'checklist-item-completed' : ''}`}
                  >
                    {item.text}
                  </span>
                  <div className="checklist-item-actions">
                    <button
                      onClick={() => onStartEditing(item)}
                      className="checklist-edit-btn"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="checklist-delete-btn"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="checklist-empty">
            Список пока пуст. Добавьте первый пункт!
          </p>
        )}
      </div>
    </section>
  );
};
