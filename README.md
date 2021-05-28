# TypeORM bug

A simple repository to reproduce theses errors:

- [`PostgresDriver.enableExtensions` is runned on slave connection · Issue #7691 · typeorm/typeorm](https://github.com/typeorm/typeorm/issues/7691)
- [⚠Caching won't work with replication enabled · Issue #5919 · typeorm/typeorm](https://github.com/typeorm/typeorm/issues/5919)

## Run

```sh
git clone https://github.com/madeindjs/typeorm_bug
cd typeorm_bug
docker-compose up
```
