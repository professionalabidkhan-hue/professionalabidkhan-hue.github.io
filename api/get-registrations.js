import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    // Verify this name matches the Database name in your Atlas "Browse Collections"
    const db = client.db('Abid_ELearning_Hub'); 
    
    // This fetches from the 'students' collection seen in your screenshot
    const data = await db.collection('students').find({}).toArray();
    
    if (!data || data.length === 0) {
        return res.status(200).json([{ name: "System Message", role: "admin", department: "VAULT EMPTY", whatsapp: "Check Atlas", jcore: new Date() }]);
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Vault Connection Failed: " + e.message });
  } finally {
    await client.close();
  }
}
