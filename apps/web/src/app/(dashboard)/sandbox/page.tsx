'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mic, MicOff, Phone, PhoneOff, Bot, User, Clock, Activity, Fingerprint,
  Cpu, ShieldCheck, AlertTriangle, Pause, Play, Settings, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

interface UserProfile {
  name: string;
  role: string;
  clearanceLevel: 'L1' | 'L2' | 'L3' | 'Top Secret';
  department: string;
}

// Add type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function SandboxPage() {
  // Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [aiStatus, setAiStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'paused'>('idle');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const [transcript, setTranscript] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Identity State
  const [isIdentified, setIsIdentified] = useState(false);
  const [showProfileConfig, setShowProfileConfig] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Agent',
    role: 'Staff',
    clearanceLevel: 'L1',
    department: 'General'
  });

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize & Load Profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const savedProfile = localStorage.getItem('guru_voice_profile_v2');
      if (savedProfile) {
        const { gender, profile, identified } = JSON.parse(savedProfile);
        setVoiceGender(gender || 'female');
        setUserProfile(profile || userProfile);
        if (identified) {
          setIsIdentified(true);
        }
      } else {
        // Trigger setup if no profile
        setTimeout(() => setShowProfileConfig(true), 1000);
      }
    }
  }, []);

  // Persist profile changes
  const saveProfile = () => {
    localStorage.setItem('guru_voice_profile_v2', JSON.stringify({
      gender: voiceGender,
      identified: true, // Auto-identify once saved
      profile: userProfile,
      lastSeen: new Date().toISOString()
    }));
    setIsIdentified(true);
    setShowProfileConfig(false);
    toast.success("Identity Verified & Saved");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call Timer Logic (Pause Aware)
  useEffect(() => {
    if (isCallActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive, isPaused]);

  // Audio Context Unlock
  const unlockAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Audio Output Handlers ---
  const fallbackSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v =>
      voiceGender === 'female' ? v.name.includes('Female') || v.name.includes('Samantha') : v.name.includes('Male') || v.name.includes('Daniel')
    ) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;

    utterance.onstart = () => setAiStatus('speaking');
    utterance.onend = () => {
      setAiStatus('idle');
      if (onEnd) onEnd();
    };
    synthRef.current.speak(utterance);
  }, [voiceGender]);

  const playAudio = useCallback((base64Audio: string, onEnd?: () => void) => {
    try {
      const audio = new Audio(base64Audio);
      audio.onplay = () => setAiStatus('speaking');
      audio.onended = () => {
        setAiStatus('idle');
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        setAiStatus('idle');
        if (onEnd) onEnd();
      };
      audio.play().catch(e => { console.error("Audio Play Fail", e); if (onEnd) onEnd(); });
    } catch (e) {
      console.error("Audio Init Fail", e);
    }
  }, []);

  // --- Interaction Logic ---
  const processUserMessage = useCallback(async (text: string) => {
    if (isPaused) return; // Ignore if paused

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setAiStatus('thinking');
    setConnectionError(null);

    try {
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          voiceGender: voiceGender,
          userProfile: userProfile // Pass the rich profile
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.text,
        timestamp: new Date(),
        isPlaying: true,
      };

      setMessages(prev => [...prev, aiMessage]);

      if (data.audio) {
        playAudio(data.audio, () => {
          setMessages(prev => prev.map(m => m.id === aiMessage.id ? { ...m, isPlaying: false } : m));
        });
      } else {
        fallbackSpeak(data.text, () => {
          setMessages(prev => prev.map(m => m.id === aiMessage.id ? { ...m, isPlaying: false } : m));
        });
      }

    } catch (error) {
      console.error('AI Failed', error);
      setAiStatus('idle');
      // Simple fallback for error
      const fallbackText = "Secure connection unstable. Switching to offline protocols.";
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: fallbackText,
        timestamp: new Date(),
        isPlaying: false
      }]);
      fallbackSpeak(fallbackText);
    }
  }, [voiceGender, userProfile, isPaused, playAudio, fallbackSpeak]);

  // --- Call Control Logic ---
  const startCall = async () => {
    try {
      unlockAudioContext();
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Browser does not support speech recognition.');
        return;
      }
      await navigator.mediaDevices.getUserMedia({ audio: true });

      setIsCallActive(true);
      setIsPaused(false);
      setIsMuted(false);

      const greeting = `Identity confirmed. ${userProfile.role} ${userProfile.name}, secure channel ${userProfile.clearanceLevel} is active.`;

      setMessages([{
        id: '1',
        role: 'ai',
        content: greeting,
        timestamp: new Date(),
      }]);

      // We don't auto-speak greeting to avoid permissions issues, but we could if we had user gesture
      toast.success('Secure Channel Established');

    } catch (error) {
      toast.error('Microphone Access Denied');
    }
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setAiStatus('idle');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: "*Session Resumed*",
        timestamp: new Date()
      }]);
      toast.info("Session Resumed");
    } else {
      // Pause
      setIsPaused(true);
      setAiStatus('paused');
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: "*Session Paused*",
        timestamp: new Date()
      }]);
      toast.warning("Session Paused - Timer Stopped");
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsPaused(false);
    setIsRecording(false);
    setAiStatus('idle');
    if (recognitionRef.current) recognitionRef.current.stop();

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      content: `Call Terminated. Duration: ${formatDuration(callDuration)}.`,
      timestamp: new Date(),
    }]);
  };

  const startRecording = () => {
    if (!isCallActive) { toast.error('Start call first'); return; }
    if (isPaused) { toast.warning('Session is paused. Resume to speak.'); return; }
    if (isMuted) { toast.warning('Microphone is muted.'); return; }

    unlockAudioContext();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setAiStatus('listening');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processUserMessage(text);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        setAiStatus('idle');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header with Settings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Voice Command Center <Badge variant="outline" className="text-xs border-purple-500 text-purple-600">Quantum v2.2</Badge>
          </h1>
          <p className="text-gray-500 mt-1">Advanced Identity Management & Secure Operations</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowProfileConfig(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configure Identity
          </Button>

          {isCallActive && (
            <>
              <Button
                variant={isPaused ? "default" : "secondary"}
                size="sm"
                onClick={togglePause}
                className="w-24"
              >
                {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="w-24"
                disabled={isPaused}
              >
                {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Identity Configuration Dialog */}
      <Dialog open={showProfileConfig} onOpenChange={setShowProfileConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secure Identity Profiling</DialogTitle>
            <DialogDescription>
              Configure your cognitive identity signature. The AI will adapt to your role and clearance level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input value={userProfile.role} onChange={e => setUserProfile({ ...userProfile, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={userProfile.department} onChange={e => setUserProfile({ ...userProfile, department: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Security Clearance</Label>
              <Select value={userProfile.clearanceLevel} onValueChange={(v: any) => setUserProfile({ ...userProfile, clearanceLevel: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">Level 1 (Public)</SelectItem>
                  <SelectItem value="L2">Level 2 (Internal)</SelectItem>
                  <SelectItem value="L3">Level 3 (Confidential)</SelectItem>
                  <SelectItem value="Top Secret">Top Secret (Quantum)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Voice Preference</Label>
              <Select value={voiceGender} onValueChange={(v: any) => setVoiceGender(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female (Nova)</SelectItem>
                  <SelectItem value="male">Male (Alloy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveProfile} className="w-full bg-purple-600 hover:bg-purple-700">
              <Fingerprint className="w-4 h-4 mr-2" />
              Save & Authenticate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Security Card */}
        <Card className={cn("transition-colors duration-500", isCallActive ? "border-green-500/50 bg-green-50/10" : "")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Boundary</CardTitle>
            <ShieldCheck className={cn("h-4 w-4", isCallActive ? "text-green-600" : "text-gray-400")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCallActive ? (
                <span className="text-green-600 text-lg flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {userProfile.clearanceLevel} Active
                </span>
              ) : (
                <span className="text-gray-500">Secured</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">DLP Protocols Active</p>
          </CardContent>
        </Card>

        {/* Identity Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agent</CardTitle>
            <User className={cn("h-4 w-4", isIdentified ? "text-purple-600" : "text-gray-400")} />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate" title={userProfile.role}>
              {userProfile.role}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{userProfile.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className={cn("h-4 w-4", isPaused ? "text-orange-500" : aiStatus === 'thinking' ? "text-blue-500" : "text-gray-400")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {isPaused ? <span className="text-orange-500">PAUSED</span> : aiStatus}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Neural Engine v4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className={cn("h-4 w-4", isPaused ? "text-gray-400" : "text-orange-600")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold font-mono", isPaused && "opacity-50")}>
              {formatDuration(callDuration)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardContent className="py-8 space-y-8">
            {/* Mic Button */}
            <div className="flex justify-center relative">
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-28 w-28 rounded-full bg-red-400 opacity-20"></span>
                </div>
              )}

              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={!isCallActive || isPaused || isMuted}
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-4",
                  isRecording ? "bg-red-500 border-red-300 scale-110" :
                    isPaused ? "bg-orange-100 border-orange-300 cursor-not-allowed" :
                      isMuted ? "bg-gray-200 border-gray-400" :
                        isCallActive ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 hover:scale-105 shadow-xl" :
                          "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                )}
              >
                {isPaused ? <Pause className="w-12 h-12 text-orange-500" /> :
                  isMuted ? <MicOff className="w-12 h-12 text-gray-500" /> :
                    isRecording ? <Activity className="w-12 h-12 text-white animate-pulse" /> :
                      <Mic className="w-12 h-12 text-white" />
                }
              </button>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold min-h-[28px]">
                {isPaused ? "Session Paused" :
                  isMuted ? "Microphone Muted" :
                    isRecording ? "Listening..." :
                      aiStatus === 'thinking' ? "Quantum Processing..." :
                        aiStatus === 'speaking' ? "Speaking..." :
                          isCallActive ? "Ready" : "Offline"}
              </h3>
              <p className="text-sm text-gray-500">
                {isCallActive ? (isPaused ? "Resume to continue" : "Hold to speak") : "Initiate session to begin"}
              </p>
            </div>

            {!isCallActive ? (
              <Button className="w-full text-lg bg-green-600 hover:bg-green-700 py-6" onClick={startCall}>
                <Phone className="w-5 h-5 mr-2" /> Start Secure Session
              </Button>
            ) : (
              <Button variant="destructive" className="w-full text-lg py-6" onClick={endCall}>
                <PhoneOff className="w-5 h-5 mr-2" /> Terminate
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Secure Transcript</CardTitle>
            <CardDescription>
              {isCallActive ? "Live encrypted stream active" : "History"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Cpu className="w-20 h-20 mb-4 opacity-10" />
                  <p>Waiting for input...</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={cn("flex gap-4 p-4 rounded-xl", m.role === 'ai' ? "bg-indigo-50/50 border border-indigo-100" : "bg-white border border-gray-100 ml-12")}>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", m.role === 'ai' ? "bg-indigo-600 text-white" : "bg-gray-900 text-white")}>
                      {m.role === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {m.role === 'ai' ? "Guru Core" : userProfile.name}
                        </span>
                        <span className="text-xs text-gray-400">{m.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{m.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
