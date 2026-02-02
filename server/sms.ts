import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const myPhone = process.env.MY_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSMS(message: string): Promise<boolean> {
  if (!client || !twilioPhone || !myPhone) {
    console.log("Twilio not configured, skipping SMS:", message);
    return false;
  }

  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: myPhone
    });
    console.log("SMS sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return false;
  }
}

export function notifyNewLead(name: string, email: string, projectType?: string): Promise<boolean> {
  const message = `🚀 New Lead!\n\nName: ${name}\nEmail: ${email}${projectType ? `\nProject: ${projectType}` : ""}\n\nCheck your admin dashboard!`;
  return sendSMS(message);
}

export function notifyNewQuote(name: string, projectType: string, estimatedCost: string): Promise<boolean> {
  const message = `💰 New Quote Request!\n\nName: ${name}\nProject: ${projectType}\nEstimate: $${estimatedCost}\n\nCheck your admin dashboard!`;
  return sendSMS(message);
}

export function notifyNewBooking(name: string, date: string, timeSlot: string): Promise<boolean> {
  const message = `📅 New Booking!\n\nName: ${name}\nDate: ${date}\nTime: ${timeSlot}\n\nCheck your admin dashboard!`;
  return sendSMS(message);
}

export function notifyNewPulseRequest(companyName: string, tier: string, useCase: string): Promise<boolean> {
  const message = `🎯 PULSE ACCESS REQUEST!\n\nCompany: ${companyName}\nTier: ${tier.toUpperCase()}\nUse Case: ${useCase}\n\nHigh-value lead! Check admin dashboard!`;
  return sendSMS(message);
}
