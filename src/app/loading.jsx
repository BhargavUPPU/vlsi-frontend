'use client';

import React from 'react';
import styles from './loading.module.css';

/**
 * Production-ready loading component with VLSI chip visualization
 * Features: Accessibility, responsive design, performance optimization, reduced motion support
 */
const Loading = ({ 
  message = 'Loading application, please wait...', 
  size = 'medium',
  showText = true 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.loaderSmall;
      case 'large': return styles.loaderLarge;
      default: return styles.loaderMedium;
    }
  };

  return (
    <div className={`${styles.container} ${getSizeClass()}`} role="status" aria-label="Loading">
      <div className={styles.loaderWrapper}>
        {/* Accessible loading text for screen readers */}
        <span className={styles.srOnly}>{message}</span>
        
        <svg 
          className={styles.loader} 
          viewBox="0 0 800 500" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d2d2d" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#9aa0a6" />
            </linearGradient>
            <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#bbbbbb" />
              <stop offset="50%" stopColor="#888888" />
              <stop offset="100%" stopColor="#555555" />
            </linearGradient>
          </defs>
          
          {/* Circuit traces */}
          <g className={styles.traces}>
            {/* Left side traces */}
            <path d="M100 100 H200 V210 H326" className={styles.traceBg} />
            <path d="M100 100 H200 V210 H326" className={`${styles.traceFlow} ${styles.blue}`} />
            <path d="M80 180 H180 V230 H326" className={styles.traceBg} />
            <path d="M80 180 H180 V230 H326" className={`${styles.traceFlow} ${styles.blue2}`} />
            <path d="M60 260 H150 V250 H326" className={styles.traceBg} />
            <path d="M60 260 H150 V250 H326" className={`${styles.traceFlow} ${styles.blue}`} />
            <path d="M100 350 H200 V270 H326" className={styles.traceBg} />
            <path d="M100 350 H200 V270 H326" className={`${styles.traceFlow} ${styles.blue2}`} />
            
            {/* Right side traces */}
            <path d="M700 90 H560 V210 H474" className={styles.traceBg} />
            <path d="M700 90 H560 V210 H474" className={`${styles.traceFlow} ${styles.blue}`} />
            <path d="M740 160 H580 V230 H474" className={styles.traceBg} />
            <path d="M740 160 H580 V230 H474" className={`${styles.traceFlow} ${styles.blue2}`} />
            <path d="M720 250 H590 V250 H474" className={styles.traceBg} />
            <path d="M720 250 H590 V250 H474" className={`${styles.traceFlow} ${styles.blue}`} />
            <path d="M680 340 H570 V270 H474" className={styles.traceBg} />
            <path d="M680 340 H570 V270 H474" className={`${styles.traceFlow} ${styles.blue2}`} />
          </g>
          
          {/* Main chip */}
          <rect 
            x="330" y="190" width="140" height="100" 
            rx="20" ry="20" 
            fill="url(#chipGradient)" 
            stroke="#222" 
            strokeWidth="3" 
            className={styles.chip}
          />
          
          {/* Chip pins */}
          <g className={styles.pinsLeft}>
            <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          </g>
          <g className={styles.pinsRight}>
            <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          </g>
          
          {/* Chip text */}
          <text 
            x="400" y="240" 
            className={styles.chipText}
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            VLSID
          </text>
        </svg>
        
        {/* Loading progress indicator */}
        {showText && (
          <div className={styles.loadingText}>
            <span>Loading</span>
            <div className={styles.dots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
