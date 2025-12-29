#!/bin/bash

# Kill any processes on common dev ports
echo "Killing running servers..."
lsof -ti:3000,3001,3002,5173,5174,8080 2>/dev/null | xargs kill -9 2>/dev/null

# Clear Next.js cache
echo "Clearing cache..."
rm -rf .next

# Start dev server on port 3000
echo "Starting dev server on port 3000..."
npm run dev -- -p 3000
