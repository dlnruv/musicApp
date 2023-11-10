const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/exchange-token', async (req, res) => {
    const { code, redirectUri } = req.body;

    const spotifyClientId = '249f2a846fd844ee80987d5b0406fc6d';
    const spotifyClientSecret = 'ef7756f56b084b578334081d291fb52d';

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(
                        `${spotifyClientId}:${spotifyClientSecret}`
                    ).toString('base64')}`,
                },
            }
        );

        console.log('Token exchange response:', tokenResponse.data);

        // Use the access token to get user information
        const userInfoResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        });

        console.log('User information response:', userInfoResponse.data);

        // Send the user information to the client
        res.json(userInfoResponse.data);
    } catch (error) {
        console.error('Token exchange error:', error.message);
        res.status(500).json({ error: 'Token exchange failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
