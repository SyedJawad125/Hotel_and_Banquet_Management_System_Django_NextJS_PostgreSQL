<!-- The Heritage Village — Hotel & Event & Venue Management System

القرية الشعبية — ١٩٩٨
Luxury Heritage Hotel & Event Management Platform

A modern full-stack Hotel & Event Management System built for managing halls, venues, customers, bookings, employees, payments, pricing, services, reports, and secure role-based staff operations.

The system is designed with a premium gold-on-black luxury theme, bilingual English/Arabic support, RTL-aware layouts, and enterprise-grade authentication.

Built using:

Backend: Django + Django REST Framework
Frontend: Next.js 14 (App Router)
Database: PostgreSQL
Authentication: JWT Access + Refresh Tokens
Architecture: Modular, scalable, role-based enterprise design
Features
Authentication & Security

A complete enterprise authentication system featuring:

User Signup & Invitation Flow
Secure Login
JWT Authentication
Access + Refresh Tokens
Forgot Password
OTP Verification
Password Reset
Password Change
Account Activation via Email
Login Attempt Tracking
User Blocking System
Secure Logout
Role-Based Access Control (RBAC)
Permission-Based Authorization
Tech Stack
Layer	Technology
Backend	Django
API	Django REST Framework
Frontend	Next.js 14
Database	PostgreSQL
Authentication	JWT
State Management	React Context API
Styling	Tailwind CSS + Custom Luxury Theme
File Uploads	Django Media Storage
Architecture	RESTful APIs
Design Language
Theme

Luxury heritage-inspired UI with premium hospitality aesthetics.

Color Palette
Color	Usage
#000000	Sidebar / Primary Background
#C6A43F	Gold Accent
#F6F3EC	Ivory Background
#FBF9F4	Light Cream
#26231D	Dark Typography
#CCCCCC	Secondary Text
Typography
Cormorant Garamond → Headings & Luxury Display
DM Sans → UI Labels & Body Text
Layout
Fixed dark sidebar
Gold accent navigation
Rounded luxury cards
Soft shadows
RTL support
Responsive admin dashboard
Enterprise-style data management screens
Core Modules
Dashboard
Revenue statistics
Hall occupancy analytics
Upcoming bookings
Popular halls
Activity logs
Customer insights
Financial overview
Halls & Venues

Manage hotel halls and venues:

Hall creation
Capacity management
Occupancy tracking
Hall images
Venue status
Booking analytics
Hall amenities
Dynamic pricing
Event Bookings

Complete event booking management:

Hall booking
Customer assignment
Booking code generation
Time slot management
Event scheduling
Booking status tracking
Revenue tracking

Supported shifts:

Morning Shift
Afternoon Shift
Night Shift
Payments

Payment management system:

Partial payments
Full payments
Payment history
Payment methods
Financial tracking
Booking-linked payments

Supported payment methods:

Cash
Card
Bank Transfer
Check
Hall Pricing

Dynamic hall pricing management:

Time-slot pricing
Seasonal pricing
Date-range pricing
Hall-specific rates
Booking Services

Additional booking add-ons:

Catering
Decoration
Photography
Sound System
Event Services
Hall Amenities

Manage amenities per hall:

WiFi
Parking
Air Conditioning
Projector
Sound System
Seating
Stage Setup
Customers

Customer relationship management:

Guest records
Booking history
Lifetime spending
Contact management
Customer analytics
Employees

Employee management system:

Employee onboarding
Invitation workflow
Role assignment
Employee activation/deactivation
Staff management
Roles & Permissions

Enterprise RBAC system:

Dynamic roles
Module-based permissions
Permission grouping
Secure authorization
Admin-controlled access
Reports & Analytics

Analytics and reporting system:

Revenue reports
Customer reports
Booking analytics
Export-ready data
Date-range filtering
Sidebar Navigation
MAIN
📊 Dashboard
🏛️ Halls & Venues
📅 Event Bookings
FINANCIAL
💳 Payments
💰 Hall Pricing
SERVICES
🎁 Booking Services
✨ Hall Amenities
MANAGEMENT
👥 Customers
👤 System Users
👤 Employees
🛡️ Roles
📋 Activity Log
📈 Reports & Analytics
Database Models
User App
User Model

Custom authentication user model using AbstractBaseUser.

