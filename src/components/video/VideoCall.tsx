import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWebRTC } from "@/hooks/useWebRTC";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Maximize2,
  Minimize2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCallProps {
  roomId: string;
  userId: string;
  isHost?: boolean;
  onCallEnd?: () => void;
  participantName?: string;
}

export const VideoCall = ({ 
  roomId, 
  userId, 
  isHost = false, 
  onCallEnd,
  participantName = "Participant"
}: VideoCallProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const {
    localStream,
    remoteStream,
    isConnected,
    isConnecting,
    error,
    startCall,
    joinCall,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useWebRTC({ roomId, userId });

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleStartCall = async () => {
    setCallStarted(true);
    if (isHost) {
      await startCall();
    } else {
      await joinCall();
    }
  };

  const handleEndCall = () => {
    endCall();
    setCallStarted(false);
    onCallEnd?.();
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!callStarted) {
    return (
      <Card className={cn(
        "flex flex-col items-center justify-center gap-6 p-8",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[500px]"
      )}>
        <div className="text-center">
          <Video className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Video Consultation</h3>
          <p className="text-muted-foreground">
            {isHost 
              ? "Start the video call and wait for the patient to join"
              : "Join the video call with your doctor"
            }
          </p>
        </div>
        <Button onClick={handleStartCall} size="lg" className="gap-2">
          <Phone className="h-5 w-5" />
          {isHost ? "Start Call" : "Join Call"}
        </Button>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "relative overflow-hidden bg-background",
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[500px]"
    )}>
      {/* Remote Video (Main) */}
      <div className="absolute inset-0 bg-muted">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            {isConnecting ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Connecting...</p>
              </>
            ) : (
              <>
                <Video className="h-12 w-12 mb-4 opacity-50" />
                <p>Waiting for {participantName} to join...</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-20 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-background bg-muted">
        {localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full h-full object-cover",
              !isVideoEnabled && "hidden"
            )}
          />
        ) : null}
        {!isVideoEnabled && (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <VideoOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Connection Status */}
      {isConnected && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Connected
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Fullscreen Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFullscreen}
        className="absolute top-4 right-4 bg-background/50 hover:bg-background/80"
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </Button>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <Button
          variant={isAudioEnabled ? "secondary" : "destructive"}
          size="icon"
          onClick={handleToggleAudio}
          className="h-12 w-12 rounded-full"
        >
          {isAudioEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          className="h-14 w-14 rounded-full"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant={isVideoEnabled ? "secondary" : "destructive"}
          size="icon"
          onClick={handleToggleVideo}
          className="h-12 w-12 rounded-full"
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
      </div>
    </Card>
  );
};
