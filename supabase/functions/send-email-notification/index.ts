
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationRequest {
  to: string;
  subject: string;
  message: string;
  templateName?: string;
  templateData?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { to, subject, message, templateName, templateData } = await req.json() as EmailNotificationRequest;

    // Validate required fields
    if (!to || !subject) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: 'to' and 'subject' are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Construct the email content based on template or direct message
    let htmlContent = "";
    
    if (templateName) {
      // Use template-based content when we implement templates
      switch (templateName) {
        case "staff_registration":
          htmlContent = generateStaffRegistrationTemplate(templateData);
          break;
        case "appointment_confirmation":
          htmlContent = generateAppointmentTemplate(templateData);
          break;
        default:
          htmlContent = `<div>${message}</div>`;
      }
    } else {
      // Use direct message
      htmlContent = `<div>${message}</div>`;
    }

    // In a real implementation, we would send the email using a service like SendGrid, Resend, etc.
    // For now, we'll just log it to the console
    console.log({
      to,
      subject,
      htmlContent,
    });

    // For demo purposes, always return success
    // When implementing a real email provider, make the API call here
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email notification:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to send email notification",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Template for staff registration emails
function generateStaffRegistrationTemplate(data: Record<string, any> = {}): string {
  const { 
    staffName = "Staff Member", 
    role = "Healthcare Professional",
    hospital = "Hospital",
    loginLink = "https://healthlink.example.com/login"
  } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
        <h1>Welcome to HealthLink Central</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Dear ${staffName},</p>
        
        <p>Congratulations! Your account has been created successfully as a <strong>${role}</strong> at <strong>${hospital}</strong>.</p>
        
        <p>You can now log in to the HealthLink Central system using your email address and the password you created during registration.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginLink}" style="background-color: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Login to Your Account
          </a>
        </div>
        
        <p>If you have any questions or need assistance, please contact your administrator.</p>
        
        <p>Best regards,<br>HealthLink Central Team</p>
      </div>
      
      <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2023 HealthLink Central - National Health Management System</p>
      </div>
    </div>
  `;
}

// Template for appointment emails
function generateAppointmentTemplate(data: Record<string, any> = {}): string {
  const { 
    patientName = "Patient", 
    doctorName = "Doctor",
    hospital = "Hospital",
    date = "TBD",
    time = "TBD",
    department = "Department"
  } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
        <h1>Appointment Confirmation</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Dear ${patientName},</p>
        
        <p>Your appointment has been scheduled successfully.</p>
        
        <div style="background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Hospital:</strong> ${hospital}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        
        <p>Please arrive 15 minutes before your scheduled appointment time.</p>
        <p>If you need to reschedule or cancel your appointment, please log in to your patient portal or contact the hospital directly.</p>
        
        <p>Best regards,<br>${hospital} Team</p>
      </div>
      
      <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2023 HealthLink Central - National Health Management System</p>
      </div>
    </div>
  `;
}
