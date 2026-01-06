import React, { useState } from 'react';
import type { FormField } from './formData';
import { formData, buildGoogleFormUrl } from './formData';

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
    const baseInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
    
    if (field.other !== undefined) {
      return (
        <div className="space-y-2">
          <select
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
            className={baseInputClass}
          >
            <option value="">Select an option</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
          <input
            type="text"
            placeholder="Or specify other language"
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
          rows={3}
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingress FS Event Form Builder</h1>
          <p className="text-gray-600 mb-6">Fill in the form below and submit to open the pre-filled Google Form.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.name}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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