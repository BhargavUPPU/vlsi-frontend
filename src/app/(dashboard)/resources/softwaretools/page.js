"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import VlsiFlowChart from "./FlowChart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Data for the table
const designData = [
  {
    category: "Digital IC Design",
    tools: [
      {
        name: "Logic Simulators",
        cadence: "Xcelium",
        synopsys: "VCS",
        openSource: "Icarus Verilog, Verilator",
      },
      {
        name: "RTL Synthesis",
        cadence: "Genus",
        synopsys: "Design Compiler",
        openSource: "Yosys",
      },
      {
        name: "Formal Verification",
        cadence: "JasperGold",
        synopsys: "Formality",
        openSource: "Yosys/eqy, sby",
      },
      {
        name: "Physical Synthesis",
        cadence: "Innovus",
        synopsys: "IC Compiler II",
        openSource: "OpenROAD",
      },
      {
        name: "Timing Analysis",
        cadence: "Tempus",
        synopsys: "OpenSTA",
        openSource: "OpenSTA",
      },
      {
        name: "Place & Route",
        cadence: "Innovus",
        synopsys: "IC Validator",
        openSource: "OpenROAD, graywolf",
      },
      {
        name: "Power Analysis",
        cadence: "Voltus",
        synopsys: "IC Validator",
        openSource: "Magic, Netgen",
      },
      {
        name: "Layout vs Schematic",
        cadence: "Pegasus",
        synopsys: "IC Validator",
        openSource: "Magic, Netgen",
      },
    ],
  },
  {
    category: "Analog IC Design",
    tools: [
      {
        name: "Schematic Capture",
        cadence: "Virtuoso",
        synopsys: "Custom Compiler",
        openSource: "Xschem, Kicad",
      },
      {
        name: "Circuit Simulator",
        cadence: "Spectre, APS",
        synopsys: "HSPICE, CustomSim",
        openSource: "Ngspice, Xyce",
      },
      {
        name: "Layout Editor",
        cadence: "Virtuoso Layout Suite",
        synopsys: "Custom Compiler Layout",
        openSource: "Magic, KLayout",
      },
      {
        name: "Parasitic Extraction",
        cadence: "Assura",
        synopsys: "Synopsys StarRC",
        openSource: "Magic, Netgen",
      },
      {
        name: "DRC/LVS",
        cadence: "Assura",
        synopsys: "IC Validator",
        openSource: "Magic (limited), OpenRCX",
      },
    ],
  },
];

const otherData = [
  {
    category: "Technology Support",
    cadence: "All leading nodes",
    synopsys: "All leading nodes",
    openSource: "Free and Open Source",
  },
  {
    category: "Industry Support",
    cadence: "Paid (Expensive)",
    synopsys: "Paid (Expensive)",
    openSource: "Free (Academics, Research, Startups)",
  },
];

