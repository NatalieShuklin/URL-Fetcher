const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 5 // limit each IP to 5 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

app.post('/fetch-metadata', async (req, res) => {
    const urls = req.body.urls;
    const results = [];

    for (const url of urls) {
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const html = response.data;
            const $ = cheerio.load(html);

            const title = $('head title').text();
            const description = $('meta[name="description"]').attr('content');
            const image = $('meta[property="og:image"]').attr('content');

            results.push({ url, title, description, image, error: null });
        } catch (error) {
            results.push({ url, error: `Failed to fetch metadata: ${error.message}` });
        }
    }

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
