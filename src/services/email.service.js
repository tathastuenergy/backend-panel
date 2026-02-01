// const nodemailer = require('nodemailer');
// const config = require('../config/config');
// const logger = require('../config/logger');
// const moment = require('moment');

// const transport = nodemailer.createTransport(config.email.smtp);
// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

// const sendEmail = async (to, subject, text) => {
//   const msg = { from: config.email.from, to, subject, text };
//   await transport.sendMail(msg);
// };


// const sendResetPasswordEmail = async (to, token) => {
//   const subject = 'Reset password';
//   // replace this url with the link to the reset password page of your front-end app
//   const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
//   const text = `Dear user,
// To reset your password, click on this link: ${resetPasswordUrl}
// If you did not request any password resets, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };

// const sendVerificationEmail = async (to, token) => {
//   const subject = 'Email Verification';
//   // replace this url with the link to the email verification page of your front-end app
//   const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
//   const text = `Dear user,
// To verify your email, click on this link: ${verificationEmailUrl}
// If you did not create an account, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };


// const sendLeaveRequestEmail = async (to, token, leaveData) => {
//   const subject = 'Leave Request';
//   // replace this url with the link to the email verification page of your front-end app
//   const approvalUrl = `${config.backendUrl}/api/v1/leave/approve-leave?token=${token}&id=${leaveData._id}`;
//   const rejectionUrl = `${config.backendUrl}/api/v1/leave/reject-leave?token=${token}&id=${leaveData._id}`;

//   const html = `<!DOCTYPE html>
//         <html>
//         <head>
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                     @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
//                     html , body  {
//                         font-family: 'Poppins', sans-serif;
//                         margin: 0;
//                         padding: 0;
//                     }
//                     .pg_template_email {
//                        max-width: 600px;
//                        margin: 0 auto;
//                        padding: 50px;
//                     }
//                     .pg_template_email .pg_logo_tmp {
//                         text-align: center;
//                         max-width: 100%;
//                     }
//                     .pg_template_email .pg_logo_tmp img{
//                         max-width: 40px;
//                     }
//                     .pg_template_email .pg_template_content {
//                         background-color: #f7fbff;
//                         padding: 25px;
//                     }
//                     .pg_template_email .pg_template_content p span {
//                         font-size: 14px;
//                         font-weight: 600;
//                         color: #5F6C91;
//                         line-height: 1.4;
//                     }
//                     .pg_template_email .pg_template_content p {
//                         font-size: 14px;
//                         color: #5F6C91;
//                         font-weight: 400;
//                         margin-bottom: 25px;
//                         line-height: 1.4;
//                     }
//                     .pg_template_email .pg_logo_tmp h2 {
//                         font-size: 18px;
//                         text-align: center;
//                         margin: 25px 0 20px;
//                         font-weight: bold;
//                         color: #313337;
//                         text-transform: capitalize;
//                         padding: 20px 0 0;
//                         line-height: 1.4;
//                     }
//                     .pg_template_email .pg_center {
//                         text-align: center;
//                     }
//                     .pg_template_email .pg_template_content .pg_btn{
//                         padding: 10px 35px;
//                         background: #fff;
//                         color: #fff;
//                         font-weight: 500;
//                         background-color: #848bf5;
//                         font-size: 16px;
//                         line-height: 1.4;
//                         text-decoration: none;
//                         text-transform: capitalize;
//                         border-radius: 5px;
//                         margin: 10px 0 10px;
//                         display: inline-flex;
//                     }
//                     .pg_template_email .pg_success_content  {  
//                        margin:35px 0 0;
//                     }
//                     .pg_template_email .pg_success_content p {  
//                         font-size: 14px;
//                         color: #313337;
//                         font-weight: 400;
//                         line-height: 1.6;
//                         margin: 0;
//                         letter-spacing: 0.5px;
//                         text-transform: capitalize;
//                     }
//                     @media only screen and (max-width: 600px) {
//                         .pg_template_email {
//                             max-width: 100%;
//                             padding: 20px;
//                         }
//                         .pg_template_email .pg_logo_tmp h2 {
//                             margin: 20px 0 15px;
//                             padding: 20px 0 0;
//                             font-size: 18px;
//                             font-weight: bold;
//                         }
//                         .pg_template_email .pg_template_content .pg_btn {
//                             padding: 10px 25px;
//                             margin: 0 0 10px;
//                             font-size: 14px;
//                         }
//                         .pg_template_email .pg_template_content {
//                             padding: 20px;
//                         }
//                     }
//                 </style>
//         </head>
//         <body>
//             <div class="pg_template_email">
//                 <div class="pg_logo_tmp">
//                     <h2>Leave Request</h2>
//                 </div>
//                 <div class="pg_template_content">
//                     <p>Employee Name: <span>${leaveData?.user?.firstName + " " + leaveData?.user?.lastName}</span></p>
//                     <p>Employee Email: <span>${leaveData.user.email}</span></p>
//                     <div class="pg_success">
//                         <div class="pg_success_content">
//                             <p>Click on the button below to approve or reject the leave request.</p>
//                         </div>
//                     </div>

