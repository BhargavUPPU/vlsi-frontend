/**
 * VLSI Tools Flowchart Component
 * Production-level interactive flowchart for VLSI software tools
 * @author VLSI Team
 * @version 2.0.0
 */
"use client";

import React, { useCallback, useMemo, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { ErrorBoundary } from "react-error-boundary";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./flowchart.css";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Production constants
const FLOWCHART_CONFIG = {
  MIN_ZOOM: 0.3,
  MAX_ZOOM: 2.5,
  DEFAULT_ZOOM: 1,
  ANIMATION_DURATION: 200,
  IMAGE_SIZES: {
    CATEGORY: { width: 80, height: 80 },
    TOOL: { width: 150, height: 50 },
    VENDOR: { width: 120, height: 40 },
    TOOLTIP: { width: 220, height: 110 },
  },
  VIEWPORT: {
    HEIGHT: 800,
    CONTENT_HEIGHT: 720,
  },
};

const COLORS = {
  PRIMARY: "#3B82F6",
  SUCCESS: "#10B981", 
  WARNING: "#F59E0B",
  BACKGROUND: "#1F2937",
  SURFACE: "#374151",
  TEXT: "#F9FAFB",
  MUTED: "#9CA3AF",
};

// Enhanced base styles with better accessibility and responsive design
const BASE_NODE_STYLE = {
  padding: 0,
  border: "none",
  background: "transparent",
};

const cardBase =
  "flex flex-col items-center justify-center p-3 rounded-xl text-white border shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50";

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="text-center">
        <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-4 text-sm">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Enhanced Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6", 
    large: "h-8 w-8",
  };
  
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
};

// Enhanced Image Component with error handling and loading states
const OptimizedImage = React.memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  onLoad,
  onError,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback((e) => {
    setIsLoading(false);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
    console.warn(`Failed to load image: ${src}`);
  }, [onError, src]);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 rounded-md ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <AlertTriangle className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md"
          style={{ width, height }}
        >
          <LoadingSpinner size="small" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

