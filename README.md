# Todo Application

A modern task management application built with Angular 18.

## Features

- Create new tasks with names and due dates
- View list of all tasks
- Delete existing tasks
- RESTful API integration

## Prerequisites

- Node.js (LTS version recommended)
- Angular CLI v18.2.2 or higher

## Installation

1. Clone the repository:

```bash
git clone https://github.com/emsqrd/todo-app.git
cd todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Project Structure

- `src/app/models` - Data models and interfaces
- `src/app/services` - Angular services for API communication
- `src/app/components` - Angular components

## Available Scripts

- `npm start` - Runs the development server
- `npm run build` - Builds the application for production
- `npm test` - Executes unit tests
- `npm run watch` - Builds the application in watch mode

## Technical Stack

- Angular 18
- RxJS
- Angular CDK
- TypeScript

## API Integration

The application communicates with a RESTful API using the following endpoints:

- `GET /tasks` - Retrieve all tasks
- `POST /tasks` - Create a new task
- `DELETE /tasks/:id` - Delete a specific task
