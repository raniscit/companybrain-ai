import { db } from "@/db";
import { employees } from "../src/db/schema";

async function seed() {
  console.log("Seeding employees...");

  await db.insert(employees).values([
    {
      employeeId: "EMP001",
      email: "shavimaurya65@gmail.com",
      name: "Shivi Maurya",
      department: "Engineering",
      designation: "Software Engineer",
      accessGroup: "EMPLOYEE",
    },

    {
      employeeId: "MGR001",
      email: "manager@company.com",
      name: "Amit Verma",
      department: "Engineering",
      designation: "Engineering Manager",
      accessGroup: "MANAGER",
    },

    {
      employeeId: "HR001",
      email: "hr@company.com",
      name: "Priya Singh",
      department: "Human Resources",
      designation: "HR Manager",
      accessGroup: "HR",
    },

    {
      employeeId: "FIN001",
      email: "finance@company.com",
      name: "Neha Gupta",
      department: "Finance",
      designation: "Finance Manager",
      accessGroup: "FINANCE",
    },

    {
      employeeId: "ADM001",
      email: "admin@company.com",
      name: "Admin User",
      department: "IT",
      designation: "Administrator",
      accessGroup: "ADMIN",
    },
  ]);

  console.log("Employees seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });