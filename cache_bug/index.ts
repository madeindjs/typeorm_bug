import {
  Column,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({type: "text"})
  name: string | undefined;
}

async function main() {
  const connection = await createConnection({
    type: "postgres",
    synchronize: true,
    cache: true,
    replication: {
      master: {
        database: "postgres",
        host: "postgres",
        username: "arousseau",
        password: "password",
        port: 5432,
      },
      slaves: [
        {
          database: "postgres",
          host: "postgres-slave",
          username: "arousseau",
          password: "password",
          port: 5432,
        },
      ],
    },
    entities: [User],
  });

  const user = new User();
  user.name = " toto";

  await connection.manager.save(user);

  await connection
    .createQueryBuilder(connection.createQueryRunner("slave"))
    .from(User, "u")
    .select("name")
    .cache(2000)
    .getMany();
  // QueryFailedError: cannot execute INSERT in a read-only transaction
  //     at new QueryFailedError (/usr/src/app/src/error/QueryFailedError.ts:9:9)
  //     at PostgresQueryRunner.<anonymous> (/usr/src/app/src/driver/postgres/PostgresQueryRunner.ts:228:19)
  //     at step (/usr/src/app/node_modules/tslib/tslib.js:143:27)
  //     at Object.throw (/usr/src/app/node_modules/tslib/tslib.js:124:57)
  //     at rejected (/usr/src/app/node_modules/tslib/tslib.js:115:69)
  //     at processTicksAndRejections (internal/process/task_queues.js:93:5) {
  //   length: 118,
  //   severity: 'ERROR',
  //   code: '25006',
  //   detail: undefined,
  //   hint: undefined,
  //   position: undefined,
  //   internalPosition: undefined,
  //   internalQuery: undefined,
  //   where: undefined,
  //   schema: undefined,
  //   table: undefined,
  //   column: undefined,
  //   dataType: undefined,
  //   constraint: undefined,
  //   file: 'utility.c',
  //   line: '246',
  //   routine: 'PreventCommandIfReadOnly',
  //   query: 'INSERT INTO "query-result-cache"("identifier", "query", "time", "duration", "result") VALUES (DEFAULT, $1, $2, $3, $4)',
  //   parameters: [
  //     'SELECT name FROM "user" "u" -- PARAMETERS: []',
  //     1622197257656,
  //     2000,
  //     '[{"name":" toto"},{"name":" toto"}]'
  //   ]
  // }

  await connection.close();
}

main().catch(console.error);
