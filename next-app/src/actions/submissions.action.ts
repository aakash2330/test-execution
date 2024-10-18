"use server";

import prisma from "@/lib/prisma";
import _ from "lodash";

export async function fetchAllSubmissions() {
  const data = await prisma.submission.findMany();
  if (_.isEmpty(data)) {
    return null;
  }
  return { submissions: data };
}
