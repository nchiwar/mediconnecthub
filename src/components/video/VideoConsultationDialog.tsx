import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoCall } from "./VideoCall";

interface VideoConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  userId: string;
  isDoctor?: boolean;
  participantName?: string;
}

export const VideoConsultationDialog = ({
  open,
  onOpenChange,
  appointmentId,
  userId,
  isDoctor = false,
  participantName = "Participant",
}: VideoConsultationDialogProps) => {
  const handleCallEnd = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>
            Video Consultation {participantName && `with ${participantName}`}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <VideoCall
            roomId={appointmentId}
            userId={userId}
            isHost={isDoctor}
            onCallEnd={handleCallEnd}
            participantName={participantName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
