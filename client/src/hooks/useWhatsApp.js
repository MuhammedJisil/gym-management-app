export const useWhatsApp = () => {
  const sendWhatsAppMessage = (phone, message, memberName) => {
    // Clean phone number (remove spaces, dashes, and ensure it starts with country code)
    let cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digit characters
    
    // If phone doesn't start with country code, assume it's Indian (+91)
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
  };

  const sendExpiringMemberMessage = (member) => {
    const daysRemaining = Math.ceil((new Date(member.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    const message = `Hi ${member.name}! 👋

Your gym membership is expiring soon!

⏰ Days remaining: ${daysRemaining} days
📅 Expiry date: ${new Date(member.endDate).toLocaleDateString()}
🏋️‍♂️ Membership type: ${member.membershipType}

Please renew your membership to continue enjoying our services. Visit us or call for renewal options.

Thank you! 💪
- Gym Management Team`;

    sendWhatsAppMessage(member.phone, message, member.name);
  };

  const sendUnpaidMemberMessage = (member) => {
    const message = `Hi ${member.name}! 👋

We noticed your gym membership payment is pending.

📋 Membership details:
🏋️‍♂️ Type: ${member.membershipType}
📅 End date: ${new Date(member.endDate).toLocaleDateString()}
💳 Status: Payment Due

Please complete your payment to continue using our facilities without interruption.

Contact us for payment options or visit the gym reception.

Thank you! 🙏
- Gym Management Team`;

    sendWhatsAppMessage(member.phone, message, member.name);
  };

  return {
    sendWhatsAppMessage,
    sendExpiringMemberMessage,
    sendUnpaidMemberMessage
  };
};