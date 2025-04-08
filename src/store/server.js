// backend/index.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/live-scores/:sport', async (req, res) => {
  const { sport } = req.params;

  try {
    const response = await axios.get(`https://api.soccersapi.com/v1/live-scores/${sport}`, {
      headers: {
        Authorization: `Bearer ec1d5f15cc6070806992c9beece2b10e`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
