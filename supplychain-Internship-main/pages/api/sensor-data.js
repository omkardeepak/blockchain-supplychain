import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase("signup");

  if (req.method === 'POST') {
    const { temperature, humidity, soil, rain, farmId } = req.body;

    if (
      temperature === undefined ||
      humidity === undefined ||
      soil === undefined ||
      rain === undefined
    ) {
      return res.status(400).json({ message: 'Missing sensor data fields' });
    }

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }

    const entry = {
      temperature: Number(temperature),
      humidity: Number(humidity),
      soil: Number(soil),
      rain: Number(rain),
      timestamp: new Date(), // store as Date object
      farmId: new ObjectId(farmId),
    };

    try {
      const result = await db.collection('sensorData').insertOne(entry);
      return res.status(200).json({ message: 'Data received successfully', id: result.insertedId });
    } catch (error) {
      console.error('Failed to insert sensor data:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
if (req.method === 'GET') {
  const { farmId } = req.query;

  if (!farmId) {
    return res.status(400).json({ message: 'Farm ID is required' });
  }

  try {
    const data = await db
      .collection('sensorData')
      .find({ farmId: new ObjectId(farmId) })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    const formattedData = data.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    })).reverse();
    
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Failed to fetch sensor data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
