#!/bin/bash
# tunnel.sh

if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

docker run cloudflare/cloudflared:latest tunnel --no-autoupdate --url http://localhost:4000