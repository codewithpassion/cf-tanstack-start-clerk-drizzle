#!/bin/bash
# startup-claude.sh

if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

bun install
if [ ! -f .env ]; then
  echo ".env file not found! Generating .env..."
  ./generate-env.sh
fi
