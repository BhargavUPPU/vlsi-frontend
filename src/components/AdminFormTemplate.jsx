"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { AdminLoading } from '@/components/AdminLoading';
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { bufferToDataURL } from '@/lib/utils/imageUtils';


// Image Upload Component with Preview
function ImageUploadField({ 
  label, 
  name, 
  existingImage, 
  onImageChange, 
  required = false,
  error 
}) {
  const [preview, setPreview] = useState(existingImage || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        onImageChange(file);
      }
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {preview ? (
        <div className="relative group">
          <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-500' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={name}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor={name} className="cursor-pointer">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Array Field Component
function ArrayField({ 
  label, 
  name, 
  placeholder, 
  value = [], 
  onChange,
  type = 'text',
  error 
}) {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState(value);

  useEffect(() => {
    onChange(items);
  }, [items]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Added items:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm flex-1 break-all">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Multiple Images Upload Component
function MultipleImagesField({
  label,
  name,
  existingImages = [],
  onImagesChange,
  maxFiles = 10,
  required = false,
  error
}) {
  const [previews, setPreviews] = useState(existingImages);
  const [dragActive, setDragActive] = useState(false);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (previews.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newPreviews = [];
    const newFiles = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            file,
            preview: reader.result,
            name: file.name,
            size: file.size
          });
          
          if (newPreviews.length === files.length) {
            const updatedPreviews = [...previews, ...newPreviews];
            setPreviews(updatedPreviews);
            onImagesChange(updatedPreviews.map(p => p.file).filter(Boolean));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      processFiles(files);
    }
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated.map(p => p.file).filter(Boolean));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-sm text-gray-500 ml-2">
          ({previews.length}/{maxFiles} images)
        </span>
      </Label>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={name}
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="hidden"
          disabled={previews.length >= maxFiles}
        />
        <label htmlFor={name} className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each (max {maxFiles} images)
          </p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((item, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={item.preview}
                  alt={item.name || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* File Info */}
              <div className="mt-1 text-xs text-gray-600 truncate">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-gray-500">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function AdminFormTemplate({
  title,
  schema,
  defaultValues = {},
  onSubmit,
  isLoading = false,
  isEditing = false,
  backPath,
  fields = [],
  children
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageFields, setImageFields] = useState({});
  const [multipleImagesFields, setMultipleImagesFields] = useState({});
  const [arrayFields, setArrayFields] = useState({});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  // Initialize array fields from defaultValues
  useEffect(() => {
    const imageFieldNames = fields.filter(f => f.type === 'image').map(f => f.name);
    const multipleImagesFieldNames = fields.filter(f => f.type === 'multipleImages').map(f => f.name);
    const arrayFieldNames = fields.filter(f => f.type === 'array').map(f => f.name);
    
    // Parse array fields - they might come as JSON strings from the database
    const initialArrayFields = {};
    arrayFieldNames.forEach(fieldName => {
      const value = defaultValues[fieldName];
      if (value) {
        // If it's a string, try to parse it as JSON
        if (typeof value === 'string') {
          try {
            initialArrayFields[fieldName] = JSON.parse(value);
          } catch (e) {
            console.warn(`Failed to parse ${fieldName} as JSON:`, e);
            initialArrayFields[fieldName] = [];
          }
        } else if (Array.isArray(value)) {
          // Already an array
          initialArrayFields[fieldName] = value;
        } else {
          initialArrayFields[fieldName] = [];
        }
      } else {
        initialArrayFields[fieldName] = [];
      }
    });
    setArrayFields(initialArrayFields);

    // Set existing images - convert Buffer to data URL
    const initialImageFields = {};
    imageFieldNames.forEach(fieldName => {
      if (defaultValues[fieldName]) {
        // Convert buffer to data URL for display
        const dataUrl = bufferToDataURL(defaultValues[fieldName]);
        if (dataUrl) {
          initialImageFields[fieldName] = dataUrl;
        }
      }
    });
    setImageFields(initialImageFields);

    // Set existing multiple images - convert files array
    const initialMultipleImagesFields = {};
    multipleImagesFieldNames.forEach(fieldName => {
      // For eventFiles, it's an array of file objects from the database
      if (fieldName === 'eventFiles' && defaultValues.files && Array.isArray(defaultValues.files)) {
        // Convert each file buffer to a preview object
        const existingImages = defaultValues.files
          .map((file, index) => {
            const preview = bufferToDataURL(file.fileData);
            if (!preview) return null;
            return {
              preview,
              name: `Image ${index + 1}`,
              size: file.fileData?.length || 0,
              isExisting: true,
              id: file.id
            };
          })
          .filter(Boolean); // Remove any null entries
        initialMultipleImagesFields[fieldName] = existingImages;
      } else if (defaultValues[fieldName]) {
        // Handle other multiple image fields
        const existingImages = Array.isArray(defaultValues[fieldName]) 
          ? defaultValues[fieldName]
              .map((item, index) => {
                const preview = bufferToDataURL(item.fileData || item);
                if (!preview) return null;
                return {
                  preview,
                  name: item.name || `Image ${index + 1}`,
                  size: item.fileData?.length || item?.length || 0,
                  isExisting: true,
                  id: item.id
                };
              })
              .filter(Boolean)
          : [];
        initialMultipleImagesFields[fieldName] = existingImages;
      }
    });
    setMultipleImagesFields(initialMultipleImagesFields);
  }, [defaultValues, fields]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      console.log('Form submission - received data:', data);
      
      // Get ALL form values (includes values from Select components in children)
      const allFormValues = form.getValues();
      console.log('All form values from form.getValues():', allFormValues);
      
      // Merge with submitted data (submitted data takes precedence)
      const mergedData = { ...allFormValues, ...data };
      console.log('Merged data:', mergedData);
      
      // Add regular form fields
      Object.entries(mergedData).forEach(([key, value]) => {
        // Skip image, multipleImages, and array fields as they're handled separately
        const field = fields.find(f => f.name === key);
        if (field?.type === 'image' || field?.type === 'multipleImages' || field?.type === 'array') {
          return;
        }
        
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      // Add array fields
      Object.entries(arrayFields).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
      
      // Add image fields
      Object.entries(imageFields).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(key, file);
        }
      });

      // Add multiple images fields
      console.log('multipleImagesFields:', multipleImagesFields);
      Object.entries(multipleImagesFields).forEach(([key, filesArray]) => {
        console.log(`Processing ${key}:`, filesArray?.length, 'files');
        if (Array.isArray(filesArray)) {
          // For eventFiles and projectImages, use 'files' as the field name for backend
          const fieldName = key === 'eventFiles' || key === 'projectImages' ? 'files' : key;
          console.log(`Appending to field: ${fieldName}`);
          
          // Filter out existing images (only append new ones)
          const newFiles = filesArray.filter(item => !item.isExisting && item.file instanceof File);
          console.log(`  - Found ${newFiles.length} new files out of ${filesArray.length} total`);
          
          newFiles.forEach((item, index) => {
            console.log(`  - Appending file ${index + 1}:`, item.file.name, item.file.size);
            formData.append(fieldName, item.file);  // Append all with same field name
          });
        }
      });
      
      // Log final FormData contents
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(' ', pair[0], ':', pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
      }
      
      await onSubmit(formData);
      router.push(backPath);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <AdminLoading message={`Loading ${title.toLowerCase()}...`} />;
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={backPath}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? `Edit ${title}` : `Create ${title}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? `Update ${title.toLowerCase()} information` : `Add a new ${title.toLowerCase()}`}
            </p>
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl">{isEditing ? 'Edit' : 'Create'} {title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Regular Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => {
                  if (field.type === 'image') {
                    return (
                      <div key={field.name} className="md:col-span-2">
                        <ImageUploadField
                          label={field.label}
                          name={field.name}
                          required={field.required}
                          existingImage={imageFields[field.name]}
                          onImageChange={(file) => {
                            setImageFields(prev => ({
                              ...prev,
                              [field.name]: file
                            }));
                          }}
                          error={form.formState.errors[field.name]?.message}
                        />
                      </div>
                    );
                  }

                  if (field.type === 'array') {
                    return (
                      <div key={field.name} className="md:col-span-2">
                        <ArrayField
                          label={field.label}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={arrayFields[field.name]}
                          onChange={(items) => {
                            setArrayFields(prev => ({
                              ...prev,
                              [field.name]: items
                            }));
                          }}
                          type={field.inputType || 'text'}
                          error={form.formState.errors[field.name]?.message}
                        />
                      </div>
                    );
                  }

                  if (field.type === 'multipleImages') {
                    return (
                      <div key={field.name} className="md:col-span-2">
                        <MultipleImagesField
                          label={field.label}
                          name={field.name}
                          required={field.required}
                          existingImages={multipleImagesFields[field.name] || []}
                          maxFiles={field.maxFiles || 10}
                          onImagesChange={(files) => {
                            setMultipleImagesFields(prev => ({
                              ...prev,
                              [field.name]: files
                            }));
                          }}
                          error={form.formState.errors[field.name]?.message}
                        />
                      </div>
                    );
                  }

                  // Regular fields
                  const isFullWidth = field.type === 'textarea' || field.fullWidth;
                  return (
                    <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            rows={field.rows || 4}
                            {...form.register(field.name)}
                            className={form.formState.errors[field.name] ? 'border-red-500' : ''}
                          />
                        ) : field.type === 'number' ? (
                          <Input
                            id={field.name}
                            type="number"
                            placeholder={field.placeholder}
                            {...form.register(field.name, { valueAsNumber: true })}
                            className={form.formState.errors[field.name] ? 'border-red-500' : ''}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            {...form.register(field.name)}
                            className={form.formState.errors[field.name] ? 'border-red-500' : ''}
                          />
                        )}
                        {form.formState.errors[field.name] && (
                          <p className="text-sm text-red-600">
                            {form.formState.errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Children Fields */}
              {children && (
                <div className="border-t pt-6">
                  {children(form)}
                </div>
              )}

              {/* Multiple File Upload Section (Backward Compatibility) */}
              {!fields.some(f => f.type === 'image') && (
                <div className="space-y-4 border-t pt-6">
                  <Label>Additional Files/Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-700">Click to upload files</p>
                      <p className="mt-1 text-xs text-gray-500">Images, PDFs, or Documents</p>
                    </label>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files:</Label>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link href={backPath}>Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminErrorBoundary>
  );
}