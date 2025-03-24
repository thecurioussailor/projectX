import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#7F37D8' 
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-4 border-solid border-t-transparent`}
        style={{ borderColor: `${color} transparent transparent transparent` }}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner; 