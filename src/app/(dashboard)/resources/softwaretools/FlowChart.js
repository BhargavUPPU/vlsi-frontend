/**
 * VLSI Tools Flowchart Component
 * Production-level interactive SVG flowchart for VLSI software tools
 * Features: Interactive hover tooltips, download links, responsive design
 * @author VLSI Team
 * @version 4.0.0
 */
"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import {
  ZoomInIcon,
  ZoomOutIcon,
  HomeIcon,
  DownloadIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  AlertTriangle,
  InfoIcon,
  MousePointerClickIcon
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Production constants
const FLOWCHART_CONFIG = {
  MIN_ZOOM: 0.2,
  MAX_ZOOM: 3,
  DEFAULT_ZOOM: 1,
  ANIMATION_DURATION: 300,
  VIEWPORT: {
    WIDTH: 1800,
    HEIGHT: 1200,
  },
  PADDING: {
    TOP: 120,
    LEFT: 150,
    RIGHT: 150,
    BOTTOM: 120,
  },
  HOVER_SCALE: 1.08,
  TRANSITION_DURATION: '0.25s',
};

const COLORS = {
  PRIMARY: "#3B82F6",
  PRIMARY_HOVER: "#2563EB",
  SUCCESS: "#10B981", 
  WARNING: "#F59E0B",
  BACKGROUND: "#0F172A",
  SURFACE: "#1E293B",
  SURFACE_HOVER: "#334155",
  TEXT: "#F8FAFC",
  TEXT_MUTED: "#94A3B8",
  BORDER: "#475569",
  BORDER_HOVER: "#60A5FA",
  SHADOW: "rgba(0, 0, 0, 0.25)",
  SHADOW_HOVER: "rgba(59, 130, 246, 0.25)",
};

