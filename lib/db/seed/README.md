# Database Seeding System

A modular, auto-discovering database seeding system that follows TypeScript best practices.

## Structure

```
lib/db/seed/
├── types/
│   └── seed-config.type.ts     # Type definitions for seed operations
├── operations/
│   ├── 01-categories.seed.ts   # Category seeding
│   ├── 02-authors.seed.ts      # Author seeding
│   ├── 03-tags.seed.ts         # Tag seeding
│   ├── 04-blog-posts.seed.ts   # Blog post seeding (depends on categories & authors)
│   ├── 05-blog-post-tags.seed.ts # Post-tag relationships (depends on posts & tags)
│   └── index.ts                # Barrel export for all operations
├── orchestrator.ts             # Discovers and runs all seeds in order
├── index.ts                    # Main entry point
└── README.md                   # This file
```

## Features

- **Auto-Discovery**: Automatically discovers new seed files when added to `operations/index.ts`
- **Ordered Execution**: Seeds run in numerical order based on filename prefix
- **Dependency Management**: Handles dependencies between entities automatically
- **Error Handling**: Stops execution on failure and provides detailed error reporting
- **Performance Tracking**: Tracks execution time for each operation
- **Type Safety**: Fully typed with TypeScript following project guidelines

## Usage

### Running Seeds

```bash
# Run all seeds
npm run db:seed

# Or directly with tsx
npx tsx lib/db/seed/index.ts
```

### Adding New Seeds

1. Create a new seed file in `operations/` with a numeric prefix:

   ```
   06-new-entity.seed.ts
   ```

2. Implement the `SeedOperation` interface:

   ```typescript
   import { db } from "../../index";
   import { newEntity, type NewEntity } from "../../schema/index";
   import type { SeedOperation } from "../types/seed-config.type";

   const execute = async (): Promise<number> => {
     // Seeding logic here
     const result = await db.insert(newEntity).values(data).returning();
     return result.length;
   };

   const clear = async (): Promise<void> => {
     await db.delete(newEntity);
   };

   export const newEntitySeed: SeedOperation = {
     config: {
       name: "new-entity",
       order: 6, // Higher numbers run later
       description: "Seed new entity data",
     },
     execute,
     clear,
   };
   ```

3. Export the new seed in `operations/index.ts`:

   ```typescript
   export { newEntitySeed } from "./06-new-entity.seed";
   ```

4. The orchestrator will automatically discover and run it in the correct order!

## Seed Execution Order

Current seeds run in this order:

1. **Categories** (independent)
2. **Authors** (independent)
3. **Tags** (independent)
4. **Blog Posts** (depends on categories and authors)
5. **Blog Post Tags** (depends on blog posts and tags)

## Error Handling

- If any seed fails, execution stops immediately
- Detailed error messages are provided
- Failed operations are clearly identified in the summary
- Use the `clear` function to clean up data for retries

## Best Practices

1. **Dependencies**: Ensure dependent seeds have higher order numbers
2. **Data Validation**: Validate that dependent data exists before creating relationships
3. **Idempotent Operations**: Seeds should handle re-running gracefully
4. **Clear Function**: Always implement the clear function for cleanup
5. **Error Messages**: Provide descriptive error messages for debugging

## Type Safety

All seed operations use proper TypeScript types:

- `SeedOperation`: Interface for seed implementations
- `SeedConfig`: Configuration for individual seeds
- `SeedResult`: Results of seed execution
- Schema types: Use generated types from your database schema
