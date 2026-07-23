/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Compass, RefreshCw, Trees, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FlowZen Uncaught Component Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          id="error-boundary-screen"
          className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center font-sans"
        >
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-stone-100 flex items-center justify-center mx-auto shadow-md">
              <Compass className="h-7 w-7 text-emerald-300 animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full inline-block">
                Sanctuary Restoring
              </span>
              <h2 className="font-serif text-2xl font-normal text-stone-900">
                Restoring Quiet Harmony
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                FlowZen encountered a temporary visual disruption. Your practice data and living garden sanctuary remain completely safe.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full min-h-[44px] py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Return to Quiet Sanctuary</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