// Enhanced software tools data with comprehensive metadata
const TOOLS_DATA = {
  "vlsi-tools": {
    id: "vlsi-tools",
    label: "VLSI Tools",
    image: "/VLSITOOLS.svg",
    description: "Complete ecosystem of VLSI design and verification tools for semiconductor development",
    category: "Semiconductor Design",
    type: "root"
  },
  "open-source": {
    id: "open-source",
    label: "Open Source Tools",
    image: "/OPENSOURCE.svg",
    description: "Free and open-source VLSI design tools for educational and commercial use",
    category: "Free Tools",
    type: "category"
  },
  "eda": {
    id: "eda",
    label: "Commercial EDA",
    image: "/EDA.svg",
    description: "Electronic Design Automation - Industry-leading commercial software vendors",
    category: "Commercial Tools",
    type: "category"
  },
  "ngspice": {
    id: "ngspice",
    label: "NGSPICE",
    image: "/NGSPICE.svg",
    description: "Open-source mixed-level/mixed-signal circuit simulator based on SPICE 3f5",
    downloadLink: "https://ngspice.sourceforge.io/download.html",
    website: "https://ngspice.sourceforge.io/",
    category: "Circuit Simulation",
    features: ["SPICE 3f5 Compatible", "Mixed-Signal", "Cross-Platform"],
    type: "tool"
  },
  "esim": {
    id: "esim",
    label: "eSim",
    image: "/ESIM.svg",
    description: "Free and open-source EDA tool for circuit design, simulation, analysis and PCB design",
    downloadLink: "https://esim.fossee.in/downloads",
    website: "https://esim.fossee.in/",
    category: "Circuit Design",
    features: ["Schematic Capture", "SPICE Simulation", "PCB Design"],
    type: "tool"
  },
  "opentimer": {
    id: "opentimer",
    label: "OpenTimer",
    image: "/OPENTIMER.svg",
    description: "High-performance timing analysis engine for next-generation EDA tools",
    downloadLink: "https://github.com/OpenTimer/OpenTimer/releases",
    website: "https://github.com/OpenTimer/OpenTimer",
    category: "Timing Analysis",
    features: ["Static Timing", "Parallel Computing", "Industry Standard"],
    type: "tool"
  },
  "magic": {
    id: "magic",
    label: "Magic VLSI",
    image: "/MAGICVLSILAYOUT.svg",
    description: "Venerable VLSI layout tool with built-in DRC, LVS and extraction capabilities",
    downloadLink: "http://www.opencircuitdesign.com/magic/download.html",
    website: "http://www.opencircuitdesign.com/magic/",
    category: "Layout Design",
    features: ["DRC Checking", "Layout vs Schematic", "Parasitic Extraction"],
    type: "tool"
  },
  "ltspice": {
    id: "ltspice",
    label: "LTspice",
    image: "/LT_SPICE.svg",
    description: "Analog Devices' high-performance SPICE simulator, schematic capture and waveform viewer",
    downloadLink: "https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html#software-download",
    website: "https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html",
    category: "Circuit Simulation",
    features: ["Fast SPICE", "Schematic Capture", "Waveform Viewer", "Model Libraries"],
    type: "tool"
  },
  "cadence": {
    id: "cadence",
    label: "Cadence",
    image: "/CADENCE.svg",
    description: "Leading EDA software and engineering services company with comprehensive design suite",
    downloadLink: "https://www.cadence.com/en_US/home/support/downloads.html",
    website: "https://www.cadence.com/",
    category: "Commercial EDA",
    tools: ["Virtuoso", "Innovus", "Genus", "Spectre", "Voltus", "Pegasus", "Palladium"],
    marketShare: "~30%",
    type: "vendor"
  },
  "synopsys": {
    id: "synopsys",
    label: "Synopsys",
    image: "/SYNOPSIS.svg",
    description: "World leader in EDA software, IP and application security testing solutions",
    downloadLink: "https://www.synopsys.com/support/downloads.html",
    website: "https://www.synopsys.com/",
    category: "Commercial EDA",
    tools: ["Design Compiler", "IC Compiler", "PrimeTime", "HSPICE", "VCS", "Fusion Compiler"],
    marketShare: "~32%",
    type: "vendor"
  },
  "siemens": {
    id: "siemens",
    label: "Siemens EDA",
    image: "/SIMENS.svg",
    description: "Siemens EDA (formerly Mentor Graphics) - verification, test and manufacturing solutions",
    downloadLink: "https://eda.sw.siemens.com/en-US/support/downloads/",
    website: "https://eda.sw.siemens.com/en-US/",
    category: "Commercial EDA",
    tools: ["Questa", "Calibre", "Tessent", "Analog FastSPICE", "ModelSim"],
    marketShare: "~20%",
    type: "vendor"
  },
  "xilinx": {
    id: "xilinx",
    label: "AMD Xilinx",
    image: "/XILINX.svg",
    description: "FPGA design tools and adaptive computing solutions for programmable logic devices",
    downloadLink: "https://www.xilinx.com/support/download.html",
    website: "https://www.xilinx.com/products/design-tools/vivado.html",
    category: "FPGA Tools",
    tools: ["Vivado", "Vitis", "ISE", "LabVIEW FPGA", "System Generator", "Versal ACAP"],
    marketShare: "~60% FPGA",
    type: "vendor"
  },
  "virtuoso": {
    id: "virtuoso",
    label: "Cadence Suite",
    image: "/VIRTUSO.svg", 
    description: "Comprehensive analog/mixed-signal design and implementation platform",
    category: "Analog Design",
    tools: ["Virtuoso", "Innovus", "Encounter", "Genus", "Spectre", "AMS Designer"],
    type: "toolset"
  },
  "primetime": {
    id: "primetime",
    label: "Synopsys Digital",
    image: "/synopsys_tools.png",
    description: "Complete digital design and verification flow from RTL to GDSII",
    category: "Digital Design",
    tools: ["Design Compiler", "IC Compiler", "PrimeTime", "StarRC", "Formality"],
    type: "toolset"
  },
  "dft": {
    id: "dft",
    label: "Synopsys Test",
    image: "/DFT.svg",
    description: "Design for test and manufacturing test solutions",
    category: "Test & DFT",
    tools: ["DFT Compiler", "TetraMAX", "VCS", "HSPICE", "SiliconSmart"],
    type: "toolset"
  },
  "tessent": {
    id: "tessent",
    label: "Siemens Suite",
    image: "/mentor_tools.png",
    description: "Verification, test and physical design solutions",
    category: "Verification",
    tools: ["Tessent", "Calibre", "Questa", "ModelSim", "Analog FastSPICE"],
    type: "toolset"
  },
  "vivado": {
    id: "vivado",
    label: "Xilinx FPGA Suite",
    image: "/ISE_XILINX.svg",
    description: "Complete FPGA design suite from concept to configuration",
    category: "FPGA Design",
    tools: ["Vivado Design Suite", "Vitis Unified Platform", "System Generator", "Vivado HLS"],
    type: "toolset"
  }
};

