interface RenaissanceLogoProps {
  className?: string
}

export function RenaissanceLogo({ className }: RenaissanceLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Football/Soccer ball */}
      <circle cx="50" cy="50" r="35" className="fill-background stroke-foreground" />

      {/* Pentagon patterns on the ball */}
      <path d="M50,15 L70,30 L65,55 L35,55 L30,30 Z" className="fill-none" />
      <path d="M30,30 L15,50 L30,70 L50,65 L50,55 Z" className="fill-none" />
      <path d="M70,30 L85,50 L70,70 L50,65 L50,55 Z" className="fill-none" />
      <path d="M30,70 L50,85 L70,70 L50,65 Z" className="fill-none" />

      {/* Renaissance star symbol overlay */}
      <path
        d="M50,35 L55,45 L65,45 L57,53 L60,63 L50,57 L40,63 L43,53 L35,45 L45,45 Z"
        className="fill-none stroke-primary"
      />

      {/* Blockchain elements */}
      <circle cx="30" cy="40" r="3" className="fill-primary stroke-none" />
      <circle cx="70" cy="40" r="3" className="fill-primary stroke-none" />
      <circle cx="40" cy="70" r="3" className="fill-primary stroke-none" />
      <circle cx="60" cy="70" r="3" className="fill-primary stroke-none" />

      {/* Connecting lines representing blockchain */}
      <path d="M30,40 L40,70" className="stroke-primary stroke-[1.5]" />
      <path d="M70,40 L60,70" className="stroke-primary stroke-[1.5]" />
      <path d="M30,40 L70,40" className="stroke-primary stroke-[1.5]" />
      <path d="M40,70 L60,70" className="stroke-primary stroke-[1.5]" />
    </svg>
  )
}