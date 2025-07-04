import { test, expect } from "@playwright/test";

test.describe("Site navigation", () => {
  test("navigation bar links are visible", async ({ page, baseURL }) => {
    await page.goto(baseURL || "/");
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /blog/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /let's talk/i })).toBeVisible();
  });

  test("blog link redirects to substack", async ({ page, context, baseURL }) => {
    await page.goto(baseURL || "/");
    // Intercept new tab
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: /blog/i }).click(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    expect(newPage.url()).toContain("drelsolutions.substack.com");
  });
});