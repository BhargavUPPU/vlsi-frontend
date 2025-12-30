"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

/**
 * PasswordInput Component
 * Enhanced password input with visibility toggle and optional strength indicator
 */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  showStrength = false,
  error,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthMap = {
      0: { label: "", color: "" },
      1: { label: "Very Weak", color: "bg-red-500" },
      2: { label: "Weak", color: "bg-orange-500" },
      3: { label: "Fair", color: "bg-yellow-500" },
      4: { label: "Good", color: "bg-blue-500" },
      5: { label: "Strong", color: "bg-green-500" },
    };

    return { score, ...strengthMap[score], checks };
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    if (showStrength) {
      setStrength(calculateStrength(newValue));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...props}
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-2">
          {/* Strength Bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  level <= strength.score ? strength.color : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Strength Label */}
          {strength.label && (
            <p className="text-xs font-medium text-gray-600">
              Password strength: <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
            </p>
          )}

          {/* Requirements Checklist */}
          <div className="space-y-1 text-xs">
            <p className="font-medium text-gray-700">Password must contain:</p>
            <div className="grid grid-cols-2 gap-1">
              <RequirementItem
                met={strength.checks?.length}
                text="8+ characters"
              />
              <RequirementItem
                met={strength.checks?.lowercase}
                text="Lowercase letter"
              />
              <RequirementItem
                met={strength.checks?.uppercase}
                text="Uppercase letter"
              />
              <RequirementItem
                met={strength.checks?.number}
                text="Number"
              />
              <RequirementItem
                met={strength.checks?.special}
                text="Special character"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function RequirementItem({ met, text }) {
  return (
    <div className="flex items-center gap-1">
      {met ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-gray-400" />
      )}
      <span className={met ? "text-green-600" : "text-gray-500"}>{text}</span>
    </div>
  );
}
