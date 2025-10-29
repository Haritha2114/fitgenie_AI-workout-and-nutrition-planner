'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { JournalEntry } from '@/lib/types';
import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  onUpdateEntries: (entries: JournalEntry[]) => void;
}

export default function JournalSection({ initialEntries, onUpdateEntries }: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);


  const addEntry = () => {
    if (!newEntryContent.trim()) return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(), // Simple ID generation
      date: new Date().toISOString(),
      content: newEntryContent,
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    onUpdateEntries(updatedEntries); // Notify parent of update
    setNewEntryContent('');
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    onUpdateEntries(updatedEntries);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-primary" /> Fitness Journal
        </CardTitle>
        <CardDescription>Log your thoughts, feelings, and achievements on your fitness journey. Today is {currentDate}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Textarea
            placeholder="How was your day? Any milestones or challenges?"
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <Button onClick={addEntry} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
          </Button>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(new Date(entry.date), "PPPp")}
                    </p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive" onClick={() => deleteEntry(entry.id)}>
                        <Trash2 className="h-4 w-4"/>
                        <span className="sr-only">Delete entry</span>
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No journal entries yet. Add your first one!</p>
        )}
      </CardContent>
    </Card>
  );
}
