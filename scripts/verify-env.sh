#!/bin/bash
# ===============================================================
# DreamScape AI — Environment Verification Script
# Checks all required env vars and validates their formats.
# Usage: bash scripts/verify-env.sh
# ===============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

check_var() {
  local name="$1"
  local value="${!name}"
  local label="$2"

  if [ -z "$value" ]; then
    echo -e "  ${RED}✗${NC} ${BOLD}$name${NC} ${DIM}— ${label}${NC}"
    FAIL=$((FAIL + 1))
  else
    echo -e "  ${GREEN}✓${NC} $name"
    PASS=$((PASS + 1))
  fi
}

validate_format() {
  local name="$1"
  local value="${!name}"
  local pattern="$2"
  local label="$3"

  if [ -z "$value" ]; then
    echo -e "  ${RED}✗${NC} ${BOLD}$name${NC} ${DIM}— ${label}${NC}"
    FAIL=$((FAIL + 1))
  elif [[ ! "$value" =~ $pattern ]]; then
    echo -e "  ${YELLOW}⚠${NC} ${BOLD}$name${NC} ${DIM}— Invalid format. ${label}${NC}"
    WARN=$((WARN + 1))
  else
    echo -e "  ${GREEN}✓${NC} $name"
    PASS=$((PASS + 1))
  fi
}

echo ""
echo -e "${BOLD}${BLUE}DreamScape AI — Environment Verification${NC}"
echo ""
echo -e "${DIM}Node: $(node --version) | Platform: $(uname -s) | CWD: $(pwd)${NC}"
echo ""

# ── Required Variables ──────────────────────────────────
echo -e "${BOLD}Required Variables:${NC}"
check_var "NEXT_PUBLIC_SUPABASE_URL" "Supabase project URL"
check_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase anonymous key"

# ── Supabase Validation ─────────────────────────────────
echo ""
echo -e "${BOLD}Supabase Validation:${NC}"
validate_format "NEXT_PUBLIC_SUPABASE_URL" "^https?://.*\.supabase\.co" "Must be a valid Supabase project URL (https://*.supabase.co)"

# ── Stripe Configuration ────────────────────────────────
echo ""
echo -e "${BOLD}Stripe Configuration:${NC}"
validate_format "STRIPE_SECRET_KEY" "^(sk_live_|sk_test_)" "Must start with sk_live_ or sk_test_"
validate_format "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "^(pk_live_|pk_test_)" "Must start with pk_live_ or pk_test_"
check_var "STRIPE_WEBHOOK_SECRET" "Stripe webhook signing secret"
check_var "STRIPE_PRICE_MONTHLY" "Monthly subscription price ID"
check_var "STRIPE_PRICE_YEARLY" "Yearly subscription price ID"

# ── AI Providers ────────────────────────────────────────
echo ""
echo -e "${BOLD}AI Providers:${NC}"
validate_format "OPENAI_API_KEY" "^sk-" "Must start with 'sk-'"
validate_format "ANTHROPIC_API_KEY" "^sk-ant-" "Must start with 'sk-ant-'"

# ── Site Configuration ──────────────────────────────────
echo ""
echo -e "${BOLD}Site Configuration:${NC}"
check_var "NEXT_PUBLIC_SITE_URL" "Production site URL"

# ── Summary ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}Summary:${NC}"
echo -e "  ${GREEN}✓${NC} $PASS configured"
if [ "$WARN" -gt 0 ]; then
  echo -e "  ${YELLOW}⚠${NC} $WARN format warnings"
fi
if [ "$FAIL" -gt 0 ]; then
  echo -e "  ${RED}✗${NC} $FAIL missing variables"
fi
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}Some required variables are missing.${NC}"
  echo -e "  ${DIM}Copy .env.example to .env.local and fill in the values.${NC}"
  echo ""
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo -e "  ${YELLOW}${BOLD}All required vars present. Some format warnings.${NC}"
  echo -e "  ${DIM}Check SUPABASE_SETUP.md for how to get the correct values.${NC}"
  echo ""
  exit 0
else
  echo -e "  ${GREEN}${BOLD}All variables configured and validated! Ready to go.${NC}"
  echo ""
  exit 0
fi