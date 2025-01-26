import React from "react";

export default function ClickButton({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>;
}
