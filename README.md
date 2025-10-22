# OptiVision AI - AI-Powered Ophthalmic EHR

OptiVision AI is an advanced Electronic Health Record (EHR) and clinical decision support system designed for ophthalmology. It leverages state-of-the-art AI, powered by Google's Gemini models and the Genkit framework, to provide clinicians with rapid, data-driven diagnostic insights. The platform enhances clinical efficiency, promotes early disease detection, and ultimately aims to improve patient outcomes.

This project is built with Next.js, React, Tailwind CSS, and ShadCN UI components for a modern, responsive, and professional user interface. The backend is powered by Firebase for authentication and database services, with Genkit orchestrating the AI workflows.

---

## Core Features

-   **Role-Based Dashboards:** Separate, tailored dashboard experiences for Clinicians and Patients.
-   **Patient Management:** Clinicians can register new patients and manage their entire roster from a central dashboard.
-   **AI-Driven Diagnostics:** Upload eye scans (e.g., fundus images) and optional medical documents (PDFs) to receive a comprehensive AI analysis. The analysis includes:
    -   Diagnostic insights and potential abnormalities.
    -   Early detection of disease biomarkers.
    -   Risk assessment and disease staging.
    -   Actionable recommendations for treatment and follow-up tests.
-   **Longitudinal Progression Analysis:** Track and visualize disease progression over time by comparing multiple scans for a single patient, helping to inform treatment adjustments.
-   **Strabismus Screening Tool:** A dedicated feature for patients and clinicians to perform a quick, AI-powered screening for strabismus (crossed eyes) using a device camera or uploaded image.
-   **Automated PDF Reporting:** Instantly generate professional, downloadable PDF reports of AI analyses, suitable for inclusion in medical records.
-   **End-to-End Encryption:** Sensitive patient data (medical history, clinical notes) is encrypted on the client side, ensuring data privacy and security.
-   **Google Drive Backup:** Clinicians can export and back up all their patient and scan data securely to their personal Google Drive.

---

## Technology Stack

-   **Frontend:** Next.js, React, TypeScript
-   **Styling:** Tailwind CSS, ShadCN UI
--   **State Management:** React Hooks
-   **AI Orchestration:** Google Genkit
-   **Generative AI Models:** Google Gemini (for multi-modal analysis)
-   **Authentication:** Firebase Authentication (Email/Password, Google, Phone)
-   **Database:** Firestore
-   **Deployment:** Vercel

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A Firebase project with Authentication (Email/Password, Google, Phone providers enabled) and Firestore enabled.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase project credentials. You can find these in your Firebase project settings.

```
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# Google AI API Key for Genkit
# Get one from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...

# Firebase Admin SDK for Server-side Operations (e.g., Google Drive Export)
# Generate this from your Firebase Project Settings > Service Accounts
FIREBASE_SERVICE_ACCOUNT=
```

**Important:** For the `FIREBASE_SERVICE_ACCOUNT`, you need to generate a new private key (JSON file) from your Firebase project's service account settings. Copy the entire content of that JSON file and paste it as the value for `FIREBASE_SERVICE_ACCOUNT`.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### 5. Run the Genkit Development Server (Optional)

To inspect AI flows and traces, you can run the Genkit development UI in a separate terminal.

```bash
npm run genkit:dev
```

This will start the Genkit developer UI, typically available at `http://localhost:4000`.
