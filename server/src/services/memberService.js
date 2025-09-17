const { pool } = require('../config/database');

const autoExpireMembers = async () => {
  try {
    const result = await pool.query(`
      UPDATE members 
      SET payment_status = 'unpaid' 
      WHERE end_date < CURRENT_DATE 
      AND payment_status = 'paid'
      RETURNING id, name, email
    `);
    
    if (result.rows.length > 0) {
      console.log(`Auto-expired ${result.rows.length} members:`, result.rows.map(m => m.name));
    }
    
    return result.rows;
  } catch (error) {
    console.error('Error auto-expiring members:', error);
    return [];
  }
};

const formatMember = (member) => ({
  ...member,
  startDate: member.start_date,
  endDate: member.end_date,
  membershipType: member.membership_type,
  paymentStatus: member.payment_status,
  photo: member.photo_url
});

module.exports = { autoExpireMembers, formatMember };