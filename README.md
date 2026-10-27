# ClientFlow

A full-stack support ticket management system with AI-powered triage, built with Laravel, React, and MySQL.

## Overview

ClientFlow is a CRM-lite tool designed for agencies and SMBs to manage client support requests. When a ticket is submitted, an AI model automatically classifies its category and priority — no manual sorting needed.

## Features

- **Authentication** — JWT-based auth via Laravel Sanctum with role management (admin, operator, client)
- **Ticket management** — Full CRUD with status tracking (open → in progress → closed)
- **AI Triage** — Automatic category and priority assignment via Groq (Llama 3.3 70B)
- **Email notifications** — Automatic emails on ticket status updates via SMTP
- **Client registry** — Manage client profiles linked to their tickets
- **Dashboard** — Real-time stats and recent ticket overview

## Tech Stack

**Backend**

- PHP 8.5 / Laravel 13
- MySQL
- Laravel Sanctum (API auth)
- Guzzle (Groq API integration)

**Frontend**

- React 18 + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

## API Endpoints

| Method | Endpoint                    | Description               | Auth           |
| ------ | --------------------------- | ------------------------- | -------------- |
| POST   | `/api/register`             | Register user             | Public         |
| POST   | `/api/login`                | Login                     | Public         |
| GET    | `/api/tickets`              | List tickets              | Admin/Operator |
| POST   | `/api/tickets`              | Create ticket (AI triage) | All roles      |
| GET    | `/api/tickets/:id`          | Ticket detail             | All roles      |
| PUT    | `/api/tickets/:id`          | Update ticket             | Admin/Operator |
| DELETE | `/api/tickets/:id`          | Delete ticket             | Admin/Operator |
| GET    | `/api/clients`              | List clients              | Admin/Operator |
| POST   | `/api/clients`              | Create client             | Admin/Operator |
| POST   | `/api/tickets/:id/messages` | Add message               | All roles      |
