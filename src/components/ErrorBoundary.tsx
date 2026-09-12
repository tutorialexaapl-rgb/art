import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, componentStack: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FATAL RUNTIME ERROR]', error);
    console.error('[FATAL ERROR NAME]', error.name);
    console.error('[FATAL ERROR MESSAGE]', error.message);
    console.error('[FATAL COMPONENT STACK]', errorInfo.componentStack);
    console.error('[FATAL FULL ERROR]', error.stack);
    this.setState({ componentStack: errorInfo.componentStack ?? null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 p-8">
          <div className="max-w-2xl text-center">
            <h1 className="text-2xl font-bold text-stone-800">
              Coś poszło nie tak
            </h1>
            <p className="mt-4 text-stone-600">
              Strona nie mogła się załadować. Spróbuj odświeżyć stronę.
            </p>
            <div className="mt-4 rounded-lg bg-stone-100 p-4 text-left text-xs text-red-600 overflow-auto max-h-64">
              <div className="font-bold mb-1">Error: {this.state.error?.name ?? 'Unknown'}</div>
              <div className="mb-2">{this.state.error?.message ?? 'Nieznany błąd'}</div>
              {this.state.componentStack && (
                <div className="mt-2 border-t border-stone-300 pt-2 whitespace-pre-wrap text-stone-700">
                  {this.state.componentStack}
                </div>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-stone-800 px-6 py-3 text-white hover:bg-stone-700 transition-colors"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
