import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { username, email, name } = await request.json();

    const to = process.env.SIGNUP_NOTIFY_EMAIL || 'usamafarooq2007@gmail.com';
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_EMAIL;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    console.log('🚀 [SEND SIGNUP NOTIFICATION] smtpUser:', smtpUser);
    console.log('🚀 [SEND SIGNUP NOTIFICATION] smtpPass:', smtpPass);

    if (!smtpUser || !smtpPass) {
      console.log('⚠️ [SEND SIGNUP NOTIFICATION] SMTP not configured - skipping email notification');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SMTP not configured',
        message: 'Email notification skipped - SMTP credentials not found'
      }), { status: 200 }); // Return 200 to not break the signup flow
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
      console.log('✅ [SEND SIGNUP NOTIFICATION] SMTP connection verified');
    } catch (verifyError: any) {
      console.log('❌ [SEND SIGNUP NOTIFICATION] SMTP verification failed:', verifyError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SMTP verification failed',
        message: 'Email notification skipped - SMTP connection failed'
      }), { status: 200 }); // Return 200 to not break the signup flow
    }

    const profileUrl = `https://cvchatter.com/profile/${username}`;

    await transporter.sendMail({
      from: smtpUser,
      to,
      subject: `New User Signup: ${name || username}`,
      text: `A new user has signed up on your platform!\n\nName: ${name || 'Unknown'}\nEmail: ${email || 'Unknown'}\nUsername: ${username}\nProfile Link: ${profileUrl}\n\nCreated at: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New User Signup Notification</h2>
          <p>A new user has signed up on your platform!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name || 'Unknown'}</p>
            <p><strong>Email:</strong> ${email || 'Unknown'}</p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Profile Link:</strong> <a href="${profileUrl}" style="color: #007bff;">${profileUrl}</a></p>
            <p><strong>Created at:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    console.log('✅ [SEND SIGNUP NOTIFICATION] Email sent successfully to:', to);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.log('❌ [SEND SIGNUP NOTIFICATION] Error details:', {
      message: e?.message,
      code: e?.code,
      response: e?.response,
      responseCode: e?.responseCode
    });
    
    // Return 200 instead of 500 to not break the signup flow
    return new Response(JSON.stringify({ 
      success: false, 
      error: e?.message || 'Unknown error',
      message: 'Email notification failed but signup completed successfully'
    }), { status: 200 });
  }
}


