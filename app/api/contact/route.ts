import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Please fill in all required fields'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const to = 'usamafarooq2007@gmail.com';
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_EMAIL;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    console.log('🚀 [CONTACT FORM] smtpUser:', smtpUser);
    console.log('🚀 [CONTACT FORM] smtpPass:', smtpPass);

    if (!smtpUser || !smtpPass) {
      console.log('⚠️ [CONTACT FORM] SMTP not configured - skipping email notification');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SMTP not configured',
        message: 'Email service not available. Please try again later.'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: smtpUser, 
        pass: smtpPass 
      },
      // Add timeout and connection options
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 10000,     // 10 seconds
    });

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ [CONTACT FORM] SMTP connection verified');
    } catch (verifyError: any) {
      console.log('❌ [CONTACT FORM] SMTP verification failed:', verifyError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SMTP verification failed',
        message: 'Email service temporarily unavailable. Please try again later.'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const emailSubject = `CVChatter Contact: ${subject} - From ${name}`;
    const emailBody = `
New contact form submission from CVChatter:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the CVChatter contact form.
Timestamp: ${new Date().toISOString()}
    `.trim();

    await transporter.sendMail({
      from: smtpUser,
      to,
      subject: emailSubject,
      text: emailBody,
      replyTo: email, // Allow direct reply to the sender
    });

    console.log('✅ [CONTACT FORM] Email sent successfully to:', to);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Thank you for your message! I'll get back to you within 24 hours."
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ [CONTACT FORM] Error sending email:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to send email',
      message: 'Something went wrong. Please try again or email me directly at usamafarooq2007@gmail.com'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
