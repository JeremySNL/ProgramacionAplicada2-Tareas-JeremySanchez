import { test, expect } from '@playwright/test';

test("", async ({ page }) => {
  await page.goto("http://localhost:8081/login", { waitUntil: "commit" });

  await page.getByPlaceholder("correo@ejemplo.com").fill("usuario@test.com");
  await page.getByPlaceholder("Mínimo 6 caracteres").fill("Castilla02");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page).toHaveURL("http://localhost:8081/servicios", { timeout: 10000 });
});