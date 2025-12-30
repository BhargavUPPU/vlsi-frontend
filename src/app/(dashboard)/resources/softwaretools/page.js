"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/components/ui/table";
import { Badge } from "../../../components/components/ui/badge";
import VlsiFlowChart from "./FlowChart";

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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section 1: Introduction */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🛠️</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              VLSI Software Tools
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                We work on a whole gamut of VLSI tools from opensource to
                commercial. We provide our clients with a bunch of services,
                ranging from custom scripting and tools to design, simulation,
                verification, and power analysis, to help them with their VLSI
                design projects. These tools reduce design time, and ensure
                accuracy, performance, and reliability of the final IC.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our teams are well-trained, and can work on any set of EDA tools
                and flows to make your IC design journey from idea to chip
                design feasible.
              </p>
              <p className="text-gray-700 leading-relaxed">
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

            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
              <Image
                src="/softwareTools/Chip.png"
                alt="VLSI Chip Die Shot"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Flowchart Diagram */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-2">VLSI Design Flow</h2>
            <p className="opacity-90">
              Comprehensive EDA tools ecosystem for chip design
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <VlsiFlowChart />
          </div>
        </section>

        {/* Section 3: Application & Tools Table */}
        <section>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-2">Application & Tools</h2>
            <p className="opacity-90">
              Comprehensive comparison of EDA tools from major vendors
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <TableHead className="w-[180px] font-bold text-gray-800">
                      Digital IC Design
                    </TableHead>
                    <TableHead className="w-[200px] font-bold text-gray-800">
                      Stage
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      Cadence
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      Synopsys
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
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
                            className="font-bold text-gray-800 align-top bg-blue-50"
                            rowSpan={section.tools.length}
                          >
                            {section.category}
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-gray-700">
                          {tool.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {tool.cadence}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {tool.synopsys}
                        </TableCell>
                        <TableCell className="text-gray-600">
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
                        className="font-bold text-gray-800"
                      >
                        {row.category}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {row.cadence}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {row.synopsys}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            row.openSource.includes("Free")
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
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
