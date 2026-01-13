**Summarizer Frontend**
=======================

The **Summarizer Frontend** is a Next.js/React application that allows users to submit text and receive AI-generated summaries. It integrates with **Summarizer/RefineBot Backend API** and includes user **email verification** to ensure secure access.

* * * * *

**Features**
------------

-   Submit text for summarization

-   Instant display of AI-generated summaries

-   Email verification for users after signup

-   Responsive design for desktop and mobile

-   Error handling and loading indicators for better UX

-   Direct integration with the backend API using the **Fetch API**

* * * * *

**Tech Stack**
--------------

-   **Next.js** (React framework)

-   **TypeScript** for type safety

-   **Tailwind CSS** for styling

-   **Fetch API** for all backend requests (summarization, email verification)

-   Deployed on **Vercel**

* * * * *

**Project Structure**
---------------------


* * * * *

**Setup Instructions**
----------------------

1.  **Clone the repository:**

`git clone https://github.com/rabebe/summarizer-frontend.git cd summarizer-frontend `

1.  **Install dependencies:**

`npm install `

1.  **Create a `.env.local` file** in the project root with the following variables:

`NEXT_PUBLIC_API_URL=https://your-backend-api.com


1.  **Start the development server:**

`npm run dev `

The app will be available at `http://localhost:3000`.

* * * * *

**Email Verification Flow**
---------------------------

1.  User signs up or submits their email in the frontend.

2.  Backend generates a verification token and sends an email.

3.  The email link points to `/verify-email?token=<token>` on the frontend.

4.  Frontend extracts the token and calls the backend verification endpoint using **Fetch**.

5.  Verification success or failure is displayed to the user.

* * * * *

**Available Scripts**
---------------------

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production version |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run format` | Runs Prettier to format code |

* * * * *

**Deployment**
--------------

-   **Build the app for production:**

`npm run build `

-   Deploy the `.next` build folder to **Vercel**, **Netlify**, or your preferred hosting platform.

-   Make sure `.env` variables are set in your hosting environment.

* * * * *

**Contributing**
----------------

1.  Fork the repository

2.  Create a branch for your feature (`git checkout -b feature/your-feature`)

3.  Make your changes

4.  Commit your changes (`git commit -m "Add feature"`)

5.  Push your branch (`git push origin feature/your-feature`)

6.  Open a Pull Request

* * * * *