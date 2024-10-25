"use server";

import prisma from "@/lib/prisma";
import _ from "lodash";

export async function fetchAllSubmissionsByChallengeId({
  challengeId,
}: {
  challengeId: string;
}) {
  const data = await prisma.submission.findMany({
    where: { challenge: { id: challengeId } },
    include: { user: true, results: true },
  });
  console.log({ data });
  if (_.isEmpty(data)) {
    return null;
  }
  return { submissions: data };
}
