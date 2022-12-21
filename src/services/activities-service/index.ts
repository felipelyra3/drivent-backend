import activitiesRepository from "@/repositories/activities-repository";

async function listActivities() {
  const activities = await activitiesRepository.findActivities();
  return activities;
}

const activitiesService = {
  listActivities,
};

export default activitiesService;
