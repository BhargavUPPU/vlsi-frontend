"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useClubMembers } from "@/lib/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClubMembersPage() {
  const { data: clubMembers, isLoading, error, refetch } = useClubMembers();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/clubMembers/coreMembers">Manage Core Members</Link>
        </Button>
      </div>
      <AdminPageTemplate
        title="Club Members"
        data={clubMembers}
        columns={columns}
        isLoading={isLoading}
        error={error}
        createPath="/admin/clubMembers/createClubMember"
        createButtonText="Add Club Member"
        onRefresh={refetch}
        searchKey="name"
        apiEndpoint="clubMembers"
      />
    </div>
  );
}
