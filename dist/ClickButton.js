import React from "react";
export default function ClickButton({ onClick, label }) {
    return React.createElement("button", { onClick: onClick }, label);
}
