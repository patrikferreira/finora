import type { CSSProperties } from 'react';

export default function LoadingView() {
  const cssVar = (i: number): CSSProperties =>
    ({ ['--i']: i } as CSSProperties);

    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="loading-bars">
          <div 
            className="bar w-1.5 h-2"
            style={cssVar(0)}
          />
          <div 
            className="bar w-1.5 h-4"
            style={cssVar(1)}
          />
          <div 
            className="bar w-1.5 h-6"
            style={cssVar(2)}
          />
        </div>
      </div>
    );
  }