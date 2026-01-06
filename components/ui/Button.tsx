"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base = "px-6 py-3 rounded-lg font-semibold transition-all shadow-lg";

  const variants = {
    primary: "bg-cyan-600 text-black shadow-cyan-900/20", // always blue
    secondary: "bg-gray-700 text-white shadow-gray-900/20",
    danger: "bg-red-600 text-white shadow-red-900/20",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}
