export const passwordRecoveryLetter = (email, verificationToken) => {
  const passwordLetter = {
    to: email,
    subject: "Reset Password",
    html:     `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                background-color: #ffffff;
                color: #2f2f2f;
            }
            .container {
                margin: 0 auto;
                padding: 50px 0;
                text-align: center;
                width: 65%;
            }
            .title{
                color:#407bff;
                margin-bottom: 44px;
            }
            .subtitle{
                margin-bottom: 24px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #407bff;
                color: white;
                text-decoration: none;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            .signature{
                font-size: 12px
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Water Tracker App</h1>
            <h6 class="subtitle"></h6>
            <p>Trouble accessing your Water Tracker account? No problem, we're here to help. Select the button below to reset your password. The link is valid for 2 hours.</p>
            <a class="button" href="${process.env.BASE_URL}/api/users/reset-password/${verificationToken}">Reset Password</a>
            <p By resetting your password, you'll also confirm your email associated with the account.</p>
            <p If you didn't request this reset, you can safely ignore this email.</p>
            <div class="signature">Happy Listening,</div>
            <div class="signature">The Water Tracker Team</div>
        </div>
    </body>
  </html>`

  }
  return passwordLetter;
};