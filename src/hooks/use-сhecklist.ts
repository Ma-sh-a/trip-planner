import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface UseChecklistProps {
  tripId: string | undefined;
  initialChecklist: ChecklistItem[];
  onChecklistUpdate: (checklist: ChecklistItem[]) => void;
}

export const useChecklist = ({
  tripId,
  initialChecklist,
  onChecklistUpdate,
}: UseChecklistProps) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemText, setEditItemText] = useState('');

  const saveChecklist = async (checklist: ChecklistItem[]) => {
    if (!tripId) return;

    try {
      await updateDoc(doc(db, 'trips', tripId), {
        checklist: checklist,
      });
      onChecklistUpdate(checklist);
    } catch (error) {
      console.error('Ошибка сохранения чек-листа:', error);
      throw error;
    }
  };

  const addItem = async () => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    const updatedChecklist = [...initialChecklist, newItem];
    await saveChecklist(updatedChecklist);
    setNewItemText('');
  };

  const toggleItem = async (itemId: string) => {
    const updatedChecklist = initialChecklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await saveChecklist(updatedChecklist);
  };

  const deleteItem = async (itemId: string) => {
    const updatedChecklist = initialChecklist.filter(
      item => item.id !== itemId
    );
    await saveChecklist(updatedChecklist);
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingItemId(item.id);
    setEditItemText(item.text);
  };

  const saveEditing = async () => {
    if (!editingItemId || !editItemText.trim()) return;

    const updatedChecklist = initialChecklist.map(item =>
      item.id === editingItemId ? { ...item, text: editItemText.trim() } : item
    );

    await saveChecklist(updatedChecklist);
    setEditingItemId(null);
    setEditItemText('');
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditItemText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return {
    newItemText,
    setNewItemText,
    editingItemId,
    editItemText,
    setEditItemText,
    addItem,
    toggleItem,
    deleteItem,
    startEditing,
    saveEditing,
    cancelEditing,
    handleKeyPress,
  };
};
