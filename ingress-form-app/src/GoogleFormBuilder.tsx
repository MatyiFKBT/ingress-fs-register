import React, { useState } from 'react';
import type { FormField } from './formData';
import { formData, buildGoogleFormUrl } from './formData';
import MarkdownEditor from './MarkdownEditor';

export default function GoogleFormBuilder() {
  const [formFields, setFormFields] = useState<FormField[]>(formData);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [restockMapsUrl, setRestockMapsUrl] = useState('');

  const handleFieldChange = (id: number, field: 'value' | 'other', newValue: string) => {
    setFormFields(prev => 
      prev.map(f => 
        f.id === id ? { ...f, [field]: newValue } : f
      )
    );
  };

  const handleGoogleMapsUrl = (url: string) => {
    setGoogleMapsUrl(url);
  };

  const handleRestockMapsUrl = (url: string) => {
    setRestockMapsUrl(url);
  };

  const parseGoogleMapsUrl = () => {
    if (!googleMapsUrl) return;

    try {
      const url = new URL(googleMapsUrl);
      const ll = url.searchParams.get('ll');
      const q = url.searchParams.get('q');
      
      if (ll && q) {
        // Extract coordinates from ll parameter
        const [lat, lng] = ll.split(',');
        
        // Extract portal name from q parameter
        // Format: "coordinates (name)" - just regular space and parentheses
        let portalName = 'Unknown Portal';
        
        // Pattern: "47.491558,19.069074 (Oroszlanos Kapubejaro)"
        const nameMatch = q.match(/^\s*[0-9.,]+\s*\((.+)\)\s*$/);
        if (nameMatch) {
          portalName = nameMatch[1].trim();
        } else {
          // Fallback: try encoded version
          const encodedMatch = q.match(/^[^%]*%20\((.+)\)$/);
          if (encodedMatch) {
            portalName = decodeURIComponent(encodedMatch[1]);
          } else {
            // Another fallback: extract after space before parentheses
            const spaceMatch = q.match(/\s+\((.+)\)/);
            if (spaceMatch) {
              portalName = spaceMatch[1].trim();
            }
          }
        }
        
        console.log('Q parameter:', q); // Debug log
        console.log('Parsed portal name:', portalName); // Debug log
        
        // Update Base Portal Name
        setFormFields(prev => 
          prev.map(f => 
            f.name === "Base Portal Name" ? { ...f, value: portalName } : f
          )
        );
        
        // Update Base Portal URL with Intel link using the extracted coordinates
        const intelUrl = `https://intel.ingress.com/intel?pll=${lat},${lng}`;
        setFormFields(prev => 
          prev.map(f => 
            f.name === "Base Portal URL" ? { ...f, value: intelUrl } : f
          )
        );
        
        // Clear the input after successful parsing
        setGoogleMapsUrl('');
      } else {
        alert('Invalid Google Maps URL format. Please copy the full URL from Google Maps.');
      }
    } catch (error) {
      alert('Invalid URL format. Please paste a valid Google Maps URL.');
    }
  };

  const parseRestockMapsUrl = () => {
    if (!restockMapsUrl) return;

    try {
      const url = new URL(restockMapsUrl);
      const ll = url.searchParams.get('ll');
      const q = url.searchParams.get('q');
      
      if (ll && q) {
        // Extract coordinates from ll parameter
        const [lat, lng] = ll.split(',');
        
        // Extract portal name from q parameter
        let portalName = 'Unknown Portal';
        
        const nameMatch = q.match(/^\s*[0-9.,]+\s*\((.+)\)\s*$/);
        if (nameMatch) {
          portalName = nameMatch[1].trim();
        } else {
          const encodedMatch = q.match(/^[^%]*%20\((.+)\)$/);
          if (encodedMatch) {
            portalName = decodeURIComponent(encodedMatch[1]);
          } else {
            const spaceMatch = q.match(/\s+\((.+)\)/);
            if (spaceMatch) {
              portalName = spaceMatch[1].trim();
            }
          }
        }
        
        console.log('Restock Q parameter:', q);
        console.log('Parsed restock portal name:', portalName);
        
        // Update Restocking Portal Name
        setFormFields(prev => 
          prev.map(f => 
            f.name === "Restocking Portal Name" ? { ...f, value: portalName } : f
          )
        );
        
        // Update Restocking Portal Intel URL
        const intelUrl = `https://intel.ingress.com/intel?pll=${lat},${lng}`;
        setFormFields(prev => 
          prev.map(f => 
            f.name === "Restocking Portal Intel URL" ? { ...f, value: intelUrl } : f
          )
        );
        
        // Clear input after successful parsing
        setRestockMapsUrl('');
      } else {
        alert('Invalid Google Maps URL format. Please copy full URL from Google Maps.');
      }
    } catch (error) {
      alert('Invalid URL format. Please paste a valid Google Maps URL.');
    }
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
              {/* Google Maps URL Parsers - Side by Side */}
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Base Portal Parser */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Base Portal URL
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="url"
                      placeholder="Base Portal Google Maps URL..."
                      value={googleMapsUrl}
                      onChange={(e) => handleGoogleMapsUrl(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                    />
                    <button
                      type="button"
                      onClick={parseGoogleMapsUrl}
                      className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                    >
                      Parse
                    </button>
                  </div>
                </div>

                {/* Restocking Portal Parser */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Restocking Portal URL
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="url"
                      placeholder="Restocking Portal Google Maps URL..."
                      value={restockMapsUrl}
                      onChange={(e) => handleRestockMapsUrl(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                    />
                    <button
                      type="button"
                      onClick={parseRestockMapsUrl}
                      className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                    >
                      Parse
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-span-full text-xs text-gray-400">
                Paste Google Maps URLs to extract portal names & coordinates automatically
              </div>

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
                initialValue={`# Ingress FS Event in {{city}}, {{country}}

Join us for an exciting **First Saturday** event!

## Event Details
- **Time:** {{startTime}}
- **Type:** {{eventType}}
- **Base Portal:** {{basePortal}}
- **Restock Portal:** {{restockPortal}}

Bring your friends and let's have some fun!`}
                onChange={(_, html) => {
                  setFormFields(prev => 
                    prev.map(f => 
                      f.name === "Event Description" ? { ...f, value: html } : f
                    )
                  );
                }}
                variables={{
                  city: formFields.find(f => f.name === "City")?.value || '',
                  country: formFields.find(f => f.name === "Country")?.value || '',
                  startTime: formFields.find(f => f.name === "Event Start Time")?.value || '',
                  eventType: formFields.find(f => f.name === "Event Type")?.value || '',
                  basePortal: formFields.find(f => f.name === "Base Portal Name")?.value || '',
                  restockPortal: formFields.find(f => f.name === "Restocking Portal Name")?.value || ''
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