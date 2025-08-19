
import React from 'react';

const BarcodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5v15m3.75-15v15m3.75-15v15m3.75-15v15m3.75-15v15" />
  </svg>
);

export default BarcodeIcon;
