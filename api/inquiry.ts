import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Resend will read RESEND_API_KEY from environment variables on Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_name, user_email, user_phone, message, exam_date } = request.body;

    // Validate inputs
    if (!user_name || !user_email || !message) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // ==========================================
    // CONFIGURATION
    // ==========================================
    // 1. Change this to 'website@thinkinenglish.in' (or any verified sender) after GoDaddy verification is successful
    const FROM_EMAIL = 'Think in English <onboarding@resend.dev>';
    
    // 2. The email where you want to receive inquiry alerts (your personal/client email)
    const ADMIN_ALERT_EMAIL = 'jesvinsaji91@gmail.com'; 

    // Smart Testing Override:
    // If we're using onboarding@resend.dev, we send both emails to the admin (to avoid Resend unverified error)
    const isTesting = FROM_EMAIL.includes('onboarding@resend.dev');
    const userRecipient = isTesting ? ADMIN_ALERT_EMAIL : user_email;

    // ==========================================
    // EMAIL 1: Notify Admin of New Inquiry (To you)
    // ==========================================
    const adminEmailPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_ALERT_EMAIL,
      subject: `New Inquiry from ${user_name}`,
      text: `received inquiry from ${user_email} name: ${user_name}, phone number: ${user_phone || 'N/A'} and this message: ${message}`,
    });

    // ==========================================
    // EMAIL 2: Auto-responder to User (To inquirer)
    // ==========================================
    const userEmailPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: userRecipient,
      subject: `Inquiry Received - Think in English`,
      text: `hi we have recieved ur inquiry we will reply shortly with regard TIE`,
    });

    // Execute both sends in parallel
    await Promise.all([adminEmailPromise, userEmailPromise]);

    return response.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return response.status(500).json({ error: error.message || 'Internal server error' });
  }
}
