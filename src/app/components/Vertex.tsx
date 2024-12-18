import React from 'react'

interface VertexProps {
  x: number
  y: number
  onClick: (x: number, y: number) => void
  color?: string
}

export const Vertex: React.FC<VertexProps> = ({ x, y, onClick, color }) => {
  return (
    <g style={{ zIndex: 20 }}>
      <circle
        cx={x}
        cy={y}
        r={0.3}
        fill={color || '#efefef'}
        stroke="black"
        strokeWidth={0.05}
        onClick={() => onClick(x, y)}
        className="cursor-pointer"
      />
    </g>
  )
}

