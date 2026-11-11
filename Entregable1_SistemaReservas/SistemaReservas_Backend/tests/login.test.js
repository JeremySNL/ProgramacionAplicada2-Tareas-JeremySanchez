import { test, expect, request } from "@playwright/test";
import { expectFailure } from "node:test";

test("login exitoso", async () => {
  const api = await request.newContext({ baseURL: "http://localhost:3000" });

  const res = await api.post("/auth/login", {
    data: {
      email: "usuario@test.com",
      password: "Castilla02",
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.body();
  expect(body).toBeDefined();
});

test("Positive LogIn test", async ({ page }) => {
  await page.goto("https://practicetestautomation.com/practice-test-login/");

  await page.getByLabel("Username").fill("student");
  await page.getByLabel("Password ").fill("Password123");
  await page.getByRole("button", { name: "Submit" }).click();

  expect(await page.url()).toBe(
    "https://practicetestautomation.com/logged-in-successfully/",
  );
  expect(await page.getByRole("strong").textContent()).toBe(
    "Congratulations student. You successfully logged in!",
  );
});
