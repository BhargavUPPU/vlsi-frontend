"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { motion } from "framer-motion";
import { Users, Search, ArrowLeft, Download, Filter, ChevronLeft, ChevronRight, UserCircle, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClubMembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["clubMembers"],
    queryFn: () => apiClient.get(API_ENDPOINTS.CLUB_MEMBERS.BASE),
  });

  const allMembers = Array.isArray(membersData?.data) 
    ? membersData.data 
    : Array.isArray(membersData?.data?.data)
      ? membersData.data.data
      : [];

  // Get unique academic years for dropdown
  const academicYears = [...new Set(allMembers.map((m) => m.academicYear))]
    .sort()
    .reverse();

  // Handle year selection change
  useEffect(() => {
    if (academicYears.length > 0 && !academicYears.includes(selectedYear)) {
      setSelectedYear(academicYears[0]);
    }
  }, [academicYears, selectedYear]);

  // Filter by academic year first
  const membersByYear = allMembers.filter((member) => member.academicYear === selectedYear);

  // Then filter by search term
  const filteredMembers = membersByYear.filter((member) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchStr) ||
      member.rollNumber?.toLowerCase().includes(searchStr) ||
      member.sectionBranch?.toLowerCase().includes(searchStr)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/team"
              className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Team</span>
              <span className="sm:hidden">Team</span>
            </Link>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-500" />
              <div className="relative group">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 font-semibold text-slate-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer text-sm"
                >
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
                  size={14}
                />
              </div>
            </div>
            
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 whitespace-nowrap">
              Members: {filteredMembers.length}
            </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-slate-900 tracking-tight"
                >
                    Club <span className="text-blue-600">Members</span>
                </motion.h1>
                <p className="mt-2 text-slate-500 font-medium">
                    The growing community of VLSI enthusiasts and innovators.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search by name, roll no..."
                        className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* Members Table */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-white border-b px-8 py-6">
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Directory</CardTitle>
                    <CardDescription>Comprehensive list of all registered club members</CardDescription>
                </div>
                <Users className="text-blue-200 h-10 w-10" />
             </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Loading members...</p>
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="w-[100px] font-bold text-slate-600 uppercase tracking-wider text-xs px-8 h-14">SR No.</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs h-14">Member Profile</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs h-14">Roll Number</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs h-14">Academic Year</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs h-14">Branch / Section</TableHead>
                     
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.map((member, idx) => (
                      <TableRow key={member.id} className="group border-slate-50 hover:bg-blue-50/20 transition-colors">
                        <TableCell className="font-medium text-slate-400 px-8 py-4">
                          #{(startIndex + idx + 1).toString().padStart(2, '0')}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <UserCircle size={22} />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">{member.name}</p>
                                <p className="text-xs text-slate-400 font-medium">{member.memberShipId || 'Associate Member'}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-mono font-bold text-slate-600 text-sm">
                          {member.rollNumber}
                        </TableCell>
                        <TableCell className="py-4">
                           <Badge variant="outline" className="rounded-md border-slate-200 text-slate-600 font-medium">
                            {member.academicYear}
                           </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                           <div className="text-slate-600 font-medium text-sm">
                              {member.sectionBranch || 'N/A'}
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <Users className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No members found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search criteria</p>
                <Button 
                    variant="outline" 
                    className="mt-6 rounded-xl"
                    onClick={() => setSearchTerm("")}
                >
                    Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, filteredMembers.length)}</span> of <span className="text-slate-900">{filteredMembers.length}</span> members
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-10 w-10 p-0"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    <ChevronLeft size={18} />
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        className={`rounded-lg h-10 w-10 font-bold ${currentPage === i + 1 ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-10 w-10 p-0"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    <ChevronRight size={18} />
                </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Quote */}
      <footer className="max-w-7xl mx-auto px-4 py-20 text-center">
            <p className="text-slate-400 font-medium italic text-sm">
                "United by passion, driven by excellence in VLSI research and innovation."
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-slate-300">
                <div className="w-12 h-px bg-slate-200" />
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <div className="w-12 h-px bg-slate-200" />
            </div>
      </footer>
    </div>
  );
}
