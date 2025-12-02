# Shell Scripts

Development and deployment shell scripts for the Awesome Weather Application.

This directory contains POSIX-compatible helper scripts for build, deployment, and process management workflows used in both local development and CI/CD pipelines (e.g., Jenkins).

---

## Overview

These scripts automate common development tasks including building the application, deploying to a production-like environment, managing server processes, and running tests. They are designed to be used in POSIX-compatible shell environments (sh/bash) and integrate with npm for Node.js operations.

---

## Script Inventory

| Script | Purpose |
|--------|---------|
| `deliver-for-development.sh` | Runs `npm run build` with xtrace (`set -x`) for development builds with verbose output |
| `deploy-for-production.sh` | Builds the app, installs the `serve` package, and launches a static server on port 5000 with `.pidfile` management |
| `kill.sh` | Terminates server processes using the PID stored in `.pidfile` and runs `pkill npm` |
| `test.sh` | Demonstration/testing script with example npm commands (mostly commented out) |

---

## Prerequisites

Before running any scripts, ensure the following requirements are met:

- **Node.js and npm**: Must be installed and available on your system PATH
- **npm dependencies**: Install project dependencies first with:
  ```bash
  npm i --legacy-peer-deps
  ```
- **POSIX-compatible shell**: Scripts require a POSIX shell environment (sh, bash, zsh, etc.)
- **Write access**: Scripts need write access to the workspace directory for `.pidfile` creation
- **Port availability**: Port 5000 must be available for the production server (`deploy-for-production.sh`)

---

## Usage Examples

### Development Build

Run a development build with verbose trace output:

```bash
./scripts/deliver-for-development.sh
```

This executes `npm run build` with shell tracing enabled, showing each command as it runs.

### Production Deployment

Build and deploy the application for production preview:

```bash
./scripts/deploy-for-production.sh
```

This script will:
1. Build the application using `npm run build`
2. Install the `serve` package for static file serving
3. Start a server on port 5000 in the background
4. Save the server process ID to `.pidfile` for later termination

After running, visit [http://localhost:5000](http://localhost:5000) to view the application.

### Stop the Server

Terminate the running server process:

```bash
./scripts/kill.sh
```

This reads the process ID from `.pidfile` and terminates the server, plus runs `pkill npm` for cleanup.

### Run Tests

Execute the test script:

```bash
./scripts/test.sh
```

> **Note**: This script currently contains mostly commented-out commands and is primarily for demonstration purposes.

---

## Exit Codes

| Exit Code | Meaning |
|-----------|---------|
| 0 | Success (or forced exit in `kill.sh`) |
| Non-zero | Inherited from underlying npm commands on failure |

**Important behaviors:**
- Scripts inherit exit codes from npm commands they execute
- `kill.sh` explicitly exits with code 0 regardless of kill command success
- Scripts do **NOT** use `set -e` (errexit), so command failures may not cause immediate script termination

---

## Notes and Warnings

### Shell Behavior

- **No errexit**: Scripts do NOT use `set -e`, meaning command failures may not abort script execution. This could result in partial completion states.
- **Xtrace enabled**: The `set -x` option is enabled in scripts, which prints each command before execution. Be aware this may expose environment variables or sensitive data in logs.

### Process Management

- **PID file**: The `.pidfile` is created by `deploy-for-production.sh` in the workspace root and contains the process ID of the background server. The `kill.sh` script reads this file to terminate the process.
- **pkill npm**: The `kill.sh` script also runs `pkill npm` which may terminate other npm processes running on the system.

### Production Server

- **serve package**: The `serve` package used for production preview is a lightweight static file server. It is suitable for previewing production builds but is not hardened for production hosting. For actual production deployment, consider using a proper web server (nginx, Apache) or cloud hosting platforms.
- **Background process**: The server runs as a background process (`&`) to prevent blocking CI/CD pipelines.

### CI/CD Considerations

- Review scripts for robustness before using in production CI environments
- Consider adding `set -e` for stricter error handling in automated pipelines
- Ensure `.pidfile` is properly cleaned up between builds
- Scripts include verbose echo statements designed for Jenkins console output

---

## File Details

### deliver-for-development.sh

Simple development build script that wraps `npm run build` with trace output:

```bash
#!/usr/bin/env sh
set -x
npm run build
set +x
```

### deploy-for-production.sh

Full production deployment workflow:
1. Builds the React application for production
2. Installs the `serve` npm package
3. Starts a static server on port 5000
4. Writes the server PID to `.pidfile` for process management

### kill.sh

Process termination script:
1. Reads PID from `.pidfile`
2. Kills the process with that PID
3. Runs `pkill npm` for additional cleanup
4. Exits with code 0

### test.sh

Demonstration script with commented-out test commands. Contains examples for:
- Installing cross-env as a dev dependency
- Running Jest tests via `npm test`

---

## Related Documentation

- [Back to Main README](../README.md) - Project overview, features, and technologies
- This module is part of the **Awesome Weather Application** project

---

*For more information about the project structure and other modules, see the [main README](../README.md).*
