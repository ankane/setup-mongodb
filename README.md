# setup-mongodb

The missing action for MongoDB :tada:

- Faster and simpler than containers
- Works on Linux, Mac, and Windows
- Supports different versions

[![Build Status](https://github.com/ankane/setup-mongodb/workflows/build/badge.svg?branch=v1)](https://github.com/ankane/setup-mongodb/actions)

## Getting Started

Add it as a step to your workflow

```yml
    - uses: ankane/setup-mongodb@v1
```

## Versions

Specify a version (defaults to the latest)

```yml
    steps:
    - uses: ankane/setup-mongodb@v1
      with:
        mongodb-version: 4.4
```

Currently supports

Version | `4.4` | `4.2` | `4.0`
--- | --- | --- | ---
`ubuntu-20.04` | ✓ | |
`ubuntu-18.04` | ✓ | ✓ | ✓
`macos-11.0` | ✓ | ✓ | ✓
`macos-10.15` | ✓ | ✓ | ✓
`windows-2019` | ✓ | |
`windows-2016` | ✓ | |

Test against multiple versions

```yml
    strategy:
      matrix:
        mongodb-version: [4.4, 4.2, 4.0]
    steps:
    - uses: ankane/setup-mongodb@v1
      with:
        mongodb-version: ${{ matrix.mongodb-version }}
```

## Extra Steps

Run queries

```yml
    - run: mongo --eval "db.version()"
```

## Related Actions

- [setup-postgres](https://github.com/ankane/setup-postgres)
- [setup-mysql](https://github.com/ankane/setup-mysql)
- [setup-mariadb](https://github.com/ankane/setup-mariadb)
- [setup-elasticsearch](https://github.com/ankane/setup-elasticsearch)
- [setup-sqlserver](https://github.com/ankane/setup-sqlserver)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/setup-mongodb/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/setup-mongodb/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features
