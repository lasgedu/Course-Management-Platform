# Course Management Platform

A comprehensive backend system for academic institutions to manage courses, track facilitator activities, and support student reflections with internationalization.

## Key Features
Module 1: Core System

* Course Allocation: Assign instructors to courses/cohorts
* Student Enrollment: Track registrations and academic progress
* Role-Based Access: Admin/Facilitator/Student permissions
* Reporting Tools: Academic statistics and cohort management

## Course Reflection Page
[https://github.com/lasgedu/Reflection-Page](https://lasgedu.github.io/Course-Management-Platform/)

## Module 2: Activity Tracker (In Dev)

* Weekly Logs: Record faculty attendance and grading status
* Automated Alerts: Deadline reminders via Redis
* Compliance Dashboard: Monitor submission deadlines

## Quick Setup
Requirements

* Node.js 16+ | MySQL 8+ | Redis 6+ (Module 2)

## Install
```

bashDownloadCopy code Wrapgit clone <repo-url>
cd course-management-platform
npm install
Configure
Create .env:
envDownloadCopy code WrapDB_HOST=localhost
DB_USER=mysql_user
DB_PASSWORD=mysql_pass
JWT_SECRET=your_secret_key
REDIS_HOST=localhost # Module 2
Initialize
bashDownloadCopy code Wrapnpm run migrate   # Set up database
npm run seed      # Load demo data
npm start         # Run server (Port 3000)
```


## Testing Accounts
```

Use these credentials:
RoleEmailPasswordManagerjohn.manager@uni.eduManager123!Facilitatoralice.smith@uni.eduFacilitator123!Studentemma.student@student.uni.eduStudent123!
```

## Core Endpoints
```

Authentication
POST /api/auth/login      # Login
POST /api/auth/refresh    # Refresh token
```

### Courses
```

GET /api/v1/course-offerings       # List courses
POST /api/v1/course-offerings      # Create course
PUT /api/v1/course-offerings/:id   # Update course
```

### EnrollmenT
```

GET /api/v1/students/enrolled-courses  # View courses
POST /api/v1/course-offerings/:id/enroll # Enroll student
```

### Activity Tracking (Module 2)
```

POST /api/v1/activity-logs          # Submit weekly log
GET /api/v1/activity-logs/compliance # Check deadlines
```

### Architecture
```
Tech Stack:

Node.js + Express + Sequelize (MySQL) + Redis
```

### Key Components:
```
* Models: Courses, Users, Enrollments, Activity Logs
* Services: Notification, Redis Queue
* Middleware: JWT Auth, Role Validation
```
### Project Structure
```
src/
├── app.js                 # Application entry point
├── config/
│   └── config.json        # Database configuration
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── courseOfferingController.js
│   ├── facilitatorController.js
│   ├── managerController.js
│   ├── studentController.js
│   └── activityTrackerController.js  # Module 2
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT authentication
│   └── roleCheck.js      # Role-based access control
├── models/               # Sequelize models
│   ├── index.js
│   ├── User.js
│   ├── Manager.js
│   ├── Facilitator.js
│   ├── Student.js
│   ├── CourseOffering.js
│   └── ActivityTracker.js # Module 2
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── courseOfferingRoutes.js
│   ├── facilitatorRoutes.js
│   ├── managerRoutes.js
│   ├── studentRoutes.js
│   └── activityTrackerRoutes.js  # Module 2
├── services/             # Business logic services
│   ├── notificationService.js    # Module 2
│   └── redisService.js          # Module 2
├── workers/              # Background job workers
│   └── notificationWorker.js    # Module 2
├── migrations/           # Database migrations
└── seeders/             # Database seeders
```

## Deployment
Production Tips

1. Database: Use connection pooling
2. Redis: Configure clustering
3. SSL: Enable HTTPS
4. Scaling: docker-compose up --scale api=3

Monitoring

* Logging: Winston + Morgan
* APM: Add application monitoring

🤝 Contribute

1. Fork repository
2. Create feature branch (feature/short-description)
3. Commit with message (chore: update setup docs)
4. Open pull request


