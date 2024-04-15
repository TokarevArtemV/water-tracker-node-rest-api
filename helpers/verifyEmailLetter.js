export const verifyEmailLetter = (email, verificationToken) => {
  const emailLetter = {
    to: email,
    subject: "Verify email",
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
                padding: 50px 0;
                text-align: center;
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Water Tracker App</h1>
            <h6 class="subtitle">Verify your email address</h6>
            <p>Thanks for signing up with us. <br/> Click on the button below to verify your email address.</p>
            <a class="button" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>
            <p class="description">If this email wasn't intended for you, feel free to delete it.</p>
        </div>
    </body>
  </html>`

  }
  return emailLetter;
};