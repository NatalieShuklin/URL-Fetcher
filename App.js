import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure your CSS is set up

function App() {
    const [urls, setUrls] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const [inputUrl, setInputUrl] = useState('');
    const [error, setError] = useState('');

    const handleAddUrl = () => {
        if (urls.length >= 3) {
            setError('Maximum of 3 URLs allowed');
            return;
        }
        if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
            setError('Enter a valid URL that starts with http:// or https://');
            return;
        }
        setUrls([...urls, inputUrl]);
        setInputUrl('');
        setError('');
    };

    const handleSubmit = async () => {
        if (urls.length < 3) {
            setError('Please add at least 3 URLs');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/fetch-metadata', { urls });
            setMetadata(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch metadata');
        }
    };

    return (
        <div className="App">
            <h1>URL Metadata Fetcher</h1>
            {error && <div className="error">{error}</div>}
            <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={handleAddUrl}>Add URL</button>
            <button onClick={handleSubmit}>Fetch Metadata</button>
            <div className="results">
                {metadata.map((data, index) => (
                    <div key={index} className="result">
                        {data.error ? (
                            <div className="error">Error for {data.url}: {data.error}</div>
                        ) : (
                            <div>
                                <h2>{data.title}</h2>
                                <p>{data.description}</p>
                                {data.image && <img src={data.image} alt={data.title} />}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
