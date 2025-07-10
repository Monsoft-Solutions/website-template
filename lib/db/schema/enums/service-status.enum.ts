import { pgEnum } from "drizzle-orm/pg-core";

export const serviceStatusEnum = pgEnum("service_status", [
  "draft",
  "published",
  "archived",
]);
