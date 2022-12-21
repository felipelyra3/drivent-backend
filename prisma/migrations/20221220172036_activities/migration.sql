-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startsAt" TEXT NOT NULL,
    "endsAt" TEXT NOT NULL,
    "vacancy" INTEGER NOT NULL,
    "venue" INTEGER,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitiesVenue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ActivitiesVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySubscription" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER,
    "ticketId" INTEGER,

    CONSTRAINT "ActivitySubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivitiesVenue_name_key" ON "ActivitiesVenue"("name");

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_venue_fkey" FOREIGN KEY ("venue") REFERENCES "ActivitiesVenue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ActivitySubscription" ADD CONSTRAINT "ActivitySubscription_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ActivitySubscription" ADD CONSTRAINT "ActivitySubscription_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
