import React from 'react';
import { HabitTracker } from '../components/habits/HabitTracker';

export const HabitsPage: React.FC = () => {
  return (
    <div className="py-4">
      <HabitTracker />
    </div>
  );
};
