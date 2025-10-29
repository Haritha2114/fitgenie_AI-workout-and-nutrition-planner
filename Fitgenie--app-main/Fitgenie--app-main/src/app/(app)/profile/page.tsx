'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile, FitnessMetrics, JournalEntry } from '@/lib/types'; // Assuming types are defined
import { PenLine, Camera, Footprints, Weight, DumbbellIcon } from 'lucide-react';
import Image from 'next/image';
import JournalSection from '@/components/profile/journal';
import ProgressChart from '@/components/profile/progress-chart';


// Mock user data
const initialProfile: UserProfile = {
  name: 'Alex Fitness',
  email: 'alex@example.com',
  avatarUrl: 'https://placehold.co/128x128.png',
  fitnessMetrics: {
    weight: 75, // kg
    reps: { 'Bench Press': 10, 'Squats': 12 },
  },
  photos: [
    'https://placehold.co/300x200.png?text=Progress+Pic+1',
    'https://placehold.co/300x200.png?text=Progress+Pic+2',
  ],
  journalEntries: [
    { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString(), content: 'Felt great during today\'s workout! Hit a new PR on squats.' },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), content: 'Nutrition was on point. Feeling energetic.' },
  ],
  steps: 10520,
};


export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [metricsForm, setMetricsForm] = useState<FitnessMetrics>(profile.fitnessMetrics);

  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'weight') {
      setMetricsForm(prev => ({ ...prev, weight: parseFloat(value) || undefined }));
    } else {
      // For specific exercises, e.g. name="reps.Bench Press"
      const exerciseName = name.split('.')[1];
      if (exerciseName) {
        setMetricsForm(prev => ({
          ...prev,
          reps: { ...prev.reps, [exerciseName]: parseInt(value) || 0 }
        }));
      }
    }
  };

  const saveMetrics = () => {
    setProfile(prev => ({ ...prev, fitnessMetrics: metricsForm }));
    setEditingMetrics(false);
    // Here you would typically call an API to save the data
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="person avatar"/>
            <AvatarFallback className="text-3xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <CardTitle className="text-3xl text-primary">{profile.name}</CardTitle>
            <CardDescription className="text-lg">{profile.email}</CardDescription>
            <Button variant="outline" size="sm" className="mt-2">
              <PenLine className="mr-2 h-4 w-4" /> Edit Profile (mock)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
            <MetricDisplay icon={<Weight className="h-6 w-6 text-secondary"/>} label="Weight" value={`${profile.fitnessMetrics.weight || 'N/A'} kg`} />
            <MetricDisplay icon={<DumbbellIcon className="h-6 w-6 text-secondary"/>} label="Bench Press Reps" value={`${profile.fitnessMetrics.reps?.['Bench Press'] || 'N/A'}`} />
            <MetricDisplay icon={<Footprints className="h-6 w-6 text-secondary"/>} label="Steps Today" value={`${profile.steps || 'N/A'}`} />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
            <Card>
                <CardHeader><CardTitle>Progress Overview</CardTitle></CardHeader>
                <CardContent>
                    <ProgressChart />
                    <p className="mt-4 text-muted-foreground text-center">More detailed charts and summaries will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fitness Metrics</CardTitle>
                <Button variant={editingMetrics ? "default" : "outline"} size="sm" onClick={() => editingMetrics ? saveMetrics() : setEditingMetrics(true)}>
                  {editingMetrics ? 'Save Metrics' : 'Edit Metrics'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingMetrics ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" name="weight" type="number" value={metricsForm.weight || ''} onChange={handleMetricsChange} />
                    </div>
                     <div>
                      <Label htmlFor="reps.Bench Press">Bench Press (reps)</Label>
                      <Input id="reps.Bench Press" name="reps.Bench Press" type="number" value={metricsForm.reps?.['Bench Press'] || ''} onChange={handleMetricsChange} />
                    </div>
                  </div>
                  {/* Add more editable metrics here */}
                </>
              ) : (
                <ul className="space-y-2">
                  <li><strong>Weight:</strong> {profile.fitnessMetrics.weight || 'N/A'} kg</li>
                  <li><strong>Bench Press Reps:</strong> {profile.fitnessMetrics.reps?.['Bench Press'] || 'N/A'}</li>
                  <li><strong>Squat Reps:</strong> {profile.fitnessMetrics.reps?.['Squats'] || 'N/A'}</li>
                  {/* Display more metrics */}
                </ul>
              )}
              <p className="text-sm text-muted-foreground">HealthKit integration for steps is planned for future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Progress Photos</CardTitle>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" /> Upload Photo (mock)
                </Button>
              </div>
              <CardDescription>Visually track your transformation.</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.map((photoUrl, index) => (
                    <Image
                      key={index}
                      src={photoUrl}
                      alt={`Progress photo ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover shadow-md aspect-[3/2]"
                      data-ai-hint="fitness progress"
                    />
                  ))}
                </div>
              ) : (
                <p>No photos uploaded yet. Start tracking your progress!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="mt-6">
          <JournalSection initialEntries={profile.journalEntries} 
            onUpdateEntries={(updatedEntries) => setProfile(p => ({...p, journalEntries: updatedEntries}))} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricDisplayProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}
function MetricDisplay({icon, label, value}: MetricDisplayProps) {
    return (
        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
            <div className="p-2 bg-accent/30 rounded-md">{icon}</div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    )
}
