"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ dateStr }: { dateStr: string }) {
  const router = useRouter()
  const selectedDate = parseISO(dateStr)

  function handleSelect(date: Date | undefined) {
    if (!date) return
    router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">Date</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start gap-2 font-normal">
            <CalendarIcon className="size-4 text-muted-foreground" />
            {format(selectedDate, "MMMM d, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
