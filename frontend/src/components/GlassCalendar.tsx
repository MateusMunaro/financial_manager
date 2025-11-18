'use client';

import * as React from "react";
import { PlusIcon, Cog6ToothIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { 
  format, 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  isSameDay, 
  isToday, 
  getDate, 
  getDaysInMonth, 
  startOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';

// --- TYPE DEFINITIONS ---
interface Day {
    date: Date;
    isToday: boolean;
    isSelected: boolean;
}

interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    onAddExpense?: (date: Date) => void;
    className?: string;
}

// --- HELPER TO HIDE SCROLLBAR ---
const ScrollbarHide = () => (
    <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// --- MAIN COMPONENT ---
export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
    ({ className, selectedDate: propSelectedDate, onDateSelect, onAddExpense, ...props }, ref) => {
        const { getThemeColor } = useTheme();
        const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date());
        const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date());
        const [viewMode, setViewMode] = React.useState<'weekly' | 'monthly'>('monthly');

        // Generate all days for the current month
        const monthDays = React.useMemo(() => {
            const start = startOfMonth(currentMonth);
            const totalDays = getDaysInMonth(currentMonth);
            const days: Day[] = [];
            for (let i = 0; i < totalDays; i++) {
                const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
                days.push({
                    date,
                    isToday: isToday(date),
                    isSelected: isSameDay(date, selectedDate),
                });
            }
            return days;
        }, [currentMonth, selectedDate]);

        // Generate days for the current week
        const weekDays = React.useMemo(() => {
            const start = startOfWeek(currentMonth, { locale: ptBR });
            const end = endOfWeek(currentMonth, { locale: ptBR });
            const dates = eachDayOfInterval({ start, end });
            
            return dates.map(date => ({
                date,
                isToday: isToday(date),
                isSelected: isSameDay(date, selectedDate),
            }));
        }, [currentMonth, selectedDate]);

        // Get the appropriate days based on view mode
        const displayDays = viewMode === 'monthly' ? monthDays : weekDays;

        const handleDateClick = (date: Date) => {
            setSelectedDate(date);
            setCurrentMonth(date); // Update current month when selecting a date
            onDateSelect?.(date);
        };

        const handlePrev = () => {
            if (viewMode === 'monthly') {
                setCurrentMonth(subMonths(currentMonth, 1));
            } else {
                setCurrentMonth(subWeeks(currentMonth, 1));
            }
        };

        const handleNext = () => {
            if (viewMode === 'monthly') {
                setCurrentMonth(addMonths(currentMonth, 1));
            } else {
                setCurrentMonth(addWeeks(currentMonth, 1));
            }
        };

        const handleAddExpense = () => {
            onAddExpense?.(selectedDate);
        };

        return (
            <div
                ref={ref}
                className={`w-full rounded-3xl p-6 shadow-2xl overflow-hidden ${className || ''}`}
                style={{
                    backgroundColor: getThemeColor(colors.background.glass),
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                    boxShadow: getThemeColor(colors.shadow.lg),
                }}
                {...props}
            >
                <ScrollbarHide />

                {/* Header: Tabs and Settings */}
                <div className="flex items-center justify-between mb-6">
                    <div
                        className="flex items-center space-x-1 rounded-lg p-1"
                        style={{
                            backgroundColor: getThemeColor(colors.background.elevated),
                        }}
                    >
                        <button
                            onClick={() => setViewMode('weekly')}
                            className="rounded-md px-4 py-1.5 text-xs font-bold transition-all duration-200"
                            style={{
                                backgroundColor: viewMode === 'weekly'
                                    ? getThemeColor(colors.brand.primary)
                                    : 'transparent',
                                color: viewMode === 'weekly'
                                    ? '#FFFFFF'
                                    : getThemeColor(colors.text.secondary),
                            }}
                        >
                            Semanal
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className="rounded-md px-4 py-1.5 text-xs font-bold transition-all duration-200"
                            style={{
                                backgroundColor: viewMode === 'monthly'
                                    ? getThemeColor(colors.brand.primary)
                                    : 'transparent',
                                color: viewMode === 'monthly'
                                    ? '#FFFFFF'
                                    : getThemeColor(colors.text.secondary),
                            }}
                        >
                            Mensal
                        </button>
                    </div>
                    <button
                        className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                        style={{
                            color: getThemeColor(colors.text.secondary),
                        }}
                    >
                        <Cog6ToothIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Date Display and Navigation */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${format(currentMonth, "MMMM")}-${viewMode}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p
                                        className="text-4xl font-bold tracking-tight capitalize"
                                        style={{ color: getThemeColor(colors.text.primary) }}
                                    >
                                        {format(currentMonth, "MMMM", { locale: ptBR })}
                                    </p>
                                    <p
                                        className="text-sm font-medium mt-1"
                                        style={{ color: getThemeColor(colors.text.secondary) }}
                                    >
                                        {viewMode === 'monthly' 
                                            ? `Mês completo • ${format(currentMonth, "yyyy")}`
                                            : `Semana ${format(startOfWeek(currentMonth, { locale: ptBR }), "dd/MM")} - ${format(endOfWeek(currentMonth, { locale: ptBR }), "dd/MM/yyyy")}`
                                        }
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handlePrev}
                                className="p-1.5 rounded-full transition-all duration-200 hover:scale-110"
                                style={{
                                    color: getThemeColor(colors.text.secondary),
                                    backgroundColor: getThemeColor(colors.background.elevated),
                                }}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-1.5 rounded-full transition-all duration-200 hover:scale-110"
                                style={{
                                    color: getThemeColor(colors.text.secondary),
                                    backgroundColor: getThemeColor(colors.background.elevated),
                                }}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Calendar Grid */}
                <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${viewMode}-${format(currentMonth, "yyyy-MM-dd")}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex space-x-3 pb-2"
                        >
                            {displayDays.map((day) => (
                                <div
                                    key={format(day.date, "yyyy-MM-dd")}
                                    className="flex flex-col items-center space-y-2 flex-shrink-0"
                                >
                                    <span
                                        className="text-xs font-bold uppercase"
                                        style={{ color: getThemeColor(colors.text.tertiary) }}
                                    >
                                        {format(day.date, "EEEEE", { locale: ptBR })}
                                    </span>
                                    <button
                                        onClick={() => handleDateClick(day.date)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 relative hover:scale-110"
                                        style={{
                                            backgroundColor: day.isSelected
                                                ? getThemeColor(colors.brand.primary)
                                                : 'transparent',
                                            color: day.isSelected
                                                ? '#FFFFFF'
                                                : getThemeColor(colors.text.primary),
                                            boxShadow: day.isSelected
                                                ? getThemeColor(colors.shadow.glow)
                                                : 'none',
                                        }}
                                    >
                                        {day.isToday && !day.isSelected && (
                                            <span
                                                className="absolute bottom-1 h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: getThemeColor(colors.brand.accent) }}
                                            ></span>
                                        )}
                                        {getDate(day.date)}
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div
                    className="my-6 h-px"
                    style={{ backgroundColor: getThemeColor(colors.border.default) }}
                />

                {/* Selected Date Info */}
                <div className="mb-4">
                    <p
                        className="text-sm font-medium"
                        style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                        Data Selecionada
                    </p>
                    <p
                        className="text-lg font-bold mt-1"
                        style={{ color: getThemeColor(colors.text.primary) }}
                    >
                        {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between space-x-4">
                    <button
                        onClick={handleAddExpense}
                        className="flex-1 flex items-center justify-center space-x-2 rounded-xl px-4 py-3 font-bold transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: getThemeColor(colors.brand.primary),
                            color: '#FFFFFF',
                            boxShadow: getThemeColor(colors.shadow.md),
                        }}
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Adicionar Gasto</span>
                    </button>
                </div>
            </div>
        );
    }
);

GlassCalendar.displayName = "GlassCalendar";
