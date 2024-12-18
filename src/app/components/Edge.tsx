import React from 'react'

interface EdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  onClick: (x1: number, y1: number, x2: number, y2: number) => void
  color?: string
}

export const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, onClick, color }) => {
  return (
    <line style={{ zIndex: 10 }}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color || '#efefef'}
      strokeWidth={0.2}
      strokeLinecap="round"
      onClick={() => onClick(x1, y1, x2, y2)}
      className="cursor-pointer"
    />
  )
}

