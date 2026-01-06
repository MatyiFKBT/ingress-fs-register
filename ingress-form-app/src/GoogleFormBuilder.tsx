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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Ingress FS Event Form Builder</h1>
      <p>Fill in the form below and submit to open the pre-filled Google Form.</p>
      
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {field.name}
            </label>
            {field.other !== undefined ? (
              <div>
                <select
                  value={field.value || ''}
                  onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
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
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            ) : field.name.includes('email') ? (
              <input
                type="email"
                value={field.value || ''}
                onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : field.name.includes('URL') || field.name.includes('Link') ? (
              <input
                type="url"
                value={field.value || ''}
                onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : field.name.includes('Description') ? (
              <textarea
                value={field.value || ''}
                onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : (
              <input
                type="text"
                value={field.value || ''}
                onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          </div>
        ))}
        
        <button
          type="submit"
          style={{
            backgroundColor: '#4285f4',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Open Google Form
        </button>
      </form>
    </div>
  );
}