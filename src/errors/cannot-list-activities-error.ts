import { ApplicationError } from "@/protocols";

export function cannotListActivitiesError(): ApplicationError {
  return {
    name: "cannotListActivitiessError",
    message: "Cannot list activities!",
  };
}
