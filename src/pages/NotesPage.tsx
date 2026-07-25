import React from 'react';
import { NotesEditor } from '../components/notes/NotesEditor';

export const NotesPage: React.FC = () => {
  return (
    <div className="py-2">
      <NotesEditor />
    </div>
  );
};
