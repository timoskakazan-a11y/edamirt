
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface EmployeeHeaderProps {
  status: 'На линии' | 'Не в работе';
  employeeName: string;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ status, employeeName }) => {
  const { logout } = useAuth();
  const statusColor = status === 'На линии' ? 'bg-green-500' : 'bg-slate-400';

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`}></div>
           <span className="font-semibold text-slate-800">{status}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600 hidden sm:inline">Сотрудник: {employeeName}</span>
            <button onClick={logout} className="text-sm font-semibold text-slate-500 hover:text-brand-orange">Выйти</button>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
