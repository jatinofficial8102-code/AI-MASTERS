# APAAR ID Portal — Unified Student Data Management & Verification System

<div align="center">

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A secure, centralized, and verifiable academic credential portal aligned with India's "One Nation, One Student ID" (APAAR) initiative by the Ministry of Education & AICTE.**

[Explore Features](#key-features) • [Quick Start](#getting-started) • [Database Setup](#database-setup-supabase) • [Architecture](#system-architecture) • [Contributing](#contributing)

</div>

---

## 📌 Executive Summary

The **APAAR (Automated Permanent Academic Account Registry)** ID Portal is an institutional-grade platform designed to streamline student identity lifecycle management, credit transfer tracking (Academic Bank of Credits), and cryptographic credential verification across all AICTE and UGC accredited institutions.

### Key Objectives
- **Single Source of Truth**: Eliminate fragmented student records across multiple universities and colleges.
- **Tamper-Proof Verification**: Instant validation of degrees and marksheets via digitally verifiable credentials and QR code hashes.
- **Student Data Sovereignty**: Empower students with a granular **Consent Manager** to grant and revoke data access to recruiters, government bodies, and universities.
- **National NEP 2020 Compliance**: Seamless integration with the Academic Bank of Credits (ABC) ecosystem.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🪪 **Digital APAAR ID Card** | Generates official, high-resolution student identity cards with scannable QR verification, dynamic badges, and instant PDF/PNG export. |
| 📈 **Academic Records & Analytics** | Interactive semester-wise CGPA/SGPA tracking, credit accumulation visualizer (Recharts), and course progression metrics. |
| 🗄️ **DigiLocker Document Vault** | Encrypted repository for degree certificates, transcripts, migration letters, and government-issued proofs with verification timestamps. |
| 🔍 **Verification & QR Center** | On-demand credential authenticity check powered by SHA-256 hash validation for employers and educational auditors. |
| 🛡️ **Access & Consent Manager** | Granular data sharing policies allowing students to authorize, monitor, or revoke institutional data queries in real-time. |
| 🏛️ **Affiliated Institutions Hub** | Directory of AICTE/UGC institutions, NIRF rankings, NAAC accreditation, and credit exchange affiliations. |
| 🔐 **Enterprise Auth (Supabase)** | Robust session management, password resets, role-based access control, and row-level security (RLS) policies. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Student / Admin / Verifier]) -->|HTTPS / TLS| FE[React 19 + Vite Frontend]
    FE --> Router[React Router v7]
    Router --> Pages[Dashboard | Records | Documents | Consent | Verification]
    
    subgraph State & Security
        Pages --> Context[AppContext & Auth Provider]
        Context --> SupabaseClient[Supabase Client SDK]
    end

    subgraph Backend Services
        SupabaseClient --> Auth[Supabase Authentication]
        SupabaseClient --> DB[(PostgreSQL Database)]
        SupabaseClient --> Storage[Document Storage Vault]
    end

    subgraph Verification Ecosystem
        Pages --> QR[QR Code & Hash Verifier]
        QR --> Verifier[DigiLocker / AICTE Gateway]
    end
```

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (micro-animations), [Lucide React](https://lucide.dev/) (icons)
- **Data Visualization**: [Recharts](https://recharts.org/) (academic performance curves & credit charts)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Backend / BaaS**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Row-Level Security, Storage)
- **Linter & Quality**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

Follow these steps to run the portal locally on your workstation.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **pnpm** / **yarn**
- A **Supabase** account (Free tier supported)

### 1. Clone the Repository
```bash
git clone https://github.com/jatinofficial8102-code/AI-MASTERS.git
cd AI-MASTERS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Database Setup (Supabase)
Run the provided SQL migration in your Supabase SQL Editor:
1. Go to your Supabase project dashboard: [app.supabase.com](https://app.supabase.com)
2. Open the **SQL Editor** tab from the left sidebar.
3. Paste the contents of `supabase/migrations/20261028000000_init_apaar_schema.sql` and click **Run**.
4. This sets up the students, academic records, documents, consent logs, and RLS policies.

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

In the project directory, you can run:

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript types and builds the production-optimized bundle in `dist/`. |
| `npm run preview` | Locally serves the production build from `dist/` for sanity checking. |
| `npm run lint` | Runs Oxlint for ultra-fast static code analysis and linting. |

---

## 📁 Project Structure

```plaintext
AI-MASTERS/
├── .github/                  # GitHub Actions CI & issue/PR templates
│   ├── workflows/ci.yml      # Automated lint and build pipeline
│   ├── ISSUE_TEMPLATE/       # Bug and feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                   # Static assets & government icons
├── src/
│   ├── assets/               # Logos, banners, vector illustrations
│   ├── components/           # Reusable UI component library
│   │   ├── auth/             # Login, Register, ProtectedRoute wrappers
│   │   ├── common/           # Buttons, Badges, Modals, Toast system
│   │   ├── dashboard/        # Stat cards, ID card preview, credit gauges
│   │   ├── layout/           # Navbar, collapsible responsive Sidebar, Footer
│   │   └── modals/           # ModalRoot, ID card download, credential share
│   ├── context/              # AppContext (user session, theme, notifications)
│   ├── data/                 # Demonstration datasets & mock institutional records
│   ├── pages/                # Main application views
│   │   ├── auth/             # Authentication screens (Login, Register, Forgot)
│   │   ├── AcademicRecords.tsx  # Semester grades & credit breakdown
│   │   ├── AccessConsent.tsx    # Third-party data authorization manager
│   │   ├── Dashboard.tsx        # Central student overview & ID card
│   │   ├── Documents.tsx        # DigiLocker certificates & file vault
│   │   ├── Institutions.tsx     # Affiliated colleges & university directory
│   │   ├── MyProfile.tsx        # Personal & academic profile management
│   │   ├── Notifications.tsx    # Alerts and verification updates
│   │   ├── Settings.tsx         # Security settings & notification prefs
│   │   └── VerificationCenter.tsx # Instant QR/Document verification
│   ├── types/                # TypeScript type definitions & interfaces
│   ├── utils/                # Supabase client helpers & formatters
│   ├── App.tsx               # Main routing & application layout
│   ├── index.css             # Tailwind design tokens & utility classes
│   └── main.tsx              # React DOM root entry point
├── supabase/
│   └── migrations/           # Complete database schema & RLS policies
├── .env.example              # Template environment configuration
├── .gitignore                # Git ignore configuration
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # Custom palette (gov-blue, slate, accents)
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

---

## 🛡️ Security & Privacy Standards

- **Zero-Knowledge Consent**: Data sharing requests are explicitly logged with expiration dates and student revocation capabilities.
- **Row-Level Security (RLS)**: Enforced via PostgreSQL policies to ensure users can only query their own verified records.
- **Credential Protection**: Strict `.gitignore` rules prevent accidental commits of API keys or `.env` secrets.
- **Tamper Evident**: Marksheet hashes prevent unauthorized grade tampering or forged certificates.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes with clear messages (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request following our [PR Template](.github/PULL_REQUEST_TEMPLATE.md).

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for full details on code conventions.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🏛️ Acknowledgments & References

- **Ministry of Education, Government of India** — APAAR & National Education Policy (NEP 2020)
- **All India Council for Technical Education (AICTE)** — Student verification and institutional compliance
- **Academic Bank of Credits (ABC)** — Digital credit transfer protocols
- **Smart India Hackathon (SIH)** — Problem Statement SIH26263
