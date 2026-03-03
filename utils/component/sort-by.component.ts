import { expect, Page } from "@playwright/test";

export class SortBy {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Sorts products by price using the UI, verifies the resulting URL,
     * checks that the corresponding sort radio button is marked as selected,
     * and then validates that the product prices are actually sorted correctly.
     *
     * @param priceSort - The sorting option to apply.
     *                    "Price: High -> Low" sorts descending,
     *                    "Price: Low -> High" sorts ascending.
     */
    async sortPrice(priceSort: "Price: High -> Low" | "Price: Low -> High") {
        const priceSortUrl = priceSort === "Price: High -> Low" ? "price_desc" : "price_asc";
        const priceSortElement = this.page.getByText(priceSort)

        await priceSortElement.click()
        await expect(this.page).toHaveURL(`?sortBy=${priceSortUrl}`);
        await expect(this.page.getByLabel(priceSort)).toHaveAttribute("aria-checked", "true")
        await expect(this.page.getByLabel(priceSort)).toHaveAttribute("data-state", "checked")

        await this.verifyPriceSort(priceSort)
    }

    private async verifyPriceSort(priceSort: "Price: High -> Low" | "Price: Low -> High") {
        const allPrice = await this.page.getByTestId("price").allInnerTexts()
        const allPriceNumber: number[] = allPrice.map(price =>
            Number(price.replace(/[$,]/g, "")))
        const sortedAllPriceNumber = [...allPriceNumber].sort((a, b) =>
            priceSort === "Price: Low -> High" ? a - b : b - a
        );

        expect(allPriceNumber).toEqual(sortedAllPriceNumber);
    }
}