import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, FileSignature, Send } from "lucide-react";
import { usePrescriptions, Pharmacy } from "@/hooks/usePrescriptions";
import { useToast } from "@/hooks/use-toast";

interface MedicationItem {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

interface WritePrescriptionDialogProps {
  patientId: string;
  patientName: string;
  doctorId: string;
  appointmentId?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function WritePrescriptionDialog({
  patientId,
  patientName,
  doctorId,
  appointmentId,
  trigger,
  onSuccess
}: WritePrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<MedicationItem[]>([
    { medication_name: "", dosage: "", frequency: "", duration: "", quantity: 1, instructions: "" }
  ]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("");
  const [isSigning, setIsSigning] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { createPrescription, signPrescription, sendToPharmacy, pharmacies } = usePrescriptions();
  const { toast } = useToast();

  const addMedication = () => {
    setMedications([...medications, { medication_name: "", dosage: "", frequency: "", duration: "", quantity: 1, instructions: "" }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof MedicationItem, value: string | number) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const generateSignature = () => {
    const timestamp = new Date().toISOString();
    return `DR_SIG_${doctorId.slice(0, 8)}_${timestamp}_${Math.random().toString(36).substring(7)}`;
  };

  const handleSubmit = async () => {
    if (!diagnosis || medications.some(m => !m.medication_name || !m.dosage)) {
      toast({
        title: "Validation Error",
        description: "Please fill in diagnosis and all medication details.",
        variant: "destructive"
      });
      return;
    }

    setIsSigning(true);
    try {
      const signature = generateSignature();
      
      const prescription = await createPrescription(
        {
          patient_id: patientId,
          doctor_id: doctorId,
          appointment_id: appointmentId || null,
          pharmacy_id: null,
          diagnosis,
          notes: notes || null,
          digital_signature: signature,
          signed_at: new Date().toISOString(),
          blockchain_hash: null,
          status: 'signed'
        },
        medications.map(m => ({
          medication_name: m.medication_name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          quantity: m.quantity,
          instructions: m.instructions || null
        }))
      );

      if (selectedPharmacy) {
        setIsSending(true);
        await sendToPharmacy(prescription.id, selectedPharmacy);
      }

      toast({
        title: "Prescription Created",
        description: selectedPharmacy 
          ? "Prescription signed and sent to pharmacy!" 
          : "Prescription signed successfully!"
      });

      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to create prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSigning(false);
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setDiagnosis("");
    setNotes("");
    setMedications([{ medication_name: "", dosage: "", frequency: "", duration: "", quantity: 1, instructions: "" }]);
    setSelectedPharmacy("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <FileSignature className="h-4 w-4" />
            Write Prescription
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write E-Prescription for {patientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medications *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 mr-1" /> Add Medication
              </Button>
            </div>

            {medications.map((med, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Medication {index + 1}
                    </span>
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Input
                        placeholder="Medication name *"
                        value={med.medication_name}
                        onChange={(e) => updateMedication(index, 'medication_name', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Dosage (e.g., 500mg) *"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    />
                    <Input
                      placeholder="Frequency (e.g., Twice daily)"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    />
                    <Input
                      placeholder="Duration (e.g., 7 days)"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      min={1}
                      value={med.quantity}
                      onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                    <div className="col-span-2">
                      <Input
                        placeholder="Special instructions (optional)"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional instructions for the patient..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Send to Pharmacy (Optional)</Label>
            <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pharmacy for fulfillment" />
              </SelectTrigger>
              <SelectContent>
                {pharmacies.map((pharmacy) => (
                  <SelectItem key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name} - {pharmacy.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSigning || isSending}
              className="flex-1 gap-2"
            >
              {isSigning ? (
                "Signing..."
              ) : selectedPharmacy ? (
                <>
                  <Send className="h-4 w-4" />
                  Sign & Send to Pharmacy
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4" />
                  Sign Prescription
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
