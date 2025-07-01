#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../client/src/pages');

function walk(dir, baseRoute = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue; // skip legacy/hidden
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes = routes.concat(walk(fullPath, path.join(baseRoute, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.page.tsx')) {
      let route = path.join(baseRoute, entry.name.replace(/\.page\.tsx$/, ''));
      route = route.replace(/\\/g, '/'); // Windows compatibility
      if (route.endsWith('/index')) route = route.slice(0, -6);
      if (!route.startsWith('/')) route = '/' + route;
      routes.push(route);
    }
  }
  return routes;
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error('Pages directory not found:', PAGES_DIR);
    process.exit(1);
  }
  const routes = walk(PAGES_DIR);
  if (routes.length === 0) {
    console.error('No routes found.');
    process.exit(1);
  }
  console.log('Discovered routes:');
  for (const route of routes) {
    console.log(route);
  }
}

main(); 