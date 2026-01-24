"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export interface CustomNodeData {
  label: string;
  icon?: string;
  description?: string;
  variant?: "primary" | "secondary" | "accent" | "muted" | "success" | "warning";
}

const variantStyles = {
  primary: "bg-brand-cyan text-white border-cyan-600",
  secondary: "bg-brand-slate text-white border-slate-600",
  accent: "bg-brand-purple text-white border-purple-600",
  muted: "bg-slate-100 text-slate-700 border-slate-300",
  success: "bg-emerald-500 text-white border-emerald-600",
  warning: "bg-amber-400 text-slate-800 border-amber-500",
};

function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;
  const variant = nodeData.variant || "secondary";

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-md min-w-[140px]
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${variantStyles[variant]}
        ${selected ? "ring-2 ring-brand-purple ring-offset-2" : ""}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="flex items-center gap-2">
        {nodeData.icon && <span className="text-lg">{nodeData.icon}</span>}
        <span className="font-semibold text-sm">{nodeData.label}</span>
      </div>

      {nodeData.description && (
        <p className="text-xs opacity-80 mt-1">{nodeData.description}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(CustomNode);
