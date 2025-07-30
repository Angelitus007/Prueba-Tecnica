import { test, expect } from '@playwright/test';
import { Hero } from '../src/app/models/hero';

// Para ejecutarlos: npm run e2e

test.describe('Page Home - Tests E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test.skip('Debería poder buscar héroes por nombre correctamente', async ({ page }) => {
    // GIVEN
    const searchInput = page.locator('c-form-search input');
    const heroName = 'Superman';

    // WHEN
    await searchInput.fill(heroName);

    // THEN
    const heroCard = page.locator(`text=${heroName}`);
    await expect(heroCard).toBeVisible();
  });

  test('Debería mostrar un mensaje cuando no se encuentran héroes', async ({ page }) => {
    // GIVEN
    const searchInput = page.locator('c-form-search input');
    const nonExistentHeroName = 'NonExistentHero';

    // WHEN
    await searchInput.fill(nonExistentHeroName);

    // THEN
    const noHeroesMessage = page.locator('text=No hay héroes disponibles en este momento.');
    await expect(noHeroesMessage).toBeVisible();
  });

  test('Debería poder crear un nuevo héroe correctamente', async ({ page }) => {
    // GIVEN
    const createHeroButton = page.locator('c-create-button button');
    const hero: Omit<Hero, 'id' | 'imageURL'> = {
      name: 'Supermansito',
      superpower: 'Volar',
      description: 'Un héroe que puede volar y tiene una fuerza increíble.',
      city: 'Metropolis',
    };

    // WHEN
    await createHeroButton.click();

    const dialogHeroCreation = page.locator('c-dialog');
    await expect(dialogHeroCreation).toBeVisible();

    for (const [key, value] of Object.entries(hero)) {
      const input = dialogHeroCreation.locator(`input[formControlName="${key}"], textarea[formControlName="${key}"]`);
      await input.fill(value);
    }

    const checkbox = dialogHeroCreation.locator('input[formControlName="terms"]');
    await checkbox.check();

    const photoInput = dialogHeroCreation.locator('input[formControlName="photo"]');
    await photoInput.setInputFiles('../../Prueba Tecnica/Server/assets/spiderman.jpg');

    const createButton = dialogHeroCreation.locator('button[type="submit"]');
    await createButton.click();

    // THEN
    const successMessage = page.locator('text=Héroe creado con éxito');
    await expect(successMessage).toBeVisible();
  });

  test('Debería poder eliminar un héroe correctamente', async ({ page }) => {
    // GIVEN
    const heroListSection = page.locator('section-list-heros');
    await expect(heroListSection).toBeVisible();

    const heroCard = heroListSection.locator('c-hero-card').first();
    await expect(heroCard).toBeVisible();

    const deleteButton = heroCard.locator('button.hero-card__b-eliminar');
    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    const confirmButton = page.locator('c-dialog button:has-text("Si, eliminar")');
    await confirmButton.click();

    // THEN
    const successMessage = page.locator('text=Este héroe se ha eliminado');
    await expect(successMessage).toBeVisible();
  });

  test('Debería poder editar un héroe correctamente', async ({ page }) => {
    // GIVEN
    const heroListSection = page.locator('section-list-heros');
    await expect(heroListSection).toBeVisible();

    const heroCard = heroListSection.locator('c-hero-card').first();
    await expect(heroCard).toBeVisible();

    const editButton = heroCard.locator('button.hero-card__b-editar');
    await expect(editButton).toBeVisible();

    // WHEN
    await editButton.click();

    const dialogHeroEdit = page.locator('c-dialog');
    await expect(dialogHeroEdit).toBeVisible();

    const heroNameInput = dialogHeroEdit.locator('input[formControlName="name"]');
    await heroNameInput.fill('Héroe Editado');

    const checkbox = dialogHeroEdit.locator('input[formControlName="terms"]');
    await checkbox.check();

    const createButton = dialogHeroEdit.locator('button[type="submit"]');
    await createButton.click();

    // THEN
    const successMessage = page.locator('text=Héroe modificado con éxito');
    await expect(successMessage).toBeVisible();

  });

  // Estos 3 tests los he generado interacturando directamente con la página, usando el generador de tests de Playwright.
  // El comando es: npx playwright codegen http://localhost:4200 -->
  test.skip('Debería alternar entre "Ver más" y "Ver menos"', async ({ page }) => {

    await page.getByRole('button', { name: 'Ver más' }).click();
    await page.getByRole('button', { name: 'Ver más' }).click();
    await page.getByRole('button', { name: 'Ver menos' }).click();
    await page.getByRole('button', { name: 'Ver menos' }).click();
  });

  test('Debería poder navegar a la página de Terms a través de crear héroe', async ({ page }) => {

    await page.getByRole('button', { name: 'Add Icon Crear nuevo héroe' }).click();

    const pagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Términos y condiciones' }).click();

    const page1 = await pagePromise;
    await expect(page1).toHaveURL('http://localhost:4200/terms');

  });

  test('Debería poder navegar a la página de Terms a través de editar héroe', async ({ page }) => {

    await page.locator('c-hero-card').filter({ hasText: 'Batman Genio detective,' }).getByRole('button').first().click();

    const pagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Términos y condiciones' }).click();

    const page1 = await pagePromise;
    await expect(page1).toHaveURL('http://localhost:4200/terms');

  });

  // Pendiente el test de paginación:
  test.only('Debería poder navegar entre páginas de héroes', async ({ page }) => {
    await page.getByText('page 2').click();
    await page.getByText('page 3').click();
    await page.getByText('Previous page').click();
    await page.getByText('Next page').click();

    await page.getByText('page 4').click();
     await expect(page.locator('span[aria-disabled="true"]:has-text("Next page")')).toHaveAttribute('aria-disabled', 'true');

    await page.getByText('page 1').click();
    await expect(page.locator('span[aria-disabled="true"]:has-text("Previous page")')).toHaveAttribute('aria-disabled', 'true');
  });

});
