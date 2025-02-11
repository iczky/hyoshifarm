import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PackingRecord } from "@/types/PackingRecord";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react"; // Optional: Use an icon for the button
import { format } from "date-fns"; // Optional: For formatting the selected date

interface CalendarNavProps {
  records: PackingRecord[];
  selectedDate: Date;
  onSelect: (date: Date | undefined) => void;
}

const CalendarNav: React.FC<CalendarNavProps> = ({
  records,
  selectedDate,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  // Get unique dates with data
  const datesWithData = React.useMemo(() => {
    const dates = new Set<string>();
    records.forEach((record) => {
      if (record.timestamp) {
        dates.add(new Date(record.timestamp).toDateString());
      }
    });
    return dates;
  }, [records]);

  return (
    <div className="w-full">
      {/* Button to Open Calendar */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />{" "}
            {/* Optional: Add an icon */}
            {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
          </Button>
        </PopoverTrigger>

        {/* Calendar Popup */}
        <PopoverContent className="w-auto p-0" align="start">
          <Card>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  onSelect(date);
                  setOpen(false); // Close the popover after selecting a date
                }}
                className="rounded-md border"
                modifiers={{
                  hasData: (date) => datesWithData.has(date.toDateString()),
                }}
                modifiersStyles={{
                  hasData: {
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    color: "black",
                  },
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative w-full h-full p-2 flex items-center justify-center">
                      {date.getDate()}
                      {datesWithData.has(date.toDateString()) && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarNav;
