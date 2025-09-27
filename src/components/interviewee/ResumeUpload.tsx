import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import './ResumeUpload.css';

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  error: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload, isUploading, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type - for now only PDF is supported
    const validTypes = [
      'application/pdf'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF file only. DOCX support is coming soon.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
    onUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="resume-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div className="selected-file">
            <FileText size={48} />
            <div className="file-info">
              <h3>{selectedFile.name}</h3>
              <p>{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="remove-file-btn"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="upload-content">
            <Upload size={48} />
            <h3>Upload Your Resume</h3>
            <p>Drag and drop your resume here, or click to browse</p>
            <p className="file-types">Supported formats: PDF (DOCX coming soon)</p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="uploading">
          <div className="spinner"></div>
          <p>Processing your resume...</p>
        </div>
      )}

      {error && (
        <div className="upload-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
