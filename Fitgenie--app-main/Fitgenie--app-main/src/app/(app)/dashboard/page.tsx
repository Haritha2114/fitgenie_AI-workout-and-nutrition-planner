
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Dumbbell, Apple, BarChart3, Loader2, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { generateDashboardImage } from '@/ai/flows/generate-dashboard-image';
import { useToast } from '@/hooks/use-toast';


export default function DashboardPage() {
  const [dashboardImageUrl, setDashboardImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadImage() {
      setIsLoadingImage(true);
      try {
        const result = await generateDashboardImage({ prompt: "fitness motivation, vibrant, energetic, inclusive" });
        if (result.imageDataUri) {
          setDashboardImageUrl(result.imageDataUri);
        } else {
          throw new Error("No image data URI returned");
        }
      } catch (error) {
        console.error('Error generating dashboard image:', error);
        toast({
          title: 'Image Generation Failed',
          description: 'Could not load the AI-generated image. Displaying placeholder.',
          variant: 'destructive',
        });
        setDashboardImageUrl(null); // Fallback to placeholder or hide
      } finally {
        setIsLoadingImage(false);
      }
    }
    loadImage();
  }, [toast]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Welcome Back to FitGenie!</CardTitle>
          <CardDescription className="text-lg">
            Ready to crush your fitness goals? Here's your personal command center.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="mb-6 text-muted-foreground">
              Whether you're looking to generate a new workout, plan your meals, or track your progress, FitGenie is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/workout">
                  <Dumbbell className="mr-2 h-5 w-5" /> Create Workout
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/nutrition">
                  <Apple className="mr-2 h-5 w-5" /> Plan Nutrition
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center min-h-[200px] bg-muted/30 rounded-lg">
            {isLoadingImage ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : dashboardImageUrl ? (
              <Image 
                src={dashboardImageUrl}
                alt="Fitness motivation AI generated" 
                width={300} 
                height={200} 
                className="rounded-lg object-cover shadow-md"
                data-ai-hint="fitness motivation"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageOff className="h-12 w-12 mb-2" />
                <p>Image unavailable</p>
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Fitness illustration placeholder" 
                    width={300} 
                    height={200} 
                    className="rounded-lg object-cover shadow-md mt-2 opacity-50"
                    data-ai-hint="fitness motivation" 
                  />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="AI Workout Planner"
          description="Generate dynamic workout plans tailored to your goals, equipment, and preferences. Includes exercise modifications."
          href="/workout"
          icon={<Dumbbell className="h-8 w-8 text-primary" />}
        />
        <FeatureCard
          title="Smart Nutrition Guide"
          description="Get personalized meal plans with recipes and macro breakdowns. Easily find alternatives for ingredients or meals."
          href="/nutrition"
          icon={<Apple className="h-8 w-8 text-primary" />}
        />
        <FeatureCard
          title="Progress Tracker"
          description="Log your workouts, track physical metrics, upload progress photos, and keep a fitness journal."
          href="/profile"
          icon={<BarChart3 className="h-8 w-8 text-primary" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Consistency is key! Try to stick to your generated plans as much as possible, but don't be afraid to use FitGenie to adjust them when life happens.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={href}>
            Go to {title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

