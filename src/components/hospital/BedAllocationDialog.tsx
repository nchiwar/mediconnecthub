import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Bed, 
  Search, 
  User,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface BedInfo {
  id: number;
  number: string;
  department: string;
  status: "available" | "occupied" | "maintenance";
  patient?: string;
  admissionDate?: string;
}

const mockBeds: BedInfo[] = [
  { id: 1, number: "ICU-001", department: "ICU", status: "occupied", patient: "John Smith", admissionDate: "2024-01-10" },
  { id: 2, number: "ICU-002", department: "ICU", status: "occupied", patient: "Mary Johnson", admissionDate: "2024-01-11" },
  { id: 3, number: "ICU-003", department: "ICU", status: "available" },
  { id: 4, number: "ER-001", department: "Emergency", status: "occupied", patient: "David Miller", admissionDate: "2024-01-12" },
  { id: 5, number: "ER-002", department: "Emergency", status: "available" },
  { id: 6, number: "ER-003", department: "Emergency", status: "maintenance" },
  { id: 7, number: "GW-001", department: "General Ward", status: "occupied", patient: "Sarah Wilson", admissionDate: "2024-01-09" },
  { id: 8, number: "GW-002", department: "General Ward", status: "available" },
  { id: 9, number: "GW-003", department: "General Ward", status: "available" },
  { id: 10, number: "GW-004", department: "General Ward", status: "occupied", patient: "Robert Brown", admissionDate: "2024-01-08" },
  { id: 11, number: "PED-001", department: "Pediatrics", status: "available" },
  { id: 12, number: "PED-002", department: "Pediatrics", status: "occupied", patient: "Emily Davis (Child)", admissionDate: "2024-01-11" },
];

interface BedAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BedAllocationDialog = ({ open, onOpenChange }: BedAllocationDialogProps) => {
  const [beds, setBeds] = useState<BedInfo[]>(mockBeds);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = ["all", ...new Set(beds.map(b => b.department))];

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch = bed.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bed.patient?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === "all" || bed.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const handleStatusChange = (id: number, newStatus: "available" | "occupied" | "maintenance") => {
    setBeds(prev => prev.map(b => {
      if (b.id === id) {
        return { 
          ...b, 
          status: newStatus,
          patient: newStatus === "available" ? undefined : b.patient,
          admissionDate: newStatus === "available" ? undefined : b.admissionDate
        };
      }
      return b;
    }));
    toast.success("Bed status updated");
  };

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === "available").length,
    occupied: beds.filter(b => b.status === "occupied").length,
    maintenance: beds.filter(b => b.status === "maintenance").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-primary";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-muted";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bed className="w-5 h-5" />
            Bed Allocation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Beds</p>
            </Card>
            <Card className="p-4 text-center bg-green-500/10">
              <p className="text-2xl font-bold text-green-500">{stats.available}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </Card>
            <Card className="p-4 text-center bg-primary/10">
              <p className="text-2xl font-bold text-primary">{stats.occupied}</p>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </Card>
            <Card className="p-4 text-center bg-yellow-500/10">
              <p className="text-2xl font-bold text-yellow-500">{stats.maintenance}</p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by bed number or patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-background"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Bed Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => (
              <Card
                key={bed.id}
                className={`p-4 relative ${
                  bed.status === "available" ? "hover:border-green-500" :
                  bed.status === "maintenance" ? "opacity-75" : ""
                } transition-smooth`}
              >
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(bed.status)}`} />
                
                <div className="mb-3">
                  <h4 className="font-semibold">{bed.number}</h4>
                  <p className="text-xs text-muted-foreground">{bed.department}</p>
                </div>

                {bed.status === "occupied" && bed.patient && (
                  <div className="mb-3 p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3 h-3" />
                      <span className="font-medium truncate">{bed.patient}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since: {bed.admissionDate}
                    </p>
                  </div>
                )}

                {bed.status === "maintenance" && (
                  <div className="mb-3 p-2 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>Under Maintenance</span>
                    </div>
                  </div>
                )}

                <select
                  value={bed.status}
                  onChange={(e) => handleStatusChange(bed.id, e.target.value as any)}
                  className="w-full text-sm border rounded-lg px-2 py-1 bg-background"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
