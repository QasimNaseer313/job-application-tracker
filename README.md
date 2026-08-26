# Job Application Tracker API

A RESTful API built with Django and Django REST Framework to help job seekers track their job applications. Supports JWT authentication, filtering, search, ordering, and pagination.

## Tech Stack

- Python 3.x
- Django 4.2
- Django REST Framework
- MySQL
- JWT Authentication (SimpleJWT)
- Railway (deployment)

## Features

- JWT-based authentication (register, login, token refresh)
- Full CRUD for job applications
- Filter by status (applied, interview, rejected, offered, accepted)
- Search across company, job title, and notes
- Order by date applied, company, or created date
- Paginated responses

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login/ | Get access & refresh tokens | No |
| POST | /api/auth/refresh/ | Refresh access token | No |
| GET | /api/jobs/ | List all your applications | Yes |
| POST | /api/jobs/ | Create a new application | Yes |
| GET | /api/jobs/{id}/ | Get a single application | Yes |
| PUT | /api/jobs/{id}/ | Update an application | Yes |
| DELETE | /api/jobs/{id}/ | Delete an application | Yes |

## Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| status | ?status=applied | Filter by status |
| search | ?search=django | Search company, title, notes |
| ordering | ?ordering=-date_applied | Sort results |
| page | ?page=2 | Pagination |

## Local Setup

1. Clone the repo
```bash
   git clone https://github.com/QasimNaseer313/job-application-tracker.git
   cd job-application-tracker
```

2. Create and activate virtual environment
```bash
   python -m venv venv
   venv\Scripts\activate
```

3. Install dependencies
```bash
   pip install -r requirements.txt
```

4. Create `.env` file

SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=job_tracker
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306


5. Run migrations
```bash
   python manage.py migrate
```

6. Start the server
```bash
   python manage.py runserver
```

## Live API

Deployed on Railway — link coming soon.
