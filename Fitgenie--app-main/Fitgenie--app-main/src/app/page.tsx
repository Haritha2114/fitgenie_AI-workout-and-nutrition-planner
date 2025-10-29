
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react'; // LogIn icon and Loader2 removed
import { Logo } from '@/components/icons/logo';
// useAuth and Loader2 imports are removed

export default function HomePage() {
  // useAuth hook and related logic are removed

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <header className="mb-12 text-center">
        <div className="inline-block mb-6">
          <Logo className="h-16 w-auto" />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-4">Welcome to FitGenie</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your personal AI-powered assistant for creating customized workout and nutrition plans. Achieve your fitness goals smarter, not harder.
        </p>
      </header>

      <main className="text-center mb-12">
        <p className="text-lg mb-8">
          Ready to transform your fitness journey? Let FitGenie craft the perfect plan for you.
        </p>
        {/* Conditional rendering based on auth status is removed */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            {/* Link now directly goes to /dashboard, "Login" button removed */}
            <Link href="/dashboard"> 
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      <section className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-3">AI Workout Planner</h2>
          <p className="text-card-foreground">Generate personalized workout routines based on your goals, experience, and available equipment. Modify exercises with AI suggestions.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-3">AI Nutrition Guide</h2>
          <p className="text-card-foreground">Receive tailored meal plans that fit your dietary needs and preferences. Get smart alternatives for ingredients and meals.</p>
        </div>
      </section>

      <footer className="text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} FitGenie. All rights reserved.</p>
      </footer>
    </div>
  );
}
