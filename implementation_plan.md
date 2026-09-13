# ZeeNotes Application Implementation Plan

Based on your new requirements, we have divided the project into two main sections: **Sticky Notes** and **Personal Diary**. 

We will also use **Tailwind CSS** as per your explicit request for fast, mobile-responsive styling.

## User Review Required

> [!IMPORTANT]
> Please review the detailed step-by-step plan below. Once you approve this, we will start with Step 1.

## Open Questions

1. **Authentication:** Since this has personal diary files, do we need a basic login system so your data remains private? (Or should we skip it for now and make it a single-user app?)
2. **Database:** Should we proceed with setting up the Neon database in Step 2, or do you want to keep the data in local storage (browser) initially?

---

## Step-by-Step Execution Plan (Total 5 Steps)

### Step 1: Tailwind CSS Setup & Base Layout
- Re-install and configure Tailwind CSS in the Next.js project.
- Create the main navigation/sidebar to switch between "Sticky Notes" and "Personal Diary".
- Set up the global layout ensuring complete mobile responsiveness.

### Step 2: Database Setup (Neon + Drizzle ORM)
- Configure the connection to Neon PostgreSQL.
- Create two tables:
  - `sticky_notes` (id, content, color, shape, position/order, created_at)
  - `diary_files` (id, title, content_html, created_at)
- Create Next.js Server Actions for saving and fetching data.

### Step 3: Feature 1 - Sticky Notes Board
- **Component Design:** Build reusable sticky note components using Tailwind.
  - *Shapes:* Square, Rectangle, Circle, and Triangle (using CSS borders/clip-path for triangles).
  - *Colors:* Dynamic vibrant pastel colors.
- **Functionality:** Add new notes, edit text inside them, and delete them.
- **Responsiveness:** Ensure the grid looks perfect on both desktop and mobile screens.

### Step 4: Feature 2 - Personal Diary & Text Editor
- **File System UI:** A sidebar or list view to create and manage different diary files.
- **Text Editor:** Integrate a lightweight, simple Rich Text Editor (e.g., `react-quill` or `tiptap` configured for basics).
  - *Options included:* Font style (Bold/Italic/Underline), Font Size, and Font Color.
- **Auto-save:** Connect the editor to the database to save entries.

### Step 5: PDF Export Feature
- Integrate a library (like `html2pdf.js` or `@react-pdf/renderer`).
- Add an "Export to PDF" button on the diary page.
- Generate a beautifully formatted PDF of the diary entry directly from the browser.

---

## Verification Plan
- **Mobile Testing:** Verify the Sticky Notes board stacks correctly on mobile screens.
- **Editor Testing:** Ensure basic text formatting works and saves correctly to the database.
- **PDF Export Testing:** Download a PDF and verify the formatting matches the diary content.
