/**
 * Decorative SVG Icon Components
 * Premium themed icons for the Divyansh International design system.
 * All icons use currentColor for strokes, making them themeable.
 */

import type { SVGProps } from "react";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

// =============================================================================
// OUTLINE ICONS (Use currentColor - themeable)
// =============================================================================

/**
 * Leaf Icon - Natural organic theme
 */
export function LeafIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 21C12 21 13.5 16.5 18 13.5C22.5 10.5 21 4.5 21 4.5C21 4.5 15 3 12 7.5C9 12 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21C12 21 10.5 16.5 6 13.5C1.5 10.5 3 4.5 3 4.5C3 4.5 9 3 12 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Nut Icon - Core brand symbol
 */
export function NutIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Flower Icon - Decorative accent
 */
export function FlowerIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 8C12 8 14 4 17 4C20 4 21 7 19 10C17 13 12 12 12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8C12 8 10 4 7 4C4 4 3 7 5 10C7 13 12 12 12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C12 12 14 16 17 16C20 16 21 13 19 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C12 12 10 16 7 16C4 16 3 13 5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

// =============================================================================
// ILLUSTRATED ICONS (Fixed colors - realistic nut illustrations)
// =============================================================================

/**
 * Almond Icon - Realistic almond illustration
 */
export function AlmondIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Main almond shape */}
      <ellipse cx="32" cy="32" rx="12" ry="22" fill="#D4A574" transform="rotate(-15 32 32)" />
      <ellipse cx="32" cy="32" rx="11" ry="21" fill="#C89968" transform="rotate(-15 32 32)" />
      {/* Texture lines */}
      <path
        d="M28 18C28 18 30 25 30 32C30 39 28 46 28 46"
        stroke="#B8875A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M32 16C32 16 33 24 33 32C33 40 32 48 32 48"
        stroke="#B8875A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M36 18C36 18 34 25 34 32C34 39 36 46 36 46"
        stroke="#B8875A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Highlight */}
      <ellipse
        cx="28"
        cy="26"
        rx="3"
        ry="6"
        fill="white"
        opacity="0.3"
        transform="rotate(-15 28 26)"
      />
      {/* Shadow */}
      <ellipse
        cx="36"
        cy="36"
        rx="4"
        ry="8"
        fill="#A67C52"
        opacity="0.3"
        transform="rotate(-15 36 36)"
      />
    </svg>
  );
}

/**
 * Cashew Icon - Realistic cashew illustration
 */
export function CashewIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Main cashew shape - curved kidney shape */}
      <path
        d="M25 15C20 15 16 18 14 22C12 26 12 30 14 34C16 38 20 42 26 44C32 46 38 45 42 42C46 39 48 35 48 30C48 25 46 20 42 17C38 14 32 13 28 15C26 16 25 17 25 19C25 21 26 22 28 22C30 22 31 21 32 20C34 18 36 18 38 19C40 20 42 23 42 26C42 29 40 32 37 34C34 36 30 36 27 35C24 34 22 32 21 29C20 26 20 23 22 21C24 19 26 18 28 18"
        fill="#E8C9A0"
      />
      <path
        d="M25 15C20 15 16 18 14 22C12 26 12 30 14 34C16 38 20 42 26 44C32 46 38 45 42 42C46 39 48 35 48 30C48 25 46 20 42 17C38 14 32 13 28 15C26 16 25 17 25 19C25 21 26 22 28 22C30 22 31 21 32 20C34 18 36 18 38 19C40 20 42 23 42 26C42 29 40 32 37 34C34 36 30 36 27 35C24 34 22 32 21 29C20 26 20 23 22 21C24 19 26 18 28 18"
        fill="#D4B896"
      />
      {/* Inner curve detail */}
      <path
        d="M28 20C29 19 31 19 33 20C35 21 36 23 36 25C36 27 35 29 33 30C31 31 29 31 28 30"
        stroke="#C4A886"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Highlight */}
      <ellipse
        cx="22"
        cy="24"
        rx="4"
        ry="6"
        fill="white"
        opacity="0.3"
        transform="rotate(-25 22 24)"
      />
      {/* Shadow */}
      <path
        d="M30 38C32 39 35 39 38 38C40 37 42 35 43 33"
        stroke="#B89876"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * Walnut Icon - Realistic walnut illustration
 */
export function WalnutIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Walnut shell - two halves */}
      <ellipse cx="28" cy="32" rx="14" ry="18" fill="#8B6F47" />
      <ellipse cx="36" cy="32" rx="14" ry="18" fill="#7D6342" />
      {/* Center seam */}
      <line x1="32" y1="14" x2="32" y2="50" stroke="#5C4A33" strokeWidth="2" />
      {/* Texture - left side */}
      <path
        d="M24 20C22 24 21 28 21 32C21 36 22 40 24 44"
        stroke="#6B5538"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M28 18C26 23 25 28 25 32C25 36 26 41 28 46"
        stroke="#6B5538"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Texture - right side */}
      <path
        d="M40 20C42 24 43 28 43 32C43 36 42 40 40 44"
        stroke="#5C4A33"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M36 18C38 23 39 28 39 32C39 36 38 41 36 46"
        stroke="#5C4A33"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Highlight */}
      <ellipse cx="26" cy="24" rx="3" ry="5" fill="white" opacity="0.2" />
    </svg>
  );
}

/**
 * Peanut Icon - Realistic peanut illustration
 */
export function PeanutIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Peanut shell - figure 8 shape */}
      <ellipse cx="32" cy="22" rx="12" ry="14" fill="#D4A76A" />
      <ellipse cx="32" cy="42" rx="11" ry="13" fill="#C99A5F" />
      {/* Middle connection */}
      <rect x="26" y="28" width="12" height="8" fill="#C99A5F" rx="2" />
      {/* Texture pattern */}
      <path
        d="M28 16C26 18 25 20 25 22C25 24 26 26 28 28"
        stroke="#B8895A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M36 16C38 18 39 20 39 22C39 24 38 26 36 28"
        stroke="#B8895A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M28 36C26 38 25 40 25 42C25 44 26 46 28 48"
        stroke="#B8895A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M36 36C38 38 39 40 39 42C39 44 38 46 36 48"
        stroke="#B8895A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Texture dots */}
      <circle cx="30" cy="20" r="1" fill="#A67850" opacity="0.6" />
      <circle cx="34" cy="23" r="1" fill="#A67850" opacity="0.6" />
      <circle cx="29" cy="40" r="1" fill="#A67850" opacity="0.6" />
      <circle cx="35" cy="43" r="1" fill="#A67850" opacity="0.6" />
      {/* Highlight */}
      <ellipse cx="28" cy="19" rx="3" ry="4" fill="white" opacity="0.3" />
    </svg>
  );
}
