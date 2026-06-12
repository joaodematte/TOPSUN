import { getRequestProtocolStatusThresholds } from "@topsun/db/postgres-queries";
import { getProjectsOnRequestProtocol } from "@topsun/db/queries";

import { protectedProcedure, router } from "..";

export const requestProtocolRouter = router({
  getProjects: protectedProcedure.query(async () => {
    const data = await getProjectsOnRequestProtocol();

    return data;
  }),
  getStatusThresholds: protectedProcedure.query(async () => {
    const data = await getRequestProtocolStatusThresholds();

    return data;
  }),
});
