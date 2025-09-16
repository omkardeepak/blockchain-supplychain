import { connectToDatabase } from '../../lib/mongodb'

export default async function handler(req, res) {
  const { db } = await connectToDatabase("signup");

  if (req.method === 'POST') {
    const { temperature, humidity, soil, rain } = req.body;

    if (
      temperature === undefined ||
      humidity === undefined ||
      soil === undefined ||
      rain === undefined
    ) {
      return res.status(400).json({ message: 'Missing sensor data fields' });
    }

    const entry = {
      temperature: Number(temperature),
      humidity: Number(humidity),
      soil: Number(soil),
      rain: Number(rain),
      timestamp: new Date(), // store as Date object
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
  try {
    const { after } = req.query;
    const filter = after ? { timestamp: { $gt: new Date(after) } } : {};

    const data = await db
      .collection('sensorData')
      .find(filter, { projection: { _id: 0 } })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    const formattedData = data.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    }));

    return res.status(200).json(formattedData.reverse()); // Oldest to newest
  } catch (error) {
    console.error('Failed to fetch sensor data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
