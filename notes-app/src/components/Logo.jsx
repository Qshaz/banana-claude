export default function Logo({ iconOnly = false, size = 40, className = '' }) {
  // 8-pointed star: 16 alternating outer/inner points
  // Outer R=14, inner r=5.8, center 20,20 for 40x40 viewBox
  const outerPoints = [
    [20, 6],
    [29.9, 10.1],
    [34, 20],
    [29.9, 29.9],
    [20, 34],
    [10.1, 29.9],
    [6, 20],
    [10.1, 10.1],
  ]
  const innerPoints = [
    [21.9, 14.2],
    [25.8, 18.1],
    [25.8, 21.9],
    [21.9, 25.8],
    [18.1, 25.8],
    [14.2, 21.9],
    [14.2, 18.1],
    [18.1, 14.2],
  ]

  // Build star path: M outer[0] L inner[0] L outer[1] L inner[1] ... Z
  const starPath = outerPoints.reduce((acc, op, i) => {
    const ip = innerPoints[i]
    const prefix = i === 0 ? `M ${op[0]},${op[1]}` : `L ${op[0]},${op[1]}`
    return `${acc} ${prefix} L ${ip[0]},${ip[1]}`
  }, '') + ' Z'

  // Connecting lines through center for "two squares" visual
  // Connect alternate outer points (0,4), (1,5), (2,6), (3,7)
  const centerLines = [
    [outerPoints[0], outerPoints[4]],
    [outerPoints[1], outerPoints[5]],
    [outerPoints[2], outerPoints[6]],
    [outerPoints[3], outerPoints[7]],
  ]

  const starIcon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dar Al Hikmah logo"
    >
      {/* Thin circle ring */}
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="#B89A64"
        strokeOpacity="0.3"
        strokeWidth="0.75"
        fill="none"
      />
      {/* Inner geometric lines (two squares feel) */}
      {centerLines.map(([a, b], i) => (
        <line
          key={i}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke="#B89A64"
          strokeOpacity="0.2"
          strokeWidth="0.6"
        />
      ))}
      {/* 8-pointed star */}
      <path
        d={starPath}
        fill="#B89A64"
      />
    </svg>
  )

  if (iconOnly) {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
        {starIcon}
      </span>
    )
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
    >
      {starIcon}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '13px',
          letterSpacing: '0.15em',
          color: '#B89A64',
          fontWeight: 400,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}
      >
        DAR AL HIKMAH
      </span>
    </span>
  )
}