Features
Username-based authentication
Email integration
Mobile number support
Profile image upload
OTP password reset
Account verification
Login attempt tracking
User blocking
Role assignment
Employee/Customer user types
Employee Model

Employee profile linked with User model.

Status Flow
INVITED → ACTIVE → DEACTIVATED
Role Model

Permission bundle system.

Example roles:

Super Admin
Event Manager
Accountant
Receptionist
Staff Member
Permission Model

Granular module-level permissions.

Examples:

CREATE_BOOKING
UPDATE_HALL
DELETE_CUSTOMER
VIEW_REPORTS
MANAGE_EMPLOYEES
Hotel App
Customer

Customer contact and booking profile.

Features
Booking count
Total spending
Contact management
Analytics support
Hall

Venue management model.

Features
Capacity tracking
Occupancy tracking
Hall images
Booking analytics
Upcoming events
Booking

Core event booking model.

Features
Auto-generated booking codes
Hall allocation
Customer assignment
Event scheduling
Time slots
Booking statuses
Revenue tracking

Example booking code:

B1001
B1002
B1003
ActivityLog

Tracks system activity across modules.

Tracks
Create actions
Updates
Deletions
Booking activities
Staff activities
Payment

Tracks booking payments.

Features
Multiple payment methods
Partial payments
Booking-linked transactions
Payment notes
HallPricing

Dynamic pricing system for halls.

BookingService

Additional services attached to bookings.

HallAmenity

Amenities available in halls.

Security Features
JWT Authentication
Access & Refresh Tokens
OTP Verification
Password Reset Tokens
Secure Password Hashing
Role-Based Authorization
Permission-Based Access
Login Attempt Monitoring
User Blocking
Protected APIs
API Features
RESTful APIs
Pagination
Filtering
Search
CSV Export
Consistent API responses
Secure endpoints
Role-protected routes

Example API response:

{
  "message": "Success",
  "count": 10,
  "data": []
}
Frontend Features
Next.js 14 App Router
Server Components
Client Components
Route Protection
Dynamic Routing
Context Authentication
UI Features
Luxury hotel theme
Responsive design
Sidebar navigation
Gold hover effects
RTL Arabic support
Dashboard analytics
Reusable components
Authentication Flow
Employee Invitation Flow
Admin Creates Employee
        ↓
Invitation Email Sent
        ↓
Employee Activates Account
        ↓
Password Setup
        ↓
Login Access Granted
Forgot Password Flow
User Requests Reset
        ↓
OTP Code Sent
        ↓
OTP Verification
        ↓
New Password Creation
        ↓
Secure Login
Project Structure
backend/
│
├── user/
├── hotel/
├── utils/
├── config/
│
frontend/
│
├── app/
├── components/
├── context/
├── services/
├── hooks/
Future Enhancements
Online payments
WhatsApp notifications
SMS OTP integration
Mobile application
Hall availability calendar
Invoice generation
PDF exports
Multi-branch hotel support
AI-powered analytics
Customer portal
System Type

This project is designed as:

Enterprise Hotel Management System
Event & Venue Management Platform
Luxury Hospitality ERP
Role-Based Staff Management System
Developed Using
Django
Django REST Framework
Next.js 14
PostgreSQL
React
Tailwind CSS
JWT Authentication -->


<div align="center">

# 🏛️ The Heritage Village
### القرية الشعبية — ١٩٩٨

**Luxury Heritage Hotel & Event Management Platform**

*A modern, full-stack Hotel & Event Management System for halls, venues, customers, bookings, employees, payments, pricing, services, and secure role-based staff operations.*

