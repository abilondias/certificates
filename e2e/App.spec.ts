import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/")
})

test.describe("Select field", () => {
  test("has request type options", async ({ page }) => {
    const requestTypeSelect = await page.getByLabel("Request Type")
    await expect(await requestTypeSelect.inputValue()).toBe("default")

    await requestTypeSelect.selectOption("upload")
    await expect(await requestTypeSelect.inputValue()).toBe("upload")
  })

  test("changes image field based on request type", async ({ page }) => {
    await page.getByLabel("Request Type").selectOption("upload")

    await expect(page.getByLabel("Image File")).toBeVisible()
    await expect(page.getByLabel("Image URL")).not.toBeVisible()
    await expect(page.getByLabel("Image File")).toHaveAttribute("type", "file")

    await page.getByLabel("Request Type").selectOption("default")

    await expect(page.getByLabel("Image URL")).toBeVisible()
    await expect(page.getByLabel("Image File")).not.toBeVisible()
    await expect(page.getByLabel("Image URL")).toHaveAttribute("type", "url")
  })
})

test.describe("Form validations", () => {
  const requiredFieldMessages = new Set([
    "Subject is required",
    "Student Name is required",
    "Date is required",
    "Signature Name is required",
    "Image URL is required",
  ])

  const invalidFieldMessages = new Set([
    "Subject requires at least 3, and at most 20 characters",
    "Student Name requires at least 3, and at most 24 characters",
    "Date provided is invalid",
    "Signature Name requires at least 3, and at most 46 characters",
    "Image URL must be a valid image URL",
  ])

  test("Show API validation errors for submitting an empty form", async ({ page }) => {
    await page.getByRole("button", { name: "Generate" }).click()

    await expect(await page.getByTestId("error-container")).toBeVisible()

    const errors = await page
      .getByTestId("error-messages")
      .evaluateAll((items) => items.map((item) => item.textContent))
    const errorsMatch = errors.every((err) => {
      if (!err || err === "") {
        return false
      }
      return requiredFieldMessages.has(err)
    })
    await expect(errorsMatch).toBeTruthy()
  })

  const invalidCertificate = {
    subject: "aa",
    studentName: "bb",
    signatureName: "cc",
    imageUrl: "dd",
    date: "ee",
  }

  test("Show API validation errors for invalid fields", async ({ page }) => {
    await page.getByLabel("Request Type").selectOption("default")

    // prevent HTML validation
    await page.locator("form").evaluate((form) => form.setAttribute("novalidate", "true"))
    await page.getByRole("textbox", { name: "Date" }).evaluate((el) => {
      el.setAttribute("type", "text")
    })

    await page.getByRole("textbox", { name: "Subject" }).fill(invalidCertificate.subject)
    await page.getByRole("textbox", { name: "Student Name" }).fill(invalidCertificate.studentName)
    await page.getByRole("textbox", { name: "Signature Name" }).fill(invalidCertificate.signatureName)
    await page.getByRole("textbox", { name: "Image URL" }).fill(invalidCertificate.imageUrl)
    await page.getByRole("textbox", { name: "Date" }).fill(invalidCertificate.date)

    await page.getByRole("button", { name: "Generate" }).click()

    await expect(await page.getByTestId("error-container")).toBeVisible()

    const errors = await page
      .getByTestId("error-messages")
      .evaluateAll((items) => items.map((item) => item.textContent))

    const errorsMatch = errors.every((err) => {
      if (!err || err === "") {
        return false
      }
      return invalidFieldMessages.has(err)
    })
    await expect(errorsMatch).toBeTruthy()
  })
})
