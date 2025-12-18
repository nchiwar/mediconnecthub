import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffManagementDialog } from "@/components/hospital/StaffManagementDialog";
import { BedAllocationDialog } from "@/components/hospital/BedAllocationDialog";
import { SchedulesDialog } from "@/components/hospital/SchedulesDialog";
import { AnalyticsDialog } from "@/components/hospital/AnalyticsDialog";
import { 
  Building2, 
  Users, 
  Bed, 
  TrendingUp,
  UserCheck,
  Activity,
  AlertCircle,
  Calendar,
  Stethoscope
} from "lucide-react";

const departments = [
  { id: 1, name: "Emergency", beds: { total: 20, occupied: 18, available: 2 }, staff: 12 },
  { id: 2, name: "ICU", beds: { total: 15, occupied: 14, available: 1 }, staff: 18 },
  { id: 3, name: "General Ward", beds: { total: 50, occupied: 38, available: 12 }, staff: 25 },
  { id: 4, name: "Pediatrics", beds: { total: 30, occupied: 22, available: 8 }, staff: 15 }
];

const staff = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Cardiologist", department: "Cardiology", status: "on-duty", shift: "Morning" },
  { id: 2, name: "Dr. Michael Chen", role: "Surgeon", department: "Surgery", status: "on-duty", shift: "Evening" },
  { id: 3, name: "Nurse Emily Davis", role: "Head Nurse", department: "ICU", status: "on-duty", shift: "Night" },
  { id: 4, name: "Dr. Robert Wilson", role: "Pediatrician", department: "Pediatrics", status: "off-duty", shift: "Morning" }
];

const admissions = [
  { id: 1, patient: "John Smith", department: "Emergency", time: "30 min ago", condition: "Chest Pain", priority: "high" },
  { id: 2, patient: "Mary Johnson", department: "ICU", time: "1 hour ago", condition: "Post-Surgery", priority: "high" },
  { id: 3, patient: "David Miller", department: "General Ward", time: "2 hours ago", condition: "Pneumonia", priority: "medium" }
];

const HospitalDashboard = () => {
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [bedDialogOpen, setBedDialogOpen] = useState(false);
  const [schedulesDialogOpen, setSchedulesDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);

  return (
    <DashboardLayout
      title="Hospital Admin Dashboard"
      subtitle="Multi-tenant facility management and analytics"
      role="Hospital Administrator"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bed Capacity"
          value="115"
          icon={Bed}
          change="92 occupied, 23 available"
          trend="neutral"
        />
        <StatsCard
          title="Staff On Duty"
          value={70}
          icon={Users}
          change="85% attendance"
          trend="up"
        />
        <StatsCard
          title="Today's Admissions"
          value={23}
          icon={Activity}
          change="+5 vs yesterday"
          trend="up"
        />
        <StatsCard
          title="Occupancy Rate"
          value="80%"
          icon={TrendingUp}
          change="Optimal capacity"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Department Overview</h2>
              <Button variant="ghost" size="sm">View All Departments</Button>
            </div>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground">{dept.staff} staff members</p>
                      </div>
                    </div>
                    <Badge variant={dept.beds.available < 5 ? "destructive" : "default"}>
                      {dept.beds.available < 5 ? "Near Capacity" : "Available"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Beds</p>
                      <p className="text-2xl font-bold">{dept.beds.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Occupied</p>
                      <p className="text-2xl font-bold text-primary">{dept.beds.occupied}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available</p>
                      <p className="text-2xl font-bold text-accent">{dept.beds.available}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">
                        {Math.round((dept.beds.occupied / dept.beds.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(dept.beds.occupied / dept.beds.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Admissions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Admissions</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {admissions.map((admission) => (
                <div
                  key={admission.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{admission.patient}</h3>
                    <p className="text-sm text-muted-foreground">
                      {admission.department} • {admission.condition}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{admission.time}</p>
                  </div>
                  <Badge 
                    variant={admission.priority === "high" ? "destructive" : "default"}
                  >
                    {admission.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Staff Management */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Staff On Duty</h2>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="doctors" className="flex-1">Doctors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge 
                        variant={member.status === "on-duty" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3" />
                      <span>{member.department}</span>
                      <span>•</span>
                      <span>{member.shift} Shift</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="doctors">
                {staff.filter(s => s.role.includes("Dr.")).map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-lg border border-border mb-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge 
                        variant={member.status === "on-duty" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Stethoscope className="w-3 h-3" />
                      <span>{member.department}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full gradient-primary text-white justify-start" onClick={() => setStaffDialogOpen(true)}>
                <Users className="w-4 h-4 mr-2" />
                Manage Staff
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setBedDialogOpen(true)}>
                <Bed className="w-4 h-4 mr-2" />
                Bed Allocation
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setSchedulesDialogOpen(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                View Schedules
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setAnalyticsDialogOpen(true)}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics Report
              </Button>
            </div>
          </Card>

          {/* System Alerts */}
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-bold">System Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border border-destructive/20">
                <p className="text-sm font-medium">ICU Near Capacity</p>
                <p className="text-xs text-muted-foreground mt-1">Only 1 bed available</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-accent/20">
                <p className="text-sm font-medium">Staff Shift Change</p>
                <p className="text-xs text-muted-foreground mt-1">Night shift begins in 2 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <StaffManagementDialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen} />
      <BedAllocationDialog open={bedDialogOpen} onOpenChange={setBedDialogOpen} />
      <SchedulesDialog open={schedulesDialogOpen} onOpenChange={setSchedulesDialogOpen} />
      <AnalyticsDialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen} />
    </DashboardLayout>
  );
};

export default HospitalDashboard;