export default function VlsiToolsPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Section 1: Introduction */}
            <Link
                        href="/resources"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium p-2 sm:p-4 mb-4"
                      >
                        <ArrowLeft size={20} />
                        <span className="text-sm sm:text-base">Software Tools</span>
                      </Link>
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="text-3xl sm:text-4xl">🛠️</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              VLSI Software Tools
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We work on a whole gamut of VLSI tools from opensource to
                commercial. We provide our clients with a bunch of services,
                ranging from custom scripting and tools to design, simulation,
                verification, and power analysis, to help them with their VLSI
                design projects. These tools reduce design time, and ensure
                accuracy, performance, and reliability of the final IC.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our teams are well-trained, and can work on any set of EDA tools
                and flows to make your IC design journey from idea to chip
                design feasible.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We work on tools like{" "}
                <span className="font-semibold text-blue-600">
                  NGSPICE, LTspice, eSim, OpenTimer,
                </span>{" "}
                and{" "}
                <span className="font-semibold text-blue-600">
                  Magic VLSI Layout tool
                </span>{" "}
                for analog IC design flows, and this is used mainly for
                academics and small projects. We also work on{" "}
                <span className="font-semibold text-purple-600">
                  Cadence, Synopsys, Mentor Graphics,
                </span>{" "}
                and{" "}
                <span className="font-semibold text-orange-600">
                  Xilinx tools.
                </span>{" "}
                Synopsys IC Design Compiler, VCS, Formality, etc. Mentor
                Calibre. Modelling is used for advanced digital and analog IC
                design. Siemens provides Tessent for DFT, and Xilinx Vivado for
                FPGA design, training, synthesis, and analysis.
              </p>
            </div>

            <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl border-2 sm:border-4 border-gray-200 order-1 lg:order-2">
              <Image
                src="/Chip.png"
                alt="VLSI Chip Die Shot"
                width={600}
                height={400}
                className="object-cover w-full h-48 sm:h-64 md:h-80 lg:h-full"
                priority
              />
            </div>
          </div>
        </section>

        {/* Section 2: Flowchart Diagram */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">VLSI Design Flow</h2>
            <p className="text-sm sm:text-base opacity-90">
              Comprehensive EDA tools ecosystem for chip design
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg overflow-hidden">
            <div className="w-full overflow-x-auto">
              <VlsiFlowChart />
            </div>
          </div>
        </section>

        {/* Section 3: Application & Tools Table */}
        <section>
          <div className="p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Application & Tools</h2>
            <p className="text-sm sm:text-base opacity-90">
              Comprehensive comparison of EDA tools from major vendors
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="p-4 sm:p-6 space-y-6">
                {designData.map((section) => (
                  <div key={section.category} className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 bg-blue-50 px-4 py-2 rounded-lg">
                      {section.category}
                    </h3>
                    {section.tools.map((tool) => (
                      <div key={tool.name} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-gray-800 text-base">{tool.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Cadence:</span>
                            <span className="text-gray-800">{tool.cadence}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Synopsys:</span>
                            <span className="text-gray-800">{tool.synopsys}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Open Source:</span>
                            <span className="text-gray-800">{tool.openSource}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Other Data for Mobile */}
                <div className="space-y-4">
                  {otherData.map((row) => (
                    <div key={row.category} className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3">{row.category}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Cadence:</span>
                          <span className="text-gray-800">{row.cadence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Synopsys:</span>
                          <span className="text-gray-800">{row.synopsys}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Open Source:</span>
                          <Badge
                            className={row.openSource.includes("Free") ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                          >
                            {row.openSource}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <TableHead className="w-[180px] font-bold text-gray-800 text-sm xl:text-base">
                      Digital IC Design
                    </TableHead>
                    <TableHead className="w-[200px] font-bold text-gray-800 text-sm xl:text-base">
                      Stage
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-sm xl:text-base">
                      Cadence
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-sm xl:text-base">
                      Synopsys
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-sm xl:text-base">
                      Open-Source EDA
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designData.map((section) =>
                    section.tools.map((tool, index) => (
                      <TableRow
                        key={`${section.category}-${tool.name}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {index === 0 && (
                          <TableCell
                            className="font-bold text-gray-800 align-top bg-blue-50 text-sm xl:text-base"
                            rowSpan={section.tools.length}
                          >
                            {section.category}
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-gray-700 text-sm xl:text-base">
                          {tool.name}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm xl:text-base">
                          {tool.cadence}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm xl:text-base">
                          {tool.synopsys}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm xl:text-base">
                          {tool.openSource}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {otherData.map((row) => (
                    <TableRow
                      key={row.category}
                      className="bg-gray-50 font-semibold"
                    >
                      <TableCell
                        colSpan={2}
                        className="font-bold text-gray-800 text-sm xl:text-base"
                      >
                        {row.category}
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm xl:text-base">
                        {row.cadence}
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm xl:text-base">
                        {row.synopsys}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            row.openSource.includes("Free")
                              ? "bg-green-500 text-white text-xs"
                              : "bg-gray-500 text-white text-xs"
                          }
                        >
                          {row.openSource}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
