# 🧪 Playwright Testing Documentation

## Dashboard Testing Bayar Zakat — BAZNAS

> Dokumen ini dibuat sebagai referensi lengkap untuk menuliskan ulang test suite menggunakan **Playwright** (menggantikan Cypress). Berisi daftar semua elemen UI, aksi yang tersedia, serta test case yang perlu di-cover.

---

## 📋 Daftar Isi

1. [Tech Stack & URL Target](#tech-stack--url-target)
2. [Struktur Project Playwright yang Disarankan](#struktur-project-playwright-yang-disarankan)
3. [URL & Page Inventory](#url--page-inventory)
4. [Elemen UI & Selectors](#elemen-ui--selectors)
   - [Header](#1-header)
   - [Internet Banner](#2-internet-banner)
   - [Stats Cards](#3-stats-cards)
   - [Dashboard Options (Reset Section)](#4-dashboard-options-reset-section)
   - [Channel Grid — Search Bar](#5-channel-grid--search-bar)
   - [Channel Card](#6-channel-card)
   - [Activity Log](#7-activity-log)
   - [Reset Dialog (Modal)](#8-reset-dialog-modal)
   - [Error State](#9-error-state)
   - [Loading State](#10-loading-state)
5. [Halaman Bayar Zakat (External)](#halaman-bayar-zakat-external)
6. [Test Cases](#test-cases)
7. [API Endpoints](#api-endpoints)
8. [Page Object Model (POM) — Contoh Struktur](#page-object-model-pom--contoh-struktur)
9. [Tips Playwright vs Cypress](#tips-playwright-vs-cypress)

---

## Tech Stack & URL Target

| Item               | Detail                            |
| ------------------ | --------------------------------- |
| Framework Frontend | Next.js (App Router)              |
| Bahasa             | TypeScript                        |
| URL Dashboard      | `http://localhost:3000` (dev)     |
| URL Bayar Zakat    | `https://baznas.go.id/bayarzakat` |
| Test Runner Baru   | Playwright                        |
| Test Runner Lama   | Cypress                           |

---

## Struktur Project Playwright yang Disarankan

```
playwright-project/
├── playwright.config.ts
├── tests/
│   ├── dashboard.spec.ts          # Test untuk halaman dashboard
│   └── bayar-zakat.spec.ts        # Test untuk alur bayar zakat
├── pages/                         # Page Object Models (POM)
│   ├── DashboardPage.ts
│   └── ZakatPage.ts
└── fixtures/
    └── channels.json              # Data payment channel (sama seperti src/config/channels.json)
```

---

## URL & Page Inventory

| Halaman     | URL                 | Keterangan                               |
| ----------- | ------------------- | ---------------------------------------- |
| Dashboard   | `/`                 | Halaman utama monitoring payment channel |
| Bayar Zakat | `/zakat` (external) | Form pembayaran zakat (di situs BAZNAS)  |

---

## Elemen UI & Selectors

### 1. Header

Komponen: `dashboard-web/src/components/dashboard/Header.tsx`
Lokasi: Sticky di bagian atas halaman (z-50).

| Elemen                                | Selector / Identifikasi                            | Aksi                                   |
| ------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| Logo BAZNAS                           | `img[alt="BAZNAS Logo"]`                           | `toBeVisible()`                        |
| Judul "Dashboard Testing Bayar Zakat" | `h1` yang berisi text "Dashboard Testing"          | `toHaveText()`                         |
| Status badge "System Operational"     | `text=System Operational`                          | `toBeVisible()` (hanya saat idle)      |
| Badge "Running Tests..."              | `text=Running Tests...`                            | `toBeVisible()` (hanya saat running)   |
| Progress bar                          | `.h-2.w-full.bg-slate-200` atau `role=progressbar` | `toBeVisible()` (hanya saat running)   |
| Badge "Check Completed"               | `text=Check Completed`                             | `toBeVisible()` (hanya saat completed) |
| Tombol "Run Testing Bayar Zakat"      | `button:has-text("Run Testing Bayar Zakat")`       | `click()`                              |
| Tombol "Running..."                   | `button:has-text("Running...")`                    | `toBeDisabled()`                       |

**State tombol:**

- `idle` → tombol aktif, teks "Run Testing Bayar Zakat"
- `running` → tombol disabled, teks "Running..."
- `completed` → tombol kembali aktif

---

### 2. Internet Banner

Komponen: `dashboard-web/src/components/dashboard/InternetBanner.tsx`
Muncul saat pertama kali halaman dimuat.

| Elemen           | Selector / Identifikasi                 | Aksi            |
| ---------------- | --------------------------------------- | --------------- |
| Banner container | `text=Pastikan Koneksi Internet Stabil` | `toBeVisible()` |
| Teks deskripsi   | `text=Setelah menjalankan test`         | `toBeVisible()` |
| Tombol tutup (X) | `button[aria-label="Tutup banner"]`     | `click()`       |

**Behavior:** Setelah tombol X diklik, banner harus menghilang dari DOM atau tidak terlihat.

---

### 3. Stats Cards

Komponen: `dashboard-web/src/components/dashboard/StatsCards.tsx`
Menampilkan 3 kartu statistik.

| Kartu              | Elemen               | Selector                                |
| ------------------ | -------------------- | --------------------------------------- |
| Test Results       | Judul                | `text=Test Results`                     |
| Test Results       | Angka Passed (hijau) | `.text-emerald-600.text-2xl`            |
| Test Results       | Angka Failed (merah) | `.text-rose-600.text-2xl`               |
| Monitored Channels | Judul                | `text=Monitored Channels`               |
| Monitored Channels | Angka total channel  | `.text-3xl.font-bold`                   |
| Last Checked       | Judul                | `text=Last Checked`                     |
| Last Checked       | Tanggal/waktu format | `.text-xl.font-bold` (dalam kartu ke-3) |

**Catatan:** Jika belum ada data testing, kartu "Last Checked" menampilkan teks `"Belum ada testing"`.

---

### 4. Dashboard Options (Reset Section)

Lokasi: Di bawah Stats Cards, sebelum Channel Grid.

| Elemen                    | Selector / Identifikasi               | Aksi            |
| ------------------------- | ------------------------------------- | --------------- |
| Label "Opsi Dashboard"    | `text=Opsi Dashboard`                 | `toBeVisible()` |
| Info "Terakhir direset"   | `text=Terakhir direset:`              | `toBeVisible()` |
| Tombol "Reset Semua Data" | `button:has-text("Reset Semua Data")` | `click()`       |

---

### 5. Channel Grid — Search Bar

Komponen: `dashboard-web/src/components/dashboard/ChannelGrid.tsx`

| Elemen                     | Selector / Identifikasi                          | Aksi            |
| -------------------------- | ------------------------------------------------ | --------------- |
| Judul "Payment Gateways"   | `h2:has-text("Payment Gateways")`                | `toBeVisible()` |
| Badge "Live Status"        | `text=Live Status`                               | `toBeVisible()` |
| Input pencarian            | `input[placeholder*="Cari payment"]`             | `fill('BSI')`   |
| Tombol clear (X) di search | `button` di dalam search (muncul saat ada value) | `click()`       |
| Empty state (no data)      | `text=Still waiting to get data...`              | `toBeVisible()` |
| Empty state (not found)    | `text=Channel tidak ditemukan`                   | `toBeVisible()` |
| Tombol "Reset Pencarian"   | `button:has-text("Reset Pencarian")`             | `click()`       |

---

### 6. Channel Card

Komponen: `dashboard-web/src/components/dashboard/ChannelCard.tsx`

Setiap kartu channel menampilkan informasi berikut:

| Elemen              | Selector / Identifikasi                          | Aksi                |
| ------------------- | ------------------------------------------------ | ------------------- |
| Badge tipe channel  | `.uppercase.text-\\[10px\\]` di dalam CardHeader | `toHaveText('va')`  |
| Status badge "PASS" | `text=Pass` (dalam `.bg-emerald-50`)             | `toBeVisible()`     |
| Status badge "SLOW" | `text=Slow` (dalam `.bg-amber-50`)               | `toBeVisible()`     |
| Status badge "FAIL" | `text=Fail` (dalam `.bg-rose-50`)                | `toBeVisible()`     |
| Nama channel        | `h3` di dalam card content (uppercase)           | `toHaveText('BSI')` |
| Latency             | Teks yang mengandung "ms" atau "-"               | `toBeVisible()`     |
| Uptime              | Teks yang mengandung "Uptime"                    | `toBeVisible()`     |
| Waktu dicek         | Teks yang mengandung "Dicek:"                    | `toBeVisible()`     |

**Selector channel card individual:**

```ts
// Menggunakan nama channel (misalnya BSI)
page.locator(".card", { hasText: "BSI" });

// Atau menggunakan grid item ke-N
page.locator(".grid > div").nth(0);
```

---

### 7. Activity Log

Komponen: `dashboard-web/src/components/dashboard/ActivityLog.tsx`
**Hanya muncul saat `workflowStatus === 'running'`.**

| Elemen                     | Selector / Identifikasi        | Aksi             |
| -------------------------- | ------------------------------ | ---------------- |
| Header "Live Activity Log" | `text=Live Activity Log`       | `toBeVisible()`  |
| Log entry pertama          | `text=Initializing Pipeline`   | `toBeVisible()`  |
| Log entry kedua            | `text=Installing Dependencies` | `toBeVisible()`  |
| Semua log entry            | `.font-mono .space-y-2 > div`  | `toHaveCount(n)` |

---

### 8. Reset Dialog (Modal)

Komponen: `dashboard-web/src/components/dashboard/ResetDialog.tsx`
Muncul setelah klik tombol "Reset Semua Data".

| Elemen                        | Selector / Identifikasi                 | Aksi             |
| ----------------------------- | --------------------------------------- | ---------------- |
| Dialog container              | `role=dialog`                           | `toBeVisible()`  |
| Judul dialog                  | `text=Reset Dashboard?`                 | `toBeVisible()`  |
| Deskripsi warning             | `text=Semua hasil testing akan dihapus` | `toBeVisible()`  |
| Ikon warning (AlertTriangle)  | `.bg-rose-100` icon container           | `toBeVisible()`  |
| Tombol "Batal"                | `button:has-text("Batal")`              | `click()`        |
| Tombol "Ya, Reset"            | `button:has-text("Ya, Reset")`          | `click()`        |
| Tombol "Mereset..." (loading) | `button:has-text("Mereset...")`         | `toBeDisabled()` |

---

### 9. Error State

Komponen: `dashboard-web/src/components/dashboard/ErrorState.tsx`
Muncul saat API gagal.

| Elemen       | Selector                                | Aksi            |
| ------------ | --------------------------------------- | --------------- |
| Pesan error  | Teks error dari API                     | `toBeVisible()` |
| Tombol retry | `button:has-text("Retry")` atau sejenis | `click()`       |

---

### 10. Loading State

Komponen: `dashboard-web/src/components/dashboard/LoadingState.tsx`
Muncul saat data pertama kali difetch.

| Elemen          | Selector                                | Aksi            |
| --------------- | --------------------------------------- | --------------- |
| Skeleton loader | `.animate-pulse` atau indikator loading | `toBeVisible()` |

---

## Halaman Bayar Zakat (External)

URL: `https://baznas.go.id/bayarzakat`
Ini adalah halaman eksternal di mana Cypress dulu melakukan pengujian payment channel. Rujukan dari `ZakatPage.ts` di Cypress.

### Input Fields

| Field         | Selector (ID) | Tipe     | Contoh Value         |
| ------------- | ------------- | -------- | -------------------- |
| Nominal Zakat | `#nominal`    | `number` | `100000`             |
| Nama Donatur  | `#name`       | `text`   | `"Test User"`        |
| No. Handphone | `#handphone`  | `text`   | `"081234567890"`     |
| Email         | `#email`      | `email`  | `"test@example.com"` |

### Checkbox & Tombol

| Elemen               | Selector       | Aksi      |
| -------------------- | -------------- | --------- |
| Setuju syarat & ket. | `#cookies`     | `check()` |
| Tombol Lanjutkan     | `#next-button` | `click()` |

### Payment Channel Selection

| Elemen                   | Selector                         | Aksi            |
| ------------------------ | -------------------------------- | --------------- |
| Daftar payment channels  | `.trpayment`                     | `toBeVisible()` |
| Channel spesifik (by ID) | `#[channel.id]` (contoh: `#bsi`) | `click()`       |
| Tombol Bayar             | `#pay-button`                    | `click()`       |

### Assertion Berdasarkan Tipe Channel

| Tipe Channel | Assertion                                                          |
| ------------ | ------------------------------------------------------------------ |
| `redirect`   | `page.waitForEvent('popup')` → URL popup contains `channel.target` |
| `iframe`     | `page.frameLocator('#snap-midtrans').first().toBeVisible()`        |
| `modal`      | `page.locator('#[channel.target]').toBeVisible()`                  |
| `form`       | `page.locator('form[action*="[channel.target]"]').toBeVisible()`   |

> ⚠️ **Perbedaan Cypress vs Playwright:** Untuk menangani `window.open`, Playwright menggunakan `page.waitForEvent('popup')` bukan `cy.stub(win, 'open')`.

---

## Test Cases

### TC-01: Dashboard — Halaman Berhasil Dimuat

**File:** `tests/dashboard.spec.ts`

```
GIVEN: User membuka URL dashboard (/)
WHEN:  Halaman selesai loading
THEN:  - Header terlihat (logo, judul, tombol run test)
       - Internet Banner terlihat
       - Stats Cards (Test Results, Monitored Channels, Last Checked) terlihat
       - Tombol "Reset Semua Data" terlihat
       - Section "Payment Gateways" terlihat
```

---

### TC-02: Dashboard — Menutup Internet Banner

```
GIVEN: Halaman baru saja dimuat (banner terlihat)
WHEN:  User klik tombol X (aria-label="Tutup banner")
THEN:  Banner menghilang dari halaman
```

---

### TC-03: Dashboard — Search Payment Channel

```
GIVEN: Data channel sudah tersedia di grid
WHEN:  User mengetikkan "BSI" di input pencarian
THEN:  - Hanya kartu dengan nama/tipe mengandung "BSI" yang tampil
       - Tombol clear (X) muncul di dalam search bar

WHEN:  User klik tombol clear (X)
THEN:  Semua channel kembali tampil, input kosong
```

---

### TC-04: Dashboard — Search Tidak Menemukan Hasil

```
GIVEN: Data channel sudah tersedia di grid
WHEN:  User mengetikkan kata yang tidak ada, misal "XXXXXX"
THEN:  - Pesan "Channel tidak ditemukan" muncul
       - Tombol "Reset Pencarian" muncul

WHEN:  User klik "Reset Pencarian"
THEN:  Semua channel kembali tampil, input pencarian kosong
```

---

### TC-05: Dashboard — Tombol Run Testing

```
GIVEN: workflowStatus adalah 'idle'
WHEN:  User klik tombol "Run Testing Bayar Zakat"
THEN:  - Tombol berubah menjadi disabled dengan teks "Running..."
       - Progress bar muncul di header
       - Activity Log muncul di bawah banner
       - API POST /api/trigger-test dipanggil
```

---

### TC-06: Dashboard — Activity Log Tampil Saat Running

```
GIVEN: Test sedang berjalan (workflowStatus === 'running')
THEN:  - Section "Live Activity Log" terlihat
       - Entri log pertama "Initializing Pipeline" terlihat
       - Log muncul secara bertahap sesuai waktu berjalan
```

---

### TC-07: Dashboard — Status Selesai (Completed)

```
GIVEN: Testing selesai (workflowStatus berubah ke 'completed')
THEN:  - Badge "Check Completed" muncul di header
       - Progress bar menampilkan 100%
       - Setelah 5 detik, status kembali ke 'idle'
       - Stats Cards diperbarui dengan data terbaru
```

---

### TC-08: Dashboard — Buka Reset Dialog

```
GIVEN: Halaman berhasil dimuat dan data tersedia
WHEN:  User klik tombol "Reset Semua Data"
THEN:  - Dialog modal muncul dengan judul "Reset Dashboard?"
       - Deskripsi warning tampil
       - Tombol "Batal" dan "Ya, Reset" tersedia
```

---

### TC-09: Dashboard — Cancel Reset Dialog

```
GIVEN: Reset Dialog sedang terbuka
WHEN:  User klik tombol "Batal"
THEN:  - Dialog menutup
       - Data dashboard tidak berubah
```

---

### TC-10: Dashboard — Konfirmasi Reset

```
GIVEN: Reset Dialog sedang terbuka
WHEN:  User klik tombol "Ya, Reset"
THEN:  - Tombol berubah menjadi "Mereset..." (disabled)
       - API POST /api/reset-status dipanggil
       - Setelah selesai, dialog menutup
       - Stats Cards kembali ke nilai awal (0/0)
```

---

### TC-11: Dashboard — Tampilkan Status Kanal (Pass/Slow/Fail)

```
GIVEN: Data channel berhasil dimuat
THEN:  Setiap ChannelCard menampilkan:
       - Badge tipe channel (va, e-wallet, dll)
       - StatusIcon sesuai status:
         * operational → badge "PASS" (hijau)
         * issue       → badge "SLOW" (kuning)
         * down        → badge "FAIL" (merah)
       - Nama channel (uppercase)
       - Informasi latency dan uptime
       - Waktu "Dicek:"
```

---

### TC-12: Dashboard — API Gagal (Error State)

```
GIVEN: API /api/status mengembalikan error (mock 500)
WHEN:  Halaman dimuat
THEN:  - ErrorState component tampil
       - Pesan error ditampilkan
       - Tombol retry tersedia

WHEN:  User klik retry
THEN:  Halaman mencoba fetch ulang
```

---

### TC-13: Bayar Zakat — Isi Form & Submit

**File:** `tests/bayar-zakat.spec.ts`

```
GIVEN: User membuka halaman /zakat (baznas.go.id/bayarzakat)
WHEN:  User mengisi:
       - Nominal: 100000
       - Nama: "Test User"
       - Handphone: "081234567890"
       - Email: "test@example.com"
       - Checkbox syarat: dicentang
AND:   User klik tombol #next-button
THEN:  Daftar payment channel (.trpayment) muncul
```

---

### TC-14: Bayar Zakat — Pilih Channel & Bayar (Redirect Type)

```
GIVEN: Daftar payment channel sudah tampil
WHEN:  User klik channel dengan tipe "redirect" (misal: Dana, GoPay)
AND:   User klik #pay-button
THEN:  - Halaman baru / popup terbuka
       - URL popup mengandung target URL channel tersebut
```

_Playwright approach:_

```ts
const [popup] = await Promise.all([
  page.waitForEvent("popup"),
  page.click("#pay-button"),
]);
await expect(popup).toHaveURL(/target-url-part/);
```

---

### TC-15: Bayar Zakat — Pilih Channel & Bayar (Iframe Type)

```
GIVEN: Daftar payment channel sudah tampil
WHEN:  User klik channel dengan tipe "iframe" (misal: Midtrans SNAP)
AND:   User klik #pay-button
THEN:  Iframe dengan ID #snap-midtrans muncul dan terlihat
```

---

### TC-16: Bayar Zakat — Semua Channel (Data-Driven)

```
Loop untuk setiap channel di channels.json:
  GIVEN: Halaman /zakat dibuka
  WHEN:  Form diisi lengkap dan disubmit
  AND:   Channel [channel.name] dipilih
  AND:   #pay-button diklik
  THEN:  Mekanisme pembayaran yang sesuai muncul
         (redirect → popup, iframe → snap-iframe, modal → modal, form → form)
```

---

## API Endpoints

| Method | Endpoint                | Fungsi                                |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/api/status`           | Mengambil data channel & summary      |
| GET    | `/api/check-run-status` | Cek apakah pipeline sedang running    |
| POST   | `/api/trigger-test`     | Memicu pipeline Cypress via Bitbucket |
| POST   | `/api/reset-status`     | Reset semua data channel ke awal      |

**Contoh mock API di Playwright:**

```ts
// Mock /api/status agar mengembalikan data dummy
await page.route("/api/status*", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      lastUpdated: new Date().toISOString(),
      lastReset: null,
      summary: { total: 3, passed: 2, failed: 1 },
      channels: [
        {
          id: 1,
          name: "BSI",
          type: "va",
          status: "operational",
          latency: "350ms",
          uptime: "99.5%",
        },
        {
          id: 2,
          name: "DANA",
          type: "e-wallet",
          status: "issue",
          latency: "890ms",
          uptime: "97%",
        },
        {
          id: 3,
          name: "OVO",
          type: "e-wallet",
          status: "down",
          latency: "-",
          uptime: "0%",
        },
      ],
    }),
  });
});
```

---

## Page Object Model (POM) — Contoh Struktur

### `pages/DashboardPage.ts`

```ts
import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly runTestButton: Locator;
  readonly resetButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly internetBannerCloseButton: Locator;
  readonly resetDialogConfirmButton: Locator;
  readonly resetDialogCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.runTestButton = page.locator(
      'button:has-text("Run Testing Bayar Zakat")',
    );
    this.resetButton = page.locator('button:has-text("Reset Semua Data")');
    this.searchInput = page.locator('input[placeholder*="Cari payment"]');
    this.clearSearchButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .nth(1); // X icon next to search
    this.internetBannerCloseButton = page.locator(
      'button[aria-label="Tutup banner"]',
    );
    this.resetDialogConfirmButton = page.locator(
      'button:has-text("Ya, Reset")',
    );
    this.resetDialogCancelButton = page.locator('button:has-text("Batal")');
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async closeBanner() {
    await this.internetBannerCloseButton.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async clickRunTest() {
    await this.runTestButton.click();
  }

  async openResetDialog() {
    await this.resetButton.click();
    await expect(this.page.locator("role=dialog")).toBeVisible();
  }

  async confirmReset() {
    await this.resetDialogConfirmButton.click();
  }

  async cancelReset() {
    await this.resetDialogCancelButton.click();
  }

  getChannelCard(channelName: string): Locator {
    return this.page
      .locator('.card, [class*="Card"]', { hasText: channelName.toUpperCase() })
      .first();
  }
}
```

---

### `pages/ZakatPage.ts`

```ts
import { Page, Locator, expect } from "@playwright/test";

export class ZakatPage {
  readonly page: Page;
  readonly nominalInput: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly termsCheckbox: Locator;
  readonly nextButton: Locator;
  readonly payButton: Locator;
  readonly paymentChannels: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nominalInput = page.locator("#nominal");
    this.nameInput = page.locator("#name");
    this.phoneInput = page.locator("#handphone");
    this.emailInput = page.locator("#email");
    this.termsCheckbox = page.locator("#cookies");
    this.nextButton = page.locator("#next-button");
    this.payButton = page.locator("#pay-button");
    this.paymentChannels = page.locator(".trpayment");
  }

  async goto() {
    await this.page.goto("https://baznas.go.id/bayarzakat");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async setNominal(amount: number) {
    await this.nominalInput.clear();
    await this.nominalInput.fill(String(amount));
  }

  async fillDonorDetails(name: string, phone: string, email: string) {
    await this.nameInput.waitFor({ timeout: 10000 });
    await this.nameInput.clear();
    await this.nameInput.fill(name);
    await this.phoneInput.clear();
    await this.phoneInput.fill(phone);
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async agreeToTerms() {
    await this.termsCheckbox.check({ force: true });
  }

  async submitForm() {
    await this.nextButton.click();
  }

  async selectChannel(channelId: string) {
    const selector = channelId.startsWith("#") ? channelId : `#${channelId}`;
    await expect(this.page.locator(selector)).toBeVisible();
    await this.page.locator(selector).click();
  }

  async clickPayAndWaitForPopup() {
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.payButton.click(),
    ]);
    return popup;
  }

  async clickPayButton() {
    await expect(this.payButton).toBeVisible();
    await this.payButton.click();
  }

  async assertIframeOpen(iframeId: string = "#snap-midtrans") {
    await expect(this.page.locator(iframeId)).toBeVisible({ timeout: 20000 });
  }

  async assertModalVisible(modalId: string) {
    const id = modalId.startsWith("#") ? modalId : `#${modalId}`;
    await expect(this.page.locator(id)).toBeVisible({ timeout: 10000 });
  }

  async assertFormVisible(actionUrlPart: string) {
    await expect(
      this.page.locator(`form[action*="${actionUrlPart}"]`),
    ).toBeVisible({ timeout: 10000 });
  }
}
```

---

## Tips Playwright vs Cypress

| Fitur                 | Cypress                           | Playwright                                             |
| --------------------- | --------------------------------- | ------------------------------------------------------ |
| Kunjungi URL          | `cy.visit('/zakat')`              | `await page.goto('/zakat')`                            |
| Get element           | `cy.get('#name')`                 | `page.locator('#name')`                                |
| Type / fill input     | `.type('hello')`                  | `.fill('hello')`                                       |
| Clear input           | `.clear()`                        | `.clear()`                                             |
| Klik elemen           | `.click()`                        | `.click()` (setelah await)                             |
| Check checkbox        | `.check({ force: true })`         | `.check({ force: true })`                              |
| Assert visible        | `.should('be.visible')`           | `expect(locator).toBeVisible()`                        |
| Assert text           | `.should('have.text', 'x')`       | `expect(locator).toHaveText('x')`                      |
| Assert disabled       | `.should('be.disabled')`          | `expect(locator).toBeDisabled()`                       |
| Stub window.open      | `cy.stub(win, 'open')`            | `await Promise.all([page.waitForEvent('popup'), ...])` |
| Assert popup URL      | `cy.get('@windowOpen').should(…)` | `expect(popup).toHaveURL(/pattern/)`                   |
| Intercept API         | `cy.intercept('GET', '/api/…')`   | `await page.route('/api/…', handler)`                  |
| Wait for network idle | `cy.wait('@alias')`               | `await page.waitForLoadState('networkidle')`           |
| Mock/stub response    | `cy.intercept(…).as('alias')`     | `page.route(…, route => route.fulfill({…}))`           |
| Timeout per-assertion | default 4s, configurable          | default 5s, configurable per `expect`                  |

---

_Dokumen ini di-generate otomatis berdasarkan analisis source code project. Sesuaikan selector jika ada perubahan pada komponen._
