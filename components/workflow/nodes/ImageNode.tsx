'use client';

import { useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import BaseNode from './BaseNode';

interface ImageNodeData {
  label?: string;
  imageUrl?: string;
  imageName?: string;
  onChange?: (nodeId: string, newData: Record<string, unknown>) => void;
}

export default function ImageNode({ data, selected, id }: NodeProps<ImageNodeData>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setIsUploading(true);

      try {
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Update node data
        if (data.onChange) {
          data.onChange(id, {
            imageUrl: url,
            imageName: file.name,
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [data, id]
  );

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (data.onChange) {
      data.onChange(id, {
        imageUrl: null,
        imageName: null,
      });
    }
  }, [previewUrl, data, id]);

  return (
    <BaseNode title="Image Node" icon={ImageIcon} selected={selected}>
      <div className="space-y-3">
        {!previewUrl ? (
          // Upload Box
          <label
            htmlFor={`file-upload-${id}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (max 5MB)</p>
            </div>
            <input
              id={`file-upload-${id}`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        ) : (
          // Image Preview
          <div className="space-y-2">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 truncate max-w-[180px]">
                {data.imageName || 'image.jpg'}
              </span>
              <button
                onClick={handleRemoveImage}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-weavy-primary border-2 border-white"
        style={{ right: -6 }}
      />
    </BaseNode>
  );
}

