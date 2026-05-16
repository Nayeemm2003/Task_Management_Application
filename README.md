**Team Task Manager - Full Stack Project Management System**

**Executive Summary**

The **Team Task Manager** is a comprehensive, full-stack web application designed to streamline project and task management within organizations. The system provides role-based access control, enabling administrators to manage projects and team members while allowing regular members to track and update their assigned tasks efficiently.

**Live Application URL:** [front-end-production-7bbe.up.railway.app]

---

**Project Overview**

| **Aspect** | **Details** |
|------------|-------------|
| **Project Name** | Team Task Manager |
| **Version** | 1.0.0 |
| **Status** | Production Ready |
| **Deployment Platform** | Railway (Backend & Database) |
| **License** | MIT |

---

 **Core Features**

 1. Authentication & Authorization
- **Secure User Registration** - New users can create accounts with email and password
- **JWT-based Authentication** - Secure token-based authentication system
- **Role-Based Access Control (RBAC)** - Two distinct user roles:
  - **Administrator** - Full system access, user management, project creation/deletion
  - **Team Member** - View assigned tasks, update task status, limited project access

 2. Dashboard Analytics
- **Real-time Statistics** - Visual representation of task metrics
- **Task Completion Charts** - Graphical analysis of task progress
- **Recent Activity Feed** - Quick overview of recent tasks
- **Overdue Task Alerts** - Automatic highlighting of delayed tasks

 3. Project Management
- **Create Projects** - Administrators can create new projects with descriptions
- **Team Assignment** - Add members to specific projects
- **Project Status Tracking** - Monitor project lifecycle (Active/Completed/Archived)
- **Project Ownership** - Track project creators and managers

4. Task Management
- **Task Creation** - Create tasks with titles, descriptions, and due dates
- **Priority Levels** - Assign priority (Low/Medium/High) to tasks
- **Status Tracking** - Update task status (Pending/In-Progress/Completed)
- **Task Assignment** - Assign tasks to specific team members

---

 **Technical Architecture**

Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18.x | JavaScript runtime environment |
| Express.js | v4.18.x | Web application framework |
| MongoDB | v8.x | NoSQL database |
| Mongoose | v8.x | MongoDB ODM for data modeling |
| JSON Web Tokens | v9.x | Authentication & authorization |
| Bcrypt.js | v2.4.x | Password hashing and security |
| CORS | v2.8.x | Cross-origin resource sharing |
| Dotenv | v16.3.x | Environment variable management |

**Frontend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | v18.2.x | User interface library |
| React Router DOM | v6.20.x | Client-side routing |
| Tailwind CSS | v3.3.x | Utility-first styling framework |
| Axios | v1.6.x | HTTP client for API requests |
| Framer Motion | v10.16.x | Animation library |
| Chart.js | v4.4.x | Data visualization |
| React Hot Toast | v2.4.x | Notification system |
| React Icons | v4.12.x | Icon library |

 **Deployment Infrastructure**

| Service | Provider | Purpose |
|---------|----------|---------|
| Application Hosting | Railway | Full-stack deployment platform |
| Database | MongoDB Atlas | Cloud database service |
| Version Control | GitHub | Source code management |

---

**Database Schema Design**

User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member']),
  createdAt: Date (default: Date.now)
}



API Endpoints Documentation
Authentication Routes (/api/auth)
Method	Endpoint	Description	Access
POST	/signup	Register new user account	Public
POST	/login	Authenticate user and receive JWT	Public
GET	/me	Retrieve current user information	Private
GET	/users	Get all registered users	Admin Only
Project Routes (/api/projects)
Method	Endpoint	Description	Access
GET	/	Retrieve all accessible projects	Private
POST	/	Create a new project	Admin Only
GET	/:id	Get specific project details	Private
PUT	/:id	Update project information	Admin Only
DELETE	/:id	Delete a project	Admin Only
POST	/:id/members	Add member to project	Admin Only
Task Routes (/api/tasks)
Method	Endpoint	Description	Access
GET	/	Retrieve all accessible tasks	Private
POST	/	Create a new task	Private
GET	/project/:projectId	Get tasks by project	Private
PUT	/:id	Update task details	Private
DELETE	/:id	Delete a task	Admin Only
GET	/dashboard/stats	Get dashboard statistics	Private
Installation & Setup Guide
Prerequisites
Ensure the following software is installed on your system:

bash
Node.js (v18 or higher)
MongoDB (v6 or higher)
npm (v9 or higher) or yarn
Git
Local Development Setup
Step 1: Clone the Repository
bash
git clone https://github.com/Nayeemm2003/Task_Management_Application.git
cd Task_Management_Application
Step 2: Backend Configuration
bash
cd "Back End"
npm install
Create a .env file in the backend directory:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
Start the backend server:

