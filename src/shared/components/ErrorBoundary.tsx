/**
 * Error Boundary Component
 * Captura erros React e exibe fallback UI
 * Sprint 3 - UX & Acessibilidade
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button, Card, CardContent } from './ui';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log erro para serviço de monitoring (ex: Sentry)
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
    
    // Callback customizado
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* Ícone */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Algo deu errado
                </h1>

                {/* Descrição */}
                <p className="text-gray-600 mb-6">
                  Ocorreu um erro inesperado. Você pode tentar recarregar a página
                  ou voltar para a página inicial.
                </p>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="w-full mb-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      Detalhes técnicos (desenvolvimento)
                    </summary>
                    <div className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-60">
                      <p className="font-bold text-red-600 mb-2">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <pre className="text-gray-700 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}

                {/* Ações */}
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button
                    onClick={this.handleReset}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Tentar Novamente
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Home size={16} />
                    Ir para Início
                  </Button>
                </div>

                {/* Informação adicional */}
                <p className="text-sm text-gray-500 mt-6">
                  Se o problema persistir, entre em contato com o suporte técnico.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar ErrorBoundary de forma funcional
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
