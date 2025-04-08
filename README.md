# 🔐 Auth Practice Project

This project contains authentication implementations in various stacks. It is structured to showcase how the same auth logic can be built with different backend frameworks and databases.

## 💡 Why This Project?

- 🔐 Practice combining **Email/Password authentication** with **OAuth** (Google & GitHub)
- 🧱 Practice **database migrations** across different stacks:
  - Spring Boot → MySQL + Flyway
  - NestJS → PostgreSQL + Prisma
  - Express → MongoDB + Migrate Mongo
- 🤝 Create opportunities for other learners to:
  - Contribute to open source
  - Learn **pull request (PR) management**
  - Collaborate in a multi-stack project environment

## 📦 Implementations

| Stack            | Language       | DB       | Migration Tool     | Status         |
|------------------|----------------|----------|---------------------|----------------|
| [auth-node-express](./auth-nodejs-express)     | TypeScript (Express) | MongoDB   | migrate-mongo       | ✅ In Progress |
| [auth-node-nest](./auth-nodejs-nest)           | TypeScript (NestJS)  | PostgreSQL | TypeORM / Drizzle ORM | 🚧 Planned     |
| [auth-springboot](./auth-java-springboot) | Java (Spring Boot)   | MySQL     | Flyway              | 🚧 Planned     |
| `auth-python`                     | Python (TBD)         | TBD       | TBD                 | 🔜 Open for Contribution |

## ✨ Features

Each implementation will support:

- 📧 **Email/Password registration** with email verification
- 🌐 **OAuth login** using Google and GitHub
- 🔗 **Account linking** across providers (same email = same user)
- ⚙️ Well-structured **environment configuration**, **database migrations**, and **testing setup**
