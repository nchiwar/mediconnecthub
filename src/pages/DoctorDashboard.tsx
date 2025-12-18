import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Pill
} from "lucide-react";
import { WritePrescriptionDialog } from "@/components/prescriptions/WritePrescriptionDialog";
import { PrescriptionCard } from "@/components/prescriptions/PrescriptionCard";
import { VideoConsultationDialog } from "@/components/video/VideoConsultationDialog";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const todayAppointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    type: "Video",
    status: "Confirmed",
    avatar: "JS"
  },
  {
    id: 2,
    patient: "Emily Davis",
    time: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
    avatar: "ED"
  },
  {
    id: 3,
    patient: "Michael Brown",
    time: "02:00 PM",
    type: "Video",
    status: "Pending",
    avatar: "MB"
  },
  {
    id: 4,
    patient: "Sarah Wilson",
    time: "03:30 PM",
    type: "In-Person",
    status: "Confirmed",
    avatar: "SW"
  }
];

const recentPatients = [
  { id: 1, name: "Alice Johnson", lastVisit: "2 days ago", condition: "Hypertension", avatar: "AJ" },
  { id: 2, name: "Robert Lee", lastVisit: "1 week ago", condition: "Diabetes", avatar: "RL" },
  { id: 3, name: "Jennifer Taylor", lastVisit: "2 weeks ago", condition: "Asthma", avatar: "JT" }
];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { prescriptions, sendToPharmacy, pharmacies } = usePrescriptions();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof todayAppointments[0] | null>(null);

  useEffect(() => {
    const fetchDoctorId = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setDoctorId(data.id);
    };
    fetchDoctorId();
  }, [user]);

  const handleStartVideoCall = (appointment: typeof todayAppointments[0]) => {
    setSelectedAppointment(appointment);
    setVideoCallOpen(true);
  };

  const doctorPrescriptions = prescriptions.filter(p => 
    doctorId && p.doctor_id === doctorId
  );

  return (
    <DashboardLayout
      title="Doctor Dashboard"
      subtitle="Manage your practice and patients"
      role="Doctor"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Appointments"
          value={4}
          icon={Calendar}
          change="+2 from yesterday"
          trend="up"
        />
        <StatsCard
          title="Total Patients"
          value={156}
          icon={Users}
          change="+8 this month"
          trend="up"
        />
        <StatsCard
          title="Consultations (Month)"
          value={89}
          icon={Video}
          change="+12% vs last month"
          trend="up"
        />
        <StatsCard
          title="Patient Satisfaction"
          value="4.9"
          icon={TrendingUp}
          change="98% positive reviews"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Today's Schedule</h2>
              <Button variant="ghost" size="sm">View Calendar</Button>
            </div>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
                >
                  <Avatar className="w-12 h-12 bg-primary">
                    <AvatarFallback className="text-white font-semibold">
                      {appointment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{appointment.patient}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {appointment.type}
                      </Badge>
                      <Badge 
                        variant={appointment.status === "Confirmed" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appointment.type === "Video" && (
                      <Button 
                        size="sm" 
                        className="gradient-primary text-white"
                        onClick={() => handleStartVideoCall(appointment)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Call
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Patient Management */}
          <Card className="p-6">
            <Tabs defaultValue="recent">
              <TabsList className="mb-6">
                <TabsTrigger value="recent">Recent Patients</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-secondary">
                        <AvatarFallback className="text-white font-semibold">
                          {patient.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.condition} • Last visit: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Records
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                {doctorPrescriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No prescriptions yet</p>
                  </div>
                ) : (
                  doctorPrescriptions.slice(0, 5).map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      showActions={true}
                      role="doctor"
                      onSendToPharmacy={(id) => {
                        if (pharmacies.length > 0) {
                          sendToPharmacy(id, pharmacies[0].id);
                        }
                      }}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="notes">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Clinical notes will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {doctorId && user && (
                <WritePrescriptionDialog
                  patientId={user.id}
                  patientName="Demo Patient"
                  doctorId={doctorId}
                  trigger={
                    <Button className="w-full gradient-primary text-white justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Write E-Prescription
                    </Button>
                  }
                />
              )}
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Availability
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View Patient List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">This Month</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Consultations</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "89%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Prescriptions Written</span>
                  <span className="font-semibold">142</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                  <span className="font-semibold">4.9/5.0</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "98%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Video Call Dialog */}
      {user && selectedAppointment && (
        <VideoConsultationDialog
          open={videoCallOpen}
          onOpenChange={setVideoCallOpen}
          appointmentId={`appointment-${selectedAppointment.id}`}
          userId={user.id}
          isDoctor={true}
          participantName={selectedAppointment.patient}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
