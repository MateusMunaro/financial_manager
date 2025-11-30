'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// Breakpoints padrão do Tailwind CSS
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ViewportContextType {
  // Dimensões atuais
  width: number;
  height: number;

  // Tipo de dispositivo
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Breakpoints específicos
  isSmUp: boolean; // >= 640px
  isMdUp: boolean; // >= 768px
  isLgUp: boolean; // >= 1024px
  isXlUp: boolean; // >= 1280px
  is2XlUp: boolean; // >= 1536px

  // Orientação
  isPortrait: boolean;
  isLandscape: boolean;

  // Utilitários
  breakpoint: BreakpointKey | 'xs';
  matchesBreakpoint: (breakpoint: BreakpointKey) => boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

interface ViewportProviderProps {
  children: ReactNode;
  // Permite customizar os limites de dispositivo
  mobileMaxWidth?: number;
  tabletMaxWidth?: number;
}

export function ViewportProvider({
  children,
  mobileMaxWidth = BREAKPOINTS.md - 1, // 767px
  tabletMaxWidth = BREAKPOINTS.lg - 1, // 1023px
}: ViewportProviderProps) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Set initial dimensions
    handleResize();

    // Debounce para performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    
    // Também escuta mudanças de orientação em dispositivos móveis
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  const value = useMemo<ViewportContextType>(() => {
    const { width, height } = dimensions;

    // Determina o tipo de dispositivo
    const isMobile = width <= mobileMaxWidth;
    const isTablet = width > mobileMaxWidth && width <= tabletMaxWidth;
    const isDesktop = width > tabletMaxWidth;

    let deviceType: DeviceType = 'desktop';
    if (isMobile) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';

    // Breakpoints
    const isSmUp = width >= BREAKPOINTS.sm;
    const isMdUp = width >= BREAKPOINTS.md;
    const isLgUp = width >= BREAKPOINTS.lg;
    const isXlUp = width >= BREAKPOINTS.xl;
    const is2XlUp = width >= BREAKPOINTS['2xl'];

    // Determina o breakpoint atual
    let breakpoint: BreakpointKey | 'xs' = 'xs';
    if (is2XlUp) breakpoint = '2xl';
    else if (isXlUp) breakpoint = 'xl';
    else if (isLgUp) breakpoint = 'lg';
    else if (isMdUp) breakpoint = 'md';
    else if (isSmUp) breakpoint = 'sm';

    // Orientação
    const isPortrait = height > width;
    const isLandscape = width >= height;

    // Função utilitária
    const matchesBreakpoint = (bp: BreakpointKey) => width >= BREAKPOINTS[bp];

    return {
      width,
      height,
      deviceType,
      isMobile,
      isTablet,
      isDesktop,
      isSmUp,
      isMdUp,
      isLgUp,
      isXlUp,
      is2XlUp,
      isPortrait,
      isLandscape,
      breakpoint,
      matchesBreakpoint,
    };
  }, [dimensions, mobileMaxWidth, tabletMaxWidth]);

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
}

// Hook principal
export function useViewport(): ViewportContextType {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
}

// Hooks específicos para casos de uso comuns
export function useIsMobile(): boolean {
  const { isMobile } = useViewport();
  return isMobile;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useViewport();
  return isDesktop;
}

export function useDeviceType(): DeviceType {
  const { deviceType } = useViewport();
  return deviceType;
}

// Componente utilitário para renderização condicional
interface ShowOnProps {
  children: ReactNode;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}

export function ShowOn({ children, mobile, tablet, desktop }: ShowOnProps) {
  const { deviceType } = useViewport();

  const shouldShow =
    (mobile && deviceType === 'mobile') ||
    (tablet && deviceType === 'tablet') ||
    (desktop && deviceType === 'desktop');

  if (!shouldShow) return null;

  return <>{children}</>;
}

// Componente para renderização de variantes
interface ResponsiveProps {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
  fallback?: ReactNode;
}

export function Responsive({ mobile, tablet, desktop, fallback }: ResponsiveProps) {
  const { deviceType } = useViewport();

  switch (deviceType) {
    case 'mobile':
      return <>{mobile ?? fallback}</>;
    case 'tablet':
      return <>{tablet ?? desktop ?? fallback}</>;
    case 'desktop':
      return <>{desktop ?? fallback}</>;
    default:
      return <>{fallback}</>;
  }
}

export { BREAKPOINTS };
export type { DeviceType, BreakpointKey, ViewportContextType };
