import { test, expect, type Page } from '@playwright/test';
import { CHANNELS } from '../lib/channels';
import type { ChannelConfig, ChannelStatus } from '../lib/types';
import { updateChannelResult } from '../lib/results-store';

const FORM_DATA = {
  nominal: '100000',
  name: 'Test User',
  phone: '081234567890',
  email: 'test@example.com',
};

const BAZNAS_URL = 'https://demo-bayarzakat.baznas.or.id/zakat';

async function fillAndSubmitForm(page: Page): Promise<void> {
  await page.goto(BAZNAS_URL);

  await page.locator('#nominal').fill(FORM_DATA.nominal);

  // Nama donatur mungkin muncul setelah nominal diisi
  await page.locator('#name').waitFor({ timeout: 8000 });
  await page.locator('#name').fill(FORM_DATA.name);
  await page.locator('#handphone').fill(FORM_DATA.phone);
  await page.locator('#email').fill(FORM_DATA.email);
  await page.locator('#cookies').check({ force: true });
  await page.locator('#next-button').click();

  // Tunggu daftar payment channel muncul
  await page.locator('.trpayment').first().waitFor({ timeout: 10000 });
}

async function testChannel(
  page: Page,
  channel: ChannelConfig,
): Promise<{ status: ChannelStatus; latency: string }> {
  const start = Date.now();

  try {
    await page.locator(`#${channel.id}`).click();

    switch (channel.type) {
      case 'redirect': {
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 10000 }),
          page.locator('#pay-button').click(),
        ]);
        await popup.waitForLoadState('domcontentloaded');
        const url = popup.url();
        const passed = url.includes(channel.target);
        await popup.close();
        return { status: passed ? 'operational' : 'down', latency: `${Date.now() - start}ms` };
      }

      case 'iframe': {
        await page.locator('#pay-button').click();
        await expect(page.locator(`#${channel.target}`)).toBeVisible({ timeout: 15000 });
        return { status: 'operational', latency: `${Date.now() - start}ms` };
      }

      case 'modal': {
        await page.locator('#pay-button').click();
        // Bootstrap modal menggunakan display:block tapi offsetParent=null karena backdrop,
        // sehingga toBeVisible() gagal. Cek style.display langsung sebagai gantinya.
        await page.waitForFunction(
          (id) => {
            const els = document.querySelectorAll(`#${id}`);
            return Array.from(els).some(
              (el) => (el as HTMLElement).style.display === 'block',
            );
          },
          channel.target,
          { timeout: 10000 },
        );
        return { status: 'operational', latency: `${Date.now() - start}ms` };
      }

      case 'form': {
        await page.locator('#pay-button').click();
        await expect(page.locator(`form[action*="${channel.target}"]`)).toBeVisible({ timeout: 10000 });
        return { status: 'operational', latency: `${Date.now() - start}ms` };
      }

      default:
        return { status: 'down', latency: '-' };
    }
  } catch {
    const elapsed = Date.now() - start;
    const status: ChannelStatus = elapsed > 8000 ? 'issue' : 'down';
    return { status, latency: `${elapsed}ms` };
  }
}

for (const channel of CHANNELS) {
  test(`[${channel.category.toUpperCase()}] ${channel.name}`, async ({ page }) => {
    console.log(`Testing: ${channel.name} (${channel.type})`);

    await fillAndSubmitForm(page);

    const { status, latency } = await testChannel(page, channel);

    const uptimeMap: Record<ChannelStatus, string> = {
      operational: '100%',
      issue: '50%',
      down: '0%',
      pending: '-',
    };

    updateChannelResult({
      id: channel.id,
      name: channel.name,
      category: channel.category,
      status,
      latency,
      uptime: uptimeMap[status],
      checkedAt: new Date().toISOString(),
    });

    console.log(`Result: ${channel.name} → ${status} (${latency})`);
  });
}
