import { db } from './server/db';
import { taxForms, documents as documentsTable } from './shared/schema';
import { inArray } from 'drizzle-orm';

async function findOrphanedDocuments() {
  if (!db) {
    console.error("Database connection is not available. Please ensure your DATABASE_URL environment variable is set and db.ts initializes correctly.");
    process.exit(1);
  }

  console.log("Starting check for orphaned documents...");

  try {
    // 1. Fetch all unique IDs from the tax_forms table
    console.log("Fetching all tax form IDs...");
    const allTaxFormRecords = await db.select({ id: taxForms.id }).from(taxForms);
    const existingTaxFormIds = allTaxFormRecords.map(tf => tf.id);

    if (existingTaxFormIds.length === 0) {
      console.log("No tax forms found in the database.");
      // Check if there are any documents at all in this case
      const documentCountResult = await db.select({ count: documentsTable.id }).from(documentsTable).limit(1);
      const documentCount = documentCountResult[0]?.count ?? 0; // Drizzle returns count as string with some drivers
      
      if (Number(documentCount) > 0) {
        console.warn(`WARNING: Found ${documentCount} document(s), but no tax forms exist. All documents are effectively orphaned.`);
        console.log("You might want to investigate why all tax forms are missing or delete these documents.");
      } else {
        console.log("No documents found either. The relevant tables appear to be empty or consistent.");
      }
      return;
    }
    console.log(`Found ${existingTaxFormIds.length} unique tax form ID(s).`);

    // 2. Fetch all documents
    console.log("Fetching all document records...");
    const allDocuments = await db.select().from(documentsTable);

    if (allDocuments.length === 0) {
      console.log("No documents found in the database. Nothing to check for orphans.");
      return;
    }
    console.log(`Found ${allDocuments.length} document record(s) to check.`);

    // 3. Identify orphaned documents
    const orphanedDocuments = allDocuments.filter(doc => {
      if (doc.taxFormId === null || doc.taxFormId === undefined) {
        console.warn(`Document ID: ${doc.id} has a null or undefined taxFormId. This is unusual and should be investigated.`);
        return false; // Not technically orphaned by a non-existent ID, but still problematic
      }
      return !existingTaxFormIds.includes(doc.taxFormId);
    });

    // 4. Print the results
    if (orphanedDocuments.length > 0) {
      console.warn(`\nFound ${orphanedDocuments.length} orphaned document(s):`);
      orphanedDocuments.forEach(doc => {
        console.log(`  - Document ID: ${doc.id}`);
        console.log(`    Name: "${doc.name}"`);
        console.log(`    Orphaned taxFormId: ${doc.taxFormId}`);
        console.log(`    URL: ${doc.url}`);
        console.log(`    Uploaded At: ${doc.uploadedAt}`);
        console.log(`    ------------------------------------`);
      });

      console.log("\nRECOMMENDATION: These orphaned documents are likely no longer accessible through the application normally and may represent data integrity issues.");
      console.log("You can choose to delete them from the 'documents' table.");
      console.log("IMPORTANT: Always back up your database before performing any delete operations!");

      // 5. Example code for deletion (commented out by default)
      const orphanedDocIds = orphanedDocuments.map(d => d.id);
      console.log("\nIf you wish to delete these orphaned documents, you can use the following Drizzle ORM code:");
      console.log("------------------------------------------------------------------------------------");
      console.log("// try {");
      console.log("//   if (orphanedDocIds.length > 0) {");
      console.log("//     console.log(`Attempting to delete ${orphanedDocIds.length} orphaned document(s)...`);");
      console.log("//     const deleteResult = await db.delete(documentsTable).where(inArray(documentsTable.id, orphanedDocIds)).returning({ deletedId: documentsTable.id });");
      console.log("//     console.log(`Successfully deleted ${deleteResult.length} orphaned document(s).`);");
      console.log("//     deleteResult.forEach(item => console.log(`  - Deleted document ID: ${item.deletedId}`));");
      console.log("//   }");
      console.log("// } catch (deleteError) {");
      console.log("//   console.error('Error deleting orphaned documents:', deleteError);");
      console.log("// }");
      console.log("------------------------------------------------------------------------------------");
      console.log("To use the deletion code: uncomment it within this script and re-run, or adapt it into another script/tool.");

    } else {
      console.log("\nNo orphaned documents found. All document records correctly reference existing tax forms.");
    }

  } catch (error) {
    console.error("\nAn error occurred while checking for orphaned documents:", error);
    process.exit(1);
  }
}

findOrphanedDocuments().then(() => {
  console.log("\nOrphaned document check finished.");
}).catch((e) => {
  console.error("Script execution failed:", e);
  process.exit(1);
});
