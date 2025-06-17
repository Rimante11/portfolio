export const createEmailTemplate = (email: string, subject: string, message: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Inconsolata', monospace;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .content {
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.9em;
            color: #6b7280;
          }
          .label {
            font-weight: bold;
            color: #3b82f6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Message from ${email}</h2>
          </div>
          <div class="content">
            <p><span class="label">From:</span> ${email}</p>
            <p><span class="label">Subject:</span> ${subject}</p>
            <div class="message">
              <p><span class="label">Message:</span></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from rimante.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
};