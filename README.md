# Exam Prep App

A comprehensive exam preparation application built with Next.js, featuring AI-powered test generation, subject management, and analytics dashboard.

## Features

- **AI-Powered Test Generation**: Generate custom practice tests using Google Gemini AI
- **Subject Management**: Add and organize study subjects with custom codes
- **Test Analytics**: Track performance and costs with detailed analytics
- **User Authentication**: Secure signup and signin with NextAuth.js
- **Responsive Design**: Modern UI with Tailwind CSS
- **Database Integration**: PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API
- **Deployment**: Railway (database), Vercel (frontend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Railway account for hosted database)
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd exam-prep-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with the required variables (see Environment Variables section)

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"
```

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User authentication and profile data
- **Subject**: Study subjects with custom codes
- **Test**: Generated practice tests
- **Question**: Individual test questions with caching
- **TestResult**: User test submissions and scores

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/subjects/*` - Subject management
- `/api/tests/*` - Test generation and submission
- `/api/analytics/*` - Performance analytics

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
└── types/               # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
