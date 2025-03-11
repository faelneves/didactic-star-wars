# Didactic Star Wars

Didactic Star Wars is a project that consumes the [SWAPI](https://swapi.dev/) (Star Wars API) and provides a visualization for its data. The project consists of two main components:

- **Backend**: A PHP Laravel REST API that consumes the Star Wars API and manages requests.
- **Frontend**: A React + Vite application that provides the user interface to interact with the API.

## Table of Contents
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)

## Requirements
Ensure you have the following installed on your machine before running the project:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Project Structure
```
root/
│── backend/        # Laravel REST API
│── frontend/       # React + Vite application
│── docker-compose.yml  # Docker configuration file
```

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/faelneves/didactic-star-wars.git
   cd didactic-star-wars
   ```

2. Ensure ports **3000** (frontend) and **8000** (backend) are available on your machine.

3. Configure environment variables:
   ```sh
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Start the application using Docker Compose:
   ```sh
   docker compose up
   ```
   This command will:
   - Build and start the backend on `localhost:8000`
   - Build and start the frontend on `localhost:3000`

5. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)

## Running Tests

Ensure that the Docker containers are running before executing the tests:
```sh
docker compose up -d
```

To run tests for both backend and frontend:

- **Backend Tests (Laravel):**
  ```sh
  docker compose exec backend php artisan test
  ```

- **Frontend Tests (React + Vite):**
  ```sh
  docker compose exec frontend npm run test
  ```

## API Endpoints

The backend exposes the following routes:

### People Endpoints
- `GET /api/v1/people/search?name=<query>` - Search for characters by name.
- `GET /api/v1/people/{id}` - Retrieve details of a specific character by ID.

### Films Endpoints
- `GET /api/v1/films/search?title=<query>` - Search for films by title.
- `GET /api/v1/films/{id}` - Retrieve details of a specific film by ID.
