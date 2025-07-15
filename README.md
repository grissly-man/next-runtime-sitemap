# 🛰️ next-runtime-sitemap

**Generate sitemaps at runtime for Next.js projects, based on your actual deployed filesystem.**

[![npm version](https://img.shields.io/npm/v/next-runtime-sitemap.svg)](https://www.npmjs.com/package/next-runtime-sitemap)  
[![GitHub issues](https://img.shields.io/github/issues/grissly-man/next-runtime-sitemap.svg)](https://github.com/grissly-man/next-runtime-sitemap/issues)

---

## ✨ Features

- 🧠 **Runtime sitemap generation** — no need for build-time crawling or prerendering.
- 📂 **Filesystem-aware** — inspects your deployed `.next` directory to find generated pages.
- 🔁 **Works with revalidation** — dynamic routes are supported via `force-static` + `revalidate`.
- 🪶 **Now supports Pages Router** — your sitemap can now include pages from both `app/` and `pages/` directories.

---

## 🚧 Requirements

> ⚠️ **Not compatible with serverless platforms like Vercel**  
> Serverless functions run in isolated environments and only have access to files that are statically imported.  
> Since this package inspects the deployed filesystem at runtime, it must run in a persistent environment (e.g., custom Node.js server, Docker, or self-hosted deployment).

- ✅ Sitemap route must be hosted via the **App Router** (`app/` directory).
- ✅ Supports both App Router and Pages Router pages in the generated sitemap.
- ✅ You must enable `force-static` + `revalidate` on dynamic routes for them to persist to the filesystem.
- ✅ Static routes are automatically captured.
- ❌ Fully dynamic (e.g., `force-dynamic`) routes are **not** included—they don’t emit files.

---

## 🛠️ Installation

```bash
npm install next-runtime-sitemap
```

---

## 📦 Usage

Add a route file to your Next.js app at:

```
app/sitemaps/[sitemap]/route.ts
```

Inside that file:

```ts
import { generateAppRouterSitemap } from "next-runtime-sitemap/dist/app";

module.exports = generateAppRouterSitemap();
```

> 🔄 This route **must** live inside the App Router, but it can generate a sitemap that includes both App and Pages Router pages.

---

## 🌍 Configuration

### Base URL

### Internationalization (i18n)

If your project uses [Next.js internationalized routing](https://nextjs.org/docs/advanced-features/i18n-routing), the sitemap will now automatically include both:

- All localized routes (e.g., `mysite.com/en/about`)
- Their de-localized equivalents (e.g., `mysite.com/about`), mapped from the default locale

To enable this behavior, pass your default locale explicitly when generating the sitemap:

```ts
import { generateAppRouterSitemap } from "next-runtime-sitemap/dist/app";

module.exports = generateAppRouterSitemap({ defaultLocale: "en" });
```

You must provide a `SITEMAP_GEN_BASE_URL` environment variable.

It’s used to generate absolute URLs in your sitemap.

For example, in `.env.local`:

```
SITEMAP_GEN_BASE_URL=https://your-domain.com
```

This package uses [`dotenv-workflow`](https://www.npmjs.com/package/dotenv-workflow), so it will respect `.env`, `.env.local`, `.env.development`, etc.

---

## 🔗 Related

This package depends on [`next-dynamic-sitemap`](https://www.npmjs.com/package/next-dynamic-sitemap) internally for utility functions, but:

- `next-dynamic-sitemap` is for **build-time** sitemap generation.
- `next-runtime-sitemap` is for **runtime** sitemap generation.

Use the right one depending on your architecture.

---

## 📄 Example Output

Visit `/sitemaps/sitemap.xml` in your browser, or curl it:

```bash
curl https://your-domain.com/sitemaps/sitemap.xml
```

You’ll get a standard XML sitemap that reflects your currently built static and dynamic (with revalidation) pages—including those from the Pages Router.

---

## 🧪 Scripts

```bash
npm run build         # Compile TypeScript
npm test              # Run tests inside the /test directory
npm run format        # Format code with Prettier
npm run check-format  # Check code formatting
```

---

## 📘 License

[ISC License](./LICENSE)

---

## 🐛 Issues / Feedback

File issues or feature requests at:  
👉 [https://github.com/grissly-man/next-runtime-sitemap/issues](https://github.com/grissly-man/next-runtime-sitemap/issues)
