import React from 'react';

const BugAntIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 8.638 5.214m8.224-2.434a8.25 8.25 0 0 0-10.848 0M15.362 5.214a8.25 8.25 0 0 1-6.724 0m6.724 0-1.122-1.121M8.638 5.214l1.122-1.121M12 21v-4.5m-3.75-3.75H12m0 0h3.75M12 16.5V21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25z" />
    </svg>
);

export default BugAntIcon;
