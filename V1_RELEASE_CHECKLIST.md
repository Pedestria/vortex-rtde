# Vortex RTDE v1.0 Release Checklist (Core + LivePush, No Addons)

Scope: release-ready baseline for the core bundler and LivePush only. Addon APIs and addon compatibility are explicitly out of scope for this milestone.

## 1. Product Definition and Scope Lock

- [ ] Freeze v1.0 scope and publish a short "included vs excluded" matrix.
- [ ] Define supported targets for v1.0: app mode, library mode, LivePush mode.
- [ ] Define supported syntax/features explicitly (ESM, CJS, dynamic import, CSS, static assets).
- [ ] Define Node support policy (minimum version + tested LTS versions).
- [ ] Define platform support policy (macOS, Linux, Windows).

## 2. Config and CLI Stability

- [ ] Finalize one canonical config schema with stable field names.
- [ ] Keep compatibility layer for legacy config fields, with explicit deprecation warnings.
- [ ] Add strict startup validation with actionable error messages for invalid config.
- [ ] Make CLI flags deterministic and documented with examples.
- [ ] Ensure CLI exit codes are reliable (`0` success, non-zero on failure).
- [ ] Add `--help` output validation in tests.

## 3. Bundler Correctness (Core)

- [ ] Validate ESM import/export transforms across default, named, namespace, and mixed cases.
- [ ] Validate CJS interop behavior (`require`, `module.exports`, `exports.*`) across app and library mode.
- [ ] Validate dynamic import and chunk/planet generation behavior.
- [ ] Validate asset handling for configured extensions (path resolution, output pathing, encoding behavior).
- [ ] Validate CSS handling path in core mode (without addon pipeline).
- [ ] Validate sourcemap output and sourceURL behavior in development mode.
- [ ] Ensure deterministic build outputs for unchanged inputs.
- [ ] Ensure circular dependency handling behavior is intentional, configurable, and documented.

## 4. LivePush Reliability

- [ ] File watcher correctness for add/change/delete/rename events.
- [ ] Robust websocket lifecycle: connect, reconnect, and stale-session recovery.
- [ ] Ensure update payloads are valid and apply cleanly in client runtime.
- [ ] Add debounce/batching for rapid file changes.
- [ ] Preserve last-known-good runtime state when compile fails.
- [ ] Show compile errors clearly in browser with a predictable overlay/console format.
- [ ] Define and implement fallback policy from hot update to full reload.
- [ ] Validate long-running stability of watch server (memory growth, socket cleanup).

## 5. Performance and Resource Targets

- [ ] Baseline cold build time on reference projects.
- [ ] Baseline incremental rebuild and LivePush latency.
- [ ] Set v1.0 performance targets and document pass/fail thresholds.
- [ ] Ensure no unbounded queue growth under sustained file changes.
- [ ] Add profiling notes and bottleneck remediation tasks for top hotspots.

## 6. Error Handling and Diagnostics

- [ ] Replace uncaught runtime exceptions in normal flows with typed Vortex errors.
- [ ] Normalize error format for CLI and LivePush server logs.
- [ ] Add error codes (or stable error labels) for common failure classes.
- [ ] Add verbose/debug mode for troubleshooting.
- [ ] Ensure stack traces are shown only when useful and intentionally enabled.

## 7. Compatibility and Runtime Hardening

- [ ] Verify operation on Node LTS versions selected for support.
- [ ] Verify operation on macOS, Linux, and Windows path semantics.
- [ ] Remove runtime dependencies known to be incompatible with current Node support policy.
- [ ] Ensure startup behavior is deterministic regardless of current working directory assumptions.
- [ ] Validate behavior with spaces and mixed separators in file paths.

## 8. Automated Testing

- [ ] Unit tests for config normalization and validation.
- [ ] Unit tests for dependency resolution and graph generation.
- [ ] Unit tests for ESM/CJS transform edge cases.
- [ ] Integration tests for app-mode build.
- [ ] Integration tests for library-mode build.
- [ ] Integration tests for LivePush watch/update/reload behavior.
- [ ] Regression tests for currently known runtime failures.
- [ ] Snapshot or golden-file tests for representative bundle outputs.
- [ ] Add CI matrix for supported Node versions and OSes.

## 9. Documentation and Developer Experience

- [ ] Publish v1.0 docs for quickstart, configuration, CLI, and LivePush lifecycle.
- [ ] Add migration guide from beta config conventions to v1.0 schema.
- [ ] Add troubleshooting guide with known error messages and fixes.
- [ ] Document feature limitations and intentional non-goals for v1.0.
- [ ] Provide minimal reproducible examples for app mode, library mode, and LivePush.

## 10. Release Engineering

- [ ] Define release branch strategy and versioning rules.
- [ ] Add pre-release checklist gate in CI (tests, build, artifact sanity).
- [ ] Verify packaged artifacts contain only intended files.
- [ ] Validate fresh-install workflow from published package in a clean project.
- [ ] Publish release notes template with breaking changes, fixes, and known issues.
- [ ] Tag release and archive benchmark/test evidence for v1.0 signoff.

## 11. v1.0 Exit Criteria (Go/No-Go)

- [ ] All P0 correctness and reliability issues closed.
- [ ] CI green for supported Node + OS matrix.
- [ ] No known crash-on-start or crash-on-build issues in core workflows.
- [ ] LivePush stable under a defined soak test window.
- [ ] Documentation published and reviewed.
- [ ] Release signoff completed by maintainers.

