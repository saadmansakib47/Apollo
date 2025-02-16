import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Loader2, Clock, List } from 'lucide-react';

interface Analysis {
  keyFindings: string[];
  recommendations: string[];
  urgentConcerns: string[];
  simplifiedExplanation: string;
}

interface AnalysisResult {
  text: string;
  analysis: Analysis;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('report', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze report');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Apollo</h1>
          <p className="text-gray-600">Upload your medical report and get an AI-powered analysis in simple terms</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50/50 transition-all hover:border-blue-300">
            <Upload className="w-16 h-16 text-blue-400 mb-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3 font-medium"
            >
              Select Report Image
            </button>
            {file && (
              <p className="text-sm text-gray-600 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || isAnalyzing}
              className={`px-8 py-3 rounded-lg flex items-center font-medium ${
                !file || isAnalyzing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                <>
                  <List className="w-5 h-5 mr-2" />
                  Analyze Report
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Extracted Text
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{result.text}</pre>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Analysis Summary</h2>
              
              {result.analysis.urgentConcerns.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="text-lg font-medium text-red-800 mb-2">⚠️ Urgent Concerns</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.analysis.urgentConcerns.map((concern, index) => (
                      <li key={index} className="text-red-700">{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.analysis.keyFindings.map((finding, index) => (
                      <li key={index} className="text-blue-700">{finding}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-green-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Simplified Explanation</h3>
                <p className="text-purple-700 whitespace-pre-wrap">{result.analysis.simplifiedExplanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;