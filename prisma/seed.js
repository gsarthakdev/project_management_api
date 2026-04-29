import bcrypt from "bcrypt";
import "dotenv/config";
import prisma from "../src/config/db.js";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

try {
  // Clear tables with cascading
  await prisma.$queryRaw`TRUNCATE "User", "Project", "ProjectMember", "Task", "Comment" RESTART IDENTITY CASCADE;`;

  const usersData = [
    { email: "admin@example.com", password: "Password123!", name: "Admin User", role: "Admin" }, // role is just for demonstration if we need it, though in our DB role is strictly at the ProjectMember level!
    { email: "user@example.com", password: "userpassword321", name: "Regular User" },
  ];

  const dbUsers = [];
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: hashedPassword,
        name: u.name,
      },
    });
    dbUsers.push(user);
    console.log(`Created user: ${user.email}`);
  }

  const admin = dbUsers[0];
  const reqUser = dbUsers[1];

  // Admin creates a project and makes Regular User an Admin of that project
  const project1 = await prisma.project.create({
    data: {
      name: "Global Product Launch",
      description: "Launch activities for Q4",
      members: {
        create: [
          { userId: admin.id, role: "Owner" },
          { userId: reqUser.id, role: "Admin" },
        ],
      },
      tasks: {
        create: [
          { title: "Draft marketing email", status: "Done", assigneeId: admin.id },
          { title: "Review ad copy", status: "In Progress", assigneeId: reqUser.id },
        ]
      }
    },
    include: { tasks: true }
  });

  console.log(`Created project: ${project1.name}`);

  // Regular User creates a project
  const project2 = await prisma.project.create({
    data: {
      name: "Internal Toolkit",
      description: "Tools for the tech team",
      members: {
        create: [
          { userId: reqUser.id, role: "Owner" }, // Not shared with admin
        ],
      },
      tasks: {
        create: [
          { title: "Setup repo", status: "Done", assigneeId: reqUser.id },
        ]
      }
    },
    include: { tasks: true }
  });
  console.log(`Created project: ${project2.name}`);

  // Admin creates a private project
  const project3 = await prisma.project.create({
    data: {
      name: "Admin's Private Project",
      description: "Confidential administrative tasks",
      members: {
        create: [
          { userId: admin.id, role: "Owner" },
        ],
      },
      tasks: {
        create: [
          { title: "Secret Task", status: "In Progress", assigneeId: admin.id },
        ]
      }
    },
    include: { tasks: true }
  });
  console.log(`Created project: ${project3.name}`);

  // Add Comments
  await prisma.comment.create({
    data: {
      content: "Looks good to me!",
      taskId: project1.tasks[0].id,
      authorId: admin.id,
    }
  });

  await prisma.comment.create({
    data: {
      content: "I will get to this tomorrow.",
      taskId: project1.tasks[1].id,
      authorId: reqUser.id,
    }
  });

  // Add a comment to the secret task for testing comment 403
  await prisma.comment.create({
    data: {
      content: "This is a secret comment.",
      taskId: project3.tasks[0].id,
      authorId: admin.id,
    }
  });

  console.log("Database seeded successfully!");
} catch (error) {
  console.error("Seed failed:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
