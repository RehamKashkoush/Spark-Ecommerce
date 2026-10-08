import React from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export default function Logo({
  size = "medium",
  showText = true,
  className = "",
}) {
  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;
  const boxSize =
    size === "small" ? "28px" : size === "large" ? "44px" : "36px";
  const fontSize =
    size === "small" ? "16px" : size === "large" ? "24px" : "20px";

  return (
    <Link
      to="/"
      className={`logo-brand ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: boxSize,
          height: boxSize,
          backgroundColor: "#6366f1",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          flexShrink: 0,
        }}
      >
        <Store size={iconSize} />
      </div>
      {showText && (
        <span
          style={{
            fontSize: fontSize,
            fontWeight: "bold",
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Spark
        </span>
      )}
    </Link>
  );
}
