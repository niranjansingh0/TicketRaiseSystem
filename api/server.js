// Optional local server to run the API locally (for development)
const express = require('express');
const bodyParser = require('express');
const ticketsHandler = require('./tickets');

const app = express();
app.use(express.json());

app.use('/api/tickets', async (req, res) => {
  // adapt express req/res to handler shape
  // For simplicity, call ticketsHandler directly for GET/POST
  await ticketsHandler(req, res);
});

// Complete route
const completeHandler = require('./tickets/[id]/complete');
app.put('/api/tickets/:id/complete', async (req, res) => {
  // attach query param to req for handler
  req.query = { id: req.params.id };
  await completeHandler(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Local dev server listening on http://localhost:${PORT}`));
