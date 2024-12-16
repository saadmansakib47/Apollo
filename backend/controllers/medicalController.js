const axios = require('axios');

const analyzeReport = async (req, res) => {
    const { reportText } = req.body;

    if (!reportText) {
        return res.status(400).json({ message: 'Report text is required' });
    }

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: reportText,
                    },
                ],
            },
        ],
    };

    try {
        const apiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ analysis: apiResponse.data });
    } catch (error) {
        console.error("Error analyzing report:", error.response?.data || error.message);
        res.status(500).json({ message: 'Error analyzing report', error: error.message });
    }
};

module.exports = { analyzeReport };
