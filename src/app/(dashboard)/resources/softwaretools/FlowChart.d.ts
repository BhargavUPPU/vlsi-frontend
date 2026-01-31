/**
 * Type definitions for VLSI Flowchart Component
 * Production-level TypeScript declarations
 */

// Core data interfaces
export interface ToolData {
  label: string;
  image: string;
  link?: string;
  description?: string;
  tools?: string[];
}

export interface NodeData extends ToolData {
  tooltipImage?: string;
}

export interface FlowchartNode {
  id: string;
  type: 'imageNode' | 'categoryNode' | 'vendorToolNode';
  data: NodeData;
  position: { x: number; y: number };
  style: React.CSSProperties;
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  style: React.CSSProperties;
  markerEnd: {
    type: string;
    color: string;
  };
  animated?: boolean;
  label?: string;
  labelStyle?: React.CSSProperties;
  labelBgStyle?: React.CSSProperties;
}

// Configuration interfaces
export interface ImageSize {
  width: number;
  height: number;
}

export interface FlowchartConfig {
  MIN_ZOOM: number;
  MAX_ZOOM: number;
  DEFAULT_ZOOM: number;
  ANIMATION_DURATION: number;
  IMAGE_SIZES: {
    CATEGORY: ImageSize;
    TOOL: ImageSize;
    VENDOR: ImageSize;
    TOOLTIP: ImageSize;
  };
  VIEWPORT: {
    HEIGHT: number;
    CONTENT_HEIGHT: number;
  };
}

export interface ColorPalette {
  PRIMARY: string;
  SUCCESS: string;
  WARNING: string;
  BACKGROUND: string;
  SURFACE: string;
  TEXT: string;
  MUTED: string;
}

// Component prop interfaces
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface NodeComponentProps {
  data: NodeData;
  selected?: boolean;
}

// Statistics interface
export interface FlowchartStats {
  totalTools: number;
  openSourceTools: number;
  commercialTools: number;
}

// Main component props (currently no props needed)
export interface VlsiFlowchartProps {
  // Reserved for future props
  className?: string;
  onNodeClick?: (nodeId: string, nodeData: NodeData) => void;
  onToolSelect?: (tool: ToolData) => void;
}

// Event handler types
export type NodeClickHandler = (
  event: React.MouseEvent,
  node: FlowchartNode
) => void;

export type ConnectionHandler = (params: {
  source: string;
  target: string;
}) => void;

export type SelectionChangeHandler = (params: {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}) => void;

// Utility function types
export type CreateNodesFunction = () => FlowchartNode[];
export type CreateEdgesFunction = () => FlowchartEdge[];

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error) => void;
  onReset?: () => void;
}

// CSS class name types for better type safety
export type FlowchartClassName = 
  | 'vlsi-flowchart'
  | 'loading-node'
  | 'react-flow-dark'
  | 'flowchart-container'
  | 'flowchart-header'
  | 'flowchart-main';

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: ColorPalette;
  animations: boolean;
  highContrast: boolean;
}

// Export the main component type
export declare const VlsiFlowchart: React.FC<VlsiFlowchartProps>;
export default VlsiFlowchart;