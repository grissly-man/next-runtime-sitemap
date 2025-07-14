#!/usr/bin/env node

const assert = require("assert");
const path = require("path");
const { readFile } = require("fs/promises");
const puppeteer = require("puppeteer");

function normalizeTimeStamps(xml) {
  return xml.replace(/<lastmod>.*?<\/lastmod>/g, "");
}

let browser;

async function getBrowser() {
  browser = await puppeteer.launch();
}

async function closeBrowser() {
  await browser.close();
}

async function test() {
  // generate dynamic routes
  const results = await Promise.all([
    browser.newPage().then((p) => p.goto("http://localhost:3000/herm-dawg")),
    browser
      .newPage()
      .then((p) => p.goto("http://localhost:3000/squirms-mcgerms")),
    browser.newPage().then((p) => p.goto("http://localhost:3000/dont-find-me")), // dont index 404s
  ]);

  const snapshotPromise = readFile(
    path.join(__dirname, "snapshot/sitemap.xml"),
  );
  const sitemapResponse = await fetch(
    "http://localhost:3000/sitemaps/sitemap.xml",
  );
  const [actual, expected] = await Promise.all([
    sitemapResponse.text(),
    snapshotPromise,
  ]);

  assert.equal(
    normalizeTimeStamps(actual.toString()),
    normalizeTimeStamps(expected.toString()),
  );
}

async function runTest() {
  await getBrowser();
  await test();
}

runTest().finally(closeBrowser);