//                     <div class="pg_center" >
//                         <a  class="pg_btn" href=${approvalUrl}>Approve</a>
//                         <a  class="pg_btn" href=${rejectionUrl}>Reject</a>
//                     </div>
        
//                 </div>
//             </div>
//         </body>
//         </html>
//         `

//   const msg = {
//     from: config.email.from,
//     to,
//     subject,
//     html
//   };

//   await transport.sendMail(msg);
// }

// module.exports = {
//   transport,
//   sendEmail,
//   sendResetPasswordEmail,
//   sendVerificationEmail,
//   sendLeaveRequestEmail,
// };


const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const moment = require('moment');
const transporter = require('../config/email');

const sendWelcomeEmail = async (to, name, zoomLink) => {
  const mailOptions = {
    from: `"Tathastu Energy" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Welcome to Tathastu Energy! ☀️',
   html: `
  <div style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
      style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden;">
      
      <!-- Header -->
      <tr>
        <td style="background:#232323; text-align:center; padding:30px 20px;">
          <img src="https://content.jdmagicbox.com/v2/comp/surat/v4/0261px261.x261.230116134549.v5v4/catalogue/mendel-academy-ring-road-surat-institutes-op38wx54xr.jpg" 
               alt="Tathastu Energy Logo" 
               style="width:100%; max-width:200px; height:auto; margin-bottom:10px;"/>
          <h1 style="color:#F1C232; margin:0; font-size:26px; font-weight:bold;">
            Welcome to Tathastu Energy!
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:25px 30px; color:#333;">
          <h2 style="margin-top:0;">Hi ${name}, 👋</h2>
          <p style="font-size:15px; line-height:1.6;">
            Welcome to <b>Tathastu Energy</b>! Your account has been created successfully.
          </p>
          <p style="font-size:15px; line-height:1.6;">
            We're excited to have you join us on the journey towards sustainable solar energy solutions. 
            Together, we can make a positive impact on our planet! ☀️🌍
          </p>
          
          <div style="background:#f9f9f9; padding:20px; border-radius:6px; margin:20px 0;">
            <h3 style="margin-top:0; color:#232323;">Next Steps:</h3>
            <p style="font-size:15px; line-height:1.6; margin:10px 0;">
              Join our orientation session to learn more about our solar solutions and how we can help you:
            </p>
            <div style="text-align:center; margin:20px 0;">
              <a href="${zoomLink}" 
                 style="display:inline-block; background:#F1C232; color:#232323; padding:12px 30px; 
                        text-decoration:none; border-radius:5px; font-weight:bold; font-size:16px;">
                Join Orientation Meeting
              </a>
            </div>
          </div>

          <p style="font-size:15px; line-height:1.6;">
            If you have any questions about solar installations, financing options, or our services, 
            feel free to reach out to our team anytime.
          </p>
          
          <p style="font-size:15px; line-height:1.6; margin-top:20px;">
            Best regards,<br/>
            <b>Team Tathastu Energy</b>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#232323; padding:20px; text-align:center;">
          <p style="color:#F1C232; margin:0 0 10px 0; font-size:13px;">
            Powering a sustainable future with clean solar energy
          </p>
          <p style="color:#999; margin:0; font-size:12px;">
            © ${new Date().getFullYear()} Tathastu Energy. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </div>
`
  };

  await transporter.sendMail(mailOptions);
};

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (to, subject, text) => {
    const msg = { from: config.email.from, to, subject, text };
    await transport.sendMail(msg);
};


const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
};


const sendLeaveRequestEmail = async (to, token, leaveData) => {
    const subject = 'Leave Request';
    // replace this url with the link to the email verification page of your front-end app
    const approvalUrl = `${config.backendUrl}/api/v1/leave/approve-leave?token=${token}&id=${leaveData._id}`;
    const rejectionUrl = `${config.backendUrl}/api/v1/leave/reject-leave?token=${token}&id=${leaveData._id}`;

    const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
                    html , body  {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .pg_template_email {
                       max-width: 600px;
                       margin: 0 auto;
                       padding: 50px;
                    }
                    .pg_template_email .pg_logo_tmp {
                        text-align: center;
                        max-width: 100%;
                    }
                    .pg_template_email .pg_logo_tmp img{
                        max-width: 40px;
                    }
                    .pg_template_email .pg_template_content {
                        background-color: #f7fbff;
                        padding: 25px;
                    }
                    .pg_template_email .pg_template_content p span {
                        font-size: 14px;
                        font-weight: 600;
                        color: #5F6C91;
                        line-height: 1.4;
                    }
                    .pg_template_email .pg_template_content p {
                        font-size: 14px;
                        color: #5F6C91;
                        font-weight: 400;
                        margin-bottom: 25px;
                        line-height: 1.4;
                    }
                    .pg_template_email .pg_logo_tmp h2 {
                        font-size: 18px;
                        text-align: center;
                        margin: 25px 0 20px;
                        font-weight: bold;
                        color: #313337;
                        text-transform: capitalize;
                        padding: 20px 0 0;
                        line-height: 1.4;
                    }
                    .pg_template_email .pg_center {
                        text-align: center;
                    }
                    .pg_template_email .pg_template_content .pg_btn{
                        padding: 10px 35px;
                        background: #fff;
                        color: #fff;
                        font-weight: 500;
                        background-color: #848bf5;
                        font-size: 16px;
                        line-height: 1.4;
                        text-decoration: none;
                        text-transform: capitalize;
                        border-radius: 5px;
                        margin: 10px 0 10px;
                        display: inline-flex;
                    }
                    .pg_template_email .pg_success_content  {  
                       margin:35px 0 0;
                    }
                    .pg_template_email .pg_success_content p {  
                        font-size: 14px;
                        color: #313337;
                        font-weight: 400;
                        line-height: 1.6;
                        margin: 0;
                        letter-spacing: 0.5px;
                        text-transform: capitalize;
                    }
                    @media only screen and (max-width: 600px) {
                        .pg_template_email {
                            max-width: 100%;
                            padding: 20px;
                        }
                        .pg_template_email .pg_logo_tmp h2 {
                            margin: 20px 0 15px;
                            padding: 20px 0 0;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .pg_template_email .pg_template_content .pg_btn {
                            padding: 10px 25px;
                            margin: 0 0 10px;
                            font-size: 14px;
                        }
                        .pg_template_email .pg_template_content {
                            padding: 20px;
                        }
                    }
                </style>
        </head>
        <body>
            <div class="pg_template_email">
                <div class="pg_logo_tmp">
                    <h2>Leave Request</h2>
                </div>
                <div class="pg_template_content">
                    <p>Employee Name: <span>${leaveData?.user?.firstName + " " + leaveData?.user?.lastName}</span></p>
                    <p>Employee Email: <span>${leaveData.user.email}</span></p>
                    <div class="pg_success">
                        <div class="pg_success_content">
                            <p>Click on the button below to approve or reject the leave request.</p>
                        </div>
                    </div>

                    <div class="pg_center" >
                        <a  class="pg_btn" href=${approvalUrl}>Approve</a>
                        <a  class="pg_btn" href=${rejectionUrl}>Reject</a>
                    </div>
        
                </div>
            </div>
        </body>
        </html>
        `

    const msg = {
        from: config.email.from,
        to,
        subject,
        html
    };

    await transport.sendMail(msg);
}

const sendOtp = async (to, otp) => {
  const mailOptions = {
    from: `"Tathastu Energy" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Login OTP – Tathastu Energy ☀️",
    html: `
      <div style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" 
          style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#232323; text-align:center; padding:30px 20px;">
              <h1 style="color:#F1C232; margin:0; font-size:26px; font-weight:bold;">
                🔐 Secure Login Verification
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 30px 20px 30px; color:#333;">
              <h2 style="margin-top:0; color:#232323;">Hello,</h2>
              
              <p style="font-size:15px; line-height:1.6; margin:15px 0;">
                You requested to log in to your <b>Tathastu Energy</b> account. 
                Please use the One-Time Password (OTP) below to complete your login:
              </p>

              <!-- OTP Box -->
              <div style="background:#f9f9f9; border:2px dashed #F1C232; border-radius:8px; 
                          padding:20px; text-align:center; margin:25px 0;">
                <p style="font-size:13px; color:#666; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:1px;">
                  Your OTP Code
                </p>
                <div style="font-size:36px; font-weight:bold; letter-spacing:8px; 
                            color:#232323; font-family:'Courier New', monospace;">
                  ${otp}
                </div>
              </div>

              <!-- Important Info -->
              <div style="background:#fff3cd; border-left:4px solid #F1C232; padding:15px; margin:20px 0; border-radius:4px;">
                <p style="font-size:14px; color:#856404; margin:0; line-height:1.6;">
                  ⏱️ <b>Valid for 5 minutes only</b><br/>
                  🔒 Keep this code confidential<br/>
                  ❌ Do not share with anyone
                </p>
              </div>

              <p style="font-size:14px; line-height:1.6; color:#666; margin:20px 0;">
                <b>Did not request this OTP?</b><br/>
                If you did not attempt to log in, please ignore this email. 
                Your account remains secure, and no action is needed.
              </p>

              <!-- Security Tips -->
              <div style="background:#f8f9fa; padding:15px; border-radius:6px; margin:20px 0;">
                <p style="font-size:13px; color:#495057; margin:0 0 10px 0; font-weight:bold;">
                  🛡️ Security Tips:
                </p>
                <ul style="font-size:13px; color:#666; margin:0; padding-left:20px; line-height:1.8;">
                  <li>Never share your OTP with anyone, including Tathastu Energy staff</li>
                  <li>We will never ask for your OTP via phone, email, or SMS</li>
                  <li>Always verify you're on our official website before entering credentials</li>
                </ul>
              </div>

              <p style="font-size:14px; line-height:1.6; margin-top:25px;">
                If you need assistance, feel free to contact our support team.
              </p>

              <p style="font-size:14px; line-height:1.6; margin-top:20px;">
                Best regards,<br/>
                <b>Team Tathastu Energy</b><br/>
                <span style="color:#F1C232;">☀️ Powering a Sustainable Future</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#232323; padding:20px; text-align:center;">
              <p style="color:#999; margin:0 0 5px 0; font-size:12px;">
                This is an automated email. Please do not reply to this message.
              </p>
              <p style="color:#F1C232; margin:0; font-size:13px;">
                © ${new Date().getFullYear()} Tathastu Energy. All rights reserved.
              </p>
              <p style="color:#999; margin:10px 0 0 0; font-size:11px;">
                Powering homes and businesses with clean solar energy
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
    sendWelcomeEmail,
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
    sendLeaveRequestEmail,
    sendOtp
};
