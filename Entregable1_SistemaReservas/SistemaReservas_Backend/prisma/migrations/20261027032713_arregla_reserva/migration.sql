/*
  Warnings:

  - You are about to drop the column `idServicio` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idUsuario` on the `Reserva` table. All the data in the column will be lost.
  - Added the required column `hora` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicioId` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_idServicio_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_idUsuario_fkey";

-- DropIndex
DROP INDEX "Reserva_idServicio_key";

-- DropIndex
DROP INDEX "Reserva_idUsuario_key";

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "idServicio",
DROP COLUMN "idUsuario",
ADD COLUMN     "hora" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "servicioId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
