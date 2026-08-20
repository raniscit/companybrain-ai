import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/index";
import { employees } from "@/db/schema";

export async function getCurrentEmployee() {
  // Get authenticated Clerk user
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Get verified email from Clerk
  const email = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!email) {
    return null;
  }

  // Find employee in company DB
  const employee = await db.query.employees.findFirst({
    where: eq(employees.email, email),
  });

  return employee ?? null;
}