import { test, expect, type Page } from '@playwright/test';

// Turnstile se reemplaza por un stub: el spec no depende de la red ni de Cloudflare.
const TURNSTILE_STUB = `
  window.turnstile = {
    render: function (el, opts) { setTimeout(function () { opts.callback('test-token'); }, 0); return 'w1'; },
    reset: function () {}
  };
`;

async function stubTurnstile(page: Page): Promise<void> {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: TURNSTILE_STUB }),
  );
}

async function fillValid(page: Page): Promise<void> {
  const section = page.locator('#s8-siguiente-paso');
  await section.locator('input[name="name"]').fill('Ana Pérez');
  await section.locator('input[name="email"]').fill('ana@example.com');
  await section.locator('textarea[name="message"]').fill('Quiero hablar de un programa de innovación.');
}

const LOCALES = [
  { name: 'es', path: '/', send: 'Enviar mensaje', sent: 'Mensaje enviado' },
  { name: 'en', path: '/en/', send: 'Send message', sent: 'Message sent' },
];

for (const locale of LOCALES) {
  test.describe(`contacto S8 (${locale.name})`, () => {
    test('muestra Agendar, correo, WhatsApp y LinkedIn sin pasos', async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator('#s8-siguiente-paso');
      await expect(section.locator('a[href^="https://calendar.notion.so/meet/diegomaurymx"]')).toBeVisible();
      await expect(section.locator('.contact-row__value', { hasText: 'dm@diegomaury.mx' })).toBeVisible();
      await expect(section.locator('a[href^="https://wa.me/"]')).toBeVisible();
      await expect(section.locator('a[href^="https://www.linkedin.com/in/diegomaury"]')).toBeVisible();
      await expect(section.locator('.cta-step')).toHaveCount(0);
    });

    test('el número de WhatsApp no aparece como texto visible', async ({ page }) => {
      await page.goto(locale.path);
      const href = await page.locator('#s8-siguiente-paso a[href^="https://wa.me/"]').getAttribute('href');
      const number = /wa\.me\/(\d+)/.exec(href ?? '')?.[1] ?? '';
      expect(number).not.toBe('');
      const visibleText = await page.locator('#s8-siguiente-paso').innerText();
      expect(visibleText).not.toContain(number);
    });

    test('enviar vacío muestra errores por campo y no hace ninguna petición', async ({ page }) => {
      const requests: string[] = [];
      page.on('request', (request) => { if (request.url().includes('/api/contact')) requests.push(request.url()); });
      await page.goto(locale.path);
      const section = page.locator('#s8-siguiente-paso');
      await section.getByRole('button', { name: locale.send }).click();
      await expect(section.locator('[data-error-for="name"]')).toBeVisible();
      await expect(section.locator('[data-error-for="email"]')).toBeVisible();
      await expect(section.locator('[data-error-for="message"]')).toBeVisible();
      await expect(section.locator('input[name="name"]')).toBeFocused();
      expect(requests).toHaveLength(0);
    });

    test('envío exitoso reemplaza el formulario por la confirmación y empuja el evento', async ({ page }) => {
      await stubTurnstile(page);
      await page.route('**/api/contact', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
      );
      await page.goto(locale.path);
      await fillValid(page);
      const section = page.locator('#s8-siguiente-paso');
      await section.getByRole('button', { name: locale.send }).click();
      await expect(section.locator('[data-contact-success]')).toBeVisible();
      await expect(section.locator('[data-contact-success]')).toContainText(locale.sent);
      await expect(section.locator('[data-contact-form]')).toBeHidden();
      const events = await page.evaluate(() => (window as unknown as { dataLayer: { event?: string }[] }).dataLayer);
      expect(events.some((entry) => entry.event === 'contact_form_submit')).toBe(true);
    });

    test('fallo del servidor muestra el error con el correo directo y conserva lo escrito', async ({ page }) => {
      await stubTurnstile(page);
      await page.route('**/api/contact', (route) =>
        route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'send_failed' }) }),
      );
      await page.goto(locale.path);
      await fillValid(page);
      const section = page.locator('#s8-siguiente-paso');
      await section.getByRole('button', { name: locale.send }).click();
      await expect(section.locator('[data-contact-error]')).toBeVisible();
      await expect(section.locator('[data-contact-error] a[href="mailto:dm@diegomaury.mx"]')).toBeVisible();
      await expect(section.locator('input[name="name"]')).toHaveValue('Ana Pérez');
      await expect(section.locator('[data-contact-form]')).toBeVisible();
    });

    test('el honeypot viaja vacío en un envío normal', async ({ page }) => {
      await stubTurnstile(page);
      let sent: Record<string, unknown> = {};
      await page.route('**/api/contact', (route) => {
        sent = route.request().postDataJSON() as Record<string, unknown>;
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
      });
      await page.goto(locale.path);
      await fillValid(page);
      await page.locator('#s8-siguiente-paso').getByRole('button', { name: locale.send }).click();
      await expect(page.locator('#s8-siguiente-paso [data-contact-success]')).toBeVisible();
      expect(sent.website).toBe('');
      expect(sent.turnstileToken).toBe('test-token');
    });
  });
}

test('móvil: el panel (agendar y formulario) va antes que los canales directos', async ({ page }) => {
  await page.goto('/');
  const width = page.viewportSize()?.width ?? 1440;
  const panel = await page.locator('#s8-siguiente-paso .contact-panel').boundingBox();
  const direct = await page.locator('#s8-siguiente-paso .contact-direct').boundingBox();
  expect(panel).not.toBeNull();
  expect(direct).not.toBeNull();
  if (width <= 900) {
    expect(panel!.y).toBeLessThan(direct!.y);
  } else {
    expect(panel!.x).toBeGreaterThan(direct!.x);
  }
});

test('sin desborde horizontal en la sección de contacto', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => {
    const el = document.querySelector('#s8-siguiente-paso');
    return el ? el.scrollWidth - el.clientWidth : -1;
  });
  expect(overflow).toBeLessThanOrEqual(0);
});

test('el primer foco tras el titular es Agendar, no Copiar (orden de DOM = orden visual en móvil)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const h = document.querySelector<HTMLElement>('#s8-siguiente-paso .contact-h');
    h?.setAttribute('tabindex', '-1');
    h?.focus();
  });
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const el = document.activeElement as HTMLAnchorElement | null;
    return { href: el?.getAttribute('href') ?? '', copy: el?.hasAttribute('data-copy-email') ?? false };
  });
  expect(focused.copy).toBe(false);
  expect(focused.href).toContain('calendar.notion.so');
});
