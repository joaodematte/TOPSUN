export type {
  AutomationLogLevel,
  AutomationProgressEvent,
  AutomationRunOptions,
  AutomationRunResult,
  AutomationRunStats,
} from "./types";
export { countProtocolResults, emitProgress } from "./types";
export {
  getColetaDadosByUnidadeConsumidora,
  listAutomationRequestProtocolProjects,
  listOpenProtocolProjectsByClientNames,
  type RequestProtocolProject,
} from "./db/queries";
export { runRequestProtocol } from "./request-protocol/run";
export { runValidateProtocolReturn } from "./validate-protocol-return/run";
