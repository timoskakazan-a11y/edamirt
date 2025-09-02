import React from 'react';

const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12c0 2.22.885 4.237 2.36 5.753.473.304.891.644 1.297 1.014a6.6 6.6 0 0 1 1.745.962c.39.26.81.493 1.25.688.42.182.86.326 1.32.441.485.118.99.197 1.51.246M12 20.25c-4.97 0-9-3.694-9-8.25s4.03-8.25 9-8.25 9 3.694 9 8.25-4.03 8.25-9 8.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15h3.75" />
    </svg>
);

export default ChatBubbleBottomCenterTextIcon;