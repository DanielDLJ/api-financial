<div align="center">
  <h1>🏦 API Financial</h1>
  <p>A RESTful API for personal financial management</p>
</div>

## 📋 Table of Contents

- [About](#-about)
- [Technologies](#-technologies)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)
- [Tests](#-tests)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About

API Financial is a backend application developed with NestJS for personal financial management. The API allows you to manage credit cards, expenses, and more, focusing on security and development best practices.

## 🚀 Technologies

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
- [Prisma](https://www.prisma.io/) - Modern ORM
- [MySQL](https://www.mysql.com/) - Relational database
- [Docker](https://www.docker.com/) - Containerization
- [Jest](https://jestjs.io/) - Testing framework
- [Swagger](https://swagger.io/) - API documentation

## ✨ Features

- 👤 Authentication and Authorization

  - JWT
  - Roles (Admin/User)

- 💳 Credit Cards

  - Full CRUD
  - Bank and flag associations
  - Soft delete

- 🏦 Banks and Flags

  - Registration and listing
  - Card associations

- 💰 Expenses
  - Full CRUD

## 🏁 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/api-financial.git

# Enter the directory
cd api-financial

# Install dependencies
npm install
```

### Configuration

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Configure environment variables in the `.env` file

### Running the Project

```bash
# Development
make up

# Production
make up-prod
```

## 🧪 Tests

```bash
# Unit tests
npm run test

# Integration tests
make test-integration

# Coverage
npm run test:cov
```

## 📖 API Documentation

Swagger documentation is available at:

```
http://localhost:3001/swagger
```

## 📁 Project Structure

```
src/
|...
├── common/         # Shared code
├── credit-cards/   # Credit cards module
├── users/          # Users module
└── main.ts         # Application entry
```

## 🤝 Contributing

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/daniellj">Daniel Leme Junior</a>
</div>
