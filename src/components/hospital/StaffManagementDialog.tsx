import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck,
  UserX,
  Clock,
  Building2
} from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "on-duty" | "off-duty" | "on-leave";
  shift: string;
  phone: string;
  email: string;
}

const mockStaff: StaffMember[] = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Cardiologist", department: "Cardiology", status: "on-duty", shift: "Morning", phone: "+1234567890", email: "sarah@hospital.com" },
  { id: 2, name: "Dr. Michael Chen", role: "Surgeon", department: "Surgery", status: "on-duty", shift: "Evening", phone: "+1234567891", email: "michael@hospital.com" },
  { id: 3, name: "Nurse Emily Davis", role: "Head Nurse", department: "ICU", status: "on-duty", shift: "Night", phone: "+1234567892", email: "emily@hospital.com" },
  { id: 4, name: "Dr. Robert Wilson", role: "Pediatrician", department: "Pediatrics", status: "off-duty", shift: "Morning", phone: "+1234567893", email: "robert@hospital.com" },
  { id: 5, name: "Nurse Jessica Taylor", role: "Staff Nurse", department: "Emergency", status: "on-duty", shift: "Morning", phone: "+1234567894", email: "jessica@hospital.com" },
  { id: 6, name: "Dr. Amanda Foster", role: "Neurologist", department: "Neurology", status: "on-leave", shift: "Evening", phone: "+1234567895", email: "amanda@hospital.com" },
  { id: 7, name: "Dr. Kevin Martinez", role: "Orthopedic Surgeon", department: "Orthopedics", status: "on-duty", shift: "Morning", phone: "+1234567896", email: "kevin@hospital.com" },
  { id: 8, name: "Nurse Rachel Green", role: "ICU Nurse", department: "ICU", status: "on-duty", shift: "Night", phone: "+1234567897", email: "rachel@hospital.com" },
];

interface StaffManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StaffManagementDialog = ({ open, onOpenChange }: StaffManagementDialogProps) => {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && member.status === selectedTab;
  });

  const handleStatusChange = (id: number, newStatus: "on-duty" | "off-duty" | "on-leave") => {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    toast.success("Staff status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-duty": return "default";
      case "off-duty": return "secondary";
      case "on-leave": return "outline";
      default: return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">
                All ({staff.length})
              </TabsTrigger>
              <TabsTrigger value="on-duty">
                <UserCheck className="w-4 h-4 mr-1" />
                On Duty ({staff.filter(s => s.status === "on-duty").length})
              </TabsTrigger>
              <TabsTrigger value="off-duty">
                <UserX className="w-4 h-4 mr-1" />
                Off Duty ({staff.filter(s => s.status === "off-duty").length})
              </TabsTrigger>
              <TabsTrigger value="on-leave">
                <Clock className="w-4 h-4 mr-1" />
                On Leave ({staff.filter(s => s.status === "on-leave").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="space-y-3">
                {filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            <span>{member.department}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{member.shift} Shift</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(member.status)}>
                          {member.status.replace('-', ' ')}
                        </Badge>
                        <select
                          value={member.status}
                          onChange={(e) => handleStatusChange(member.id, e.target.value as any)}
                          className="text-sm border rounded-lg px-2 py-1 bg-background"
                        >
                          <option value="on-duty">On Duty</option>
                          <option value="off-duty">Off Duty</option>
                          <option value="on-leave">On Leave</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
