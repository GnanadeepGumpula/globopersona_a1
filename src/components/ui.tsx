"use client";

import * as React from "react";

// Primary Button Component with explicit Corporate High-Contrast interaction variants
export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/40";
  
  const variants = {
    primary: "bg-[#002D72] text-white hover:bg-[#004AAD] shadow-sm",
    secondary: "bg-[#EBF8FF] text-[#0B51C1] hover:bg-[#E2E8F0]",
    outline: "border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F7FAFC]",
    ghost: "text-[#4A5568] hover:bg-[#EDF2F7]",
    danger: "bg-[#FFF5F5] text-[#C53030] hover:bg-[#FED7D7]"
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

// Crisp Corporate White Layout Container Grid
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-[25px] shadow-sm overflow-hidden ${className}`}
      {...props}
    />
  );
}

// Card Sub-Components needed by dashboard, layout, and automation engines
export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pb-3 flex flex-col space-y-1.5 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-bold text-xl text-[#004AAD] tracking-tight ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs text-[#718096] ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

// Flat capsule status mapping widgets
export function Badge({
  tone = "slate",
  children
}: {
  tone: "green" | "amber" | "slate" | "accent" | "coral";
  children: React.ReactNode;
}) {
  const tones = {
    slate: "text-[#4A5568] bg-[#EDF2F7]",
    accent: "text-[#2B6CB0] bg-[#EBF8FF]",
    green: "text-[#2F855A] bg-[#F0FFF4]",
    coral: "text-[#C53030] bg-[#FFF5F5]",
    amber: "text-[#B7791F] bg-[#FEFCBF]"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${tones[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

// Telemetry Metric Progress Bars
export function Progress({ value = 0 }: { value: number }) {
  return (
    <div className="w-full bg-[#EDF2F7] h-2 rounded-full overflow-hidden">
      <div 
        className="bg-[#0B51C1] h-full transition-all duration-500 ease-out" 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// High-contrast input field matching corporate form screens
export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full h-11 border border-[#E2E8F0] bg-white rounded-[12px] px-4 text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all ${className}`}
      {...props}
    />
  );
}

// Clean bold descriptive typography label matching the screenshots
export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5 ${className}`}
      {...props}
    />
  );
}

// Uniform text container block for long text handling
export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full border border-[#E2E8F0] bg-white rounded-[14px] p-4 text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all ${className}`}
      {...props}
    />
  );
}

// Shimmer effect multi-row table loading skeleton matching the data grids
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-4 p-4 bg-white rounded-[20px] border border-[#E2E8F0]">
      <div className="flex space-x-4 border-b border-[#E2E8F0] pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`h-skel-${i}`} className="h-4 bg-[#EDF2F7] rounded-md animate-pulse flex-1" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-skel-${r}`} className="flex space-x-4 py-2">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={`c-skel-${c}`} className="h-5 bg-[#F7FAFC] rounded-md animate-pulse flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Action notification Toast component for success feedback and backend validation failures
export function Toast({
  message,
  type = "success",
  onClose
}: {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}) {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const backgroundType = type === "success" ? "bg-[#F0FFF4] border-[#2F855A] text-[#2F855A]" : "bg-[#FFF5F5] border-[#C53030] text-[#C53030]";

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-[14px] border shadow-md max-w-sm transition-all duration-300 ${backgroundType}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      <p className="text-xs font-bold tracking-tight">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-auto text-current opacity-60 hover:opacity-100 font-bold text-xs pl-2"
        >
          ✕
        </button>
      )}
    </div>
  );
}