
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FirebaseUser, PredefinedModelType, ExtractionResult, ExtractedField } from '../types';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { extractDataFromDocument } from '../services/geminiService';
import { useDropzone } from 'react-dropzone-esm';

interface DataExtractionPageProps {
  currentUser: FirebaseUser | null;
}

const ConfidenceIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getConfidenceColor = () => {
        if (score > 0.9) return 'bg-green-500';
        if (score > 0.75) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-1.5 my-1">
            <div
                className={`h-1.5 rounded-full ${getConfidenceColor()}`}
                style={{ width: `${score * 100}%` }}
                title={`Confidence: ${Math.round(score * 100)}%`}
            ></div>
        </div>
    );
};

const DataExtractionPage: React.FC<DataExtractionPageProps> = ({ currentUser }) => {
    const [modelType, setModelType] = useState<PredefinedModelType>('invoice');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            handleFileChange(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
        multiple: false,
    });

    const handleFileChange = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setResult(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleExtract = async () => {
        if (!file) {
            setError("Please upload a document to begin.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const extractionResult = await extractDataFromDocument(file, modelType);
            setResult(extractionResult);
        } catch (e: any) {
            console.error("Extraction failed:", e);
            setError(e.message || "An unexpected error occurred during data extraction.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFieldChange = (index: number, value: string) => {
        if (!result) return;
        const newFields = [...result.fields];
        newFields[index].value = value;
        setResult({ fields: newFields });
    };

    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const handleExportJson = () => {
        if (!result) return;
        const dataToExport = result.fields.reduce((acc, field) => ({ ...acc, [field.key]: field.value }), {});
        downloadFile(JSON.stringify(dataToExport, null, 2), `${file?.name || 'extraction'}.json`, 'application/json');
    };
    
    const handleExportCsv = () => {
        if (!result || result.fields.length === 0) return;
        const headers = result.fields.map(f => `"${f.key}"`).join(',');
        const values = result.fields.map(f => `"${f.value.replace(/"/g, '""')}"`).join(',');
        const csvContent = `${headers}\n${values}`;
        downloadFile(csvContent, `${file?.name || 'extraction'}.csv`, 'text/csv;charset=utf-8;');
    };

    const resetState = () => {
        setFile(null);
        if(previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
            <SectionTitle
                title="Data Entry & Extraction"
                subtitle="Automate data extraction from documents like invoices and receipts with AI."
            />

            {!result && !isLoading && (
                 <div className="max-w-3xl mx-auto bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 space-y-6">
                    <div>
                        <label className="block text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-100">1. Select Model</label>
                        <select
                            value={modelType}
                            onChange={(e) => setModelType(e.target.value as PredefinedModelType)}
                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white/80 dark:bg-neutral-700/80 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        >
                            <option value="invoice">Invoice</option>
                            <option value="receipt">Receipt</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-100">2. Upload Document</label>
                        <div
                            {...getRootProps()}
                            className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                                isDragActive ? 'border-orange-500 bg-orange-100/50 dark:bg-orange-900/40' : 'border-neutral-300 dark:border-neutral-600 hover:border-orange-400'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Icon icon="UploadIcon" className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-2"/>
                            {file ? (
                                <p className="text-neutral-700 dark:text-neutral-200">{file.name}</p>
                            ) : (
                                <p className="text-neutral-500 dark:text-neutral-400">
                                    {isDragActive ? 'Drop the file here...' : "Drag 'n' drop a file here, or click to select a file"}
                                    <span className="text-xs block mt-1">(PDF, JPG, PNG)</span>
                                </p>
                            )}
                        </div>
                    </div>
                     {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-800/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-sm">
                            <Icon icon="ExclamationCircleIcon" className="inline w-5 h-5 mr-2" /> {error}
                        </div>
                     )}
                     <Button onClick={handleExtract} disabled={!file} isLoading={isLoading} className="w-full">
                         {isLoading ? 'Extracting...' : 'Start Extraction'}
                     </Button>
                </div>
            )}
            
            {isLoading && (
                 <div className="text-center p-10">
                    <Icon icon="RefreshIcon" className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">AI is analyzing your document...</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">This might take a moment.</p>
                </div>
            )}

            {result && !isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                        <h3 className="text-xl font-semibold mb-4 p-2">Document Preview</h3>
                        {previewUrl && (
                             <div className="w-full h-[70vh] rounded-lg overflow-auto bg-neutral-100 dark:bg-neutral-900/50 flex items-center justify-center">
                                <img src={previewUrl} alt="Document Preview" className="max-w-full max-h-full object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                            <h3 className="text-xl font-semibold mb-4">Extracted Data</h3>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {result.fields.map((field, index) => (
                                    <div key={index}>
                                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{field.key}</label>
                                        <ConfidenceIndicator score={field.confidence} />
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => handleFieldChange(index, e.target.value)}
                                            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white/80 dark:bg-neutral-700/80"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 space-y-3">
                             <h3 className="text-xl font-semibold mb-2">Actions</h3>
                             <div className="flex space-x-2">
                                <Button onClick={handleExportJson} variant="secondary" className="w-full"><Icon icon="DownloadIcon" className="w-4 h-4 mr-2"/>JSON</Button>
                                <Button onClick={handleExportCsv} variant="secondary" className="w-full"><Icon icon="DownloadIcon" className="w-4 h-4 mr-2"/>CSV</Button>
                             </div>
                             <Button onClick={resetState} variant="primary" className="w-full">Start Over</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DataExtractionPage;
