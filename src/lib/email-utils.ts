
import { supabase } from "@/integrations/supabase/client";

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
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email notification:", error);
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
  return sendEmailNotification({
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
  return sendEmailNotification({
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
};
