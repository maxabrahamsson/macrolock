# MacroLock

MacroLock is a utility tool that helps you detect changes in a directory and execute a script if changes are detected. It does this by generating a checksum for the directory and comparing it with a previously stored checksum. If the checksums do not match, it means there have been changes in the directory, and MacroLock will execute the provided script.

## Installation

You can install MacroLock via npm:

```bash
npm install macrolock
```

Or via yarn:

```bash
yarn add macrolock
```

## Usage

MacroLock is used from the command line and takes three arguments:

1. The path to the directory you want to monitor.
2. The path to the lock file where the checksum will be stored.
3. The script you want to execute if changes are detected.

Here's an example of how you can use MacroLock:

```json
"scripts": {
  "start": "npm run watch && tauri dev",
  "ifDif:buildjs": "npm run macrolock ./js ./locks/js_code.lock 'npm run js:build'",
  "ifDif:buildcomponents": "npm run macrolock ./src/components ./locks/components.lock 'npm run generate-components'",
  "watch:components": "chokidar './src/components/' -c 'npm run ifDif:buildcomponents'",
  "watch:js": "chokidar './js/' -c 'npm run ifDif:buildjs'",
  "watch": "run-p watch:*"
}
```

In this example, we're using [chokidar](https://www.npmjs.com/package/chokidar) to watch for changes in our directories. When chokidar detects a change, it runs our `ifDif` scripts which use MacroLock to check if there have been any substantial changes in our directories (i.e., changes that affect the checksum). If there have been, MacroLock executes the provided scripts (`js:build`and`generate-components`).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)`
