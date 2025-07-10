import z from "zod";

export const serviceStatusSchema = z.enum(["draft", "published", "archived"]);

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
