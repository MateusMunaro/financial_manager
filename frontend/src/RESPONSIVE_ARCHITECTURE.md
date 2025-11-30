# Arquitetura de Responsividade

## Decisão Arquitetural

Este projeto **NÃO** utiliza pastas separadas para rotas mobile/desktop pois:

1. **Duplicação de código** - Manter duas versões de cada página aumenta complexidade
2. **Next.js App Router** - Não foi projetado para essa separação de rotas
3. **Padrão da indústria** - Mobile-first com CSS responsivo é o padrão

## Estrutura Implementada

```
src/
├── context/
│   └── ViewportContext.tsx      # Context + hooks para detecção de viewport
├── components/
│   ├── responsive/              # Apenas para componentes com UX radicalmente diferente
│   │   ├── mobile/              # Variantes mobile
│   │   ├── desktop/             # Variantes desktop
│   │   ├── shared/              # Wrappers que escolhem a variante
│   │   └── index.ts             # Exports centralizados
│   └── [outros componentes]     # Componentes adaptativos (maioria)
└── app/
    └── (auth)/                  # Páginas únicas que se adaptam via CSS/hooks
```

## Quando Usar Cada Abordagem

### 1. CSS Responsivo (Tailwind) - **Padrão**
Para 90% dos casos. Ajustes de layout, tamanhos, espaçamentos.

```tsx
// ✅ RECOMENDADO para ajustes simples
<div className="flex flex-col md:flex-row gap-2 md:gap-4">
  <Card className="w-full md:w-1/2">
    {/* conteúdo */}
  </Card>
</div>
```

### 2. Renderização Condicional Inline
Quando um elemento específico só aparece em um dispositivo.

```tsx
import { useIsMobile, ShowOn } from '@/context/ViewportContext';

// ✅ Para elementos específicos
<ShowOn mobile>
  <MobileBottomNav />
</ShowOn>

<ShowOn desktop>
  <Sidebar />
</ShowOn>
```

### 3. Componente Responsive
Quando um bloco inteiro precisa de variantes.

```tsx
import { Responsive } from '@/context/ViewportContext';

// ✅ Para seções com UX diferente
<Responsive
  mobile={<MobileDataTable data={data} />}
  desktop={<DesktopDataTable data={data} />}
/>
```

### 4. Componentes Separados em `/responsive`
**APENAS** quando a UX é tão diferente que compartilhar código seria forçado.

Exemplos válidos:
- Sidebar (drawer no mobile vs fixa no desktop)
- Navegação (bottom nav vs header)
- Tabelas de dados (cards empilhados vs tabela tradicional)

```tsx
// src/components/responsive/shared/ResponsiveSidebar.tsx
import { MobileSidebar } from '../mobile/MobileSidebar';
import { DesktopSidebar } from '../desktop/DesktopSidebar';
import { useIsMobile } from '@/context/ViewportContext';

export function ResponsiveSidebar(props) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSidebar {...props} /> : <DesktopSidebar {...props} />;
}
```

## API do ViewportContext

### Hooks Disponíveis

```tsx
// Hook completo
const {
  width,              // número em pixels
  height,             // número em pixels
  deviceType,         // 'mobile' | 'tablet' | 'desktop'
  isMobile,           // boolean (< 768px)
  isTablet,           // boolean (768px - 1023px)
  isDesktop,          // boolean (>= 1024px)
  isSmUp,             // >= 640px
  isMdUp,             // >= 768px
  isLgUp,             // >= 1024px
  isXlUp,             // >= 1280px
  is2XlUp,            // >= 1536px
  isPortrait,         // altura > largura
  isLandscape,        // largura >= altura
  breakpoint,         // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  matchesBreakpoint,  // (bp) => boolean
} = useViewport();

// Hooks simplificados
const isMobile = useIsMobile();
const isDesktop = useIsDesktop();
const deviceType = useDeviceType();
```

### Componentes Utilitários

```tsx
// Mostrar apenas em dispositivos específicos
<ShowOn mobile>Só no mobile</ShowOn>
<ShowOn tablet desktop>Tablet e desktop</ShowOn>

// Renderizar variantes
<Responsive
  mobile={<ComponenteMobile />}
  tablet={<ComponenteTablet />}
  desktop={<ComponenteDesktop />}
  fallback={<Fallback />}
/>
```

## Breakpoints (Alinhados com Tailwind)

| Breakpoint | Largura mínima |
|------------|----------------|
| xs         | 0px            |
| sm         | 640px          |
| md         | 768px          |
| lg         | 1024px         |
| xl         | 1280px         |
| 2xl        | 1536px         |

## Anti-Patterns (Evitar)

```tsx
// ❌ EVITAR: Criar páginas duplicadas
app/(auth)/dashboard/page.tsx
app/(auth)/dashboard-mobile/page.tsx

// ❌ EVITAR: CSS inline baseado em estado
<div style={{ display: isMobile ? 'flex' : 'grid' }}>

// ❌ EVITAR: Esconder com display:none (carrega ambos)
<DesktopComponent className={isMobile ? 'hidden' : ''} />
<MobileComponent className={!isMobile ? 'hidden' : ''} />

// ✅ CORRETO: Renderização condicional (carrega apenas um)
{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

## Performance

- O `ViewportContext` usa debounce (100ms) no resize
- Evita re-renders desnecessários com `useMemo`
- Escuta `orientationchange` para dispositivos móveis
- SSR-safe com valores padrão
