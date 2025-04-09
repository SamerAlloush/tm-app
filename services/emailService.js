// services/emailService.js
export const sendEmail = async (to, subject, body, attachments = []) => {
    try {
      // First upload any attachments to your server/Firebase storage
      const uploadedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          if (attachment.uri.startsWith('file://')) {
            const formData = new FormData();
            formData.append('file', {
              uri: attachment.uri,
              name: attachment.name || 'attachment',
              type: attachment.type === 'image' ? 'image/jpeg' : 'application/octet-stream',
            });
  
            const uploadResponse = await fetch('https://files/mail/inbox/${user}', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
  
            const { url } = await uploadResponse.json();
            return url;
          }
          return attachment.url;
        })
      );
  
      // Then send the email with attachment references
      const response = await fetch('https://your-api-endpoint/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          attachments: uploadedAttachments,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }


  };
  
  export const sendEmailToMultiple = async (recipients, subject, body, attachments = []) => {
    try {
      const results = await Promise.all(
        recipients.map(recipient => 
          sendEmail(recipient.email, subject, body, attachments)
            .then(() => ({ success: true, email: recipient.email }))
            .catch(() => ({ success: false, email: recipient.email }))
        )
      );
      
      return results;
    } catch (error) {
      console.error('Error sending emails:', error);
      throw error;
    }
  };