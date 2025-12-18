import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  onRemoteStream?: (stream: MediaStream) => void;
}

interface SignalMessage {
  type: "offer" | "answer" | "ice-candidate";
  from: string;
  to?: string;
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const useWebRTC = ({ roomId, userId, onRemoteStream }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = useCallback(() => {
    console.log("Creating peer connection...");
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log("Sending ICE candidate");
        channelRef.current.send({
          type: "broadcast",
          event: "signal",
          payload: {
            type: "ice-candidate",
            from: userId,
            payload: event.candidate.toJSON(),
          } as SignalMessage,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track");
      const [stream] = event.streams;
      setRemoteStream(stream);
      onRemoteStream?.(stream);
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setIsConnected(true);
        setIsConnecting(false);
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setIsConnected(false);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [userId, onRemoteStream]);

  const handleSignal = useCallback(async (message: SignalMessage) => {
    if (message.from === userId) return;

    const pc = peerConnectionRef.current;
    if (!pc) return;

    console.log("Handling signal:", message.type);

    try {
      if (message.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(message.payload as RTCSessionDescriptionInit));
        
        // Process pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        channelRef.current?.send({
          type: "broadcast",
          event: "signal",
          payload: {
            type: "answer",
            from: userId,
            payload: answer,
          } as SignalMessage,
        });
      } else if (message.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(message.payload as RTCSessionDescriptionInit));
        
        // Process pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];
      } else if (message.type === "ice-candidate") {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(message.payload as RTCIceCandidateInit));
        } else {
          pendingCandidatesRef.current.push(message.payload as RTCIceCandidateInit);
        }
      }
    } catch (err) {
      console.error("Error handling signal:", err);
      setError("Failed to process connection signal");
    }
  }, [userId]);

  const startCall = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Create peer connection
      const pc = createPeerConnection();

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Set up signaling channel
      const channel = supabase.channel(`video-call:${roomId}`, {
        config: { broadcast: { self: false } },
      });

      channel.on("broadcast", { event: "signal" }, ({ payload }) => {
        handleSignal(payload as SignalMessage);
      });

      await channel.subscribe();
      channelRef.current = channel;

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      channel.send({
        type: "broadcast",
        event: "signal",
        payload: {
          type: "offer",
          from: userId,
          payload: offer,
        } as SignalMessage,
      });

      console.log("Call started, waiting for participant...");
    } catch (err) {
      console.error("Error starting call:", err);
      setError(err instanceof Error ? err.message : "Failed to start call");
      setIsConnecting(false);
    }
  }, [roomId, userId, createPeerConnection, handleSignal]);

  const joinCall = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Create peer connection
      const pc = createPeerConnection();

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Set up signaling channel
      const channel = supabase.channel(`video-call:${roomId}`, {
        config: { broadcast: { self: false } },
      });

      channel.on("broadcast", { event: "signal" }, ({ payload }) => {
        handleSignal(payload as SignalMessage);
      });

      await channel.subscribe();
      channelRef.current = channel;

      console.log("Joined call, waiting for offer...");
    } catch (err) {
      console.error("Error joining call:", err);
      setError(err instanceof Error ? err.message : "Failed to join call");
      setIsConnecting(false);
    }
  }, [roomId, createPeerConnection, handleSignal]);

  const endCall = useCallback(() => {
    console.log("Ending call...");

    // Stop local stream
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);

    // Close peer connection
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    // Unsubscribe from channel
    channelRef.current?.unsubscribe();
    channelRef.current = null;

    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
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
  };
};
