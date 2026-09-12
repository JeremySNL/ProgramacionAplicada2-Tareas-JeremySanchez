-- DropForeignKey
ALTER TABLE "Opcion" DROP CONSTRAINT "Opcion_idEncuesta_fkey";

-- AddForeignKey
ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_idEncuesta_fkey" FOREIGN KEY ("idEncuesta") REFERENCES "Encuesta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
