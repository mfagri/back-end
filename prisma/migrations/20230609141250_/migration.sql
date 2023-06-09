/*
  Warnings:

  - Added the required column `accectoken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "accectoken" TEXT NOT NULL;
