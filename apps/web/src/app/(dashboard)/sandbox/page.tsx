'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, Volume2, RefreshCw, Bot, User, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

export default function SandboxPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [aiStatus, setAiStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsCallActive(true);
      setMessages([{
        id: '1',
        role: 'ai',
        content: 'Hello! Thank you for calling Guru-Core support. I am your AI assistant. How can I help you today?',
        timestamp: new Date(),
      }]);
      
      toast.success('Call started! You can now speak.');
    } catch (error) {
      toast.error('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsRecording(false);
    setAiStatus('idle');
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    // Add summary
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      content: `Call ended. Duration: ${formatDuration(callDuration)}. Thank you for using Guru-Core!`,
      timestamp: new Date(),
    }]);
  };

  const startRecording = async () => {
    if (!isCallActive) {
      toast.error('Please start a call first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleAudioProcessed(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAiStatus('listening');
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAiStatus('thinking');
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioProcessed = async (audioBlob: Blob) => {
    // Simulate speech-to-text and AI response
    const userText = transcript || "I'm having an issue with my recent order. It hasn't arrived yet.";
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      setAiStatus('speaking');
      
      const aiResponses = [
        "I understand your concern about the order delay. Let me check the status for you. Could you please provide your order number?",
        "I apologize for the inconvenience. Based on our records, your order is currently in transit and should arrive within 2-3 business days.",
        "I can help you with that. Would you like me to escalate this to our logistics team for priority handling?",
        "Thank you for your patience. I've noted your concern and will ensure this is resolved promptly.",
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: randomResponse,
        timestamp: new Date(),
        isPlaying: true,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate speech duration
      setTimeout(() => {
        setAiStatus('idle');
        setMessages(prev => prev.map(m => m.id === aiMessage.id ? { ...m, isPlaying: false } : m));
      }, 3000);
      
    }, 1500);
  };

  const simulatePhoneCall = () => {
    toast.info('Simulating incoming call from +91 98765 43210...');
    
    setTimeout(() => {
      startCall();
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Voice Sandbox</h1>
          <p className="text-gray-500 mt-1">Test AI voice interactions without real phone calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={simulatePhoneCall} disabled={isCallActive}>
            <Phone className="w-4 h-4 mr-2" />
            Simulate Incoming Call
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Status</CardTitle>
            <Activity className={cn("h-4 w-4", isCallActive ? "text-green-600" : "text-gray-400")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCallActive ? (
                <span className="text-green-600 flex items-center gap-2">
                  <span className="animate-pulse">●</span> Active
                </span>
              ) : (
                <span className="text-gray-500">Idle</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatDuration(callDuration)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Status</CardTitle>
            <Bot className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              <Badge variant={aiStatus === 'idle' ? 'secondary' : 'default'}>
                {aiStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Volume2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Call Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Call Controls</CardTitle>
            <CardDescription>Start a test call and use your microphone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Start/End Call */}
            {!isCallActive ? (
              <Button 
                className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
                onClick={startCall}
              >
                <Phone className="w-6 h-6 mr-2" />
                Start Test Call
              </Button>
            ) : (
              <Button 
                className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
                onClick={endCall}
              >
                <PhoneOff className="w-6 h-6 mr-2" />
                End Call ({formatDuration(callDuration)})
              </Button>
            )}

            {/* Mic Button */}
            <div className="flex justify-center">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={!isCallActive}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200",
                  isRecording 
                    ? "bg-red-500 scale-110 shadow-lg shadow-red-500/50 animate-pulse" 
                    : isCallActive
                      ? "bg-primary hover:bg-primary/90 hover:scale-105"
                      : "bg-gray-300 cursor-not-allowed"
                )}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              {isRecording 
                ? "Recording... Release to send" 
                : isCallActive 
                  ? "Hold mic button to speak" 
                  : "Start a call to begin testing"}
            </p>

            {/* Quick Text Input */}
            {isCallActive && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Or type your message:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type here..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && transcript && handleAudioProcessed(new Blob())}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => transcript && handleAudioProcessed(new Blob())}
                    disabled={!transcript}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}

            {/* Test Scenarios */}
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium">Quick Test Scenarios:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" onClick={() => setTranscript("I want to check my order status")}>
                  Order Status Inquiry
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTranscript("I need a refund for my purchase")}>
                  Refund Request
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTranscript("My product is damaged")}>
                  Damaged Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>Real-time transcript of the call</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto space-y-4 pr-2">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Bot className="w-16 h-16 mb-4 opacity-30" />
                  <p>Start a call to begin the conversation</p>
                  <p className="text-sm">Test how the AI responds to different queries</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 p-4 rounded-lg",
                      message.role === 'ai' ? "bg-primary/5" : "bg-gray-50 ml-8"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'ai' ? "bg-primary text-white" : "bg-gray-300"
                    )}>
                      {message.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.role === 'ai' ? 'Guru AI' : 'You'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.isPlaying && (
                          <span className="text-xs text-primary animate-pulse">● Speaking</span>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the Sandbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                Start a Call
              </h4>
              <p className="text-sm text-gray-600">
                Click "Start Test Call" or "Simulate Incoming Call" to begin. Allow microphone access when prompted.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                Speak or Type
              </h4>
              <p className="text-sm text-gray-600">
                Hold the mic button to record your voice, or type a message. Use quick scenarios to test common queries.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                Observe Response
              </h4>
              <p className="text-sm text-gray-600">
                Watch the AI respond in real-time. Check sentiment, response time, and conversation flow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
