import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, X, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const SortableItem = ({ id, lesson }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 bg-white border rounded-2xl mb-2 transition-all shadow-sm",
        isDragging ? "opacity-50 border-indigo-500 shadow-xl scale-[1.02]" : "border-gray-100 hover:border-gray-200"
      )}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-indigo-600 transition-colors"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 truncate">{lesson.title}</h4>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Lesson ID: {lesson.id}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-gray-300">#</span>
        <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-700 border border-gray-100">
          {lesson.temp_order}
        </span>
      </div>
    </div>
  );
};

const LessonReorderPanel = ({ isOpen, onClose, lessons = [], onSave, isLoading = false }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (lessons.length > 0) {
      // Add temp_order for visual feedback while dragging
      setItems(lessons.map((l, i) => ({ ...l, temp_order: i + 1 })));
    }
  }, [lessons]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        const newArr = arrayMove(prev, oldIndex, newIndex);
        // Update temp_order numbers
        return newArr.map((item, i) => ({ ...item, temp_order: i + 1 }));
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-in slide-in-from-top-4 duration-300 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-indigo-900">Sequence Reordering</h3>
          <p className="text-xs text-indigo-700/70 font-medium mt-1">
            Drag handles to change the unlock sequence for students.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} icon={X} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={Save} 
            loading={isLoading}
            onClick={() => onSave(items.map(it => it.id))}
          >
            Save Order
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Important:</strong> Changing the order will immediately update the progression path for all students in this grade and subject.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((it) => it.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-w-2xl">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} lesson={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LessonReorderPanel;
