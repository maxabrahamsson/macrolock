#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function getChecksum(filename) {
  const hash = crypto.createHash("sha256");
  const data = fs.readFileSync(filename);
  hash.update(data);
  return hash.digest("hex");
}

function getDirectoryChecksum(directory) {
  const entries = fs.readdirSync(directory);
  const files = entries.filter((entry) =>
    fs.statSync(path.join(directory, entry)).isFile()
  );
  const hashes = files.map((file) => getChecksum(path.join(directory, file)));
  hashes.sort(); // ensure consistent order

  const hash = crypto.createHash("sha256");
  hash.update(hashes.join());

  return hash.digest("hex");
}

function hasChanged(directory, lockFilePath) {
  const newChecksum = getDirectoryChecksum(directory);

  if (!fs.existsSync(lockFilePath)) {
    // If lock file doesn't exist, assume changes
    fs.writeFileSync(lockFilePath, newChecksum);
    return true;
  }

  const oldChecksum = fs.readFileSync(lockFilePath, "utf8");

  if (newChecksum !== oldChecksum) {
    // Update lock file with new checksum
    fs.writeFileSync(lockFilePath, newChecksum);
    return true;
  } else {
    return false;
  }
}

// Get directory and lock file path from command line arguments
const directory = process.argv[2];
const lockFilePath = process.argv[3];
const script = process.argv[4];

if (hasChanged(directory, lockFilePath)) {
  console.log("Changes were detected.");
  // Run the provided script
  exec(script, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return;
    }

    console.log(stdout);
  });
} else {
  console.log(
    "No changes were detected. Remove lock file if you wish to reset."
  );
}
