'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'custom';
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ children, onClick, disabled = false, className, size = 'lg', ...props }, ref) => {
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

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent event if clicking directly on the button (let button handle it)
      if ((e.target as HTMLElement).tagName === 'BUTTON') {
        return;
      }
      // If onClick is provided (from SignInModal or directly), trigger it
      if (onClick && !disabled) {
        onClick(e as any);
      }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Stop propagation to prevent double firing
      e.stopPropagation();
      if (onClick && !disabled) {
        onClick(e);
      }
    };

    return (
      <div 
        className={cn('modern-auth-button', wrapperClasses)}
        onClick={handleWrapperClick}
        role="button"
        aria-disabled={disabled}
      >
        <button ref={ref} onClick={handleButtonClick} disabled={disabled} {...props}>
          {children}
        </button>
      </div>
    );
  }
);

ModernButton.displayName = 'ModernButton';
