import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from './Toast';

type DocumentType = 'id' | 'proof_of_address' | 'selfie';

interface KYCUploadProps {
  onSuccess?: () => void;
}

export function KYCUpload({ onSuccess }: KYCUploadProps) {
  const showToast = useToast();
  const [documentType, setDocumentType] = useState<DocumentType>('id');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create a simple data URL for the demo
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    },
    onSuccess: async (dataUrl) => {
      // Submit the document URL to the backend
      const res = await fetch('/api/user/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: documentType,
          document_url: dataUrl
        })
      });

      if (!res.ok) throw new Error('Failed to upload document');
      
      showToast(`${documentType} document submitted for verification`, 'success');
      setSelectedFile(null);
      setPreview(null);
      onSuccess?.();
    },
    onError: (error) => {
      showToast(`Error uploading document: ${error.message}`, 'error');
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('File must be JPG, PNG, or PDF', 'error');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDocumentLabel = (type: DocumentType) => {
    switch (type) {
      case 'id': return 'Government ID (Passport, Driver\'s License, etc.)';
      case 'proof_of_address': return 'Proof of Address (Utility Bill, Bank Statement, etc.)';
      case 'selfie': return 'Selfie with ID';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as DocumentType)}
          disabled={uploadMutation.isPending}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="id">Government ID</option>
          <option value="proof_of_address">Proof of Address</option>
          <option value="selfie">Selfie with ID</option>
        </select>
        <p className="text-xs text-slate-500 mt-2">{getDocumentLabel(documentType)}</p>
      </div>

      <div className="relative">
        <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-slate-600 transition-colors">
          <div className="text-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-white">
              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-500">JPG, PNG or PDF (max 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleFileSelect}
            disabled={uploadMutation.isPending}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <div className="flex-1 text-sm text-blue-300">
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-xs opacity-75">{(selectedFile.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <button
        onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
        disabled={!selectedFile || uploadMutation.isPending}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Submit Document'}
      </button>

      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Privacy & Security
        </h4>
        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
          <li>Your documents are encrypted and securely stored</li>
          <li>Only our verification team can access your documents</li>
          <li>Verification typically takes 24-48 hours</li>
          <li>You'll receive an email notification when verified</li>
        </ul>
      </div>
    </div>
  );
}