// Enhanced Node Components with better accessibility and UX
const ImageNode = React.memo(function ImageNode({ data, selected }) {
  const { image, label, link, description } = data || {};
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    }
  }, [link]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TooltipProvider delayDuration={FLOWCHART_CONFIG.ANIMATION_DURATION}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`group relative cursor-pointer transition-all duration-200 ${
                selected ? 'ring-2 ring-blue-500' : ''
              } ${isHovered ? 'scale-105' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="button"
              aria-label={`${label} tool${description ? ` - ${description}` : ''}`}
              data-testid={`image-node-${label?.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <OptimizedImage
                src={image}
                alt={label || "VLSI tool"}
                width={FLOWCHART_CONFIG.IMAGE_SIZES.TOOL.width}
                height={FLOWCHART_CONFIG.IMAGE_SIZES.TOOL.height}
                className="rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                style={{ objectFit: "contain" }}
                priority={false}
              />
              {link && (
                <ExternalLink className="absolute top-1 right-1 h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </TooltipTrigger>

          {(link || description) && (
            <TooltipContent className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 max-w-xs">
              <div className="space-y-2">
                {description && (
                  <p className="text-gray-200">{description}</p>
                )}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-300 hover:text-blue-200 underline text-xs break-all"
                    aria-label={`Open ${label} website in a new tab`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                    {link.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                )}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </ErrorBoundary>
  );
});

const CategoryNode = React.memo(function CategoryNode({ data, selected }) {
  const { image, label, description } = data || {};
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div
        className={`${cardBase} bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 backdrop-blur-sm ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${isHovered ? 'from-gray-600 to-gray-700' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="group"
        aria-label={`${label} category${description ? ` - ${description}` : ''}`}
        data-testid={`category-node-${label?.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {image && (
          <OptimizedImage
            src={image}
            alt={label || "category"}
            width={FLOWCHART_CONFIG.IMAGE_SIZES.CATEGORY.width}
            height={FLOWCHART_CONFIG.IMAGE_SIZES.CATEGORY.height}
            className="mb-3 rounded-lg"
            priority={true}
          />
        )}
        <span className="text-sm font-bold text-center leading-tight text-white">
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-300 mt-1 text-center px-2">
            {description}
          </span>
        )}
      </div>
    </ErrorBoundary>
  );
});

const VendorToolNode = React.memo(function VendorToolNode({ data, selected }) {
  const { image, label, tooltipImage, link, description, tools } = data || {};
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    }
  }, [link]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TooltipProvider delayDuration={FLOWCHART_CONFIG.ANIMATION_DURATION}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${cardBase} bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 cursor-pointer ${
                selected ? 'ring-2 ring-blue-500' : ''
              } ${isHovered ? 'from-gray-700 to-gray-800' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label={`${label} vendor${description ? ` - ${description}` : ''}`}
              data-testid={`vendor-node-${label?.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {image && (
                <OptimizedImage
                  src={image}
                  alt={label || "vendor logo"}
                  width={FLOWCHART_CONFIG.IMAGE_SIZES.VENDOR.width}
                  height={FLOWCHART_CONFIG.IMAGE_SIZES.VENDOR.height}
                  className="object-contain"
                />
              )}
              {link && (
                <ExternalLink className="absolute top-2 right-2 h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </TooltipTrigger>

          <TooltipContent className="p-0 border-none bg-transparent shadow-none max-w-md">
            <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-600 bg-gray-900">
              {tooltipImage && (
                <OptimizedImage
                  src={tooltipImage}
                  alt={`${label} tools and details`}
                  width={FLOWCHART_CONFIG.IMAGE_SIZES.TOOLTIP.width}
                  height={FLOWCHART_CONFIG.IMAGE_SIZES.TOOLTIP.height}
                  className="object-contain"
                />
              )}
              <div className="p-3 space-y-2">
                {description && (
                  <p className="text-gray-300 text-sm">{description}</p>
                )}
                {tools && tools.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-white font-semibold text-xs">Key Tools:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tools.map((tool, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-300 hover:text-blue-200 underline text-xs break-all"
                    aria-label={`Open ${label} website in a new tab`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                    {link.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ErrorBoundary>
  );
});

// Enhanced node types registry
const nodeTypes = {
  imageNode: ImageNode,
  categoryNode: CategoryNode,
  vendorToolNode: VendorToolNode,
};

// Production-level data with comprehensive tool information matching the flowchart image
const createInitialNodes = () => [
  // Root category - VLSI Tools (left side)
  {
    id: "1",
    type: "categoryNode",
    data: { 
      label: "VLSI Tools", 
      image: "/vlsiTools.png",
      description: "Complete ecosystem of VLSI design and verification tools"
    },
    position: { x: 50, y: 150 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 100 },
  },

  // Main Categories
  {
    id: "2",
    type: "categoryNode",
    data: {
      label: "Open Source Tools",
      image: "/openSource.png",
      description: "Free and open-source VLSI design tools"
    },
    position: { x: 200, y: 50 },
    style: { ...BASE_NODE_STYLE, width: 140, height: 80 },
  },
  {
    id: "3",
    type: "categoryNode",
    data: { 
      label: "EDA", 
      image: "/eda.png",
      description: "Electronic Design Automation"
    },
    position: { x: 200, y: 200 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 80 },
  },

  // Open Source Tools - Right side branches
  {
    id: "4",
    type: "imageNode",
    data: {
      label: "NGSPICE",
      image: "/ngspice.png",
      link: "https://ngspice.sourceforge.io/",
      description: "Mixed-level/mixed-signal circuit simulator"
    },
    position: { x: 380, y: 20 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },
  {
    id: "5",
    type: "imageNode",
    data: {
      label: "eSim",
      image: "/esim.png",
      link: "https://esim.fossee.in/",
      description: "Free electronic design automation tool"
    },
    position: { x: 520, y: 60 },
    style: { ...BASE_NODE_STYLE, width: 100, height: 60 },
  },
  {
    id: "6",
    type: "imageNode",
    data: {
      label: "openTimer",
      image: "/opentimer.png",
      link: "https://github.com/OpenTimer",
      description: "High-performance static timing analysis"
    },
    position: { x: 380, y: 100 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },
  {
    id: "7",
    type: "imageNode",
    data: {
      label: "Magic VLSI Layout Tool",
      image: "/magic_vlsi.png",
      link: "http://www.opencircuitdesign.com/magic/",
      description: "VLSI layout tool with built-in DRC and extraction"
    },
    position: { x: 380, y: 180 },
    style: { ...BASE_NODE_STYLE, width: 180, height: 60 },
  },
  {
    id: "8",
    type: "imageNode",
    data: {
      label: "LTspice",
      image: "/ltspices.png",
      link: "https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html",
      description: "High-performance SPICE simulator"
    },
    position: { x: 380, y: 260 },
    style: { ...BASE_NODE_STYLE, width: 100, height: 60 },
  },

  // Commercial EDA Vendors
  {
    id: "9",
    type: "vendorToolNode",
    data: {
      label: "Cadence",
      image: "/cadence.png",
      tooltipImage: "/virtuoso_tooltip.png",
      link: "https://www.cadence.com/",
      description: "Leading EDA software and engineering services company",
      tools: ["Virtuoso", "Innovus", "Genus", "Spectre", "Voltus", "Pegasus"]
    },
    position: { x: 350, y: 340 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },
  {
    id: "10",
    type: "vendorToolNode",
    data: {
      label: "Synopsys",
      image: "/synopsys.png",
      tooltipImage: "/primetime_tooltip.png",
      link: "https://www.synopsys.com/",
      description: "World leader in electronic design automation software",
      tools: ["Design Compiler", "IC Compiler", "PrimeTime", "HSPICE", "VCS", "Fusion Compiler"]
    },
    position: { x: 350, y: 420 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },
  {
    id: "11",
    type: "vendorToolNode",
    data: {
      label: "Siemens Mentor",
      image: "/siemens_mentor.png",
      tooltipImage: "/tessent_tooltip.png", 
      link: "https://eda.sw.siemens.com/en-US/",
      description: "Siemens EDA verification and test solutions",
      tools: ["Questa", "Calibre", "Tessent", "Analog FastSPICE", "ModelSim"]
    },
    position: { x: 350, y: 500 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },
  {
    id: "12",
    type: "vendorToolNode",
    data: {
      label: "Xilinx",
      image: "/xilinx.png",
      tooltipImage: "/vivado_tooltip.png",
      link: "https://www.xilinx.com/products/design-tools/vivado.html",
      description: "FPGA design tools and adaptive computing solutions",
      tools: ["Vivado", "Vitis", "ISE", "LabVIEW FPGA", "System Generator"]
    },
    position: { x: 350, y: 580 },
    style: { ...BASE_NODE_STYLE, width: 120, height: 60 },
  },

  // Detailed Tool Nodes - Far right side specific tools
  {
    id: "13",
    type: "imageNode",
    data: {
      label: "Virtuoso, Innovus, Encounter",
      image: "/cadence_tools.png",
      description: "Cadence analog and digital design tools"
    },
    position: { x: 520, y: 340 },
    style: { ...BASE_NODE_STYLE, width: 160, height: 60 },
  },
  {
    id: "14",
    type: "imageNode",
    data: {
      label: "PrimeTime, VIA, LCQ, Design Compiler, IC Validator, Hercules, PV",
      image: "/synopsys_tools.png",
      description: "Synopsys comprehensive EDA toolsuite"
    },
    position: { x: 520, y: 400 },
    style: { ...BASE_NODE_STYLE, width: 180, height: 80 },
  },
  {
    id: "15",
    type: "imageNode",
    data: {
      label: "Design Compiler, DFT Compiler, VCS, TetraMAX ATPG",
      image: "/synopsys_dft.png",
      description: "Synopsys design and test tools"
    },
    position: { x: 520, y: 500 },
    style: { ...BASE_NODE_STYLE, width: 180, height: 80 },
  },
  {
    id: "16",
    type: "imageNode",
    data: {
      label: "Tessent, Calibre physical verification, Modelsim, Questa",
      image: "/mentor_tools.png",
      description: "Mentor Graphics verification and test tools"
    },
    position: { x: 520, y: 580 },
    style: { ...BASE_NODE_STYLE, width: 180, height: 80 },
  },
  {
    id: "17",
    type: "imageNode",
    data: {
      label: "Vivado ISE Design Suite, Xilinx Vivado",
      image: "/vivado_tools.png",
      description: "Xilinx FPGA design and implementation tools"
    },
    position: { x: 520, y: 660 },
    style: { ...BASE_NODE_STYLE, width: 180, height: 60 },
  },
];

// Enhanced edge configuration with highly visible white/light colored connections
const createInitialEdges = () => [
  // Root → Categories - Main flow branches with white lines
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { 
      stroke: "#FFFFFF", 
      strokeWidth: 3,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#FFFFFF",
      width: 20,
      height: 20
    },
    animated: false,
  },
  {
    id: "e1-3",
    source: "1",
    target: "3", 
    type: "smoothstep",
    style: { 
      stroke: "#FFFFFF", 
      strokeWidth: 3,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#FFFFFF",
      width: 20,
      height: 20
    },
    animated: false,
  },

  // Open Source Tools connections - White lines
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e2-5", 
    source: "2",
    target: "5",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e2-6",
    source: "2", 
    target: "6",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e2-7",
    source: "2",
    target: "7", 
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e2-8",
    source: "2",
    target: "8",
    type: "smoothstep", 
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },

  // EDA → Commercial Vendors - White lines
  {
    id: "e3-9",
    source: "3",
    target: "9",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e3-10",
    source: "3", 
    target: "10",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e3-11",
    source: "3",
    target: "11",
    type: "smoothstep", 
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },
  {
    id: "e3-12",
    source: "3",
    target: "12",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
  },

  // Vendor → Specific Tool connections - White lines
  {
    id: "e9-13",
    source: "9",
    target: "13",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
    animated: false,
  },
  {
    id: "e10-14",
    source: "10", 
    target: "14",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
    animated: false,
  },
  {
    id: "e10-15",
    source: "10",
    target: "15",
    type: "smoothstep", 
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
    animated: false,
  },
  {
    id: "e11-16",
    source: "11",
    target: "16",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
    animated: false,
  },
  {
    id: "e12-17",
    source: "12",
    target: "17",
    type: "smoothstep",
    style: { 
      stroke: "#000000", 
      strokeWidth: 2,
      strokeDasharray: "0"
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: "#000000",
      width: 15,
      height: 15
    },
    animated: false,
  },
];

// Production-level main component
export default function VlsiFlowchart() {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  
  // Memoized data to prevent unnecessary re-renders
  const initialNodes = useMemo(createInitialNodes, []);
  const initialEdges = useMemo(createInitialEdges, []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Enhanced connection handler with validation
  const onConnect = useCallback(
    (params) => {
      if (params.source && params.target && params.source !== params.target) {
        const newEdge = {
          ...params,
          type: "smoothstep",
          style: { stroke: COLORS.MUTED, strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.MUTED },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges],
  );

  // Selection handlers
  const onSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    setSelectedNodes(selectedNodes.map(node => node.id));
  }, []);

  // Initialize component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Error boundary reset
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[800px] bg-gray-900 text-white p-6 rounded-lg shadow-xl flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={setError} onReset={resetError}>
      <div 
        className="w-full h-[800px] bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-2xl"
        role="application"
        aria-label="VLSI Tools Interactive Flowchart"
        data-testid="vlsi-flowchart"
      >
        {/* Enhanced Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-100 mb-2">
            VLSI Design Tools Ecosystem
          </h1>
          <p className="text-center text-gray-400 text-sm mb-4">
            Interactive flowchart showcasing comprehensive VLSI design and verification tools
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Main Categories</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Open Source</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Commercial EDA</span>
            </div>
          </div>
        </header>

        {/* Enhanced ReactFlow Container */}
        <main className="w-full h-[650px] rounded-xl overflow-hidden border border-gray-700 shadow-inner bg-gray-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            className="react-flow-dark"
            minZoom={FLOWCHART_CONFIG.MIN_ZOOM}
            maxZoom={FLOWCHART_CONFIG.MAX_ZOOM}
            defaultViewport={{ zoom: FLOWCHART_CONFIG.DEFAULT_ZOOM, x: 0, y: 0 }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            snapToGrid={true}
            snapGrid={[20, 20]}
          >
            {/* Enhanced MiniMap */}
            <MiniMap
              nodeStrokeWidth={3}
              nodeColor={(node) => {
                if (node.type === "categoryNode") return COLORS.PRIMARY;
                if (node.type === "vendorToolNode") return COLORS.WARNING;
                return COLORS.SUCCESS;
              }}
              maskColor="rgba(0,0,0,0.7)"
              className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg"
              position="top-right"
            />
            
            {/* Enhanced Controls */}
            <Controls
              showInteractive={true}
              showFitView={true}
              showZoom={true}
              className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg"
              position="top-left"
            />
            
            {/* Enhanced Background */}
            <Background 
              color={COLORS.MUTED} 
              gap={24} 
              size={1.2} 
              variant="dots" 
            />

            {/* Info Panel */}
            <Panel position="bottom-right" className="bg-gray-800/90 rounded-lg p-3 text-xs text-gray-300 border border-gray-600">
              <div className="space-y-1">
                <div>🔍 Use mouse wheel to zoom</div>
                <div>🖱️ Drag nodes to rearrange</div>
                <div>📱 Click tools for details</div>
                <div>🔗 Links open in new tabs</div>
              </div>
            </Panel>
          </ReactFlow>
        </main>
      </div>
    </ErrorBoundary>
  );
}
