import { DataSource } from "typeorm";

let dbConfig = {
  synchronize: false,
  migrations: ["migrations/*.js"],
};

switch (process.env.NODE_ENV) {
  case "development":
    Object.assign(dbConfig, {
      type: "sqlite",
      database: "db.sqlite",
      entities: ["**/*.entity.js"],
    });
    break;
  case "test":
    Object.assign(dbConfig, {
      type: "sqlite",
      database: "test.sqlite",
      entities: ["**/*.entity.ts"],
    });
    break;
  case "production":
    Object.assign(dbConfig, {
      type: "postgres", // Assume production uses PostgreSQL
      url: process.env.DATABASE_URL, // Use DATABASE_URL for production
      entities: ["dist/**/*.entity.js"], // Use compiled JS files
      migrations: ["dist/migrations/*.js"], // Use compiled migrations
    });
    break;
  default:
    throw new Error("Unknown environment");
}

// Export the DataSource instance
export const AppDataSource = new DataSource({
  ...dbConfig, // Spread the config dynamically built
});
