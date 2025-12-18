import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Schedule {
  id: number;
  staffName: string;
  role: string;
  department: string;
  date: string;
  shift: "morning" | "evening" | "night";
  startTime: string;
  endTime: string;
}

const mockSchedules: Schedule[] = [
  { id: 1, staffName: "Dr. Sarah Johnson", role: "Cardiologist", department: "Cardiology", date: "2024-01-15", shift: "morning", startTime: "06:00", endTime: "14:00" },
  { id: 2, staffName: "Dr. Michael Chen", role: "Surgeon", department: "Surgery", date: "2024-01-15", shift: "evening", startTime: "14:00", endTime: "22:00" },
  { id: 3, staffName: "Nurse Emily Davis", role: "Head Nurse", department: "ICU", date: "2024-01-15", shift: "night", startTime: "22:00", endTime: "06:00" },
  { id: 4, staffName: "Dr. Robert Wilson", role: "Pediatrician", department: "Pediatrics", date: "2024-01-15", shift: "morning", startTime: "06:00", endTime: "14:00" },
  { id: 5, staffName: "Dr. Amanda Foster", role: "Neurologist", department: "Neurology", date: "2024-01-16", shift: "morning", startTime: "06:00", endTime: "14:00" },
  { id: 6, staffName: "Dr. Kevin Martinez", role: "Orthopedic Surgeon", department: "Orthopedics", date: "2024-01-16", shift: "evening", startTime: "14:00", endTime: "22:00" },
  { id: 7, staffName: "Nurse Rachel Green", role: "ICU Nurse", department: "ICU", date: "2024-01-16", shift: "night", startTime: "22:00", endTime: "06:00" },
  { id: 8, staffName: "Dr. Sarah Johnson", role: "Cardiologist", department: "Cardiology", date: "2024-01-17", shift: "evening", startTime: "14:00", endTime: "22:00" },
];

interface SchedulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SchedulesDialog = ({ open, onOpenChange }: SchedulesDialogProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState("all");

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getSchedulesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return mockSchedules.filter(s => {
      const matchesDate = s.date === dateStr;
      const matchesShift = selectedShift === "all" || s.shift === selectedShift;
      return matchesDate && matchesShift;
    });
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "evening": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "night": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Staff Schedules
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold">
                {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Tabs value={selectedShift} onValueChange={setSelectedShift}>
              <TabsList>
                <TabsTrigger value="all">All Shifts</TabsTrigger>
                <TabsTrigger value="morning">Morning</TabsTrigger>
                <TabsTrigger value="evening">Evening</TabsTrigger>
                <TabsTrigger value="night">Night</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="min-h-[200px]">
                <div className={`text-center p-2 rounded-t-lg ${
                  formatDate(day) === formatDate(new Date()) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-xs font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-bold">{day.getDate()}</p>
                </div>
                
                <div className="border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[150px]">
                  {getSchedulesForDate(day).map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`p-2 rounded-lg border text-xs ${getShiftColor(schedule.shift)}`}
                    >
                      <p className="font-semibold truncate">{schedule.staffName}</p>
                      <p className="text-[10px] opacity-75">{schedule.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                  ))}
                  {getSchedulesForDate(day).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No schedules
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Morning (6AM-2PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Evening (2PM-10PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-sm">Night (10PM-6AM)</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
