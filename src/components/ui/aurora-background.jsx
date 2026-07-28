import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn("transition-bg relative flex flex-col", className)}
      style={{ contain: "paint" }}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ contain: "strict" }}>
        {/* Primary aurora layer */}
        <div
          style={{
            position: "absolute",
            inset: "-50%",
            width: "200%",
            height: "200%",
            backgroundImage: [
              "repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%)",
              "repeating-linear-gradient(100deg, var(--accent) 10%, var(--accent-light) 15%, var(--accent-2) 20%, var(--accent) 25%, var(--accent-deep) 30%)",
            ].join(", "),
            backgroundSize: "300% 200%",
            backgroundPosition: "50% 50%",
            opacity: 0.14,
            filter: "blur(12px)",
            willChange: "transform",
            transform: "translateZ(0)",
            animation: "aurora-translate-1 70s linear infinite",
            ...(showRadialGradient
              ? {
                  maskImage:
                    "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)",
                }
              : {}),
          }}
        />
        {/* Secondary aurora layer */}
        <div
          style={{
            position: "absolute",
            inset: "-50%",
            width: "200%",
            height: "200%",
            backgroundImage: [
              "repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%)",
              "repeating-linear-gradient(100deg, var(--accent) 10%, var(--accent-light) 15%, var(--accent-2) 20%, var(--accent) 25%, var(--accent-deep) 30%)",
            ].join(", "),
            backgroundSize: "200% 100%",
            opacity: 0.10,
            filter: "blur(16px)",
            willChange: "transform",
            transform: "translateZ(0)",
            animation: "aurora-translate-2 90s linear infinite",
            ...(showRadialGradient
              ? {
                  maskImage:
                    "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)",
                }
              : {}),
          }}
        />
      </div>
      {children}
    </div>
  );
};
