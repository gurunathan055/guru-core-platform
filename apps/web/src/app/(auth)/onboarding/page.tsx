'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Sparkles,
  Users,
  Phone,
  Settings,
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Guru-Core',
      description: "Let's get you started with your AI voice automation platform",
      icon: Sparkles,
      completed: false,
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us a bit about yourself and your organization',
      icon: Users,
      completed: false,
    },
    {
      id: 'settings',
      title: 'Configure Settings',
      description: 'Set up your preferences and notification options',
      icon: Settings,
      completed: false,
    },
    {
      id: 'explore',
      title: 'Explore Features',
      description: 'Learn about the powerful features available to you',
      icon: Phone,
      completed: false,
    },
  ]);

  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    industry: '',
    team_size: '',
    use_case: '',
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profile);

    if ((profile as any)?.metadata?.onboarding_completed) {
      router.push('/dashboard');
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await saveProfile();
    }

    if (currentStep === steps.length - 1) {
      await completeOnboarding();
    } else {
      const newSteps = [...steps];
      newSteps[currentStep].completed = true;
      setSteps(newSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        // @ts-ignore
        .update({
          metadata: {
            ...(profile as any)?.metadata,
            ...formData,
          },
        } as any)
        .eq('id', (user?.id as any));

      if (error) throw error;
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        // @ts-ignore
        .update({
          metadata: {
            ...(profile as any)?.metadata,
            ...formData,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          },
        } as any)
        .eq('id', (user?.id as any));

      if (error) throw error;

      toast.success('Welcome to Guru-Core! 🎉');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      toast.error('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">Welcome to Guru-Core!</h2>
              <p className="text-gray-600 text-lg">
                Your intelligent AI voice automation platform for enterprise support
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 border rounded-lg">
                <Phone className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">AI Voice Calls</h3>
                <p className="text-sm text-gray-600">Handle customer calls with sub-250ms latency</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Users className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Live Monitoring</h3>
                <p className="text-sm text-gray-600">Monitor and manage calls in real-time</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Settings className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Easy Integration</h3>
                <p className="text-sm text-gray-600">Connect with Freshdesk, Salesforce & more</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="FMCG, Retail, Healthcare, etc."
                />
              </div>
              <div>
                <Label htmlFor="team_size">Team Size</Label>
                <select
                  id="team_size"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.team_size}
                  onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <Label htmlFor="use_case">Primary Use Case</Label>
                <textarea
                  id="use_case"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.use_case}
                  onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                  placeholder="e.g., Customer support automation, Order tracking, Returns handling..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Configure Settings</h2>
              <p className="text-gray-600">Set up your preferences</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Call Escalation Alerts</h3>
                    <p className="text-sm text-gray-600">Get notified when calls need attention</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Weekly Reports</h3>
                    <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Explore Your Dashboard</h2>
              <p className="text-gray-600">Here's what you can do with Guru-Core</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <Badge className="mb-2">Popular</Badge>
                <h3 className="font-semibold mb-1">Live Call Monitoring</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Watch active calls in real-time, take over when needed
                </p>
                <span className="text-sm text-primary">Visit /live-calls →</span>
              </div>
              <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600 mb-2">
                  View detailed metrics with 8 interactive charts
                </p>
                <span className="text-sm text-primary">Visit /analytics →</span>
              </div>
              <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Integration Studio</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Connect to Freshdesk, Salesforce, and more without code
                </p>
                <span className="text-sm text-primary">Visit /integrations →</span>
              </div>
              <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">SOP Generator</h3>
                <p className="text-sm text-gray-600 mb-2">
                  AI-powered standard operating procedure creation
                </p>
                <span className="text-sm text-primary">Visit /sop-generator →</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 <strong>Pro Tip:</strong> Start by exploring the Live Calls page to see how real-time
                monitoring works. You can take over any call with one click!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Getting Started</CardTitle>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-colors ${index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button onClick={handleNext} disabled={loading}>
                {currentStep === steps.length - 1 ? (
                  loading ? 'Finishing...' : 'Get Started'
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            <button
              onClick={completeOnboarding}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
            >
              Skip onboarding →
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
