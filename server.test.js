const request = require('supertest');
const app = require('../server'); // Ensure the path to your server file is correct

describe('POST /fetch-metadata', () => {
    test('fetches metadata successfully', async () => {
        request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://example.com'] })
            .expect(200)
            .then(response => {
                expect(response.body[0]).toHaveProperty('title');
                expect(response.body[0]).toHaveProperty('description');
                expect(response.body[0]).toHaveProperty('image');
            });
    });

    test('returns error for invalid URL format', async () => {
        request(app)
            .post('/fetch-metadata')
            .send({ urls: ['just-a-string'] })
            .expect(200)
            .then(response => {
                expect(response.body[0].error).toContain('Invalid URL format');
            });
    });

    test('handles missing metadata fields', async () => {
        request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://blank.com'] })
            .expect(200)
            .then(response => {
                expect(response.body[0].title).toBeUndefined();
            });
    });

    test('handles network errors gracefully', async () => {
        request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://down.com'] })
            .expect(200)
            .then(response => {
                expect(response.body[0].error).toContain('Failed to fetch metadata');
            });
    });

    test('rate limiting blocks excessive requests', async () => {
        for (let i = 0; i < 6; i++) {
            await request(app)
                .post('/fetch-metadata')
                .send({ urls: ['https://example.com'] });
        }
        request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://example.com'] })
            .expect(429)
            .then(response => {
                expect(response.body.error).toContain('Too many requests');
            });
    });
});
