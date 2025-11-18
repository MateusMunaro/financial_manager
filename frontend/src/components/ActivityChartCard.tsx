'use client';

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';

// Prop definition for individual data points
interface ActivityDataPoint {
  day: string;
  value: number;
}

// Prop definition for the component
interface ActivityChartCardProps {
  title?: string;
  subtitle?: string;
  totalValue: string;
  data: ActivityDataPoint[];
  className?: string;
  dropdownOptions?: string[];
  onRangeChange?: (range: string) => void;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

/**
 * A responsive and animated card component to display weekly activity data.
 * Features a bar chart animated with Framer Motion with Oceanic Depth theme.
 */
export const ActivityChartCard = ({
  title = "Atividade",
  subtitle,
  totalValue,
  data,
  className = "",
  dropdownOptions = ["Semanal", "Mensal", "Anual"],
  onRangeChange,
  trend,
}: ActivityChartCardProps) => {
  const { getThemeColor } = useTheme();
  const [selectedRange, setSelectedRange] = React.useState(dropdownOptions[0] || "");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Find the maximum value in the data to normalize bar heights
  const maxValue = React.useMemo(() => {
    return data.reduce((max, item) => (item.value > max ? item.value : max), 0);
  }, [data]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setShowDropdown(false);
    onRangeChange?.(range);
  };

  // Framer Motion variants for animations
  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Animate each child (bar) with a delay
      },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg ${className}`}
      style={{
        backgroundColor: getThemeColor(colors.background.paper),
        border: `1px solid ${getThemeColor(colors.border.default)}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: getThemeColor(colors.background.elevated),
              color: getThemeColor(colors.text.primary),
            }}
          >
            {selectedRange}
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 rounded-lg shadow-xl z-10 overflow-hidden min-w-[120px]"
              style={{
                backgroundColor: getThemeColor(colors.background.elevated),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
              }}
            >
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleRangeChange(option)}
                  className="w-full px-4 py-2 text-left text-sm transition-colors duration-200"
                  style={{
                    color: getThemeColor(colors.text.primary),
                    backgroundColor: option === selectedRange 
                      ? getThemeColor(colors.brand.primary) + '20'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (option !== selectedRange) {
                      e.currentTarget.style.backgroundColor = getThemeColor(colors.background.default);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (option !== selectedRange) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
        {/* Total Value */}
        <div className="flex flex-col min-w-[200px]">
          <p
            className="text-5xl font-bold tracking-tighter mb-2"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {totalValue}
          </p>
          {trend && (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                style={{
                  backgroundColor: trend.isPositive
                    ? getThemeColor(colors.semantic.positive) + '20'
                    : getThemeColor(colors.semantic.negative) + '20',
                }}
              >
                <ArrowTrendingUpIcon
                  className="h-4 w-4"
                  style={{
                    color: trend.isPositive
                      ? getThemeColor(colors.semantic.positive)
                      : getThemeColor(colors.semantic.negative),
                    transform: trend.isPositive ? 'none' : 'scaleY(-1)',
                  }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: trend.isPositive
                      ? getThemeColor(colors.semantic.positive)
                      : getThemeColor(colors.semantic.negative),
                  }}
                >
                  {trend.value}
                </span>
              </div>
              <span
                className="text-sm"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                vs período anterior
              </span>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <motion.div
          key={selectedRange} // Re-trigger animation when range changes
          className="flex h-32 w-full items-end justify-between gap-2 lg:gap-3"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2 group"
            >
              <motion.div
                className="w-full rounded-t-lg transition-all duration-200 relative"
                style={{
                  height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 5}%`,
                  minHeight: '8px',
                  backgroundColor: getThemeColor(colors.brand.primary),
                  boxShadow: `0 0 10px ${getThemeColor(colors.brand.primary)}40`,
                  transformOrigin: 'bottom',
                }}
                variants={barVariants}
                whileHover={{
                  backgroundColor: getThemeColor(colors.brand.accent),
                  scale: 1.05,
                }}
              >
                {/* Tooltip on hover */}
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    color: getThemeColor(colors.text.primary),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                    boxShadow: getThemeColor(colors.shadow.md),
                  }}
                >
                  R$ {item.value.toFixed(2)}
                </div>
              </motion.div>
              <span
                className="text-xs font-medium"
                style={{ color: getThemeColor(colors.text.tertiary) }}
              >
                {item.day}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
