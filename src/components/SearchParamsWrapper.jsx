"use client";
import { Suspense } from "react";

export function SearchParamsWrapper({ children }) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      {children}
    </Suspense>
  );
}
