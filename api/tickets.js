const { connect, getTicketModel } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await connect();
    const Ticket = getTicketModel();

    if (req.method === 'GET') {
      const tickets = await Ticket.find().sort({ createdAt: -1 });
      return res.status(200).json(tickets);
    }

    if (req.method === 'POST') {
      const { name, department, description } = req.body || {};
      if (!name || !description) {
        return res.status(400).json({ success: false, error: 'Name and description are required' });
      }
      const ticket = new Ticket({ name, department, description });
      await ticket.save();
      return res.status(201).json({ success: true, ticket });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
