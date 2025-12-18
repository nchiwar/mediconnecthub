import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  doctorName: string;
  onSuccess?: () => void;
}

export const BookAppointmentDialog = ({
  open,
  onOpenChange,
  doctorId,
  doctorName,
  onSuccess,
}: BookAppointmentDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [type, setType] = useState<string>("video");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  const handleBooking = async () => {
    if (!date || !time || !symptoms.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to book appointments");
        return;
      }

      const appointmentDate = new Date(date);
      const [hours, minutes] = time.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: doctorId,
          appointment_date: appointmentDate.toISOString(),
          type,
          symptoms,
          status: 'pending',
        });

      if (error) throw error;

      toast.success(`Appointment booked with ${doctorName}`);
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setDate(undefined);
      setTime("");
      setSymptoms("");
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Select Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Appointment Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Consultation</SelectItem>
                <SelectItem value="in-person">In-Person Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms or reason for consultation..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={loading}
            className="gradient-primary text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};