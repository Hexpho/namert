# nameit.

**VOTE · RANK · DECIDE**

> A premium, real-time voting application designed to collaboratively effectively rank potential names using the Elo rating system.

![nameit. Banner](https://placehold.co/1200x600/050505/D4AF37?text=nameit.)

## ✨ Overview

**nameit.** is a refined decision-making tool built for groups to choose the perfect name for a project, account, or entity. Instead of messy polls, it uses a **"Thunderdome" style 1v1 voting system**. Users are presented with two options and must choose one. Behind the scenes, an **Elo rating algorithm** mathematically calculates the ranking of each candidate based on wins, losses, and strength of schedule.

It features a **"Midnight Luxury"** aesthetic—deep matte black, charcoal, and metallic gold—ensuring the experience feels as important as the decision itself.

## 🚀 Key Features

- **⚔️ Thunderdome Voting**: Rapid-fire 1v1 matchups.
- **📈 Elo Rating System**: Fair and weighted ranking logic (just like Chess rankings).
- **🔥 Real-Time Database**: Votes sync instantly across all devices using Firebase.
- **💎 Midnight Luxury UI**: A stunning dark-mode interface with `framer-motion` animations.
- **🤣 The "Security Deposit" Prank**: A built-in practical joke that asks users for a $20 deposit before voting (fake, obviously).
- **📱 Responsive Design**: Works perfectly on desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)

## ⚡️ Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hexpho/namert.git
   cd namert
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to start voting.

## 📦 Deployment

The easiest way to deploy is using **Vercel**:

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the **Environment Variables** from your `.env.local` file.
4. Click **Deploy**.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
