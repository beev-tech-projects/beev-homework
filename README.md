# EV Fleet Analytics - Full-Stack Developer Assessment

## Overview

Design and implement a small full-stack application to help fleet managers monitor their electric vehicle fleet's efficiency and environmental impact. This project should demonstrate your ability to create clean, well-organized code while solving real-world problems.

## Expected Solution
 - We are looking forward to a project that keeps the provided organization, so please **do not split** your code into different projects
 - We expect a solution that will run without us having to do any modifications or debugging, make sure that your project **works from scratch**
 - The commands that are listed should be enough to launch the project and the seeder
 - **Important**: Focus on code quality over feature quantity. It's okay to mock some data or functionalities, but document any assumptions you make.

## AI Usage Guidelines

While AI tools can be valuable learning resources, excessive reliance on AI-generated code for this assessment defeats its purpose and **will harm your candidacy**. 
This test evaluates your problem-solving abilities, technical decision-making, and coding practices not how much code you can produce.

During the review process, be prepared for:
- A live discussion about your implementation
- Questions about specific technical choices
- Potential real-time modifications to your code

## Timeline & Submission

- **Duration**: Go through the questions and let us know when you will send us back your solution
- **Expected effort**: 4-5 hours
- **Submission method: Private GitHub repository**
- **Share access in a private github repository with**:
  - https://github.com/antonin-beev
  - https://github.com/CarlEH

## Project Requirements

### 1. Backend (NestJS)

#### Data Model

The application will track vehicles with the following properties:

- ID (uuid)
- Brand (string)
- Model (string)
- Battery capacity (kWh)
- Current charge level (%)
- Status (enum: available, charging, in_use)
- Last updated (timestamp)
- Average energy consumption (kWh/100km)
- Type (BEV/ICE) - *BEV = Battery Electric Vehicle, ICE = Internal Combustion Engine*
- Emission_gco2_km - *Grams of CO2 per kilometer*

**Data Source**: Seed your database using the provided `data/cars.csv` file (available in the project repository).

#### API Endpoints

1. **Vehicle Management**
    - GET /vehicles - List all vehicles with pagination and filtering
    - POST /vehicles - Add new vehicle
    - GET /vehicles/:id - Get vehicle details
    - PUT /vehicles/:id - Update vehicle
    - DELETE /vehicles/:id - Remove vehicle
2. **Analytics**
    - GET /analytics/fleet-efficiency
        - Average energy consumption rates across different models
        - Emissions comparison between BEV and ICE vehicles
    - GET /analytics/fleet-composition
        - Distribution of BEV vs. ICE vehicles
    - GET /analytics/fleet-operational
        - Current fleet availability rate (% of vehicles available)
        - Number of vehicles currently charging vs. in use

#### Technical Specifications

- Use [NestJs](https://docs.nestjs.com/) as the backend framework
- Use [TypeORM](https://github.com/typeorm/typeorm) for database interactions
- Implement request validation using [class-validator](https://docs.nestjs.com/pipes#class-validator)
- Add Redis caching for analytics endpoints
- Include error handling middleware
- Write [unit tests](https://vitest.dev/) for services
- Add [e2e tests](https://playwright.dev/) for critical endpoints

### 2. Frontend (React)

#### Features

1. **Dashboard Overview**
    - Fleet summary statistics
    - Fleet status
    - Environmental impact metrics
2. **Vehicle Management**
    - List view with sorting and filtering
    - Add/Edit vehicle forms
3. **Bonus:** Analytics Visualization using analytics endpoints

#### Technical Specifications

- Use TypeScript
- Implement using [shadcn/ui](https://ui.shadcn.com/) components
- Style with [Tailwind CSS](https://tailwindcss.com/docs)
- Use [React Query](https://tanstack.com/query/latest) for data fetching
- Include unit tests for key components
- Implement error boundaries
- Add loading states

## Bonus Points

- Implemented monitoring/logging
- Advanced caching strategies
- Performance optimizations
- CI setup
- Additional features that add value

## Evaluation Criteria

We're looking for:
- Clean, maintainable code
- Problem-solving approach
- Attention to detail
- Learning ability
- Technical decision-making
- Time management


---

# Project Setup Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- pnpm

## Service Ports Overview

| Service        | Internal Port | External Port | Access URL                    | Description                     |
|---------------|--------------|--------------|-------------------------------|--------------------------------|
| Frontend      | 8080         | 8000         | http://localhost:8000         | React Frontend Application     |
| Backend       | 3030         | 3030         | http://localhost:3030         | NestJS Backend API             |
| Postgres      | 5432         | 5433         | localhost:5433                | Database Service               |
| PgAdmin       | 80           | 8001         | http://localhost:8001         | Postgres Management Interface  |
| Redis         | 6379         | 6379         | localhost:6379                | Key-Value Store                |
| Redis Insight | 5540         | 8002         | http://localhost:8002         | Redis Management Interface     |

> **Note for Redis Insight**: Use the connection string `redis://default@redis:6379`

## Docker Commands

```bash
# Build all services
docker compose build

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## Development Workflow

```bash
# Install all workspace dependencies
pnpm install

# How to run a command in a specific workspace
pnpm --filter backend YOUR_COMMAND
# Or
pnpm --filter frontend YOUR_COMMAND

# Start backend first
pnpm dev:backend

# Then start frontend
pnpm dev:frontend
```

## Troubleshooting

1. Ensure Docker is running
2. Verify pnpm and Docker versions
3. Use `docker-compose logs` to inspect service startup issues

## Notes

- Default credentials are set for development
- ALWAYS change credentials in production

## FAQ

1. **Q: Where can I find the cars.csv file?**
   A: The file will be available in the project repository under the `data` directory.
2. **Q: What if I can't complete all requirements in time?**
   A: Focus on code quality over quantity. Document what you would have done with more time.

## Need Help?

If you have any questions, please contact: tech@beev.co
