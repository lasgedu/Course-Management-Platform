# Course Management Platform

A comprehensive backend system for academic institutions to manage courses, track facilitator activities, and support student reflections with internationalization.

## Features

- **Course Allocation System**: Manage facilitator assignments to courses
- **Facilitator Activity Tracker (FAT)**: Track weekly activities and compliance
- **Student Reflection Page**: Multi-language support for student feedback
- **Role-based Access Control**: Secure authentication with JWT
- **Redis-backed Notifications**: Automated reminders and alerts
- **RESTful API**: Well-documented endpoints with Swagger

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Queue System**: Redis with Bull
- **Testing**: Jest
- **Documentation**: Swagger

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Redis (v6 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lasgedu/course-management-platform.git
cd course-management-platform