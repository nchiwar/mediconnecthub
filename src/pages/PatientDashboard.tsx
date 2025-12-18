import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Activity,
  Video,
  MapPin,
  Star,
  ArrowRight,
  Pill
} from "lucide-react";
import { PrescriptionCard } from "@/components/prescriptions/PrescriptionCard";
import { VideoConsultationDialog } from "@/components/video/VideoConsultationDialog";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { useAuth } from "@/hooks/useAuth";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Today, 2:30 PM",
    type: "Video Consultation",
    avatar: "SJ"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Medicine",
    date: "Tomorrow, 10:00 AM",
    type: "In-Person",
    avatar: "MC"
  }
];

const matchedDoctors = [
  {
    id: 1,
    name: "Dr. Emily Rodriguez",
    specialty: "Neurologist",
    rating: 4.9,
    match: 95,
    avatar: "ER"
  },
  {
    id: 2,
    name: "Dr. James Williams",
    specialty: "Orthopedic",
    rating: 4.8,
    match: 92,
    avatar: "JW"
  },
  {
    id: 3,
    name: "Dr. Lisa Anderson",
    specialty: "Dermatologist",
    rating: 4.9,
    match: 88,
    avatar: "LA"
  }
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const { prescriptions } = usePrescriptions();
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof upcomingAppointments[0] | null>(null);

  const patientPrescriptions = prescriptions.filter(p => 
    user && p.patient_id === user.id
  );

  const handleJoinVideoCall = (appointment: typeof upcomingAppointments[0]) => {
    setSelectedAppointment(appointment);
    setVideoCallOpen(true);
  };

  return (
    <DashboardLayout
      title="Patient Dashboard"
      subtitle="Manage your health journey"
      role="Patient"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Upcoming Appointments"
          value={2}
          icon={Calendar}
          change="+1 this week"
          trend="up"
        />
        <StatsCard
          title="Active Prescriptions"
          value={3}
          icon={Pill}
          change="2 refills needed"
          trend="neutral"
        />
        <StatsCard
          title="Health Records"
          value={12}
          icon={FileText}
          change="Last updated: 2 days ago"
          trend="neutral"
        />
        <StatsCard
          title="AI Match Score"
          value="95%"
          icon={Activity}
          change="Excellent match"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
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
                    <h3 className="font-semibold">{appointment.doctor}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{appointment.date}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {appointment.type === "Video Consultation" ? (
                          <Video className="w-3 h-3 mr-1" />
                        ) : (
                          <MapPin className="w-3 h-3 mr-1" />
                        )}
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    className="gradient-primary text-white"
                    onClick={() => appointment.type === "Video Consultation" && handleJoinVideoCall(appointment)}
                  >
                    {appointment.type === "Video Consultation" ? "Join Call" : "View Details"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Prescriptions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Prescriptions</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {patientPrescriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No prescriptions yet</p>
                </div>
              ) : (
                patientPrescriptions.slice(0, 3).map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    role="patient"
                  />
                ))
              )}
            </div>
            <Button className="w-full mt-4 gradient-secondary text-white" asChild>
              <a href="/pharmacy-marketplace">
                Order from Pharmacy
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Matched Doctors */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">AI-Matched Doctors</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your symptoms and medical history
            </p>
            <div className="space-y-4">
              {matchedDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="bg-secondary">
                      <AvatarFallback className="text-white font-semibold">
                        {doctor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{doctor.name}</h3>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {doctor.match}% Match
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full" variant="outline">
                    Book Appointment
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Symptom Checker
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Health Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
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
          isDoctor={false}
          participantName={selectedAppointment.doctor}
        />
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
