# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2020-02-22

### Added

- Support for firmware 2008 binmaps (Valetudo RE 0.9.0)
- Unit tests for checking compatibility with different firmware versions

## [2.0.1] - 2019-12-28

### Fixed

- error handling on image processing

## [2.0.0] - 2019-11-08

### Changed

- valetudo-map-png node automatically converts binary map data, it is no longer necessary to use a parse-binmap node before.
- valetudo-parse-binmap node outputs the map data object directly instead of a JSON string.
- Implemented [Node-RED 1.0 send/done API](https://nodered.org/blog/2019/09/20/node-done).

## [1.2.0] - 2019-11-07

### Changed

- Code cleanup, update dependencies and documentation

## [1.1.0] - 2019-11-06

### Added

- valetudo-parse-binmap node to support [Valetudo RE](https://github.com/rand256/valetudo).

## [1.0.0] - 2019-06-13

### Added

- valetudo-map-png node to convert [Valetudo](https://github.com/Hypfer/Valetudo) map_data (JSON string) to a png image.
