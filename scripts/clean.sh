#!/bin/bash

set -e

echo "🧹 Cleaning React Native project..."

# Kill Metro
echo "➡️ Killing Metro bundler..."
pkill -f "metro" || true

# Watchman
if command -v watchman >/dev/null 2>&1; then
  echo "➡️ Clearing Watchman..."
  watchman watch-del-all || true
fi

# Remove node modules
echo "➡️ Removing node_modules..."
rm -rf node_modules

# Remove lockfile caches (optional)
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf pnpm-lock.yaml

# Metro cache
echo "➡️ Removing Metro cache..."
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# Android
echo "➡️ Cleaning Android..."
rm -rf android/.gradle
rm -rf android/build
rm -rf android/app/build
rm -rf android/.cxx
rm -rf android/app/.cxx

# iOS
echo "➡️ Cleaning iOS..."
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# DerivedData
echo "➡️ Cleaning Xcode DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData

echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. npm install  (or yarn / pnpm)"
echo "2. cd ios && pod install"