import { ProjectStatus } from "../../enums/ProjectStatus.js";
import { TaskStatus } from "../../enums/TaskStatus.js";

const status = Object.freeze({
  PENDING: "PENDING",
  INPROGRESS: "INPROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  HOLD: "HOLD",
  TODO: "TODO",
});

export { ProjectStatus, TaskStatus };
export default status;