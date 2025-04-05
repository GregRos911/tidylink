
import React, { useState } from 'react';
import { FileUp } from 'lucide-react';

interface FileUploadAreaProps {
  onFileProcessed: (emails: string[]) => void;
  onError: (message: string) => void;
  processFile: (file: File) => Promise<string[]>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ 
  onFileProcessed, 
  onError,
  processFile 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = async (file: File) => {
    try {
      const emails = await processFile(file);
      
      if (emails.length === 0) {
        onError('No valid emails found in the file');
        return;
      }
      
      onFileProcessed(emails);
    } catch (error) {
      console.error('Error parsing file:', error);
      onError(error instanceof Error ? error.message : 'Error parsing file');
    }
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 transition-colors ${
        isDragging ? 'border-brand-blue bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <h3 className="text-sm font-medium mb-1">Drag and drop a CSV file</h3>
        <p className="text-xs text-gray-500 mb-4">or</p>
        <label htmlFor="csv-upload" className="cursor-pointer">
          <span className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium">
            Browse Files
          </span>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
        
        <p className="mt-2 text-xs text-gray-500">CSV file should include an email column</p>
      </div>
    </div>
  );
};

export default FileUploadArea;
