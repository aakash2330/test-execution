import { Metadata } from "next";
import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { fetchAllSubmissions } from "@/actions/submissions.action";
import _ from "lodash";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export const revalidate = 1;

export default async function TaskPage() {
  const data = await fetchAllSubmissions();
  if (_.isEmpty(data)) {
    return <div>No data found</div>;
  }
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Test Submissons PROBO-v1
            </h2>
          </div>
        </div>
        <DataTable data={data.submissions} columns={columns} />
      </div>
    </>
  );
}
