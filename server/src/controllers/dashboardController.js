const { pool } = require('../config/database');
const { autoExpireMembers, formatMember } = require('../services/memberService');

const getStats = async (req, res) => {
  try {
    await autoExpireMembers();
    
    const totalMembersResult = await pool.query('SELECT COUNT(*) FROM members');
    const activeMembersResult = await pool.query("SELECT COUNT(*) FROM members WHERE payment_status = 'paid'");
    const unpaidMembersResult = await pool.query("SELECT COUNT(*) FROM members WHERE payment_status = 'unpaid'");
    const expiringMembersResult = await pool.query(
      'SELECT COUNT(*) FROM members WHERE end_date <= CURRENT_DATE + INTERVAL \'7 days\' AND end_date >= CURRENT_DATE'
    );

    const stats = {
      totalMembers: parseInt(totalMembersResult.rows[0].count),
      activeMembers: parseInt(activeMembersResult.rows[0].count),
      unpaidMembers: parseInt(unpaidMembersResult.rows[0].count),
      expiringMembers: parseInt(expiringMembersResult.rows[0].count)
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExpiringMembers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM members 
       WHERE end_date <= CURRENT_DATE + INTERVAL '7 days' 
         AND end_date >= CURRENT_DATE 
       ORDER BY end_date ASC`
    );

    const expiringMembers = result.rows.map(formatMember);
    res.json(expiringMembers);
  } catch (err) {
    console.error('Error fetching expiring members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const autoExpire = async (req, res) => {
  try {
    const expiredMembers = await autoExpireMembers();
    res.json({
      success: true,
      message: `Auto-expired ${expiredMembers.length} members`,
      expiredMembers: expiredMembers
    });
  } catch (err) {
    console.error('Error in auto-expire endpoint:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStats,
  getExpiringMembers,
  autoExpire
};
