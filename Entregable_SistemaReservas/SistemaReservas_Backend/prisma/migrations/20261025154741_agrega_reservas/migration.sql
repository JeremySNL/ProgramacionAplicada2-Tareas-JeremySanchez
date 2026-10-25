-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'COMPLETADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "idUsuario" INTEGER NOT NULL,
    "idServicio" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_idUsuario_key" ON "Reserva"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_idServicio_key" ON "Reserva"("idServicio");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_idServicio_fkey" FOREIGN KEY ("idServicio") REFERENCES "Servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
