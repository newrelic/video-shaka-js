[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

# New Relic Shaka Tracker - Development Guide

New Relic video tracking for Shaka Player.

## Requirements

- Node.js (LTS version recommended)
- npm or yarn package manager

## Setup

Install dependencies:

```shell
$ npm install
```

## Build

For development build with source maps:

```shell
$ npm run build:dev
```

For production build (minified):

```shell
$ npm run build
```

Build output is located in the `dist` folder.

## Development Workflow

1. Make your changes to the source files in `src/`
2. Run `npm run build:dev` to build with source maps
3. Test your changes using the sample files in `samples/`
4. Run `npm test` to ensure all tests pass
5. Run `npm run build` for final production build

## Project Structure

```
src/
├── tracker.js           # Main tracker implementation
└── __test__/
    └── tracker.test.js  # Unit tests
samples/
├── dash.html           # Basic DASH streaming example
└── hls.html            # HLS streaming example
```

## Testing

### Running Tests

Run the test suite:

```shell
$ npm test
```

Run tests with coverage:

```shell
$ npm run test -- --coverage
```

### Manual Testing

Test your changes using the sample HTML files:

- `samples/dash.html` - Basic DASH streaming example
- `samples/hls.html` - HLS streaming example

To run samples locally, open the HTML files directly in your browser or use a local web server:

```shell
$ npx http-server -p 8080
```

Then open `http://localhost:8080/samples/` in your browser.

## Release Process

1. Create a feature branch for your changes
2. Make your changes and test thoroughly
3. Update the version in `package.json` following semver rules:
   - **Patch** (x.x.1): Bug fixes
   - **Minor** (x.1.0): New features (backward compatible)
   - **Major** (1.0.0): Breaking changes
4. Update [CHANGELOG.md](CHANGELOG.md) with your changes
5. Create a PR with your changes
6. Once approved and merged, create a GitHub release with a tag matching the version

## Code Style

- Use ES6+ syntax
- Follow existing code patterns in the project
- Add try-catch blocks for error handling
- Document new methods with JSDoc comments
- Keep production code free of console.log statements (except for debugging during development)

## Debugging

For development builds, source maps are included to help with debugging. You can add temporary console.log statements during development, but ensure they are removed before creating a production build.

## Contributing

See [README.md](README.md) for contribution guidelines.
