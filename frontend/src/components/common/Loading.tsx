import React from 'react';

export interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({
  label = 'Processing threat intelligence...',
  size = 'md',
}) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
      <div className={`${spinnerSize} border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin`} />
      <span className="text-xs font-mono tracking-wider uppercase text-slate-400 animate-pulse">{label}</span>
    </div>
  );
};

export default Loading;
