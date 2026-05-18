-- CreateTable
CREATE TABLE "Volunteer" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "photo" TEXT,
    "skills" TEXT[],
    "hasExperience" BOOLEAN NOT NULL DEFAULT false,
    "preferredAnimals" TEXT[],
    "considersFoster" BOOLEAN NOT NULL DEFAULT false,
    "hasCage" BOOLEAN DEFAULT false,
    "hasSeparateRoom" BOOLEAN DEFAULT false,
    "maxFosterDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" SERIAL NOT NULL,
    "orgName" TEXT NOT NULL,
    "legalStatus" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "requisites" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Overexposure" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "photo" TEXT,
    "hasCage" BOOLEAN DEFAULT false,
    "hasSeparateRoom" BOOLEAN DEFAULT false,
    "hasOtherAnimals" BOOLEAN DEFAULT false,
    "maxDays" INTEGER,
    "acceptedAnimals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Overexposure_pkey" PRIMARY KEY ("id")
);
