'use client';
import { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button = ({
  children,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
