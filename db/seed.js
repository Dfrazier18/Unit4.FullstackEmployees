import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createEmployee } from "./queries/employees.js";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  // TODO
  for (let i = 0; i < 10; i++) {
    const employee = {
      name: faker.person.fullName(),
      birthday: faker.date.between({
        from: "1991-01-01T00:00:00.000Z",
        to: "2000-01-01T00:00:00.000Z",
      }),
      salary: faker.commerce.price({
        min: 100000,
        max: 200000,
        dec: 0,
      }),
    };
    await createEmployee(employee);
  }
}
