'use client';

import React, { ReactNode, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Camera } from 'lucide-react';

interface QuickActionModalProps {
  /** Controla a visibilidade do modal */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback quando "Receita" é clicado */
  onIncomeClick?: () => void;
  /** Callback quando "Despesa" é clicado */
  onExpenseClick?: () => void;
  /** Callback quando "Reconhecimento de Imagem" é clicado */
  onImageRecognitionClick?: () => void;
  /** Título do modal */
  title?: string;
  /** Mostrar botão de reconhecimento de imagem */
  showImageRecognition?: boolean;
  /** Conteúdo customizado adicional */
  children?: ReactNode;
}

/**
 * Modal de ações rápidas para criar novas transações
 * 
 * Design Oceanic Depth com glass morphism e animações suaves.
 * 
 * @example
 * ```tsx
 * <QuickActionModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onIncomeClick={() => router.push('/expenses/new?type=income')}
 *   onExpenseClick={() => router.push('/expenses/new?type=expense')}
 * />
 * ```
 */
export function QuickActionModal({
  isOpen,
  onClose,
  onIncomeClick,
  onExpenseClick,
  onImageRecognitionClick,
  title = 'Nova Transação',
  showImageRecognition = true,
  children,
}: QuickActionModalProps) {
  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fecha modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-action-title"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#021024]/60 dark:bg-[#021024]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className="
          relative w-full max-w-sm
          bg-white/95 dark:bg-[#052659]/95
          backdrop-blur-md
          rounded-2xl 
          border border-[#5483B3]/20 dark:border-[#7DA0CA]/20
          p-6
          shadow-xl shadow-[#021024]/20
          animate-in zoom-in-95 fade-in duration-200
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 
            id="quick-action-title"
            className="text-lg font-bold text-[#021024] dark:text-[#C1E8FF]"
          >
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-[#5483B3]/70 dark:text-[#7DA0CA]/70
              hover:text-[#5483B3] dark:hover:text-[#7DA0CA]
              hover:bg-[#5483B3]/10 dark:hover:bg-[#7DA0CA]/10
              transition-colors
            "
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Receita Button */}
          <button 
            onClick={() => {
              onIncomeClick?.();
              onClose();
            }}
            className="
              flex flex-col items-center justify-center p-4 
              bg-[#5483B3]/5 dark:bg-[#7DA0CA]/10
              hover:bg-[#28a745]/10 dark:hover:bg-[#28a745]/20
              border border-transparent
              hover:border-[#28a745]/50
              rounded-xl transition-all duration-200 group
            "
          >
            <div 
              className="
                p-3 rounded-full mb-2
                bg-[#28a745]/20 text-[#28a745]
                group-hover:bg-[#28a745] group-hover:text-white
                transition-colors duration-200
              "
            >
              <ArrowUpRight size={24} />
            </div>
            <span className="text-sm font-medium text-[#052659] dark:text-[#C1E8FF] group-hover:text-[#28a745]">
              Receita
            </span>
          </button>

          {/* Despesa Button */}
          <button 
            onClick={() => {
              onExpenseClick?.();
              onClose();
            }}
            className="
              flex flex-col items-center justify-center p-4 
              bg-[#5483B3]/5 dark:bg-[#7DA0CA]/10
              hover:bg-[#dc3545]/10 dark:hover:bg-[#dc3545]/20
              border border-transparent
              hover:border-[#dc3545]/50
              rounded-xl transition-all duration-200 group
            "
          >
            <div 
              className="
                p-3 rounded-full mb-2
                bg-[#dc3545]/20 text-[#dc3545]
                group-hover:bg-[#dc3545] group-hover:text-white
                transition-colors duration-200
              "
            >
              <ArrowDownRight size={24} />
            </div>
            <span className="text-sm font-medium text-[#052659] dark:text-[#C1E8FF] group-hover:text-[#dc3545]">
              Despesa
            </span>
          </button>
        </div>

        {/* Image Recognition Button */}
        {showImageRecognition && (
          <button 
            onClick={() => {
              onImageRecognitionClick?.();
              onClose();
            }}
            className="
              w-full py-3 
              bg-[#5483B3] dark:bg-[#7DA0CA]
              hover:bg-[#052659] dark:hover:bg-[#C1E8FF]
              text-white dark:text-[#021024]
              rounded-xl font-medium 
              transition-colors duration-200
              flex items-center justify-center gap-2
              shadow-lg shadow-[#5483B3]/20 dark:shadow-[#7DA0CA]/20
            "
          >
            <Camera size={20} />
            Usar Reconhecimento de Imagem
          </button>
        )}

        {/* Custom Children */}
        {children}
      </div>
    </div>
  );
}

export default QuickActionModal;
