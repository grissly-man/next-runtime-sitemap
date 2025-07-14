#!/usr/bin/env node

const assert = require("assert");
const path = require("path");
const { readFile } = require("fs/promises");

function normalizeTimeStamps(xml) {
  return xml.replace(/<lastmod>.*?<\/lastmod>/g, "");
}

async function test() {
  // generate dynamic routes
  await Promise.all([
    fetch("http://localhost:3000/dynamic/abc/def"),
    fetch("http://localhost:3000/dynamic/ghi/jkl"),
    fetch("http://localhost:3000/dynamic/notfound/notfound"),
  ]);

  const snapshotPromise = readFile(
    path.join(__dirname, "snapshot/sitemap.xml"),
  );
  const sitemapResponse = await fetch(
    "http://localhost:3000/sitemaps/sitemap.xml",
  );
  const [actual, expected] = await Promise.all([
    snapshotPromise,
    sitemapResponse.text(),
  ]);

  assert.equal(
    normalizeTimeStamps(actual.toString()),
    normalizeTimeStamps(expected.toString()),
  );
}

test();
