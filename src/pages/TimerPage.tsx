import React from 'react';
import { PomodoroTimer } from '../components/timer/PomodoroTimer';

export const TimerPage: React.FC = () => {
  return (
    <div className="py-4">
      <PomodoroTimer />
    </div>
  );
};
