/**
 * Draws a semicircle gauge needle based on risk score (0–100).
 * Lower score = higher risk (needle toward red).
 */
function drawGauge(score) {
  const svg = document.getElementById("gauge-svg");
  if (!svg) return;

  const cx = 120, cy = 110, r = 80;

  // Arc segments: green (low) → yellow → orange → red (high)
  const segments = [
    { color: "#38a169", start: 180, end: 225 }, // low risk zone
    { color: "#68d391", start: 225, end: 255 },
    { color: "#ecc94b", start: 255, end: 285 },
    { color: "#ed8936", start: 285, end: 315 },
    { color: "#e53e3e", start: 315, end: 360 }, // high risk zone
  ];

  function polarToXY(deg, radius) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(startDeg, endDeg, outerR, innerR) {
    const s = polarToXY(startDeg, outerR);
    const e = polarToXY(endDeg, outerR);
    const si = polarToXY(startDeg, innerR);
    const ei = polarToXY(endDeg, innerR);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y}
            L ${ei.x} ${ei.y} A ${innerR} ${innerR} 0 ${large} 0 ${si.x} ${si.y} Z`;
  }

  // Map score (0–100) to angle (180°–360°). Score 100 = 180° (left/green), 0 = 360° (right/red)
  const needleAngle = 180 + ((100 - score) / 100) * 180;
  const needleTip = polarToXY(needleAngle, r - 10);
  const needleBase1 = polarToXY(needleAngle + 90, 8);
  const needleBase2 = polarToXY(needleAngle - 90, 8);

  svg.innerHTML = segments
    .map((s) => `<path d="${arcPath(s.start, s.end, r, r - 22)}" fill="${s.color}" opacity="0.9"/>`)
    .join("") +
    `<polygon points="${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}"
       fill="#2d3748"/>
     <circle cx="${cx}" cy="${cy}" r="8" fill="#2d3748"/>`;
}
