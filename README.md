# Tutoring Platform Backend

This is a complete backend API for a tutoring platform (JEE, NEET, SAT, etc.) built with Node.js, Express, Prisma, and Supabase.

## Tech Stack
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Auth**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Validation**: Zod
- **Testing**: Jest + Supertest

## Setup Instructions for Beginners

Since you are adding contents and have no coding knowledge, follow these steps to get your backend online:

### 1. Create a Supabase Account
1. Go to [Supabase](https://supabase.com/) and create a free account.
2. Create a new "Project".
3. Once the project is created, go to **Project Settings -> API**.
   - Copy the `Project URL` (This is your `SUPABASE_URL`)
   - Copy the `anon` `public` key (This is your `SUPABASE_ANON_KEY`)
   - Copy the `service_role` `secret` key (This is your `SUPABASE_SERVICE_ROLE_KEY`)
   - Copy the `JWT Secret` from **Project Settings -> API -> JWT Settings** (This is your `SUPABASE_JWT_SECRET`)
4. Go to **Project Settings -> Database**.
   - Copy the `Connection String (URI)` (This is your `DATABASE_URL`). Make sure to replace `[YOUR-PASSWORD]` with your actual database password.
5. Go to **Storage** in the left sidebar.
   - Click "New Bucket" and name it exactly `media`.
   - Make sure to check the box to make the bucket **Public**.

### 2. Configure Environment Variables
1. Open the `.env.example` file in this folder.
2. Save it as `.env` (just rename it, keep it in the same folder).
3. Paste all the keys you copied from Supabase into the correct variables.

### 3. Setup the Database
1. Open a terminal or command prompt in this folder.
2. Run this command to upload your database structure to Supabase:
   ```bash
   npx prisma db push
   ```
   *(This tells Prisma to create all the tables for your courses, lessons, etc. based on your schema)*

### 4. Run the Server Locally
To start the API on your own computer:
```bash
npm run dev
```
The server will start at `http://localhost:4000`.

### 5. Deploying Online
If you want the API to be available on the internet (which you need for a real app), you can use a free service like **Render** or **Railway**.
1. Create a GitHub account, and upload this folder as a new repository.
2. Sign up on [Render.com](https://render.com/).
3. Click "New Web Service" and connect your GitHub repo.
4. Set the "Build Command" to: `npm install && npm run build`
5. Set the "Start Command" to: `npm start`
6. Important: In the Render dashboard, go to "Environment", and add ALL the variables from your `.env` file one by one.
7. Click Deploy!

## API Usage
You can use tools like Postman to interact with the `/api/auth`, `/api/courses`, and `/api/lessons` endpoints, or connect a Frontend (like Next.js) to it.
