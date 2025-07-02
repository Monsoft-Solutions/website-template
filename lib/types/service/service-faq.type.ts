import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceFaqs } from "@/lib/db/schema/service-faq.table";

/**
 * Type definitions for the service FAQs table
 */
export type ServiceFaq = InferSelectModel<typeof serviceFaqs>;
export type NewServiceFaq = InferInsertModel<typeof serviceFaqs>;
