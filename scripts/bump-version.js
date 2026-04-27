#!/usr/bin/env node

/**
 * Bump version (x.x.x (n) -> x.x.(x+1) (1)).
 * Android versionCode is incremented; versionName is set to the new version.
 * Updates: package.json, android/app/build.gradle, ios/ColoryxRN.xcodeproj/project.pbxproj
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function incrementPatch(version) {
  const parts = version.split(".");
  if (parts.length < 3) return version;
  const patch = parseInt(parts[2], 10) || 0;
  parts[2] = String(patch + 1);
  return parts.join(".");
}

function main() {
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const currentVersion = pkg.version || "1.0.0";
  const newVersion = incrementPatch(currentVersion);

  // 1. package.json (version)
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("package.json: version", currentVersion, "->", newVersion);

  // 2. android/app/build.gradle (versionCode += 1, versionName = newVersion)
  const buildGradlePath = path.join(root, "android", "app", "build.gradle");
  let gradle = fs.readFileSync(buildGradlePath, "utf8");
  const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
  const currentVersionCode = versionCodeMatch ? parseInt(versionCodeMatch[1], 10) : 1;
  const newVersionCode = currentVersionCode + 1;
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(buildGradlePath, gradle);
  console.log("android/app/build.gradle: versionName ->", newVersion, ", versionCode ->", newVersionCode);

  // 3. ios/ColoryxRN.xcodeproj/project.pbxproj (CURRENT_PROJECT_VERSION = 1, MARKETING_VERSION = newVersion)
  const pbxPath = path.join(root, "ios", "ColoryxRN.xcodeproj", "project.pbxproj");
  let pbx = fs.readFileSync(pbxPath, "utf8");
  pbx = pbx.replace(/CURRENT_PROJECT_VERSION = \d+;/g, "CURRENT_PROJECT_VERSION = 1;");
  pbx = pbx.replace(/MARKETING_VERSION = [\d.]+;/g, `MARKETING_VERSION = ${newVersion};`);
  fs.writeFileSync(pbxPath, pbx);
  console.log("ios/ColoryxRN.xcodeproj/project.pbxproj: MARKETING_VERSION ->", newVersion, ", CURRENT_PROJECT_VERSION -> 1");

  console.log("\nDone. Version is now", newVersion, "(build 1).");
}

main();
