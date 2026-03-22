import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const p = new PrismaClient();

async function main() {
  const rooms = await p.roomType.findMany({
    select: { id: true, name: true, isActive: true, maxOccupancy: true },
  });
  console.log("RoomTypes count:", rooms.length);
  for (const r of rooms) {
    console.log(`  - ${r.name} | isActive=${r.isActive} | maxOcc=${r.maxOccupancy}`);
  }
}

main()
  .catch((e) => console.error("Error:", e.message))
  .finally(() => p.$disconnect());
