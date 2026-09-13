# Zohaib-Notes 🚀

Zohaib-Notes is a premium, full-stack Next.js workspace that features an interactive Sticky Notes board and a Personal Diary with rich-text editing and PDF export capabilities.

## Features ✨
- **Sticky Notes Board**: Create, drag, resize, and color-code sticky notes with different shapes.
- **Personal Diary**: Rich text editor (Tiptap) with real-time autosave.
- **PDF Export**: Convert any diary entry into a clean, downloaded PDF file.
- **Secure Access**: Protected by a 6-digit PIN code.
- **Database Integrated**: Data is fully synced and persisted using a PostgreSQL database (Neon) & Drizzle ORM.
- **Modern UI**: Dark/Light mode, vibrant gradients, and fully responsive.

---

## 🛠️ Getting Started (Step-by-Step Setup)

Follow these instructions to clone the project, set up your environment, and run the app locally.

### 1. Clone the Repository
Open your terminal and run the following command to download the code to your computer:
`ash
git clone https://github.com/ZohaibandSaeed/ZeeNotes.git
cd ZeeNotes
`

### 2. Install Dependencies
Install all required NPM packages:
`ash
npm install
`

### 3. Setup Environment Variables (.env)
You need to create a .env file in the root folder of the project. You can copy the provided .env.example file:
`ash
cp .env.example .env
`
Open the .env file in your code editor and set the following variables:

- DATABASE_URL: Your Neon PostgreSQL connection string. (Go to [Neon.tech](https://neon.tech), create a database, and copy the connection string).
- APP_PASSWORD: The 6-digit PIN used to unlock the workspace (e.g., 123456).

*Example .env file:*
\\\env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
APP_PASSWORD="123456"
\\\

### 4. Setup the Database (Drizzle Push)
Push the database schema to your Neon PostgreSQL database to create the required tables (\settings\, \sticky_notes\, \diary_files\):
`ash
npx drizzle-kit push
`

### 5. Run the Application
Start the development server:
`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser. Enter your 6-digit PIN to access the workspace!

---

## 🚀 Deployment (Netlify or Vercel)

If you want to deploy this app live to Netlify or Vercel:
1. Connect this GitHub repository to your hosting provider.
2. In the hosting dashboard, add the Environment Variables (\DATABASE_URL\ and \APP_PASSWORD\).
3. Set the build command to \
pm run build\ and publish directory to \.next\.
4. Deploy!
