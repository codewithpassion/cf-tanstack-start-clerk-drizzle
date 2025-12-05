#!/bin/bash
# generate-env.sh

# Clear existing .env
> .env

# Export specific vars you need
echo "VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}" >> .env
echo "CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}" >> .env
echo "CLERK_SECRET_KEY=${CLERK_SECRET_KEY}" >> .env
echo "CLERK_JWT_ISSUER_DOMAIN=${CLERK_JWT_ISSUER_DOMAIN}" >> .env
