import { count } from "drizzle-orm";
import { getDb } from "@/db";
import { software, journalEntries } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [softwareRow] = await getDb().select({ value: count() }).from(software);
    const [devRow] = await getDb()
      .select({ value: count() })
      .from(journalEntries)
      .where(journalEntries.kind === "dev");
    const [diaryRow] = await getDb()
      .select({ value: count() })
      .from(journalEntries)
      .where(journalEntries.kind === "diary");

    return Response.json({
      software: softwareRow?.value ?? 0,
      dev: devRow?.value ?? 0,
      diary: diaryRow?.value ?? 0,
    });
  } catch {
    return Response.json({ software: 0, dev: 0, diary: 0 });
  }
}
