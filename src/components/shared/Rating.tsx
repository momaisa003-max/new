'use client';

import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  count?: number;
}

export default function Rating({
  value,
  max = 5,
  size = 'md',
  readOnly = true,
  onChange,
  showValue = false,
  count,
}: RatingProps) {
  const sizeClasses = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.floor(value);
          const halfFilled = !filled && starValue === Math.ceil(value) && value % 1 >= 0.25;

          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              className={`${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } transition-transform disabled:opacity-100 p-0 border-0 bg-transparent`}
              onClick={() => onChange?.(starValue)}
            >
              <Star
                className={`${starSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'fill-muted text-muted-foreground/30'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
