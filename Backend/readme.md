# AI Prompt for Django Models-Based System Generation

You are a Senior Full Stack Engineer and Django Architect.

I will provide you with a Django `models.py` file for a Hall Booking & Event Management System.

Your task is to deeply analyze the models, relationships, business logic, validations, and helper methods, then generate production-level architecture, APIs, frontend structures, admin dashboards, serializers, permissions, and documentation.

## Requirements

### 1. Analyze Models Completely

Understand:

* ForeignKey relationships
* Related names
* Validators
* Business logic
* Helper methods
* Aggregation methods
* Status fields
* Time slot handling
* Reporting functions
* Pricing logic
* Payment tracking
* Amenities and services structure

---

## Models Included

### Core Modules

* Customer
* Hall
* Booking
* ActivityLog
* Payment
* HallPricing
* BookingService
* HallAmenity

---

# Generate the Following

## A. System Architecture

Create:

* Full backend architecture
* Modular Django app structure
* Suggested folder structure
* Service layer architecture
* Repository pattern (if needed)
* Utility modules
* Permissions architecture
* Signals structure
* Caching strategy
* Reporting architecture

---

## B. Django REST Framework APIs

Generate:

* Models
* Serializers
* ViewSets
* APIViews
* URLs
* Filters
* Pagination
* Search
* Ordering
* Swagger/OpenAPI documentation
* JWT Authentication integration

For every model create:

* CRUD APIs
* Search APIs
* Dashboard APIs
* Statistics APIs
* Export APIs

---

## C. Dashboard APIs

Generate APIs for:

* Total revenue
* Monthly revenue
* Hall occupancy
* Upcoming bookings
* Customer growth
* Booking trends
* Popular halls
* Pending payments
* Booking status analytics
* Payment analytics

---

## D. Booking Business Logic

Implement:

* Prevent double booking
* Time slot validation
* Hall availability checking
* Auto booking code generation
* Dynamic pricing calculation
* Service cost addition
* Total invoice calculation
* Payment balance calculation
* Cancellation logic

---

## E. Frontend Structure (React / Next.js)

Generate:

* Modern admin dashboard
* Responsive UI structure
* Sidebar navigation
* Table views
* Form structures
* Analytics charts
* Booking calendar
* Hall cards
* Revenue reports UI
* Payment tracking UI

Use:

* Next.js
* Tailwind CSS
* TypeScript
* Shadcn UI
* React Query
* Axios

---

## F. Database Design

Generate:

* ER Diagram explanation
* Table relationships
* Index recommendations
* Query optimization suggestions
* Performance improvements

---

## G. Permissions & Roles

Create roles:

* Admin
* Manager
* Data Entry
* CEO

Define:

* CRUD permissions
* Report access
* Dashboard access
* Financial access
* Booking approval permissions

---

## H. Signals & Automation

Generate Django signals for:

* Activity logs
* Revenue recalculation
* Customer statistics update
* Hall booking count update
* Notifications
* Booking status changes

---

## I. Reports & Export System

Generate:

* Revenue reports
* Customer reports
* Payment reports
* Hall occupancy reports

Support:

* Excel export
* CSV export
* PDF export

---

## J. Advanced Features

Suggest and implement:

* Notification system
* Email reminders
* SMS reminders
* Booking calendar sync
* Audit logs
* Soft delete system
* Role-based dashboards
* Multi-language support (English/Arabic)
* Media management
* File uploads

---

## K. Code Quality Requirements

All generated code must:

* Follow clean architecture
* Be production-ready
* Use best practices
* Include comments
* Use type hints where possible
* Be scalable and maintainable
* Follow PEP8 standards
* Include validation and error handling

---

# Important Notes

* The project is a Hall Booking & Event Management System.
* Customers do NOT have login accounts.
* Staff users manage bookings and halls.
* Arabic + English support is required.
* Dashboard performance is important.
* Avoid N+1 query problems.
* Use optimized queryset strategies.

---

# Expected Output

Provide:

1. Complete architecture explanation
2. Backend code
3. Frontend code
4. API documentation
5. Database explanation
6. Business logic explanation
7. Security recommendations
8. Scalability recommendations
9. Deployment suggestions
10. Production optimization tips

Now analyze the provided Django models and generate the complete professional system.
