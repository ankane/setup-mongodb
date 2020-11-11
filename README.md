# setup-mongodb

The missing action for MongoDB - no need to use containers :tada:

Supports:

- Linux and Mac (`ubuntu-20.04`, `ubuntu-18.04`, `ubuntu-16.04`, and `macos-10.15`)
- Many versions (`4.4`, `4.2`, `4.0`, `3.6`, `3.4`, and `3.2`)

[![Build Status](https://github.com/ankane/setup-mongodb/workflows/build/badge.svg?branch=v1)](https://github.com/ankane/setup-mongodb/actions)

## Getting Started

Add it as a step to your workflow

```yml
jobs:
  build:
    steps:
    - uses: ankane/setup-mongodb@v1
```

Specify a version (defaults to the latest if no version is specified)

```yml
jobs:
  build:
    steps:
    - uses: ankane/setup-mongodb@v1
      with:
        mongodb-version: 4.4
```

Test against multiple versions

```yml
jobs:
  build:
    strategy:
      matrix:
        mongodb-version: [4.4, 4.2, 4.0, 3.6, 3.4, 3.2]
    steps:
    - uses: ankane/setup-mongodb@v1
      with:
        mongodb-version: ${{ matrix.mongodb-version }}
```

## Related Actions

- [setup-postgres](https://github.com/ankane/setup-postgres)
- [setup-mysql](https://github.com/ankane/setup-mysql)
- [setup-mariadb](https://github.com/ankane/setup-mariadb)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/setup-mongodb/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/setup-mongodb/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features
