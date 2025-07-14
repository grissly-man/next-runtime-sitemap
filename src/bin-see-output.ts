#! /usr/bin/env node

import { introspectFiles } from "./lib/introspect-files";

async function binSeeOutput() {
  const result = await introspectFiles();
  console.error(result);
}

binSeeOutput().then();
