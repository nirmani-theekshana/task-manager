# Task Manager App 📋

A full-stack task management web application inspired by Trello. 
Users can create boards, manage tasks across columns, and drag 
and drop tasks between different stages.

## 🔗 Live Demo
Frontend: [Add your Vercel link here]  
Backend: [Add your Render link here]

## 📸 Screenshots
[Add a screenshot of your app here]

## ✨ Features
- User registration and login with JWT authentication
- Create and delete boards
- Add and delete columns
- Create, update, and delete tasks
- Drag and drop tasks between columns
- Protected routes (only logged in users can access dashboard)

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Context API
- @hello-pangea/dnd (drag and drop)
- Vite

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs

### Database
- PostgreSQL
- Prisma ORM

## 📁 Project Structure
```
task-manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── index.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## 🚀 Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. Clone the repository
```
git clone https://github.com/nirmani-theekshana/task-manager.git
```

2. Setup Backend
```
cd backend
npm install
```

3. Create `.env` file in backend folder
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskmanager"
JWT_SECRET=mysecretkey123
```

4. Run database migration
```
npx prisma migrate dev --name init
```

5. Start backend server
```
npm run dev
```

6. Setup Frontend
```
cd ../frontend
npm install
npm run dev
```

7. Open your browser at `http://localhost:5173`

## 👩‍💻 Author
Nirmani Theekshana  
GitHub: [@nirmani-theekshana](https://github.com/nirmani-theekshana)
