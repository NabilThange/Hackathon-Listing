"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Hackathon } from "@/lib/data"

interface HackathonListProps {
  hackathons: Hackathon[]
  onToggleRegistration: (id: number) => void
}

const urgencyConfig = {
  red: { variant: "red" as const, label: "🔴 URGENT" },
  yellow: { variant: "yellow" as const, label: "🟡 THIS WEEK" },
  green: { variant: "green" as const, label: "🟢 UPCOMING" },
  closed: { variant: "gray" as const, label: "⬛ CLOSED" }
}

export function HackathonList({ hackathons, onToggleRegistration }: HackathonListProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const handleCheckboxClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    onToggleRegistration(id)
  }

  return (
    <div className="space-y-4">
      {hackathons.map((hack) => {
        const isOpen = openItems.has(hack.id)
        const urgency = urgencyConfig[hack.urgency]

        return (
          <Collapsible
            key={hack.id}
            open={isOpen}
            onOpenChange={() => toggleItem(hack.id)}
          >
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div 
                        className="flex items-center mt-1"
                        onClick={(e) => handleCheckboxClick(e, hack.id)}
                      >
                        <input
                          type="checkbox"
                          checked={hack.registered || false}
                          onChange={() => {}}
                          className="h-5 w-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                          title="Mark as registered"
                        />
                      </div>
                      <Badge variant={urgency.variant} className="mt-1 shrink-0">
                        {urgency.label}
                      </Badge>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{hack.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Event: {format(new Date(hack.eventDate), "MMM dd, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Reg: {format(new Date(hack.regDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-sm">💰 Prize Pool</p>
                    <p className="text-sm mt-1">{hack.prize}</p>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <DetailRow label="Status" value={hack.status} />
                    <DetailRow
                      label="Event Date"
                      value={format(new Date(hack.eventDate), "MMMM dd, yyyy")}
                    />
                    <DetailRow
                      label="Registration Deadline"
                      value={format(new Date(hack.regDate), "MMMM dd, yyyy")}
                    />
                    <DetailRow label="Team Size" value={hack.teamSize} />
                    <DetailRow label="Entry Fee" value={hack.fee} />
                    {hack.duration && <DetailRow label="Duration" value={hack.duration} />}
                    {hack.domains && <DetailRow label="Domains" value={hack.domains} />}
                    <DetailRow label="Mode" value={hack.mode} />
                    <DetailRow label="Venue" value={hack.venue} />
                    <DetailRow label="Organizer" value={hack.organizer} />
                    {hack.links.length > 0 && (
                      <DetailRow
                        label="Links"
                        value={
                          <div className="flex flex-wrap gap-2">
                            {hack.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