// Node positions with much better spacing and proper centering
const NODE_POSITIONS = {
  // Root node - centered in viewport
  "vlsi-tools": { x: 200, y: 500 },
  
  // Main categories - much better spacing
  "open-source": { x: 520, y: 250 },
  "eda": { x: 520, y: 750 },
  
  // Open source tools - significantly improved spacing
  "ngspice": { x: 900, y: 100 },
  "esim": { x: 1120, y: 150 },
  "opentimer": { x: 900, y: 200 },
  "magic": { x: 1120, y: 250 },
  "ltspice": { x: 900, y: 300 },
  
  // EDA vendors - much better vertical distribution
  "cadence": { x: 900, y: 600 },
  "synopsys": { x: 900, y: 740 },
  "siemens": { x: 900, y: 880 },
  "xilinx": { x: 900, y: 1020 },
  
  // Vendor toolsets - properly aligned with good spacing
  "virtuoso": { x: 1300, y: 600 },
  "primetime": { x: 1300, y: 710 },
  "dft": { x: 1300, y: 820 },
  "tessent": { x: 1300, y: 930 },
  "vivado": { x: 1300, y: 1040 }
};

// Connection paths
const CONNECTIONS = [
  { from: "vlsi-tools", to: "open-source" },
  { from: "vlsi-tools", to: "eda" },
  { from: "open-source", to: "ngspice" },
  { from: "open-source", to: "esim" },
  { from: "open-source", to: "opentimer" },
  { from: "open-source", to: "magic" },
  { from: "open-source", to: "ltspice" },
  { from: "eda", to: "cadence" },
  { from: "eda", to: "synopsys" },
  { from: "eda", to: "siemens" },
  { from: "eda", to: "xilinx" },
  { from: "cadence", to: "virtuoso" },
  { from: "synopsys", to: "primetime" },
  { from: "synopsys", to: "dft" },
  { from: "siemens", to: "tessent" },
  { from: "xilinx", to: "vivado" }
];


// Enhanced Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-slate-900 text-white rounded-lg border border-slate-700 p-8">
      <AlertTriangle className="w-16 h-16 text-red-400 mb-4 animate-pulse" />
      <h2 className="text-xl font-bold mb-2 text-slate-100">Flowchart Error</h2>
      <p className="text-slate-400 text-center mb-4 max-w-md leading-relaxed">
        {error?.message || "Something went wrong loading the VLSI tools flowchart."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium"
        >
          <HomeIcon className="w-4 h-4" />
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Enhanced Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center h-96">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-600 border-t-blue-500`} />
    </div>
  );
};

