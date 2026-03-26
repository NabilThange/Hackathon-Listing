"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hackathon } from "@/lib/data"

interface CalendarViewProps {
  hackathons: Hackathon[]
  onToggleRegistration: (id: number) => void
}

interface CalendarEvent {
  hackathon: Hackathon
  type: 'event' | 'registration'
}

const urgencyConfig = {
  red: { variant: "red" as const, label: "🔴 URGENT" },
  yellow: { variant: "yellow" as const, label: "🟡 THIS WEEK" },
  green: { variant: "green" as const, label: "🟢 UPCOMING" },
  closed: { variant: "gray" as const, label: "⬛ CLOSED" }
}

export function CalendarView({ hackathons, onToggleRegistration }: CalendarViewProps) {
  const eventsByDate: Record<string, CalendarEvent[]> = {}

  const handleCheckboxClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    onToggleRegistration(id)
  }

  hackathons.forEach((hack) => {
    if (!eventsByDate[hack.eventDate]) {
      eventsByDate[hack.eventDate] = []
    }
    eventsByDate[hack.eventDate].push({ hackathon: hack, type: 'event' })

    if (!eventsByDate[hack.regDate]) {
      eventsByDate[hack.regDate] = []
    }
    eventsByDate[hack.regDate].push({ hackathon: hack, type: 'registration' })
  })

  const sortedDates = Object.keys(eventsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedDates.map((date) => (
        <Card key={date} className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <CardTitle className="text-lg text-primary">
              {format(new Date(date), "MMMM dd, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {eventsByDate[date].map((event, idx) => {
              const urgency = urgencyConfig[event.hackathon.urgency]
              return (
                <div
                  key={idx}
                  className="bg-card border-l-4 border-primary rounded-md p-3 space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <div 
                      className="flex items-center mt-0.5"
                      onClick={(e) => handleCheckboxClick(e, event.hackathon.id)}
                    >
                      <input
                        type="checkbox"
                        checked={event.hackathon.registered || false}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                        title="Mark as registered"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm leading-tight">
                        {event.hackathon.name}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {event.type === 'event' ? '📅 Event Day' : '📝 Registration Deadline'}
                  </p>
                  <Badge variant={urgency.variant} className="text-xs">
                    {urgency.label}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
