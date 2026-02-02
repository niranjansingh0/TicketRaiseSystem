const { connect, getTicketModel } = require('../../../lib/db');

module.exports = async (req, res) => {
  try {
    await connect();
    const Ticket = getTicketModel();
    const { id } = req.query || {};

    if (req.method !== 'PUT') {
      res.setHeader('Allow', 'PUT');
      return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    if (!id) {
      return res.status(400).json({ success: false, error: 'Ticket id is required' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    ticket.status = 'Completed';
    await ticket.save();

    return res.status(200).json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