// Enhanced SVG Node Component with improved hover effects
const SVGNode = React.memo(function SVGNode({ 
  tool, 
  position, 
  zoom,
  onHover,
  onLeave,
  hoveredTool,
  onClick 
}) {
  const { x, y } = position;
  const isHovered = hoveredTool === tool.id;
  const hasInteraction = Boolean(tool.downloadLink || tool.website || tool.tools);
  
  // Node dimensions based on type with better proportions
  const getNodeDimensions = (type) => {
    switch (type) {
      case 'root':
        return { width: 220, height: 180, borderRadius: 20 };
      case 'category':
        return { width: 260, height: 160, borderRadius: 18 };
      case 'vendor':
        return { width: 200, height: 140, borderRadius: 16 };
      case 'tool':
        return { width: 180, height: 125, borderRadius: 14 };
      case 'toolset':
        return { width: 300, height: 160, borderRadius: 18 };
      default:
        return { width: 180, height: 125, borderRadius: 14 };
    }
  };

  const { width, height, borderRadius } = getNodeDimensions(tool.type);
  
  const nodeStyle = {
    transform: `translate(${x}px, ${y}px) scale(${isHovered ? FLOWCHART_CONFIG.HOVER_SCALE : 1})`,
    transition: `all ${FLOWCHART_CONFIG.TRANSITION_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
    cursor: hasInteraction ? 'pointer' : 'default',
    transformOrigin: 'center'
  };

  const rectStyle = {
    fill: isHovered ? COLORS.SURFACE_HOVER : COLORS.SURFACE,
    stroke: isHovered ? COLORS.BORDER_HOVER : COLORS.BORDER,
    strokeWidth: isHovered ? 3 : 2,
    rx: borderRadius,
    ry: borderRadius,
    filter: isHovered 
      ? `drop-shadow(0 12px 24px ${COLORS.SHADOW_HOVER}) drop-shadow(0 4px 12px ${COLORS.SHADOW})`
      : `drop-shadow(0 6px 12px ${COLORS.SHADOW})`
  };

  // Status indicator based on tool type
  const getStatusColor = (type) => {
    switch (type) {
      case 'root': return COLORS.PRIMARY;
      case 'category': return COLORS.SUCCESS;
      case 'vendor': return COLORS.WARNING;
      case 'tool': return COLORS.SUCCESS;
      case 'toolset': return COLORS.PRIMARY;
      default: return COLORS.TEXT_MUTED;
    }
  };

  return (
    <g
      style={nodeStyle}
      onMouseEnter={() => onHover(tool.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(tool)}
      role="button"
      aria-label={`${tool.label}: ${tool.description}`}
      tabIndex={0}
    >
      <rect
        width={width}
        height={height}
        style={rectStyle}
      />
      
      {/* Status indicator */}
      <circle
        cx={width - 15}
        cy={15}
        r={6}
        fill={getStatusColor(tool.type)}
        opacity={0.8}
      />
      
      {/* Interaction indicator */}
      {hasInteraction && (
        <g opacity={isHovered ? 1 : 0.6}>
          <circle
            cx={15}
            cy={15}
            r={8}
            fill={COLORS.PRIMARY}
            opacity={0.8}
          />
          <MousePointerClickIcon
            x={11}
            y={11}
            width={8}
            height={8}
            fill="white"
          />
        </g>
      )}
      
      <foreignObject
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <div className="flex flex-col items-center justify-center h-full p-4 text-white">
          {tool.image && (
            <div className="mb-3 flex-shrink-0 relative">
              <Image
                src={tool.image}
                alt={tool.label}
                width={tool.type === 'root' ? 180 : tool.type === 'category' ? 178 : tool.type === 'vendor' ? 150 : 142}
                height={tool.type === 'root' ? 180 : tool.type === 'category' ? 178 : tool.type === 'vendor' ? 150 : 70}
                className={`rounded-lg shadow-lg transition-all duration-200 ${isHovered ? 'shadow-xl' : ''}`}
                priority={tool.type === 'root'}
              />
            </div>
          )}
          <div className="text-center px-2">
            <p className={`font-semibold leading-tight ${
              tool.type === 'root' ? 'text-lg' : 
              tool.type === 'category' ? 'text-base' :
              tool.type === 'toolset' ? 'text-sm leading-relaxed' : 'text-sm'
            } ${isHovered ? 'text-blue-300' : 'text-slate-100'} transition-colors duration-200`}>
              {tool.label}
            </p>
            {tool.category && (
              <p className={`text-xs mt-1 ${isHovered ? 'text-slate-300' : 'text-slate-400'} transition-colors duration-200`}>
                {tool.category}
              </p>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  );
});

// Enhanced SVG Connection Line Component
const SVGConnection = React.memo(function SVGConnection({ from, to, zoom, hoveredTool }) {
  const fromPos = NODE_POSITIONS[from];
  const toPos = NODE_POSITIONS[to];
  
  if (!fromPos || !toPos) return null;

  // Calculate connection points
  const fromTool = TOOLS_DATA[from];
  const toTool = TOOLS_DATA[to];
  
  const getNodeDimensions = (type) => {
    switch (type) {
      case 'root': return { width: 220, height: 180 };
      case 'category': return { width: 260, height: 160 };
      case 'vendor': return { width: 200, height: 140 };
      case 'tool': return { width: 180, height: 125 };
      case 'toolset': return { width: 300, height: 160 };
      default: return { width: 180, height: 125 };
    }
  };

  const fromDim = getNodeDimensions(fromTool.type);
  const toDim = getNodeDimensions(toTool.type);

  const x1 = fromPos.x + fromDim.width;
  const y1 = fromPos.y + fromDim.height / 2;
  const x2 = toPos.x;
  const y2 = toPos.y + toDim.height / 2;

  // Create smooth curved path
  const midX = (x1 + x2) / 2;
  const controlOffset = Math.abs(x2 - x1) * 0.3;
  const path = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1} ${x2 - controlOffset} ${y2} ${x2} ${y2}`;

  // Highlight connected paths when hovering
  const isHighlighted = hoveredTool === from || hoveredTool === to;

  return (
    <g>
      <path
        d={path}
        stroke={isHighlighted ? COLORS.BORDER_HOVER : COLORS.BORDER}
        strokeWidth={isHighlighted ? 4 : 3}
        fill="none"
        markerEnd="url(#arrowhead)"
        opacity={isHighlighted ? 0.9 : 0.6}
        style={{
          transition: 'all 0.25s ease-in-out'
        }}
      />
    </g>
  );
});

// Enhanced Tooltip Component for comprehensive tool information
const DownloadTooltip = ({ tool, children }) => {
  if (!tool.downloadLink && !tool.website && !tool.tools && !tool.features) return children;

  const tooltipContent = (
    <div className="p-5 max-w-md bg-slate-800 border border-slate-600 rounded-lg shadow-2xl">
      <div className="flex items-start gap-3 mb-4">
        {tool.image && (
          <Image
            src={tool.image}
            alt={tool.label}
            width={48}
            height={48}
            className="rounded-lg shadow-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-100 mb-1 text-lg leading-tight">{tool.label}</h4>
          {tool.category && (
            <span className="inline-block text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded-full font-medium mb-2">
              {tool.category}
            </span>
          )}
          {tool.marketShare && (
            <span className="inline-block text-xs bg-green-600 text-green-100 px-2 py-1 rounded-full font-medium mb-2 ml-2">
              {tool.marketShare}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">{tool.description}</p>
      
      {tool.features && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
            <InfoIcon className="w-4 h-4" />
            Key Features:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tool.features.map((feature) => (
              <span key={feature} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-medium">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {tool.tools && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
            <InfoIcon className="w-4 h-4" />
            Available Tools:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tool.tools.slice(0, 6).map((toolName) => (
              <span key={toolName} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-medium">
                {toolName}
              </span>
            ))}
            {tool.tools.length > 6 && (
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-md">
                +{tool.tools.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {tool.downloadLink && (
          <a
            href={tool.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/25"
            onClick={(e) => e.stopPropagation()}
          >
            <DownloadIcon className="w-4 h-4" />
            Download Software
          </a>
        )}
        {tool.website && (
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLinkIcon className="w-4 h-4" />
            Official Website
          </a>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-transparent border-none p-0 max-w-none shadow-none"
          sideOffset={15}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Main Enhanced VLSI Flowchart Component
export default function VlsiFlowchart() {
  const [zoom, setZoom] = useState(FLOWCHART_CONFIG.DEFAULT_ZOOM);
  const [pan, setPan] = useState({ x: -100, y: -120 });
  const [hoveredTool, setHoveredTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Memoized calculations for performance
  const viewBox = useMemo(() => 
    `0 0 ${FLOWCHART_CONFIG.VIEWPORT.WIDTH} ${FLOWCHART_CONFIG.VIEWPORT.HEIGHT}`, 
    []
  );
  
  const transform = useMemo(() => 
    `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, 
    [zoom, pan.x, pan.y]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, FLOWCHART_CONFIG.MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, FLOWCHART_CONFIG.MIN_ZOOM));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(FLOWCHART_CONFIG.DEFAULT_ZOOM);
    setPan({ x: -100, y: -120 });
  }, []);

  const handleNodeHover = useCallback((toolId) => {
    setHoveredTool(toolId);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredTool(null);
  }, []);

  const handleNodeClick = useCallback((tool) => {
    setSelectedTool(tool);
    if (tool.downloadLink) {
      window.open(tool.downloadLink, '_blank', 'noopener,noreferrer');
    } else if (tool.website) {
      window.open(tool.website, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case '+':
      case '=':
        e.preventDefault();
        handleZoomIn();
        break;
      case '-':
        e.preventDefault();
        handleZoomOut();
        break;
      case '0':
        e.preventDefault();
        handleResetView();
        break;
    }
  }, [handleZoomIn, handleZoomOut, handleResetView]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="w-full bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden min-h-[1000px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-400 text-lg font-medium">Loading VLSI Tools Flowchart...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="w-full bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden min-h-[1000px] flex flex-col">
        {/* Enhanced Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-slate-800/95 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-blue-500/25 group"
            title="Zoom In (+ key)"
            disabled={zoom >= FLOWCHART_CONFIG.MAX_ZOOM}
          >
            <ZoomInIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 bg-slate-800/95 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-blue-500/25 group"
            title="Zoom Out (- key)"
            disabled={zoom <= FLOWCHART_CONFIG.MIN_ZOOM}
          >
            <ZoomOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={handleResetView}
            className="p-3 bg-slate-800/95 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-blue-500/25 group"
            title="Reset View (0 key)"
          >
            <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Enhanced Info Panel */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-800/95 text-white p-5 rounded-lg border border-slate-600 max-w-sm backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <InfoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">VLSI Tools</h3>
              <p className="text-xs text-slate-400">Interactive Flowchart</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Explore comprehensive VLSI software tools and vendors with direct download links
          </p>
          <div className="text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <MousePointerClickIcon className="w-3 h-3" />
              <span>Hover for detailed information</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLinkIcon className="w-3 h-3" />
              <span>Click to visit official sites</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomInIcon className="w-3 h-3" />
              <span>Use +/- keys to zoom</span>
            </div>
          </div>
        </div>

        {/* Enhanced SVG Container */}
        <div
          ref={containerRef}
          className="w-full h-[1000px] overflow-hidden flex items-center justify-center"
          role="img"
          aria-label="VLSI Tools Flowchart"
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={viewBox}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
            }}
          >
            {/* Enhanced Definitions */}
            <defs>
              {/* Arrow marker */}
              <marker
                id="arrowhead"
                markerWidth="14"
                markerHeight="10"
                refX="13"
                refY="5"
                orient="auto"
              >
                <polygon
                  points="0 0, 14 5, 0 10"
                  fill={COLORS.BORDER}
                  stroke={COLORS.BORDER}
                  strokeWidth="1"
                />
              </marker>
              
              {/* Hover arrow marker */}
              <marker
                id="arrowhead-hover"
                markerWidth="14"
                markerHeight="10"
                refX="13"
                refY="5"
                orient="auto"
              >
                <polygon
                  points="0 0, 14 5, 0 10"
                  fill={COLORS.BORDER_HOVER}
                  stroke={COLORS.BORDER_HOVER}
                  strokeWidth="1"
                />
              </marker>

              {/* Enhanced grid pattern */}
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={COLORS.BORDER}
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              </pattern>

              {/* Radial gradient for background */}
              <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </radialGradient>
            </defs>

            {/* Background with pattern */}
            <rect width="100%" height="100%" fill="url(#bgGradient)" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Transform group for zoom and pan with smooth transitions */}
            <g style={{ 
              transform, 
              transition: zoom === FLOWCHART_CONFIG.DEFAULT_ZOOM ? 'transform 0.3s ease-out' : 'none'
            }}>
              {/* Render connections first (behind nodes) */}
              {CONNECTIONS.map((connection, index) => (
                <SVGConnection
                  key={`connection-${index}`}
                  from={connection.from}
                  to={connection.to}
                  zoom={zoom}
                  hoveredTool={hoveredTool}
                />
              ))}

              {/* Render nodes with tooltips */}
              {Object.entries(TOOLS_DATA).map(([id, tool]) => {
                const position = NODE_POSITIONS[id];
                if (!position) return null;

                const nodeElement = (
                  <SVGNode
                    key={id}
                    tool={tool}
                    position={position}
                    zoom={zoom}
                    onHover={handleNodeHover}
                    onLeave={handleNodeLeave}
                    hoveredTool={hoveredTool}
                    onClick={handleNodeClick}
                  />
                );

                return (
                  <DownloadTooltip key={id} tool={tool}>
                    {nodeElement}
                  </DownloadTooltip>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Enhanced Zoom Indicator */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-800/95 text-white px-4 py-2 rounded-lg text-sm border border-slate-600 backdrop-blur-sm shadow-lg font-mono flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          {Math.round(zoom * 100)}%
        </div>

        {/* Accessibility and SEO enhancement */}
        <div className="sr-only">
          <h2>VLSI Tools and Software Flowchart</h2>
          <p>Interactive diagram showing relationships between VLSI design tools, including open source options like NGSPICE, eSim, OpenTimer, and Magic VLSI, as well as commercial EDA vendors like Cadence, Synopsys, Siemens EDA, and AMD Xilinx.</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

