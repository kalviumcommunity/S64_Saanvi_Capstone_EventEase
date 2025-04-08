# EventEase - A One-Stop Event Planning Hub
## Project Idea
EventEase is a web-based event planning platform designed to simplify and streamline the process of organizing small-scale events such as weddings, birthdays, and local festivals. The platform connects event planners with vendors, offers real-time event execution tracking, and enhances collaboration through task assignments and guest management. 
## Key Features
- **Event Dashboard** – Manage all aspects of an event from one place.
- **Vendor Marketplace** – Discover, filter, and book service providers.
- **Budget Tracker** – Monitor expenses and payments.
- **Guest & Invitation Management** – Send WhatsApp invitations with RSVP options.
- **Logistics & Execution Tracking** – Track vendor status, deliveries, and last-minute backups.
- **Business Growth for Vendors** – Leaderboards, insights, and social media sharing.
## Tech Stack
- **Frontend:** React.js + Tailwind CSS (for modern UI and fast development)
- **Backend:** Node.js + Express.js (for scalable API handling)
- **Database:** MongoDB (for flexible data storage and retrieval)
- **Authentication:** JWT (username/password) + Google OAuth (third-party login)
- **Data Syncing:** API polling (every 30 seconds, instead of WebSockets)
- **Deployment:** Vercel (Frontend) + Render/AWS (Backend)
- **Testing:** Jest (unit tests for APIs & React components)
- **Notifications:** Nodemailer (email alerts) + WhatsApp API (invites and RSVPs)
## Capstone Journey Plan

### Week 1 - Project Setup & Design

**Day 1-2:**
- Finalize project scope, gather feedback from the mentor.
- Document all planned features and expected outcomes.
**Day 3-4:**
- Create low-fidelity wireframes using Figma or Adobe XD.
- Develop high-fidelity wireframes focusing on user experience (UI/UX).
- Get feedback on wireframes and make necessary adjustments.
**Day 5-6:**
- Set up GitHub repository with proper documentation.
- Create a README file, project board, and organize issues.
- Set up GitHub workflows for version control.
**Day 7:**
- Initialize React project and configure Tailwind CSS.
- Implement basic routing and folder structure.
### Week 2 - Backend Development

**Day 8-9:**
- Set up Node.js backend with Express.js.
- Implement middleware for authentication and error handling.
**Day 10-11:**
- Define database schema in MongoDB (Users, Events, Vendors, RSVPs, Payments).
- Set up database connection and ORM setup (if needed).
**Day 12:**
- Implement authentication with JWT and Google OAuth.
- Create user registration and login API endpoints.
**Day 13:**
- Implement core backend APIs:
  - Event creation, updates, and deletion.
  - Vendor listing and filtering.
  - RSVP management
**Day 14:**
- Deploy backend on Render/AWS.
- Test API endpoints using Postman/Bruno.
### Week 3 - Frontend Development (Basic UI + API Integration)

**Day 15-16:**
- Develop core React components:
  - Event dashboard (tasks, budget, and calendar views).
  - Vendor marketplace UI.
**Day 17-18:**
- Integrate authentication flow.
- Set up protected routes and session management.
**Day 19-20:**
- Implement API integration with frontend (fetching and displaying data).
- Design interactive forms for event creation and vendor bookings.
**Day 21:**
- Implement vendor search, filters, and sorting logic.
### Week 4 - Advanced Features & Testing

**Day 22-23:**
- Implement RSVP and WhatsApp invitation system:
  - Generate RSVP links with Yes/Maybe/No options.
  - Send invitations via WhatsApp with pre-filled messages.
**Day 24-25:**
- Implement logistics tracking and backup vendor system:
  - Live status updates from vendors.
  - Backup vendor recommendations based on location and availability.
**Day 26:**
- Implement Jest unit tests for API endpoints and frontend components.
**Day 27:**
- Deploy frontend on Vercel.
- Conduct cross-browser testing and fix UI bugs.
**Day 28:**
- Perform security checks and optimize performance.
### Week 5 - Final Touches & Submission

**Day 29:**
- Prepare documentation and proof of work:
  - PR links, feature demo videos, and detailed reports.
  - Record walkthrough video showcasing key functionalities.

**Day 30:**
- Conduct final testing and debugging.
- Submit the project for evaluation.
- Share deployment links and documentation with the mentor.



