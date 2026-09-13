-- CreateTable
CREATE TABLE "Habito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta" TEXT NOT NULL,

    CONSTRAINT "Habito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "idHabito" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "completado" BOOLEAN NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_idHabito_fkey" FOREIGN KEY ("idHabito") REFERENCES "Habito"("id") ON DELETE CASCADE ON UPDATE CASCADE;
