import React, { useState } from 'react';
import type { FormField } from './formData';
import { formData, buildGoogleFormUrl } from './formData';
import MarkdownEditor from './MarkdownEditor';

export default function GoogleFormBuilder() {
  const [formFields, setFormFields] = useState<FormField[]>(formData);

  const handleFieldChange = (id: number, field: 'value' | 'other', newValue: string) => {
    setFormFields(prev => 
      prev.map(f => 
        f.id === id ? { ...f, [field]: newValue } : f
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const googleFormUrl = buildGoogleFormUrl(formFields);
    window.open(googleFormUrl, '_blank');
  };

  const renderField = (field: FormField) => {
    const baseInputClass = "w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs";
    
    if (field.other !== undefined) {
      return (
        <div className="space-y-1">
          <select
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
            className={baseInputClass}
          >
            <option value="">Select option</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
          <input
            type="text"
            placeholder="Or specify other"
            value={field.other || ''}
            onChange={(e) => handleFieldChange(field.id, 'other', e.target.value)}
            className={baseInputClass}
          />
        </div>
      );
    }
    
    if (field.name.includes('email')) {
      return (
        <input
          type="email"
          value={field.value || ''}
          onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
          className={baseInputClass}
        />
      );
    }
    
    if (field.name.includes('URL') || field.name.includes('Link')) {
      return (
        <input
          type="url"
          value={field.value || ''}
          onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
          className={baseInputClass}
        />
      );
    }
    
    if (field.name.includes('Description')) {
      return (
        <textarea
          value={field.value || ''}
          onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
          rows={2}
          className={baseInputClass}
        />
      );
    }
    
    return (
      <input
        type="text"
        value={field.value || ''}
        onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
        className={baseInputClass}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Ingress FS Event Form Builder</h1>
            <p className="text-sm text-gray-600">Fill form below and submit to open pre-filled Google Form.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {formFields.filter(field => field.name !== "Event Description").map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      {field.name}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              
              {/* Event Description with Markdown Editor */}
              <MarkdownEditor
                initialValue={formFields.find(f => f.name === "Event Description")?.value || ''}
                onChange={(_, html) => {
                  setFormFields(prev => 
                    prev.map(f => 
                      f.name === "Event Description" ? { ...f, value: html } : f
                    )
                  );
                }}
              />
            </div>
            
            <div className="pt-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Open Google Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}