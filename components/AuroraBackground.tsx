import React from "react"

// AuroraBackground: animated aurora/gradient background
export const AuroraBackground: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden z-0 ${className}`} aria-hidden="true">
      {/* Aurora effect: animated gradients */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 w-[120vw] h-[120vw] -translate-x-1/2 animate-aurora-blur opacity-70">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-60 animate-aurora-move" />
        <div className="absolute left-1/4 top-1/3 w-2/3 h-2/3 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-300 rounded-full blur-2xl opacity-40 animate-aurora-move2" />
        <div className="absolute left-1/2 top-1/2 w-1/2 h-1/2 bg-gradient-to-tl from-purple-200 via-blue-300 to-pink-200 rounded-full blur-2xl opacity-30 animate-aurora-move3" />
      </div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

// Tailwind CSS (add to your global styles):
// .animate-aurora-blur { animation: aurora-blur 12s ease-in-out infinite alternate; }
// .animate-aurora-move { animation: aurora-move 18s linear infinite alternate; }
// .animate-aurora-move2 { animation: aurora-move2 22s linear infinite alternate; }
// .animate-aurora-move3 { animation: aurora-move3 26s linear infinite alternate; }
// @keyframes aurora-blur { 0% { filter: blur(40px); } 100% { filter: blur(80px); } }
// @keyframes aurora-move { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-40px) scale(1.1); } }
// @keyframes aurora-move2 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(60px) scale(1.05); } }
// @keyframes aurora-move3 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(40px) scale(0.95); } }
