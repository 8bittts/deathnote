# Death Note: Digital Legacy Management

<div align="center">
  <img src="public/logo.svg" alt="Death Note Logo" width="200" />
</div>

Death Note is a secure digital legacy management platform that enables users to create and store messages that will be delivered to their designated contacts only when they're no longer able to verify their status. Using a sophisticated proof-of-life verification system, the application ensures your final messages remain private until the appropriate time.

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.1.0-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0.0-blue)

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Data Flow](#-data-flow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication](#-authentication)
- [Components](#-components)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)

## 🌟 Features

- **Secure Message Creation**: Craft detailed final messages with a full-featured rich text editor
- **Automated Verification System**: Regular check-ins ensure your messages remain private
- **Contact Management**: Designate and manage trusted recipients for your messages
- **Theme Options**: Light, Dark, and "Shinigami" modes for personalized user experience
- **Verification History**: Track all past check-ins and verifications
- **Premium Features**: Extended verification periods, unlimited contacts, and custom notifications
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **End-to-End Encryption**: Your sensitive data is always protected

## 🏗 Architecture

The Death Note application uses a modern, component-based architecture built on Next.js App Router with a focus on server components where possible and client components where interactivity is needed.

```mermaid
graph TD
    A[Client] --> B[Next.js App Router]
    B --> C[Clerk Authentication]
    B --> D[Server Components]
    B --> E[Client Components]
    D --> F[API Routes]
    E --> G[UI Components]
    F --> H[External Services]
    G --> I[User Interface]
```

### Core Module Structure

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│  Authentication     │─────▶│     Dashboard       │─────▶│  Message Editor     │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
          │                            │                            │
          │                            │                            │
          ▼                            ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│   User Settings     │      │ Verification System │      │  Contact Manager    │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

## 🔄 Data Flow

The application follows a unidirectional data flow pattern:

```mermaid
flowchart TD
    A[User Action] --> B[State Update]
    B --> C[Component Re-render]
    C --> D[UI Update]
    D --> A
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant Auth as Clerk Auth
    participant API as API Routes
    participant DB as Database

    U->>C: Login Request
    C->>Auth: Authentication Request
    Auth->>Auth: Validate Credentials
    Auth->>C: JWT Token
    C->>API: Request with JWT
    API->>Auth: Verify Token
    Auth->>API: Token Valid
    API->>DB: Fetch User Data
    DB->>API: User Data
    API->>C: Protected Response
    C->>U: Display Protected Content
```

### Verification System

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant D as Database
    participant N as Notification Service
    participant C as Contacts

    U->>S: Regular Check-in
    S->>D: Log Verification
    S->>D: Reset Timer
    
    alt No Check-in for X Days
        D->>S: Timer Expired
        S->>S: Final Verification Attempts
        alt No Response
            S->>N: Trigger Notifications
            N->>C: Send Final Messages
        end
    end
```

## 🛠 Tech Stack

- **Frontend**:
  - Next.js 15.3.2
  - React 19.0.0
  - TypeScript 5.0+
  - Tailwind CSS 4.0
  - Framer Motion 12.11.0
  - Shadcn UI Components

- **Authentication**:
  - Clerk Authentication

- **Rich Text Editing**:
  - TipTap Editor

- **State Management**:
  - React Hooks
  - Context API

- **Data Visualization**:
  - Recharts

- **Form Handling**:
  - React Hook Form
  - Zod Validation

## 📁 Project Structure

```
/src
  /app                     # Next.js App Router
    /(auth)                # Protected routes
      /dashboard           # Main dashboard
      /editor              # Message editor
      /contacts            # Contact management
      /verification        # Verification history
      /settings            # User settings
    /api                   # API routes
    /sign-in               # Authentication pages
    /sign-up
  /components              # Reusable components
    /ui                    # UI components (Shadcn)
    /icons                 # SVG icons and logos
  /lib                     # Utility functions
  /hooks                   # Custom React hooks
  /types                   # TypeScript type definitions
  /styles                  # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/8bittts/deathnote.git
   cd deathnote
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Then edit .env.local with your API keys
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:4321](http://localhost:4321) in your browser to view the application.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret API key | Yes |
| `NEXT_PUBLIC_VERIFICATION_PERIOD_DAYS` | Default verification period (days) | No (default: 7) |
| `NEXT_PUBLIC_APP_URL` | Application URL for callbacks | Yes |

## 🔑 Authentication

Death Note uses Clerk for authentication, providing:

- Email/password authentication
- Social login options
- Two-factor authentication
- Session management
- User profile management

Authentication is handled through middleware that protects all routes within the `(auth)` folder.

## 🧩 Components

The application uses a combination of custom components and Shadcn UI components, styled with Tailwind CSS.

### Key Custom Components

| Component | Description | Location |
|-----------|-------------|----------|
| `TiptapEditor` | Rich text editor for message creation | `src/components/tiptap-editor.tsx` |
| `DeathNoteLogo` | Application logo with animation | `src/components/icons/death-note-logo.tsx` |
| `AppHeader` | Main navigation header | `src/components/app-header.tsx` |
| `ThemeToggle` | Theme switcher component | `src/components/theme-toggle.tsx` |
| `VerificationHistory` | History of check-ins | `src/components/verification-history.tsx` |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contacts` | GET, POST | Manage user contacts |
| `/api/notes` | GET, POST, PUT | Manage legacy notes |
| `/api/verification` | POST | Record user verification |
| `/api/verification/history` | GET | Get verification history |

## 🤝 Contributing

We welcome contributions to Death Note! See our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 🔒 Security

Death Note takes security seriously:

- All user data is encrypted
- Authentication is handled securely via Clerk
- Regular security audits
- Expiry message system with multiple verification attempts
- No storage of sensitive data in client-side code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Death Note</strong> - Secure your digital legacy</p>
  <p>Created by <a href="https://github.com/8bittts">8bittts</a></p>
</div> 