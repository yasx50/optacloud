// import app from './app';
// import {connectDB} from './db/db.connection'

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     connectDB();
//     console.log(Server is running on http://localhost:${PORT});
// });

import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// Initialize Express application
const app: Application = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Address type definition
interface Address {
  id: number;
  label: string;
  details: string;
}

// In-memory storage for addresses
let addresses: Address[] = [];

// Routes

// Get all addresses
app.get('/addresses', (req: Request, res: Response) => {
  res.json(addresses);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Add a new address
app.post('/address', (req: any, res: any) => {
  const { label, details } = req.body as { label: string; details: string };

  // Validate request body
  if (!label || !details) {
    return res.status(400).json({ message: 'Label and details are required' });
  }

  // Create a new address
  const newAddress: Address = {
    id: addresses.length + 1,
    label,
    details,
  };

  addresses.push(newAddress);
  res.status(201).json(newAddress);
});

// Delete an address
app.delete('/address/:id', (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const initialLength = addresses.length;
  addresses = addresses.filter((address) => address.id !== id);

  if (addresses.length === initialLength) {
    return res.status(404).json({ message: 'Address not found' });
  }

  res.status(200).json({ message: 'Address deleted' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(Server running at http://localhost:${PORT});
});