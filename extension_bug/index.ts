import {
  Column,
  createConnection,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({type: "text"})
  name: string | undefined;

  @Generated("uuid")
  @Column({type: "uuid"})
  uuid: string | undefined;
}

async function main() {
  const connection = await createConnection({
    type: "postgres",
    synchronize: true,
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
  // ERROR:
  // postgres-slave_1  | 2021-05-28 10:13:15.614 UTC [33] ERROR:  cannot execute CREATE EXTENSION in a read-only transaction
  // postgres-slave_1  | 2021-05-28 10:13:15.614 UTC [33] STATEMENT:  CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

  const user = new User();
  user.name = " toto";

  await connection.manager.save(user);

  await connection.close();
}

main().catch(console.error);
