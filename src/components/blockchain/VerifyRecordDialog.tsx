import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerificationResult {
  verified: boolean;
  record?: {
    appointmentDate: string;
    status: string;
    type: string;
    symptoms: string;
    prescription: string;
  };
  message?: string;
}

export const VerifyRecordDialog = () => {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [open, setOpen] = useState(false);

  const handleVerify = async () => {
    if (!hash.trim()) {
      toast.error("Please enter a blockchain hash");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('blockchain-records', {
        body: { 
          action: 'verify_record',
          data: { hash },
        },
      });

      if (error) throw error;
      setResult(data);
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || "Failed to verify record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="w-4 h-4" />
          Verify Health Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Verify Blockchain Record
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="hash">Blockchain Hash</Label>
            <Input
              id="hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleVerify} 
            disabled={loading || !hash.trim()}
            className="w-full gradient-primary text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify Record
              </>
            )}
          </Button>

          {result && (
            <div className={`p-4 rounded-xl border ${
              result.verified 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-destructive/10 border-destructive/20"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {result.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-semibold">
                  {result.verified ? "Record Verified" : "Record Not Found"}
                </span>
              </div>

              {result.verified && result.record && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(result.record.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{result.record.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge>{result.record.status}</Badge>
                  </div>
                  {result.record.symptoms && (
                    <div>
                      <span className="text-muted-foreground">Symptoms:</span>
                      <p className="mt-1">{result.record.symptoms}</p>
                    </div>
                  )}
                  {result.record.prescription && (
                    <div>
                      <span className="text-muted-foreground">Prescription:</span>
                      <p className="mt-1">{result.record.prescription}</p>
                    </div>
                  )}
                </div>
              )}

              {!result.verified && result.message && (
                <p className="text-sm text-muted-foreground">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};