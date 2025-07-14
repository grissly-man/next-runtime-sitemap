# next-runtime-sitemap

**Generate sitemaps at runtime for Next.js App Router projects, based on your actual deployed filesystem.**

[![npm version](https://img.shields.io/npm/v/next-runtime-sitemap.svg)](https://www.npmjs.com/package/next-runtime-sitemap)  
[![GitHub issues](https://img.shields.io/github/issues/grissly-man/next-runtime-sitemap.svg)](https://github.com/grissly-man/next-runtime-sitemap/issues)

---

## ✨ Features

- 🧠 **Runtime sitemap generation** — no need for build-time crawling or prerendering.
- 📂 **Filesystem-aware** — inspects your deployed `.next` directory to find generated pages.
- 🚀 **Optimized for App Router** — supports Next.js 13+ using the `app/` directory.
- 🔁 **Works with revalidation** — dynamic routes are supported via `force-static` + `revalidate`.

---

## 🚧 Requirements

> ⚠️ **Not compatible with serverless platforms like Vercel**  
> Serverless functions run in isolated environments and only have access to files that are statically imported.  
> Since this package inspects the deployed filesystem at runtime, it must run in a persistent environment (e.g., custom Node.js server, Docker, or self-hosted deployment).

- ✅ Next.js **App Router** only (`app/` directory)
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

export const GET = generateAppRouterSitemap();
```

This will generate sitemaps at runtime based on the pages that have actually been built and stored on the server.

---

## 🌍 Configuration

### Base URL

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

You’ll get a standard XML sitemap that reflects your currently built static and dynamic (with revalidation) pages.

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
