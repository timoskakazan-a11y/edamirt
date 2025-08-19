import React from 'react';

const EmployeeSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-brand-orange animate-popIn" style={{ animationDuration: '0.7s' }}>
          edamirt
        </h1>
        <p 
          className="text-red-600 text-lg font-semibold tracking-widest mt-2 opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}
        >
          delivery
        </p>
      </div>
    </div>
  );
};

export default EmployeeSplashScreen;
