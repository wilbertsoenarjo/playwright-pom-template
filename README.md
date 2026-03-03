# Automation Testing with Playwright Using TypeScript

## Introduction

This project is a test automation framework built using Playwright and TypeScript. It consists of two types of tests: E2E automation and API automation. The framework covers the following test targets:

- **E2E**: Medusa Store, SauceLabs Demo
- **API**: ReqRes API

### E2E Automation

This E2E automation project is built using Playwright and TypeScript. It implements the Page Object Model (POM) pattern with no explicit waits, covers Medusa Store and SauceLabs Demo applications, and runs on CI whenever there is a new commit to the master branch.

### API Automation

This automated API test suite is built using Playwright, TypeScript, and AJV for schema validation. It covers the ReqRes API with test cases for user login, user registration, and retrieving users.

### Installation and Local Run

**Prerequisites:** Node.js v18 or higher

1. Clone this repository
```
git clone https://github.com/wilbertsoenarjo/playwright-pom-template.git
```
2. Navigate to the project directory
```
cd <project_directory>
```
3. Install dependencies
```
npm install
```
4. Run headed API or E2E test using scripts
```
npm run api
npm run e2e
```

### Claude Code API Commands

This project includes custom [Claude Code](https://claude.ai/code) slash commands that generate API test boilerplate automatically.

#### `/api-test` — Generate a complete API test suite

Generates three files: a schema file, a data fixture entry, and a spec file. See [`.claude/commands/api-test.md`](.claude/commands/api-test.md) for full usage and argument details.

---

#### `/api-schema` — Generate an AJV schema file only

Use this when you already have a spec file and only need the schema. See [`.claude/commands/api-schema.md`](.claude/commands/api-schema.md) for full usage and argument details.

---

### Accessing Trace Viewer From Github Action

1. Open workflow to debug
2. Download artifact
3. Unzip downloaded artifact
4. Inside unzipped folder, select index.html file
5. Click copy command from the message shown
6. Paste command on local terminal
7. Run the localhost provided

### Project Structure
```
├── .github/                    # GitHub workflow folder
│   └── workflows/              # CI pipeline configurations
│
├── fixtures/                   # Test data and schemas
│   ├── data/                   # Test data per application
│   └── schemas/                # Schemas for API response validation
│
├── pages/                      # Page Object Model (POM) classes
│
├── tests/                      # All test specifications
│   ├── api/                    # API test suites
│   └── e2e/                    # E2E test suites
│
├── types/                      # Shared TypeScript interfaces & types
│
├── utils/                      # Helper functions & reusable logic
│   └── component/              # Component-level helpers (UI/POM helpers)
│
├── playwright.config.ts        # Playwright test configuration
├── package.json                # Dependencies and scripts
├── package-lock.json           # Dependency lockfile
└── README.md                   # Project documentation
```