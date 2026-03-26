"use client"

import { useState, useMemo, useEffect } from "react"
import { Calendar, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { HackathonList } from "@/components/HackathonList"
import { CalendarView } from "@/components/CalendarView"
import { hackathons as initialHackathons, Hackathon } from "@/lib/data"

type ViewMode = 'list' | 'calendar'
type SortMode = 'eventDate' | 'regDate'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortMode, setSortMode] = useState<SortMode>('eventDate')
  const [hackathons, setHackathons] = useState<Hackathon[]>(initialHackathons)

  useEffect(() => {
    const saved = localStorage.getItem('hackathon-registrations')
    if (saved) {
      try {
        const registrations = JSON.parse(saved) as Record<number, boolean>
        setHackathons(prev => 
          prev.map(h => ({ ...h, registered: registrations[h.id] || false }))
        )
      } catch (e) {
        console.error('Failed to load registrations', e)
      }
    }
  }, [])

  const toggleRegistration = (id: number) => {
    setHackathons(prev => {
      const updated = prev.map(h => 
        h.id === id ? { ...h, registered: !h.registered } : h
      )
      
      const registrations = updated.reduce((acc, h) => {
        if (h.registered) acc[h.id] = true
        return acc
      }, {} as Record<number, boolean>)
      
      localStorage.setItem('hackathon-registrations', JSON.stringify(registrations))
      
      return updated
    })
  }

  const sortedHackathons = useMemo(() => {
    return [...hackathons].sort((a, b) => {
      const dateA = new Date(sortMode === 'eventDate' ? a.eventDate : a.regDate)
      const dateB = new Date(sortMode === 'eventDate' ? b.eventDate : b.regDate)
      return dateA.getTime() - dateB.getTime()
    })
  }, [sortMode, hackathons])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <header className="bg-primary text-primary-foreground py-8 px-6 rounded-b-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-2">
            🏆 Hackathon Organizer
          </h1>
          <p className="text-center text-primary-foreground/90">
            Total Events: {hackathons.length}
          </p>
        </header>

        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar View
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Sort by:
              </label>
              <Select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="eventDate">Event Date (Ascending)</option>
                <option value="regDate">Registration Date (Ascending)</option>
              </Select>
            </div>
          </div>

          <div>
            {viewMode === 'list' ? (
              <HackathonList 
                hackathons={sortedHackathons} 
                onToggleRegistration={toggleRegistration}
              />
            ) : (
              <CalendarView 
                hackathons={sortedHackathons}
                onToggleRegistration={toggleRegistration}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
