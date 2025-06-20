import { cn } from "@/lib/utils";
import { RotatingLines } from 'react-loader-spinner';

/**
 * A small, rotating lines loader for inline use, like next to an input field.
 * Uses the project's teal-to-blue gradient color scheme.
 * @param {string} className - Optional additional classes for styling.
 * @param {number} width - Width of the spinner (default: 20).
 */
export const InlineLoader = ({ 
  className, 
  width = 20 
}: { 
  className?: string;
  width?: number;
}) => {
  return (
    <div className={cn("inline-flex", className)}>
      <RotatingLines
        strokeColor="#0ea5e9" // Sky-500 (teal-blue)
        strokeWidth="2"
        animationDuration="0.75"
        width={width.toString()}
        visible={true}
      />
    </div>
  );
};

/**
 * A small, rotating lines loader designed to be placed inside a button.
 * Uses white color for button contrast.
 * @param {string} className - Optional additional classes for styling.
 * @param {number} width - Width of the spinner (default: 16).
 */
export const ButtonLoader = ({ 
  className, 
  width = 16 
}: { 
  className?: string;
  width?: number;
}) => {
  return (
    <div className={cn("inline-flex", className)}>
      <RotatingLines
        strokeColor="#ffffff" // White for button contrast
        strokeWidth="2"
        animationDuration="0.75"
        width={width.toString()}
        visible={true}
      />
    </div>
  );
};

/**
 * A gradient rotating lines loader that uses the project's teal-to-blue gradient.
 * Perfect for larger loading states or page loads.
 * @param {string} className - Optional additional classes for styling.
 * @param {number} width - Width of the spinner (default: 40).
 */
export const GradientLoader = ({ 
  className, 
  width = 40 
}: { 
  className?: string;
  width?: number;
}) => {
  return (
    <div className={cn("inline-flex", className)}>
      <RotatingLines
        strokeColor="url(#gradient)"
        strokeWidth="3"
        animationDuration="0.75"
        width={width.toString()}
        visible={true}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} /> {/* Teal-600 */}
            <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} /> {/* Sky-500 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}; 