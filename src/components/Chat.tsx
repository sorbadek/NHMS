
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Paperclip, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: Date;
  is_ai?: boolean;
}

interface ChatProps {
  channelId: string;
  title?: string;
  userId: string;
  userName: string;
}

const Chat = ({ channelId, title = "Support Chat", userId, userName }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll add some demo messages
        const demoMessages: Message[] = [
          {
            id: "1",
            sender_id: "ai",
            sender_name: "AI Assistant",
            content: "Hello! Welcome to the NHMS support chat. How can I help you today?",
            timestamp: new Date(Date.now() - 3600000),
            is_ai: true
          },
          {
            id: "2",
            sender_id: userId,
            sender_name: userName,
            content: "I'm having trouble accessing my medical records.",
            timestamp: new Date(Date.now() - 3500000)
          },
          {
            id: "3",
            sender_id: "ai",
            sender_name: "AI Assistant",
            content: "I'm sorry to hear that. Could you specify what issue you're experiencing with accessing your records?",
            timestamp: new Date(Date.now() - 3400000),
            is_ai: true
          }
        ];
        
        setMessages(demoMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [channelId, userId, userName]);

  // Set up real-time message subscription
  useEffect(() => {
    // In a real implementation, this would subscribe to Supabase realtime
    // For demo purposes, we'll just log that we would be setting up subscription
    console.log(`Setting up subscription to channel: ${channelId}`);
    
    // This would be the actual subscription code:
    /*
    const channel = supabase
      .channel(`chat:${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
    */
    
    // Cleanup function
    return () => {
      console.log(`Cleaning up subscription to channel: ${channelId}`);
    };
  }, [channelId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage("");
    
    const tempId = Date.now().toString();
    const newUserMessage: Message = {
      id: tempId,
      sender_id: userId,
      sender_name: userName,
      content: messageToSend,
      timestamp: new Date()
    };
    
    // Add user message to the state immediately
    setMessages(prev => [...prev, newUserMessage]);
    
    // Simulate sending message to the server
    try {
      // In a real implementation, this would send to Supabase
      console.log("Sending message:", messageToSend);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender_id: "ai",
          sender_name: "AI Assistant",
          content: getAIResponse(messageToSend),
          timestamp: new Date(),
          is_ai: true
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message and show error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };
  
  // Simple AI response generator - in a real implementation, this would be a proper AI model
  const getAIResponse = (message: string): string => {
    message = message.toLowerCase();
    
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! How can I assist you with the NHMS platform today?";
    }
    
    if (message.includes("medical record") || message.includes("health record")) {
      return "To access your medical records, navigate to the 'Patient Dashboard' and click on 'Patient Records'. All your health records from connected hospitals will appear there. Is there a specific issue you're experiencing?";
    }
    
    if (message.includes("appointment") || message.includes("schedule")) {
      return "You can schedule appointments through the 'Patient Appointments' section. Select your preferred hospital, date, and available time slot. Would you like me to guide you through the process?";
    }
    
    if (message.includes("hospital") || message.includes("clinic")) {
      return "NHMS connects with various hospitals across the country. You can view all affiliated healthcare facilities in the 'Hospitals' directory. Is there a specific hospital you're looking for?";
    }
    
    if (message.includes("password") || message.includes("login") || message.includes("sign in")) {
      return "If you're having trouble with your password, you can use the 'Forgot Password' option on the login page. For other login issues, please provide more details so I can assist you better.";
    }
    
    if (message.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with today?";
    }
    
    return "I understand you're asking about " + message.split(' ').slice(0, 3).join(' ') + "... Could you provide more details so I can give you the most accurate information?";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-health-600" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-1px)]">
            <div className="flex flex-col gap-3 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.sender_id === userId ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.is_ai ? "/placeholder.svg" : ""} />
                      <AvatarFallback className={message.is_ai ? "bg-health-100 text-health-600" : "bg-gray-200"}>
                        {message.is_ai ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender_id === userId
                          ? "bg-health-600 text-white"
                          : message.is_ai
                          ? "bg-health-50 border border-health-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs opacity-70 mb-1">
                          {message.sender_name} • {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-health-600 hover:bg-health-700"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