[![Backend](https://img.shields.io/badge/Backend-Django%20%7C%20DRF-092E20?style=flat-square&logo=django)](#)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=flat-square&logo=nextdotjs)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](#)
[![Auth](https://img.shields.io/badge/Auth-JWT-C6A43F?style=flat-square&logo=jsonwebtokens)](#)
[![License](https://img.shields.io/badge/License-Proprietary-8A8270?style=flat-square)](#)

</div>

---

## ✨ Overview

**The Heritage Village** is an enterprise-grade Hotel & Event Management System designed with a **premium gold-on-black luxury theme**, full **bilingual English/Arabic** support with RTL-aware layouts, and secure, role-based staff operations.

Built as a modular, scalable platform for real hospitality operations — from booking a hall to tracking every riyal of revenue.

| | |
|---|---|
| 🖥️ **Backend** | Django + Django REST Framework |
| 🌐 **Frontend** | Next.js 14 (App Router) |
| 🗄️ **Database** | PostgreSQL |
| 🔐 **Authentication** | JWT (Access + Refresh Tokens) |
| 🏗️ **Architecture** | Modular · Scalable · Role-Based |

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Design Language](#-design-language)
- [Core Modules](#-core-modules)
- [Sidebar Navigation](#-sidebar-navigation)
- [Database Models](#-database-models)
- [Security Features](#-security-features)
- [API Features](#-api-features)
- [Frontend Features](#-frontend-features)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [System Type](#-system-type)
- [Built With](#-built-with)

---

## 🔐 Features

A complete enterprise authentication system featuring:

- ✅ User Signup & Invitation Flow
- ✅ Secure Login
- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Forgot Password + OTP Verification
- ✅ Password Reset & Password Change
- ✅ Account Activation via Email
- ✅ Login Attempt Tracking
- ✅ User Blocking System
- ✅ Secure Logout
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission-Based Authorization

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django |
| **API** | Django REST Framework |
| **Frontend** | Next.js 14 |
| **Database** | PostgreSQL |
| **Authentication** | JWT |
| **State Management** | React Context API |
| **Styling** | Tailwind CSS + Custom Luxury Theme |
| **File Uploads** | Django Media Storage |
| **Architecture** | RESTful APIs |

---

## 🎨 Design Language

### Theme
Luxury heritage-inspired UI with premium hospitality aesthetics.

### Color Palette

| Color | Swatch | Usage |
|---|---|---|
| `#000000` | ⬛ | Sidebar / Primary Background |
| `#C6A43F` | 🟨 | Gold Accent |
| `#F6F3EC` | ⬜ | Ivory Background |
| `#FBF9F4` | ⬜ | Light Cream |
| `#26231D` | ⬛ | Dark Typography |
| `#CCCCCC` | ⬜ | Secondary Text |

### Typography
- **Cormorant Garamond** → Headings & Luxury Display
- **DM Sans** → UI Labels & Body Text

### Layout
- Fixed dark sidebar with gold accent navigation
- Rounded luxury cards with soft shadows
- Full RTL support
- Responsive, enterprise-style admin dashboard

---

## 🧩 Core Modules

<details open>
<summary><strong>📊 Dashboard</strong></summary>

- Revenue statistics
- Hall occupancy analytics
- Upcoming bookings
- Popular halls
- Activity logs
- Customer insights
- Financial overview
</details>

<details>
<summary><strong>🏛️ Halls & Venues</strong></summary>

- Hall creation & capacity management
- Occupancy tracking
- Hall images
- Venue status
- Booking analytics
- Hall amenities
- Dynamic pricing
</details>

<details>
<summary><strong>📅 Event Bookings</strong></summary>

- Hall booking & customer assignment
- Auto-generated booking codes
- Time slot management
- Event scheduling
- Booking status tracking
- Revenue tracking

**Supported Shifts:** Morning · Afternoon · Night
</details>

<details>
<summary><strong>💳 Payments</strong></summary>

- Partial & full payments
- Payment history
- Booking-linked payments
- Financial tracking

**Supported Methods:** Cash · Card · Bank Transfer · Check
</details>

<details>
<summary><strong>💰 Hall Pricing</strong></summary>

- Time-slot pricing
- Seasonal pricing
- Date-range pricing
- Hall-specific rates
</details>

<details>
<summary><strong>🎁 Booking Services</strong></summary>

- Catering
- Decoration
- Photography
- Sound System
- Event Services
</details>

<details>
<summary><strong>✨ Hall Amenities</strong></summary>

- WiFi · Parking · Air Conditioning
- Projector · Sound System
- Seating · Stage Setup
</details>

<details>
<summary><strong>👥 Customers</strong></summary>

- Guest records & booking history
- Lifetime spending
- Contact management
- Customer analytics
</details>

<details>
<summary><strong>👤 Employees</strong></summary>

- Employee onboarding & invitation workflow
- Role assignment
- Activation / deactivation
- Staff management
</details>

<details>
<summary><strong>🛡️ Roles & Permissions</strong></summary>

- Dynamic roles
- Module-based permissions
- Permission grouping
- Secure, admin-controlled authorization
</details>

<details>
<summary><strong>📈 Reports & Analytics</strong></summary>

- Revenue reports
- Customer reports
- Booking analytics
- Export-ready data
- Date-range filtering
</details>

---

## 🗂️ Sidebar Navigation

```
MAIN
  📊 Dashboard
  🏛️ Halls & Venues
  📅 Event Bookings

FINANCIAL
  💳 Payments
  💰 Hall Pricing

SERVICES
  🎁 Booking Services
  ✨ Hall Amenities

MANAGEMENT
  👥 Customers
  👤 System Users
  👤 Employees
  🛡️ Roles
  📋 Activity Log
  📈 Reports & Analytics
```

---

## 🗄️ Database Models

### User App

**User Model** — Custom authentication user model using `AbstractBaseUser`.

- Username-based authentication
- Email & mobile number integration
- Profile image upload
- OTP password reset
- Account verification
- Login attempt tracking & user blocking
- Role assignment · Employee/Customer user types

**Employee Model** — Employee profile linked to the User model.

```
INVITED → ACTIVE → DEACTIVATED
```

**Role Model** — Permission bundle system.
> Example roles: `Super Admin` · `Event Manager` · `Accountant` · `Receptionist` · `Staff Member`

**Permission Model** — Granular module-level permissions.
> Examples: `CREATE_BOOKING` · `UPDATE_HALL` · `DELETE_CUSTOMER` · `VIEW_REPORTS` · `MANAGE_EMPLOYEES`

### Hotel App

| Model | Description |
|---|---|
| **Customer** | Contact & booking profile — booking count, total spending, analytics |
| **Hall** | Venue management — capacity, occupancy, images, upcoming events |
| **Booking** | Core event booking — auto-generated codes, hall/customer assignment, time slots, statuses, revenue |
| **ActivityLog** | Tracks create/update/delete actions across bookings, staff, and payments |
| **Payment** | Booking-linked transactions — multiple methods, partial payments, notes |
| **HallPricing** | Dynamic pricing engine for halls |
| **BookingService** | Additional services attached to bookings |
| **HallAmenity** | Amenities available per hall |

> Example booking codes: `B1001` · `B1002` · `B1003`

---

## 🔒 Security Features

- JWT Authentication with Access & Refresh Tokens
- OTP Verification
- Password Reset Tokens
- Secure Password Hashing
- Role-Based Authorization
- Permission-Based Access
- Login Attempt Monitoring
- User Blocking
- Protected APIs

---

## 🔌 API Features

- RESTful APIs
- Pagination, Filtering & Search
- CSV Export
- Consistent API response shape
- Secure, role-protected endpoints

**Example response:**

```json
{
  "message": "Success",
  "count": 10,
  "data": []
}
```

---

## 💻 Frontend Features

**Next.js 14 App Router**
- Server Components
- Client Components
- Route Protection
- Dynamic Routing
- Context Authentication

**UI**
- Luxury hotel theme with gold hover effects
- Responsive design & sidebar navigation
- RTL Arabic support
- Dashboard analytics
- Reusable components

---

## 🔁 Authentication Flow

### Employee Invitation Flow

```
Admin Creates Employee
        ↓
Invitation Email Sent
        ↓
Employee Activates Account
        ↓
Password Setup
        ↓
Login Access Granted
```

### Forgot Password Flow

```
User Requests Reset
        ↓
OTP Code Sent
        ↓
OTP Verification
        ↓
New Password Creation
        ↓
Secure Login
```

---

## 📁 Project Structure

```
backend/
│
├── user/
├── hotel/
├── utils/
├── config/

frontend/
│
├── app/
├── components/
├── context/
├── services/
├── hooks/
```

---

## 🚀 Future Enhancements

- [ ] Online payments
- [ ] WhatsApp notifications
- [ ] SMS OTP integration
- [ ] Mobile application
- [ ] Hall availability calendar
- [ ] Invoice generation
- [ ] PDF exports
- [ ] Multi-branch hotel support
- [ ] AI-powered analytics
- [ ] Customer portal

---

## 🏢 System Type

This project is designed as:

- Enterprise Hotel Management System
- Event & Venue Management Platform
- Luxury Hospitality ERP
- Role-Based Staff Management System

---

## 🛠️ Built With

<div align="center">

`Django` · `Django REST Framework` · `Next.js 14` · `PostgreSQL` · `React` · `Tailwind CSS` · `JWT Authentication`

</div>

---

<div align="center">

**The Heritage Village** — *Where hospitality meets heritage.*

</div>