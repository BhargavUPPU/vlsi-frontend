// /d:/Vlsi_website/Vlsi_Website/app/(dashboard)/Resources/softwareTools/FlowChart.jsx
"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BASE_NODE_STYLE = {
  padding: 0,
  border: "none",
  background: "transparent",
};

const cardBase =
  "flex flex-col items-center justify-center p-2 rounded-lg text-white border shadow-lg";

const ImageNode = React.memo(function ImageNode({ data }) {
  const { image, label, link } = data || {};
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center">
            <Image
              src={image}
              alt={label || "tool image"}
              width={150}
              height={50}
              className="rounded-md shadow-md"
              style={{ objectFit: "contain" }}
            />
          </div>
        </TooltipTrigger>

        {link && (
          <TooltipContent className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
              aria-label={`Open ${label} in a new tab`}
            >
              {link.replace(/(^\w+:|^)\/\//, "")}
            </a>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});

const CategoryNode = React.memo(function CategoryNode({ data }) {
  const { image, label } = data || {};
  return (
    <div
      className={`${cardBase} bg-gray-700/60 backdrop-blur-sm border-gray-600`}
      role="group"
      aria-label={label}
    >
      {image && (
        <Image
          src={image}
          alt={label || "category image"}
          width={80}
          height={80}
          className="mb-2 rounded-md"
        />
      )}
      <span className="text-sm font-semibold text-center">{label}</span>
    </div>
  );
});

const VendorToolNode = React.memo(function VendorToolNode({ data }) {
  const { image, label, tooltipImage, link } = data || {};
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`${cardBase} bg-gray-800 border-gray-700 p-3`}
            role="button"
            tabIndex={0}
            aria-label={`${label} vendor`}
          >
            {image && (
              <Image
                src={image}
                alt={label || "vendor logo"}
                width={120}
                height={40}
                objectFit="cover"
                className="object-cover"
              />
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent className="p-0 border-none bg-transparent shadow-none">
          <div className="rounded-md overflow-hidden shadow-xl border border-gray-600 bg-gray-900">
            {tooltipImage && (
              <Image
                src={tooltipImage}
                alt={`${label} details`}
                width={220}
                height={110}
                className="object-contain"
              />
            )}
            {link && (
              <div className="bg-gray-800 text-white text-xs px-2 py-1 text-center rounded-b-md">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                  aria-label={`Open ${label} website in a new tab`}
                >
                  {link.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const nodeTypes = {
  imageNode: ImageNode,
  categoryNode: CategoryNode,
  vendorToolNode: VendorToolNode,
};

export default function VlsiFlowchart() {
  // memoize initial data to avoid re-creating on each render
  const initialNodes = useMemo(
    () => [
      // Root category
      {
        id: "1",
        type: "categoryNode",
        data: { label: "VLSI Tools", image: "/vlsiTools.png" },
        position: { x: 0, y: 150 },
        style: { ...BASE_NODE_STYLE, width: 150, height: 150 },
      },

      // Categories
      {
        id: "2",
        type: "categoryNode",
        data: {
          label: "Open Source Tools",
          image: "/openSource.png",
        },
        position: { x: 250, y: 50 },
        style: { ...BASE_NODE_STYLE, width: 170, height: 100 },
      },
      {
        id: "3",
        type: "categoryNode",
        data: { label: "EDA", image: "/eda.png" },
        position: { x: 250, y: 300 },
        style: { ...BASE_NODE_STYLE, width: 170, height: 100 },
      },

      // Open Source Tools
      {
        id: "4",
        type: "imageNode",
        data: {
          label: "NGSPICE",
          image: "/ngspice.png",
          link: "https://ngspice.sourceforge.io/",
        },
        position: { x: 700, y: 0 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "5",
        type: "imageNode",
        data: {
          label: "eSim",
          image: "/esim.png",
          link: "https://esim.fossee.in/",
        },
        position: { x: 700, y: 70 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "6",
        type: "imageNode",
        data: {
          label: "OpenTimer",
          image: "/opentimer.png",
          link: "https://github.com/OpenTimer",
        },
        position: { x: 700, y: 140 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "7",
        type: "imageNode",
        data: {
          label: "Magic VLSI",
          image: "/magic_vlsi.png",
          link: "http://www.opencircuitdesign.com/magic/",
        },
        position: { x: 700, y: 210 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "8",
        type: "imageNode",
        data: {
          label: "LTspice",
          image: "/ltspices.png",
          link: "https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html",
        },
        position: { x: 700, y: 280 },
        style: BASE_NODE_STYLE,
      },

      // EDA Vendor Tools
      {
        id: "9",
        type: "vendorToolNode",
        data: {
          label: "Cadence",
          image: "/cadence.png",
          tooltipImage: "/virtuoso_tooltip.png",
          link: "https://www.cadence.com/",
        },
        position: { x: 700, y: 380 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "10",
        type: "vendorToolNode",
        data: {
          label: "Synopsys",
          image: "/synopsys.png",
          tooltipImage: "/primetime_tooltip.png",
          link: "https://www.synopsys.com/",
        },
        position: { x: 700, y: 470 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "11",
        type: "vendorToolNode",
        data: {
          label: "Siemens Mentor",
          image: "/siemens_mentor.png",
          tooltipImage: "/tessent_tooltip.png",
          link: "https://eda.sw.siemens.com/en-US/",
        },
        position: { x: 700, y: 560 },
        style: BASE_NODE_STYLE,
      },
      {
        id: "12",
        type: "vendorToolNode",
        data: {
          label: "Xilinx",
          image: "/xilinx.png",
          tooltipImage: "/vivado_tooltip.png",
          link: "https://www.xilinx.com/products/design-tools/vivado.html",
        },
        position: { x: 700, y: 650 },
        style: BASE_NODE_STYLE,
      },
    ],
    [],
  );

  const EDGE_STYLE = {
    stroke: "#3B82F6", // Bright blue for visibility
    strokeWidth: 3, // Thicker line
  };

  const initialEdges = useMemo(
    () => [
      // Root → Categories
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "straight",
        style: { stroke: "#3B82F6", strokeWidth: 4 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#3B82F6" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: "straight",
        style: { stroke: "#3B82F6", strokeWidth: 4 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#3B82F6" },
      },

      // Open Source Tools
      {
        id: "e2-4",
        source: "2",
        target: "4",
        type: "straight",
        style: { stroke: "#10B981", strokeWidth: 3 }, // Bright green
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        type: "straight",
        style: { stroke: "#10B981", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
      },
      {
        id: "e2-6",
        source: "2",
        target: "6",
        type: "straight",
        style: { stroke: "#10B981", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
      },
      {
        id: "e2-7",
        source: "2",
        target: "7",
        type: "straight",
        style: { stroke: "#10B981", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
      },
      {
        id: "e2-8",
        source: "2",
        target: "8",
        type: "straight",
        style: { stroke: "#10B981", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
      },

      // EDA Vendor Tools
      {
        id: "e3-9",
        source: "3",
        target: "9",
        type: "straight",
        style: { stroke: "#F59E0B", strokeWidth: 3 }, // Bright orange
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F59E0B" },
      },
      {
        id: "e3-10",
        source: "3",
        target: "10",
        type: "straight",
        style: { stroke: "#F59E0B", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F59E0B" },
      },
      {
        id: "e3-11",
        source: "3",
        target: "11",
        type: "straight",
        style: { stroke: "#F59E0B", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F59E0B" },
      },
      {
        id: "e3-12",
        source: "3",
        target: "12",
        type: "straight",
        style: { stroke: "#F59E0B", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F59E0B" },
      },
    ],
    [],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => {
      if (params.source && params.target) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setEdges],
  );

  // small UI wrapper for consistent spacing and height
  return (
    <div className="w-full h-[800px] bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold text-center text-gray-100">
          VLSI Software Tools Flowchart
        </h2>
        <p className="text-center text-gray-400 text-sm mt-2">
          Interactive flowchart showing VLSI design tools categorized by type
        </p>
      </header>

      <main className="w-full h-[720px] rounded-md overflow-hidden border border-gray-700 shadow-inner">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="react-flow-dark"
          minZoom={0.5}
          maxZoom={2}
        >
          <MiniMap
            nodeStrokeWidth={2}
            nodeColor={(n) => {
              if (n.type === "categoryNode") return "#3B82F6";
              if (n.type === "vendorToolNode") return "#F59E0B";
              return "#10B981";
            }}
            maskColor="rgba(0,0,0,0.6)"
            className="bg-gray-800 border border-gray-600 rounded"
          />
          <Controls
            showInteractive={true}
            className="bg-gray-800 border border-gray-600 rounded"
          />
          <Background color="#4B5563" gap={20} size={1} variant="dots" />
        </ReactFlow>
      </main>
    </div>
  );
}
