import { test, expect } from "@playwright/test";

const COLLECTION_CID = "bafybeiclu2xddpmbpgipirkjdrpxtnimpzm5a3cvfzlbpfa4irnyqfhf4u";

const SINGLE_PIXEL_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9Vgm4ZkAAAAASUVORK5CYII=";

test.describe("NFT Presale page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://ipfs.io/**", async route => {
      const url = route.request().url();

      if (url.endsWith(".json")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            name: "Mock Butterfly",
            image: `ipfs://${COLLECTION_CID}/images/mock.png`,
          }),
        });
        return;
      }

      if (url.endsWith(".png")) {
        await route.fulfill({
          status: 200,
          contentType: "image/png",
          body: Buffer.from(SINGLE_PIXEL_PNG, "base64"),
        });
        return;
      }

      await route.continue();
    });
  });

  test("renders five rounds with expected states and quantity controls", async ({ page }) => {
    await page.goto("/nft/presale");

    const cards = page.locator('[data-testid^="presale-round-"]');
    await expect(cards).toHaveCount(5);

    const firstCard = cards.nth(0);
    const buyButtons = page.getByRole("button", { name: "BUY" });

    await expect(firstCard.getByText("Number")).toBeVisible();
    await expect(firstCard.getByText("1000")).toBeVisible();
    await expect(firstCard.getByText("Price")).toBeVisible();
    await expect(firstCard.getByText("Price")).toBeVisible();

    await expect(buyButtons.nth(0)).toBeDisabled();
    await expect(buyButtons.nth(1)).toBeDisabled();
    await expect(buyButtons.nth(2)).toBeDisabled();
    await expect(buyButtons.nth(3)).toBeDisabled();
    await expect(buyButtons.nth(4)).toBeDisabled();

    const quantityInput = firstCard.locator('input[type="number"]');
    const plusButton = firstCard.locator('button', { hasText: '+' });
    const minusButton = firstCard.locator('button', { hasText: '-' });

    await expect(quantityInput).toHaveValue("1");

    await plusButton.click();
    await expect(quantityInput).toHaveValue("2");

    await minusButton.click();
    await expect(quantityInput).toHaveValue("1");
  });
});
