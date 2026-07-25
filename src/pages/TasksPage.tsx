import React from 'react';
import { KanbanBoard } from '../components/tasks/KanbanBoard';

export const TasksPage: React.FC = () => {
  return (
    <div className="py-4">
      <KanbanBoard />
    </div>
  );
};
