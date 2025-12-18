import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pill, User, Calendar, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Prescription {
  id: number;
  medication: string;
  quantity: number;
  refills: number;
  doctor: string;
  expires: string;
  status: string;
}

interface PrescriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription | null;
  onOrderRefill: (id: number) => void;
}

export const PrescriptionDetailsDialog = ({
  open,
  onOpenChange,
  prescription,
  onOrderRefill
}: PrescriptionDetailsDialogProps) => {
  if (!prescription) return null;

  const handleOrderRefill = () => {
    onOrderRefill(prescription.id);
    toast.success(`Refill ordered for ${prescription.medication}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{prescription.medication}</h3>
              <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                {prescription.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prescribed by</p>
                <p className="font-medium">{prescription.doctor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Pill className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{prescription.quantity} tablets</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Refills Remaining</p>
                <p className="font-medium">{prescription.refills}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Expires</p>
                <p className="font-medium">{prescription.expires}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              className="flex-1 gradient-primary text-white"
              onClick={handleOrderRefill}
              disabled={prescription.refills === 0}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Order Refill
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