bash
npm start
# or for development with auto-reload
npm run dev
Step 3: Frontend Configuration
bash
cd "../Front end"
npm install
Create a .env file in the frontend directory:

env
REACT_APP_API_URL=http://localhost:5000
Start the frontend development server:

bash
npm start
Step 4: Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

Deployment Guide
Deploying to Railway (Production)
Create a Railway Account

Visit railway.app

Sign up using GitHub credentials

Create New Project

Click "New Project"

Select "Deploy from GitHub repo"

Choose the repository: Task_Management_Application

Add MongoDB Database

Click "New" → "Database" → "MongoDB"

Wait for automatic provisioning

Deploy Backend Service

Add another service from GitHub

Set Root Directory to Back End

Configure environment variables:

text
PORT=5000
JWT_SECRET=production_secret_key
Deploy Frontend Service

Add another service from GitHub

Set Root Directory to Front end

Configure environment variable:

text
REACT_APP_API_URL=https://your-backend-url.railway.app
Generate Public URLs

Navigate to each service → Settings → Networking

Click "Generate Domain"

Copy the generated URLs for access

Testing Guide
Backend API Testing
Test the backend API using curl or Postman:

bash
Health Check
curl https://your-backend-url.railway.app/

User Registration
curl -X POST https://your-backend-url.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"admin"}'

User Login
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
Frontend Testing
Test Case	Expected Result
User Registration	New account created successfully
User Login	Redirect to dashboard
Create Project	Project appears in projects list
Create Task	Task appears in tasks table
Update Task Status	Status changes immediately
Admin Access	Can see all projects and tasks
Member Access	Only sees assigned items

Project Structure
text
Task_Management_Application/
│
├── Back End/                          # Backend application
│   ├── models/                        # Database schemas
│   │   ├── User.js                    # User model
│   │   ├── Project.js                 # Project model
│   │   └── Task.js                    # Task model
│   ├── routes/                        # API routes
│   │   ├── auth.js                    # Authentication endpoints
│   │   ├── projects.js                # Project endpoints
│   │   └── tasks.js                   # Task endpoints
│   ├── middleware/                    # Custom middleware
│   │   └── auth.js                    # JWT verification
│   ├── server.js                      # Application entry point
│   └── package.json                   # Backend dependencies
│
├── Front end/                         # Frontend application
│   ├── public/                        # Static assets
│   │   └── index.html                 # Main HTML file
│   ├── src/
│   │   ├── components/                # Reusable components
│   │   │   └── Navbar.js              # Navigation component
│   │   ├── pages/                     # Page components
│   │   │   ├── Login.js               # Login page
│   │   │   ├── Signup.js              # Registration page
│   │   │   ├── Dashboard.js           # Dashboard page
│   │   │   ├── Projects.js            # Projects page
│   │   │   └── Tasks.js               # Tasks page
│   │   ├── context/                   # React context
│   │   │   └── AuthContext.js         # Authentication context
│   │   ├── App.js                     # Main component
│   │   ├── index.js                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── package.json                   # Frontend dependencies
│   └── tailwind.config.js             # Tailwind configuration
│
├── .gitignore                         # Git ignore rules
└── README.md                          # Project documentation
Troubleshooting Guide
Common Issues and Solutions
Issue	Possible Cause	Solution
Build fails on Railway	Incorrect root directory	Set Root Directory to Back End or Front end
Frontend can't reach backend	Missing environment variable	Add REACT_APP_API_URL in frontend variables
MongoDB connection error	Invalid connection string	Verify MONGODB_URI environment variable
401 Unauthorized error	Invalid or expired token	Login again to generate new token
CORS errors	Backend not configured for frontend URL	Update CORS settings in server.js
Module not found	Missing dependencies	Run npm install in both directories
Debugging Commands
bash
 Check backend logs
railway logs --service backend

 Check frontend build status
railway logs --service frontend

Test API endpoint
curl -I https://your-backend-url.railway.app/api/auth/me
Future Enhancement Roadmap
Priority	Feature	Expected Release
High	Email notifications for task assignments	Q1 2025
High	File attachments for tasks	Q1 2025
Medium	Real-time updates with WebSockets	Q2 2025
Medium	Task comments and discussions	Q2 2025
Medium	Export reports (PDF/CSV)	Q2 2025
Low	Calendar view for tasks	Q3 2025
Low	Mobile native application	Q4 2025


Support & Contact
Role	Name	Contact
Developer	MD NAYEEM	GitHub: @Nayeemm2003
Project Repository	-	[GitHub Link](https://github.com/Nayeemm2003/Task_Management_Application)

