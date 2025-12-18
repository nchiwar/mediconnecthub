import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, FileSignature, Truck, CheckCircle, Clock, Package, MapPin } from "lucide-react";
import { Prescription } from "@/hooks/usePrescriptions";
import { BlockchainRecordBadge } from "@/components/blockchain/BlockchainRecordBadge";
import { format } from "date-fns";

interface PrescriptionCardProps {
  prescription: Prescription;
  showActions?: boolean;
  onSendToPharmacy?: (prescriptionId: string) => void;
  onUpdateStatus?: (prescriptionId: string, status: Prescription["status"]) => void;
  role?: "patient" | "doctor" | "pharmacy";
}

const statusConfig: Record<Prescription["status"], { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  signed: { label: "Signed", variant: "default", icon: <FileSignature className="h-3 w-3" /> },
  sent_to_pharmacy: { label: "At Pharmacy", variant: "outline", icon: <Package className="h-3 w-3" /> },
  processing: { label: "Processing", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  ready: { label: "Ready for Pickup", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  out_for_delivery: { label: "Out for Delivery", variant: "default", icon: <Truck className="h-3 w-3" /> },
  delivered: { label: "Delivered", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", variant: "destructive", icon: <Clock className="h-3 w-3" /> },
};

export function PrescriptionCard({ 
  prescription, 
  showActions = false, 
  onSendToPharmacy,
  onUpdateStatus,
  role = "patient" 
}: PrescriptionCardProps) {
  const status = statusConfig[prescription.status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            {prescription.diagnosis}
          </CardTitle>
          <div className="flex items-center gap-2">
            {prescription.blockchain_hash && (
              <BlockchainRecordBadge hash={prescription.blockchain_hash} />
            )}
            <Badge variant={status.variant} className="gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Prescribed on {format(new Date(prescription.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
          {prescription.signed_at && (
            <p className="flex items-center gap-1 mt-1">
              <FileSignature className="h-3 w-3" />
              Digitally signed on {format(new Date(prescription.signed_at), "MMM d, yyyy")}
            </p>
          )}
        </div>

        {prescription.notes && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Notes:</p>
            <p className="text-sm text-muted-foreground">{prescription.notes}</p>
          </div>
        )}

        {showActions && role === "pharmacy" && (
          <div className="flex gap-2 pt-2">
            {prescription.status === "sent_to_pharmacy" && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus?.(prescription.id, "processing")}
              >
                Start Processing
              </Button>
            )}
            {prescription.status === "processing" && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus?.(prescription.id, "ready")}
              >
                Mark Ready
              </Button>
            )}
            {prescription.status === "ready" && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus?.(prescription.id, "out_for_delivery")}
                className="gap-1"
              >
                <Truck className="h-4 w-4" />
                Start Delivery
              </Button>
            )}
            {prescription.status === "out_for_delivery" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onUpdateStatus?.(prescription.id, "delivered")}
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Delivered
              </Button>
            )}
          </div>
        )}

        {showActions && role === "doctor" && prescription.status === "signed" && !prescription.pharmacy_id && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendToPharmacy?.(prescription.id)}
            className="gap-1"
          >
            <MapPin className="h-4 w-4" />
            Send to Pharmacy
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
