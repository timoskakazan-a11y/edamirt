import React from 'react';
import type { OrderStatus } from '../types';
import { AcceptedIcon, AssemblingIcon, DeliveringIcon, DeliveredIcon } from './icons/OrderIcons';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

const VISUAL_STEPS: OrderStatus[] = ['принят', 'сборка', 'доставляется', 'доставлен'];

// This function maps all possible statuses to a visual step index.
const getStepIndex = (status: OrderStatus): number => {
  switch (status) {
    case 'принят':
      return 0;
    case 'сборка':
    case 'фасовка':
    case 'ожидает курьера': // Map intermediate statuses to the 'assembling' step
      return 1;
    case 'доставляется':
      return 2;
    case 'доставлен':
      return 3;
    default:
      return 0; // Default to the first step if status is unknown
  }
};


const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentStepIndex = getStepIndex(currentStatus);

  const getIconForStatus = (status: OrderStatus) => {
    switch (status) {
      case 'принят': return <AcceptedIcon className="w-5 h-5" />;
      case 'сборка': return <AssemblingIcon className="w-5 h-5" />;
      case 'доставляется': return <DeliveringIcon className="w-5 h-5" />;
      case 'доставлен': return <DeliveredIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/30 transform -translate-y-1/2"></div>
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-white transform -translate-y-1/2 transition-all duration-500"
        style={{ width: `${(currentStepIndex / (VISUAL_STEPS.length - 1)) * 100}%` }}
      ></div>

      {VISUAL_STEPS.map((status, index) => {
        const isCompleted = currentStepIndex >= index;
        return (
          <div key={status} className="z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-white text-brand-orange' : 'bg-white/30 text-white/60'}`}>
              {getIconForStatus(status)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTracker;