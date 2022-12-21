import { prisma } from "@/config";

async function findActivities() {
  return prisma.activities.findMany();
}

const activitiesRepository = {
  findActivities,
};
  
export default activitiesRepository;
