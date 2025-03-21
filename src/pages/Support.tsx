
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail, MessageSquare, Clock, CheckCircle2, ArrowUpRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: "",
    attachFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.type || !form.subject || !form.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Support Request Submitted",
        description: "We've received your request and will get back to you shortly.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4 border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
                N
              </div>
              <span className="font-semibold text-lg">NHMS Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-gray-600">Get help with the National Hospital Management System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {!isSubmitted ? (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              placeholder="John Doe" 
                              value={form.name}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Your Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              placeholder="johndoe@example.com" 
                              value={form.email}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Request Type</Label>
                            <Select 
                              value={form.type} 
                              onValueChange={(value) => handleSelectChange("type", value)}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select request type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technical">Technical Support</SelectItem>
                                <SelectItem value="account">Account Issues</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="billing">Billing Inquiry</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input 
                              id="subject" 
                              name="subject" 
                              placeholder="Brief description of your issue" 
                              value={form.subject}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message" 
                            name="message" 
                            placeholder="Please describe your issue in detail" 
                            rows={6}
                            value={form.message}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : "Submit Support Request"}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold">Request Submitted</h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Thank you for contacting the NHMS support team. We've received your request and will get back to you within 24-48 hours.
                      </p>
                      <div className="pt-4">
                        <p className="text-sm text-gray-500">Reference Number</p>
                        <p className="font-medium">{`SUP-${Date.now().toString().substring(5)}`}</p>
                      </div>
                      <div className="pt-4">
                        <Button onClick={() => setIsSubmitted(false)}>
                          Submit Another Request
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-100">
                        <Phone className="h-5 w-5 text-health-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-gray-600">+123-456-7890</p>
                        <p className="text-xs text-gray-500 mt-1">Available Mon-Fri, 8am-6pm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-100">
                        <Mail className="h-5 w-5 text-health-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-gray-600">support@nhms.gov</p>
                        <p className="text-xs text-gray-500 mt-1">We aim to respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-100">
                        <MessageSquare className="h-5 w-5 text-health-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-gray-600">Chat with support agents</p>
                        <p className="text-xs text-gray-500 mt-1">Available 24/7 for urgent issues</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-100">
                        <Clock className="h-5 w-5 text-health-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Support Hours</h3>
                        <p className="text-sm text-gray-600">Monday - Friday: 8am - 8pm</p>
                        <p className="text-sm text-gray-600">Saturday: 9am - 5pm</p>
                        <p className="text-sm text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Help Resources</h2>
                  <div className="space-y-3">
                    <Link to="/documentation" className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Documentation</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link to="/faq" className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Frequently Asked Questions</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <a href="#" className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Video Tutorials</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Community Forum</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} National Hospital Management System. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-health-600">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-health-600">Terms of Service</Link>
              <Link to="/faq" className="text-sm text-gray-600 hover:text-health-600">FAQ</Link>
              <Link to="/support" className="text-sm text-gray-600 hover:text-health-600">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
