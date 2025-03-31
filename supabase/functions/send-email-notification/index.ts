
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type EmailRequestBody = {
  to: string;
  subject: string;
  message?: string;
  templateName?: "staff_registration" | "appointment_confirmation";
  templateData?: Record<string, any>;
}

function generateStaffRegistrationEmail(data: any): string {
  const { staffName, role, hospital, loginLink } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to HealthLink Central</h1>
      </div>
      
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Hello ${staffName},
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Your account has been created in the HealthLink Central system as a <strong>${role}</strong> at <strong>${hospital}</strong>.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          You can now login using your registered email address and the temporary password provided to you.
        </p>
        
        <div style="margin: 25px 0; text-align: center;">
          <a href="${loginLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
            Login to your Account
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Please change your password after your first login for security reasons.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-top: 30px;">
          Thank you,<br />
          The HealthLink Central Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 14px; color: #6b7280;">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>© ${new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
      </div>
    </div>
  `;
}

function generateAppointmentConfirmationEmail(data: any): string {
  const { patientName, doctorName, hospital, date, time, department } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
      <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Appointment Confirmation</h1>
      </div>
      
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Hello ${patientName},
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Your appointment has been confirmed with the following details:
        </p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 4px; border-left: 4px solid #10b981;">
          <p style="margin: 5px 0; font-size: 16px;"><strong>Doctor:</strong> ${doctorName}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Hospital:</strong> ${hospital}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Department:</strong> ${department}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0; font-size: 16px;"><strong>Time:</strong> ${time}</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, please do so at least 24 hours in advance.
        </p>
        
        <div style="margin: 25px 0; padding: 15px; background-color: #f0fdf4; border-radius: 4px; border-left: 4px solid #10b981;">
          <p style="margin: 0; font-size: 14px; color: #065f46;">
            <strong>Important:</strong> Remember to bring your ID card and any relevant medical records to your appointment.
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-top: 30px;">
          Thank you,<br />
          The HealthLink Central Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 14px; color: #6b7280;">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>© ${new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  // This is a placeholder for actual email delivery service
  // In a real implementation, you'd use a service like SendGrid, Mailgun, etc.
  
  // For demo purposes, let's log the email details
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content length: ${htmlContent.length} characters`);
  
  // Simulate a successful email send
  return { success: true };
  
  // Example implementation with SendGrid would look like:
  /*
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@healthlink.example.com', name: 'HealthLink Central' },
      subject: subject,
      content: [{ type: 'text/html', value: htmlContent }]
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }
  
  return { success: true };
  */
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body: EmailRequestBody = await req.json();
    const { to, subject, message, templateName, templateData } = body;
    
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to and subject are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    let htmlContent = '';
    
    // Determine email content based on template or message
    if (templateName) {
      switch (templateName) {
        case 'staff_registration':
          if (!templateData) {
            return new Response(
              JSON.stringify({ success: false, error: 'templateData is required for staff_registration template' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          htmlContent = generateStaffRegistrationEmail(templateData);
          break;
          
        case 'appointment_confirmation':
          if (!templateData) {
            return new Response(
              JSON.stringify({ success: false, error: 'templateData is required for appointment_confirmation template' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          htmlContent = generateAppointmentConfirmationEmail(templateData);
          break;
          
        default:
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid templateName' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
      }
    } else if (message) {
      // Simple message without template
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h1 style="color: #111827;">${subject}</h1>
            <div style="color: #4b5563; line-height: 1.5;">${message}</div>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              This message is from HealthLink Central - National Hospital Management System
            </p>
          </div>
        </div>
      `;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Either message or templateName with templateData is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Send the email
    await sendEmail(to, subject, htmlContent);
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Email notification error:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || "An error occurred while sending the email" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
