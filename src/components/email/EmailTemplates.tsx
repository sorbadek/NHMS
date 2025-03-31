
import React from 'react';

export interface StaffRegistrationEmailProps {
  staffName: string;
  role: string;
  hospital: string;
  loginLink: string;
}

export const StaffRegistrationEmailTemplate: React.FC<StaffRegistrationEmailProps> = ({
  staffName,
  role,
  hospital,
  loginLink
}) => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
      <div style={{
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: '20px',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>Welcome to HealthLink Central</h1>
      </div>
      
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Hello {staffName},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Your account has been created in the HealthLink Central system as a <strong>{role}</strong> at <strong>{hospital}</strong>.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          You can now login using your registered email address and the temporary password provided to you.
        </p>
        
        <div style={{ margin: '25px 0', textAlign: 'center' }}>
          <a href={loginLink} style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Login to your Account
          </a>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Please change your password after your first login for security reasons.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563', marginTop: '30px' }}>
          Thank you,<br />
          The HealthLink Central Team
        </p>
      </div>
      
      <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#6b7280' }}>
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>© {new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
      </div>
    </div>
  );
};

export interface AppointmentConfirmationEmailProps {
  patientName: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
  department: string;
}

export const AppointmentConfirmationEmailTemplate: React.FC<AppointmentConfirmationEmailProps> = ({
  patientName,
  doctorName,
  hospital,
  date,
  time,
  department
}) => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
      <div style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '20px',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>Appointment Confirmation</h1>
      </div>
      
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Hello {patientName},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Your appointment has been confirmed with the following details:
        </p>
        
        <div style={{ 
          margin: '20px 0', 
          padding: '15px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Doctor:</strong> {doctorName}</p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Hospital:</strong> {hospital}</p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Department:</strong> {department}</p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Date:</strong> {date}</p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Time:</strong> {time}</p>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
          Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, please do so at least 24 hours in advance.
        </p>
        
        <div style={{ margin: '25px 0', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '4px', borderLeft: '4px solid #10b981' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#065f46' }}>
            <strong>Important:</strong> Remember to bring your ID card and any relevant medical records to your appointment.
          </p>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563', marginTop: '30px' }}>
          Thank you,<br />
          The HealthLink Central Team
        </p>
      </div>
      
      <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#6b7280' }}>
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>© {new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
      </div>
    </div>
  );
};
