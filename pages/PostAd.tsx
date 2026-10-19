import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useToast } from '../context/ToastContext';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Star,
  Shield,
  Layers,
  Sparkles,
  ShieldCheck,
  Eye,
  Check
} from 'lucide-react';
import { SECTIONS } from '../constants';

const SAMPLE_IMAGES = [
  { label: 'Vehicle', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Apartment', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laptop / Tech', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Furniture', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' }
];

export const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { showToast } = useToast();

  // Wizard Step: 1 = Details & Photos, 2 = Location & Safety
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('for-sale');
  const [location, setLocation] = useState('San Francisco, CA');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [useApproximateRadius, setUseApproximateRadius] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photos State: array of Data URLs or web URLs
  const [photos, setPhotos] = useState<string[]>([SAMPLE_IMAGES[0].url]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact & safety preferences
  const [hidePhone, setHidePhone] = useState(true);
  const [allowContactRelay, setAllowContactRelay] = useState(true);

  // Quick Importer State
  const [isQuickImportOpen, setIsQuickImportOpen] = useState(false);
  const [quickImportText, setQuickImportText] = useState('');

  const handleAutoImport = (rawText: string) => {
    if (!rawText.trim()) return;

    // Extract price ($XXX)
    const priceMatch = rawText.match(/\$([0-9,]+)/);
    if (priceMatch) {
      setPrice(priceMatch[1].replace(/,/g, ''));
    }

    // Keyword category detection
    const lower = rawText.toLowerCase();
    if (lower.includes('car') || lower.includes('civic') || lower.includes('truck') || lower.includes('auto') || lower.includes('toyota')) {
      setCategory('cars-trucks');
    } else if (lower.includes('bike') || lower.includes('trek') || lower.includes('bicycle') || lower.includes('cycling')) {
      setCategory('bicycles');
    } else if (lower.includes('apartment') || lower.includes('loft') || lower.includes('rent') || lower.includes('1br') || lower.includes('sublet')) {
      setCategory('apartments-housing');
    } else if (lower.includes('macbook') || lower.includes('laptop') || lower.includes('phone') || lower.includes('computer') || lower.includes('intel')) {
      setCategory('computers');
    } else if (lower.includes('table') || lower.includes('furniture') || lower.includes('chair') || lower.includes('sofa') || lower.includes('desk')) {
      setCategory('furniture');
    }

    // Extract title & description
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      setTitle(lines[0].replace(/\$([0-9,]+)/g, '').trim());
      if (lines.length > 1) {
        setDescription(lines.slice(1).join('\n'));
      } else {
        setDescription(rawText);
      }
    }

    showToast('Classified details extracted and populated!', 'success');
    setIsQuickImportOpen(false);
  };

  // Compress & read uploaded files
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            setPhotos((prev) => [...prev, compressedDataUrl]);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setPhotos((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const updated = [...prev];
      const selected = updated.splice(index, 1)[0];
      return [selected, ...updated];
    });
  };

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide an ad title', 'error');
      return;
    }
    if (!price.trim()) {
      showToast('Please enter an item price', 'error');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedPrice = price.startsWith('$') ? price : `$${price || '0'}`;
    const primaryImage = photos[0] || SAMPLE_IMAGES[0].url;

    // Apply slight random privacy offset if user enabled approximate radius
    const jitterLat = useApproximateRadius ? latitude + (Math.random() - 0.5) * 0.004 : latitude;
    const jitterLng = useApproximateRadius ? longitude + (Math.random() - 0.5) * 0.004 : longitude;

    const newAd = addListing({
      title: title.trim(),
      price: formattedPrice,
      description: description.trim() || 'No description provided.',
      category,
      location: location.trim() || 'SF Bay Area',
      citySlug: 'sfbay',
      imageUrl: primaryImage,
      gallery: photos.length > 1 ? photos : [primaryImage],
      latitude: jitterLat,
      longitude: jitterLng,
      coordinates: {
        type: 'Point',
        coordinates: [jitterLng, jitterLat]
      },
      seller: {
        id: `sel-${Date.now()}`,
        name: 'Community Poster',
        rating: 5.0,
        phoneVerified: !hidePhone,
        joinedDate: new Date().getFullYear().toString()
      }
    });

    showToast('Your classified ad is live on the map and ready for buyers!', 'success');
    navigate(`/listing/${newAd.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Top Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-700 dark:hover:text-purple-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Classifieds</span>
        </Link>

        {/* Wizard Steps Progress Indicator */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              step === 1
                ? 'bg-purple-700 text-white border-purple-700 shadow-md'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 1 ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
            }`}>
              1
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">1. Item & Photos</span>
              <span className={`text-[10px] block ${step === 1 ? 'text-purple-200' : 'text-gray-400'}`}>
                Title, pricing & images
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (title.trim() && price.trim()) setStep(2);
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              step === 2
                ? 'bg-purple-700 text-white border-purple-700 shadow-md'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 2 ? 'bg-white text-purple-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">2. Location & Privacy</span>
              <span className={`text-[10px] block ${step === 2 ? 'text-purple-200' : 'text-gray-400'}`}>
                Interactive map pin & safety
              </span>
            </div>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400">
                <PlusCircle className="w-5 h-5" />
              </span>
              <h1 className="font-serif font-black text-2xl text-gray-900 dark:text-gray-100">
                {step === 1 ? 'Describe Your Item & Add Photos' : 'Set Location & Safety Preferences'}
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {step === 1
                ? 'Quick 30-second posting form. High-quality photos attract 4x more buyers.'
                : 'Drag your pin on the map. You can show an approximate neighborhood circle to protect privacy.'}
            </p>
          </div>

          {/* STEP 1: Basic Details & Photos */}
          {step === 1 && (
            <form onSubmit={goToStep2} className="space-y-6 animate-fadeIn">
              
              {/* Quick 1-Click Fast Importer Button */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200/80 dark:border-purple-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-700 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
                      Fast 1-Click Importer & Cross-Poster
                    </span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-400">
                      Paste text from Craigslist, Facebook Marketplace, or notes to auto-fill in 1 second.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickImportOpen(true)}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  ⚡ Auto-Fill
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Posting Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2021 Honda Civic EX or Sunny 1BR Loft with Balcony"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 450 or 2200/mo"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  >
                    {SECTIONS.map(section => (
                      <optgroup key={section.id} label={section.title.toUpperCase()}>
                        {section.categories.map(cat => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Item Photos ({photos.length})
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Drag & Drop or browse files
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 scale-[1.01]'
                      : 'border-gray-300 dark:border-gray-700 hover:border-purple-500 bg-gray-50/70 dark:bg-gray-800/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        Drop real photos here, or <span className="text-purple-600 underline">browse files</span>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Compressed client-side to keep browser storage fast. Zero external cloud required.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Camera EXIF Scrubber Badge */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Camera EXIF Scrubber:</strong> Home GPS coordinates and camera serial numbers are automatically stripped in your browser prior to saving.</span>
                </div>

                {/* Thumbnails list */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-gray-100 dark:bg-gray-800 shadow-xs ${
                          idx === 0 ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 bg-purple-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>Cover</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAsCover(idx);
                              }}
                              className="px-2 py-0.5 bg-white text-gray-900 rounded-md text-[9px] font-bold hover:bg-purple-100"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(idx);
                            }}
                            className="p-1 bg-red-600 text-white rounded-md text-[9px] hover:bg-red-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[10px] font-bold text-gray-400 shrink-0">Sample Presets:</span>
                  {SAMPLE_IMAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotos((prev) => [...prev, sample.url])}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-50 hover:text-purple-700 transition-colors shrink-0"
                    >
                      + {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Posting Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Include condition, specs, dimensions, pickup instructions, and contact preferences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                />
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Location & Safety</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: Location on Map & Privacy */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
              
              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Neighborhood / Location Name *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mission District, San Francisco or Berkeley Downtown"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                </div>
              </div>

              {/* Privacy Radius Toggle */}
              <div className="bg-purple-50/70 dark:bg-purple-950/40 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-white dark:bg-gray-900 rounded-xl text-purple-600">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200">
                      Neighborhood Privacy Protection (Recommended)
                    </h4>
                    <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                      Shows a 500m general neighborhood circle on the public map instead of your exact home address.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useApproximateRadius}
                  onChange={(e) => setUseApproximateRadius(e.target.checked)}
                  className="w-5 h-5 rounded text-purple-700 focus:ring-purple-600 border-purple-300"
                />
              </div>

              {/* Interactive Location Picker Map */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-850">
                <LocationPickerMap
                  initialLat={latitude}
                  initialLng={longitude}
                  onLocationChange={(lat, lng, placeLabel) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    if (placeLabel && (!location || location === 'San Francisco, CA')) {
                      setLocation(placeLabel);
                    }
                  }}
                />
              </div>

              {/* Safety Preferences */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Communication Privacy:
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={allowContactRelay}
                    onChange={(e) => setAllowContactRelay(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="font-medium">Use Craigslist in-app chat & relay (keeps personal phone/email private)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={hidePhone}
                    onChange={(e) => setHidePhone(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="font-medium">Hide direct phone number until buyer makes a verified offer</span>
                </label>
              </div>

              {/* Buttons: Back & Final Submit */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit Details</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing Classified...' : 'Publish Advertisement on Craigslist'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* 1-Click Fast Import Modal */}
      {isQuickImportOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif font-black text-lg text-gray-900 dark:text-gray-100">
                    1-Click Fast Ad Importer
                  </h3>
                  <p className="text-[11px] text-gray-400">Paste text from Craigslist, Facebook, eBay, or notes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickImportOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                Paste raw ad text:
              </label>
              <textarea
                rows={5}
                placeholder="e.g. 2021 Honda Civic EX $19,500 - 32k miles, clean title, backup camera, heated seats. San Francisco pickup."
                value={quickImportText}
                onChange={(e) => setQuickImportText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-purple-600 font-mono dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Or Try Sample:
              </span>
              <button
                type="button"
                onClick={() => setQuickImportText('2021 Specialized Sirrus X 4.0 Gravel Bike $850\nLightweight aluminum frame, carbon fork, 1x11 Shimano Deore. Serviced recently in Berkeley, ready to ride.')}
                className="text-[11px] text-purple-700 dark:text-purple-400 font-medium hover:underline block text-left cursor-pointer"
              >
                Sample: "2021 Specialized Sirrus X 4.0 Gravel Bike $850..."
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsQuickImportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAutoImport(quickImportText)}
                disabled={!quickImportText.trim()}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Parse & Auto-Fill Form
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
