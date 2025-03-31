
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailNotificationParams {
  to: string;
  subject: string;
  message?: string;
  templateName?: "staff_registration" | "appointment_confirmation";
  templateData?: Record<string, any>;
}

/**
 * Sends an email notification using the Supabase Edge Function
 */
export const sendEmailNotification = async (
  params: EmailNotificationParams
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { to, subject, message, templateName, templateData } = params;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("send-email-notification", {
      body: {
        to,
        subject,
        message,
        templateName,
        templateData,
      },
    });

    if (error) {
      console.error("Email notification error:", error);
      toast.error("Failed to send email notification");
      return { success: false, error: error.message };
    }

    toast.success("Email notification sent successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email notification:", error);
    toast.error("Failed to send email notification");
    return { 
      success: false, 
      error: error.message || "Failed to send email notification" 
    };
  }
};

/**
 * Sends a staff registration notification email
 */
export const sendStaffRegistrationEmail = async (
  email: string,
  staffName: string,
  role: string,
  hospital: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendEmailNotification({
      to: email,
      subject: "Welcome to HealthLink Central - Your Account Has Been Created",
      templateName: "staff_registration",
      templateData: {
        staffName,
        role,
        hospital,
        loginLink: window.location.origin + "/auth"
      }
    });
    
    if (result.success) {
      toast.success(`Staff registration notification sent to ${email}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("Failed to send staff registration email:", error);
    toast.error("Failed to send staff registration notification");
    return { 
      success: false, 
      error: error.message || "Failed to send staff registration notification" 
    };
  }
};

/**
 * Sends an appointment confirmation email
 */
export const sendAppointmentConfirmationEmail = async (
  email: string,
  patientName: string,
  doctorName: string,
  hospital: string,
  date: string,
  time: string,
  department: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendEmailNotification({
      to: email,
      subject: "HealthLink Central - Appointment Confirmation",
      templateName: "appointment_confirmation",
      templateData: {
        patientName,
        doctorName,
        hospital,
        date,
        time,
        department
      }
    });
    
    if (result.success) {
      toast.success(`Appointment confirmation sent to ${email}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("Failed to send appointment confirmation email:", error);
    toast.error("Failed to send appointment confirmation");
    return { 
      success: false, 
      error: error.message || "Failed to send appointment confirmation" 
    };
  }
};

/**
 * Sends a notification for emergency cases
 */
export const sendEmergencyNotification = async (
  email: string,
  emergencyType: string,
  location: string,
  details: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendEmailNotification({
      to: email,
      subject: `URGENT: ${emergencyType} Emergency Alert`,
      message: `
        <h2>Emergency Alert</h2>
        <p><strong>Type:</strong> ${emergencyType}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Details:</strong> ${details}</p>
        <p><strong>Reported:</strong> ${new Date().toLocaleString()}</p>
        <p>Please respond according to emergency protocols.</p>
      `
    });
    
    if (result.success) {
      toast.success(`Emergency notification sent to ${email}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("Failed to send emergency notification:", error);
    toast.error("Failed to send emergency alert");
    return { 
      success: false, 
      error: error.message || "Failed to send emergency alert" 
    };
  }
};

/**
 * Sends a system update notification to administrators
 */
export const sendSystemUpdateNotification = async (
  email: string,
  updateTitle: string,
  updateDetails: string,
  effectiveDate: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendEmailNotification({
      to: email,
      subject: `HealthLink Central - System Update: ${updateTitle}`,
      message: `
        <h2>System Update Notification</h2>
        <p><strong>Update:</strong> ${updateTitle}</p>
        <p><strong>Effective Date:</strong> ${effectiveDate}</p>
        <p><strong>Details:</strong></p>
        <div>${updateDetails}</div>
        <p>Please ensure all staff are informed about these changes.</p>
      `
    });
    
    if (result.success) {
      toast.success(`System update notification sent to ${email}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("Failed to send system update notification:", error);
    toast.error("Failed to send system update notification");
    return { 
      success: false, 
      error: error.message || "Failed to send system update notification" 
    };
  }
};

/**
 * Utility to validate email format
 */
export const isValidEmail = (email: string): boolean => {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utility to generate a generic email for testing
 */
export const generateTestEmail = (subject: string, message: string): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; background: #f9fafb; border-radius: 0 0 5px 5px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            <p>This is an automated message from HealthLink Central.</p>
            <p>&copy; ${new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
