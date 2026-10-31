import { test, expect, type Page } from "@playwright/test";

/**
 * Loads the static export and asserts the page renders with zero console
 * errors, then exercises the match form against a mocked API so the test
 * doesn't depend on (or hit) the deployed backend.
 */

// The page pings the API on load to warm it up; mock that so tests stay offline.
test.beforeEach(async ({ page }) => {
  await page.route("**/ping", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
    });
  });
});

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

test("/ has no console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "Phone Numbers" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("loading the page warms up the API", async ({ page }) => {
  const ping = page.waitForRequest("**/ping");

  await page.goto("/");

  await ping;
});

test("submitting a phone number shows the match", async ({ page }) => {
  const errors = collectConsoleErrors(page);

  await page.route("**/match?value=*", async (route) => {
    const value = new URL(route.request().url()).searchParams.get("value");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ input: value, match: "1800 test me" }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Phone number").fill("1800837863");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByTestId("result")).toHaveText("1800 test me");
  expect(errors).toEqual([]);
});
