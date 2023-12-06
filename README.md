# sf-chipps-package

[![NPM](https://img.shields.io/npm/v/sf-chipps-package.svg?label=sf-chipps-package)](https://www.npmjs.com/package/sf-chipps-package) [![Downloads/week](https://img.shields.io/npm/dw/sf-chipps-package.svg)](https://npmjs.org/package/sf-chipps-package) [![Known Vulnerabilities](https://snyk.io/test/github/ClayChipps/sf-chipps-package/badge.svg)](https://snyk.io/test/github/ClayChipps/sf-chipps-package) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/salesforcecli/sf-chipps-package/main/LICENSE.txt)

## Install

```bash
sf plugins install sf-chipps-package
```

## Issues

Please report any issues at https://github.com/ClayChipps/sf-chipps-package/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:ClayChipps/sf-chipps-package

# Install the dependencies and compile
yarn && yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev hello world
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins link .
# To verify
sf plugins
```

## Commands

<!-- commands -->

- [`sf hello world`](#sf-hello-world)

## `sf hello world`

Say hello either to the world or someone you know.

```
USAGE
  $ sf hello world [--json] [-n <value>]

FLAGS
  -n, --name=<value>  [default: World] The name of the person you'd like to say hello to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Say hello either to the world or someone you know.

  Say hello either to the world or someone you know.

EXAMPLES
  Say hello to the world:

    $ sf hello world

  Say hello to someone you know:

    $ sf hello world --name Astro
```

<!-- commandsstop -->
