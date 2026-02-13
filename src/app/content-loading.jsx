'use client';

import React from 'react';
import styles from './content-loading.module.css';

/**
 * Content loading component with VLSI chip visualization
 * Features: Light background, inline usage, accessibility, responsive design
 */
const ContentLoading = ({ 
  message = 'Loading content...', 
  size = 'medium',
  showText = true,
  inline = false 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.loaderSmall;
      case 'large': return styles.loaderLarge;
      default: return styles.loaderMedium;
    }
  };

  const containerClass = inline ? styles.containerInline : styles.container;

  return (
    <div className={`${containerClass} ${getSizeClass()}`} role="status" aria-label="Loading content">
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
            <linearGradient id="contentChipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f0f0" />
              <stop offset="100%" stopColor="#d0d0d0" />
            </linearGradient>
            <linearGradient id="contentTextGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="100%" stopColor="#666666" />
            </linearGradient>
            <linearGradient id="contentPinGradient" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#999999" />
              <stop offset="50%" stopColor="#777777" />
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
            fill="url(#contentChipGradient)" 
            stroke="#aaa" 
            strokeWidth="3" 
            className={styles.chip}
          />
          
          {/* Chip pins */}
          <g className={styles.pinsLeft}>
            <rect x="322" y="205" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="322" y="225" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="322" y="245" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="322" y="265" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
          </g>
          <g className={styles.pinsRight}>
            <rect x="470" y="205" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="470" y="225" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="470" y="245" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
            <rect x="470" y="265" width="8" height="10" fill="url(#contentPinGradient)" rx="2" />
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

export default ContentLoading;