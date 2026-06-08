#!/usr/bin/env node

/**
 * DreamScape AI — Environment Verification Script
 * Run: node scripts/verify-env.js
 * 
 * Checks all required environment variables exist and warns about optional ones.
 */

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const OPTIONAL = [
  { key: 'SUPABASE_SERVICE_ROLE_KEY', note: 'Needed for admin DB operations' },
  { key: 'STRIPE_SECRET_KEY', note: 'Needed for payment processing' },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', note: 'Needed for Stripe frontend' },
  { key: 'STRIPE_WEBHOOK_SECRET', note: 'Needed for Stripe webhook verification' },
  { key: 'STRIPE_PRICE_MONTHLY', note: 'Monthly subscription price ID' },
  { key: 'STRIPE_PRICE_YEARLY', note: 'Yearly subscription price ID' },
  { key: 'OPENAI_API_KEY', note: 'Needed for AI dream reconstruction' },
  { key: 'ANTHROPIC_API_KEY', note: 'Needed for AI dream interpretation' },
  { key: 'NEXT_PUBLIC_SITE_URL', note: 'Your production URL' },
];

const STYLES = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

let hasErrors = false;
let hasWarnings = false;

function check(label, condition, note) {
  if (condition) {
    console.log(`  ${STYLES.green}✓${STYLES.reset} ${label}`);
  } else {
    console.log(`  ${STYLES.red}✗${STYLES.reset} ${STYLES.bold}${label}${STYLES.reset} ${STYLES.dim}— ${note}${STYLES.reset}`);
    if (label.startsWith('REQUIRED')) {
      hasErrors = true;
    } else {
      hasWarnings = true;
    }
  }
}

console.log(`\n${STYLES.bold}${STYLES.blue}DreamScape AI — Environment Verification${STYLES.reset}\n`);
console.log(`${STYLES.dim}Node: ${process.version} | Platform: ${process.platform} | CWD: ${process.cwd()}${STYLES.reset}\n`);

// Check each required var
console.log(`${STYLES.bold}Required Variables:${STYLES.reset}`);
for (const key of REQUIRED) {
  check(`REQUIRED: ${key}`, !!process.env[key], 'This variable is required for the app to function');
}

// Check each optional var
console.log(`\n${STYLES.bold}Optional Variables:${STYLES.reset}`);
for (const { key, note } of OPTIONAL) {
  check(`OPTIONAL: ${key}`, !!process.env[key], note);
}

// Summary
console.log(`\n${STYLES.bold}Summary:${STYLES.reset}`);
if (hasErrors) {
  console.log(`  ${STYLES.red}${STYLES.bold}✗ Some required variables are missing.${STYLES.reset}`);
  console.log(`  ${STYLES.dim}Copy .env.example to .env.local and fill in the values.${STYLES.reset}`);
  process.exit(1);
} else if (hasWarnings) {
  console.log(`  ${STYLES.yellow}${STYLES.bold}⚠ All required vars present. Some optional vars missing.${STYLES.reset}`);
  console.log(`  ${STYLES.dim}Check SUPABASE_SETUP.md for how to get the optional values.${STYLES.reset}`);
  process.exit(0);
} else {
  console.log(`  ${STYLES.green}${STYLES.bold}✓ All variables configured. Ready to go!${STYLES.reset}`);
  process.exit(0);
}