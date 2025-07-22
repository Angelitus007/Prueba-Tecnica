import { test, expect } from '@playwright/test';
import { Hero } from '../src/app/models/hero';

test.describe('Page Home - Tests E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('Debería poder buscar héroes por nombre correctamente', async ({ page }) => {
    // GIVEN
    const searchInput = page.locator('section-search-bar input');
    const heroName = 'Superman';

    // WHEN
    await searchInput.fill(heroName);

    // THEN
    const heroCard = page.locator(`text=${heroName}`);
    await expect(heroCard).toBeVisible();
  });

  test('Debería mostrar un mensaje cuando no se encuentran héroes', async ({ page }) => {
    // GIVEN
    const searchInput = page.locator('section-search-bar input');
    const nonExistentHeroName = 'NonExistentHero';
    const msgNoHeroes = 'No hay héroes disponibles en este momento.';

    // WHEN
    await searchInput.fill(nonExistentHeroName);

    // THEN
    const noHeroesMessage = page.locator('text=No hay héroes disponibles en este momento.');
    await expect(noHeroesMessage).toBeVisible();
  });

  test.skip('Debería poder crear un nuevo héroe', async ({ page }) => {
    // GIVEN
    const createHeroButton = page.locator('section-create-hero button');
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

    // No se me abre la imagen --->
    const photoInput = dialogHeroCreation.locator('input[formControlName="photo"]');
    await photoInput.setInputFiles('./Server/assets/superman.jpg');

    const createButton = dialogHeroCreation.locator('button[type="submit"]');
    await createButton.click();

    // THEN
    const successMessage = page.locator('text=Héroe creado con éxito');
    await expect(successMessage).toBeVisible();
  });

  test.only('Debería eliminar un héroe correctamente', async ({ page }) => {
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

  test('Debería alternar entre "Ver más" y "Ver menos"', async ({ page }) => {
    // GIVEN
  });

});
