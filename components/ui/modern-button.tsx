'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'custom';
}

export function ModernButton({
  children,
  onClick,
  disabled = false,
  className,
  size = 'lg',
}: ModernButtonProps) {
  // Size variants with padding and sizing
  const sizeClasses = {
    sm: 'px-6 py-2.5 min-w-[160px] min-h-[44px]',
    md: 'px-8 py-3 min-w-[180px] min-h-[48px]',
    lg: 'px-8 py-4 w-full min-h-[56px]',
    custom: '', // For circular buttons or completely custom styling
  };

  // If className is provided and size is not 'custom', combine them
  // Otherwise use size classes or className alone
  const wrapperClasses = className
    ? (size === 'custom' ? className : cn(sizeClasses[size], className))
    : sizeClasses[size];

  return (
    <div className={cn('modern-auth-button', wrapperClasses)}>
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </div>
  );
}
