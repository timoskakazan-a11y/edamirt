import React from 'react';

const WorkBootsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(5, 5) scale(0.9)">
      {/* Left Boot */}
      <rect x="15" y="65" width="30" height="10" fill="#2F80ED" />
      <path d="M 15 65 L 15 40 Q 15 30, 25 30 L 40 30 L 40 65 Z" fill="#EB5757" />
      <rect x="20" y="32" width="15" height="2" fill="#F2F2F2" />
      <rect x="20" y="38" width="15" height="2" fill="#F2F2F2" />
      <rect x="15" y="75" width="35" height="5" rx="2" fill="#333" />
      <rect x="15" y="80" width="35" height="10" rx="2" fill="#27AE60" />

      {/* Right Boot */}
      <rect x="55" y="65" width="30" height="10" fill="#2F80ED" />
      <path d="M 55 65 L 55 30 L 70 30 Q 80 30, 80 40 L 80 65 Z" fill="#EB5757" />
      <rect x="60" y="32" width="15" height="2" fill="#F2F2F2" />
      <rect x="60" y="38" width="15" height="2" fill="#F2F2F2" />
      <rect x="50" y="75" width="35" height="5" rx="2" fill="#333" />
      <rect x="50" y="80" width="35" height="10" rx="2" fill="#27AE60" />
    </g>
  </svg>
);

export default WorkBootsIcon;
