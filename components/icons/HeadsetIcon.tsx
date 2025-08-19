import React from 'react';

const HeadsetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75v-1.5a1.5 1.5 0 00-1.5-1.5h-3a1.5 1.5 0 00-1.5 1.5v1.5m5.25 0V18.25a2.25 2.25 0 01-2.25 2.25H9.75A2.25 2.25 0 017.5 18.25V6.75m5.25 0h-5.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5v.75a2.25 2.25 0 002.25 2.25h.75v-2.25a.75.75 0 00-.75-.75h-.75zm15 0v.75a2.25 2.25 0 01-2.25 2.25h-.75v-2.25a.75.75 0 01.75-.75h.75z" />
  </svg>
);

export default HeadsetIcon;
