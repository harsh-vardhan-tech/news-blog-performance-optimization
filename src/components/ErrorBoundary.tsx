import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 p-8 max-w-lg w-full text-center shadow-xs">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-900">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Application Notice
            </h2>
            <p className="text-sm text-zinc-500 mt-2 mb-6">
              The Performance Optimization interface encountered a runtime issue. Please reload to restore state.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center px-4 py-2 border border-black bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
