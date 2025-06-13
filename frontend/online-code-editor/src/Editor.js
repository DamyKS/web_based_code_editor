import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function CodeEditor() {
    // Available languages
    const languageOptions = [
        { value: 'python', label: 'Python', default: '# Python code\nprint("Hello from Python!")\n\n# You can define functions\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Output example\nprint(greet("User"))' },
        { value: 'javascript', label: 'JavaScript', default: '// JavaScript code\nconsole.log("Hello from JavaScript!");\n\n// You can define functions\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Output example\nconsole.log(greet("User"));' },
        { value: 'ruby', label: 'Ruby', default: '# Ruby code\nputs "Hello from Ruby!"\n\n# You can define functions\ndef greet(name)\n  "Hello, #{name}!"\nend\n\n# Output example\nputs greet("User")' }
    ];

    // State for each editor
    const [htmlCode, setHtmlCode] = useState('<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to my web app!</p>\n</div>');
    const [cssCode, setCssCode] = useState('.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}');
    const [codeContent, setCodeContent] = useState(languageOptions[0].default);

    // UI State
    const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].value);
    const [output, setOutput] = useState('');
    const [previewHtml, setPreviewHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('vs-dark');
    const [activeTab, setActiveTab] = useState('output'); // 'output' or 'preview'
    const [isExpandedPreview, setIsExpandedPreview] = useState(false); // State for expansion

    // Refs for Monaco Editor instances
    const htmlEditorRef = useRef(null);
    const cssEditorRef = useRef(null);
    const codeEditorRef = useRef(null);

    // Function to handle editor mount
    const handleEditorDidMount = (editor, ref) => {
        ref.current = editor;
        // Optionally trigger layout on initial mount too
        editor.layout();
    };

    // Update preview when HTML or CSS changes
    useEffect(() => {
        const combinedHtml = `
          <html>
            <head>
              <style>${cssCode}</style>
            </head>
            <body>${htmlCode}</body>
          </html>
        `;
        setPreviewHtml(combinedHtml);
    }, [htmlCode, cssCode]);

    // Effect to prevent body scrolling when preview is expanded
    useEffect(() => {
        if (isExpandedPreview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto'; // Clean up on unmount
        };
    }, [isExpandedPreview]);

    // Effect to force Monaco Editor layout when preview expands/collapses
    useEffect(() => {
        // Use a small timeout to allow CSS transitions to complete
        // This timer will now be the SOLE trigger for layout, as automaticLayout is false
        const timer = setTimeout(() => {
            if (htmlEditorRef.current) htmlEditorRef.current.layout();
            if (cssEditorRef.current) cssEditorRef.current.layout();
            if (codeEditorRef.current) codeEditorRef.current.layout();
        }, 350); // Slightly longer than your CSS transition (0.3s)

        return () => clearTimeout(timer); // Clean up the timer
    }, [isExpandedPreview]);


    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);

        // Set default code for the selected language
        const selectedOption = languageOptions.find(option => option.value === newLanguage);
        if (selectedOption) {
            setCodeContent(selectedOption.default);
        }
    };

    const handleRunCode = async () => {
        setLoading(true);
        // Ensure preview is not expanded when running dynamic code
        setIsExpandedPreview(false);
        try {
            console.log(selectedLanguage);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/editor/execute', {
                code: codeContent,
                language: selectedLanguage

            });
            setOutput(response.data.output);
            setActiveTab('output');
        } catch (error) {
            setOutput('Error executing code: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    const handleClearOutput = () => {
        setOutput('');
    };

    const handlePreviewClick = () => {
        setActiveTab('preview');
        setIsExpandedPreview(true); // Expand when preview is clicked
    };

    const handleCancelPreview = () => {
        setIsExpandedPreview(false); // Collapse when cancel is clicked
        setActiveTab('output'); // Optionally switch back to output tab
    };

    return (
        <div className={`code-editor-container ${isExpandedPreview ? 'preview-expanded' : ''}`}>
            <header className="editor-header">
                <div className="logo">
                    <h1>Code Editor</h1>
                </div>
                <div className="editor-controls">
                    <select value={theme} onChange={handleThemeChange} className="theme-selector">
                        <option value="vs-dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                    <button onClick={handleRunCode} className="run-button" disabled={loading}>
                        {loading ? 'Running...' : `Run ${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}`}
                    </button>
                </div>
            </header>

            <div className={`editor-panels ${isExpandedPreview ? 'minimized-panels' : ''}`}>
                <div className="panel html-panel">
                    <div className="panel-header">
                        <h3>HTML</h3>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        language="html"
                        value={htmlCode}
                        onChange={setHtmlCode}
                        theme={theme}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: false, // <--- CHANGED TO FALSE
                            tabSize: 2
                        }}
                        onMount={(editor) => handleEditorDidMount(editor, htmlEditorRef)}
                    />
                </div>

                <div className="panel css-panel">
                    <div className="panel-header">
                        <h3>CSS</h3>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="css"
                        language="css"
                        value={cssCode}
                        onChange={setCssCode}
                        theme={theme}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: false, // <--- CHANGED TO FALSE
                            tabSize: 2
                        }}
                        onMount={(editor) => handleEditorDidMount(editor, cssEditorRef)}
                    />
                </div>

                <div className="panel python-panel">
                    <div className="panel-header">
                        <div className="language-selector-container">
                            <select
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className="language-selector"
                            >
                                {languageOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage={selectedLanguage}
                        language={selectedLanguage}
                        value={codeContent}
                        onChange={setCodeContent}
                        theme={theme}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: false, // <--- CHANGED TO FALSE
                            tabSize: 2
                        }}
                        onMount={(editor) => handleEditorDidMount(editor, codeEditorRef)}
                    />
                </div>
            </div>

            <div className={`result-container ${isExpandedPreview ? 'expanded' : ''}`}>
                <div className="result-tabs">
                    <button
                        className={`tab-button ${activeTab === 'output' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('output'); setIsExpandedPreview(false); }}
                    >
                        Code Output
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={handlePreviewClick}
                    >
                        HTML Preview
                    </button>
                    {activeTab === 'output' && (
                        <button onClick={handleClearOutput} className="clear-button">Clear</button>
                    )}
                    {activeTab === 'preview' && isExpandedPreview && (
                        <button onClick={handleCancelPreview} className="cancel-preview-button">X</button>
                    )}
                </div>

                {activeTab === 'output' ? (
                    <div className="output-content">
                        <pre>{output}</pre>
                    </div>
                ) : (
                    <div className="preview-content">
                        <iframe
                            title="Preview"
                            srcDoc={previewHtml}
                            width="100%"
                            height="100%"
                            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-pointer-lock allow-same-origin"
                        />
                    </div>
                )}
            </div>

            <footer className="editor-footer">
                <p>Code Editor - Built with React , Django and Monaco Editor</p>
            </footer>
        </div>
    );
}

export default CodeEditor;
