import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [reportText, setReportText] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!reportText) {
            alert('Please enter a report text!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/medical/analyze', { reportText });

            // Logging the full response
            console.log(response.data);

            // Extracting analysis text from the correct path in the response
            const analysisResult = response.data.analysis.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available';

            setAnalysis(analysisResult);
        } catch (error) {
            alert('Error analyzing report: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="app">
            <h1>Medical Report Interpreter</h1>
            <textarea
                placeholder="Type your medical report here..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
            />
            <button onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <div className="analysis">
                <h3>Analysis:</h3>
                <p>{analysis || 'Your analysis will appear here.'}</p>
            </div>
        </div>
    );
};

export default App;
