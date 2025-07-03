import db from "#db/client";
import { faker } from "@faker-js/faker";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const testUser = await createUser("notarealuser", "fakepass");

  for(let i = 0; i < 3; i++){
    await createTask(faker.word.verb(), faker.datatype.boolean(), testUser.id);
  };
}
