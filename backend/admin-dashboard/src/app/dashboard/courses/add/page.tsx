'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiService from '@/lib/api';

// Define the formData type with an index signature
interface CourseFormData {
  title: string;
  description: string;
  lectures: string;
  hours: string;
  timings: string;
  batchStartDate: string;
  batchRecording: { preRecorded: string; newRecording: string };
  booksIncluded: string[];
  platforms: string[];
  doubtSolvingPlatform: string;
  syllabusType: string;
  videoLanguage: string;
  systemRequirements: { supported: string[]; notSupported: string[] };
  faculty: { name: string; bio: string; experience: string; style: string; image: string };
  thumbnail: string;
  accessOptions: { type: string; price: string; views: string; validity: string }[];
  [key: string]: any;
}

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    lectures: '',
    hours: '',
    timings: '',
    batchStartDate: '',
    batchRecording: {
      preRecorded: '',
      newRecording: ''
    },
    booksIncluded: [''],
    platforms: [''],
    doubtSolvingPlatform: '',
    syllabusType: '',
    videoLanguage: '',
    systemRequirements: {
      supported: [''],
      notSupported: ['']
    },
    faculty: {
      name: '',
      bio: '',
      experience: '',
      style: '',
      image: ''
    },
    thumbnail: '',
    accessOptions: [{ type: '', price: '', views: '', validity: '' }],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(typeof prev[parent] === 'object' && prev[parent] !== null ? prev[parent] : {}),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (parent: string, index: number, value: string) => {
    setFormData(prev => {
      const array = Array.isArray(prev[parent]) ? [...(prev[parent] as string[])] : [];
      array[index] = value;
      return {
        ...prev,
        [parent]: array
      };
    });
  };

  const addArrayItem = (parent: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: [...(prev[parent as keyof typeof prev] as string[]), '']
    }));
  };

  const removeArrayItem = (parent: string, index: number) => {
    setFormData(prev => {
      const array = [...(prev[parent as keyof typeof prev] as string[])];
      array.splice(index, 1);
      return {
        ...prev,
        [parent]: array
      };
    });
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiService.uploadThumbnail(file);
      setFormData(prev => ({
        ...prev,
        thumbnail: (res.success && res.url) ? res.url : prev.thumbnail
      }));
      if (!(res.success && res.url)) {
        alert('Failed to upload image');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleAccessOptionChange = (index: number, field: keyof CourseFormData['accessOptions'][0], value: string) => {
    setFormData(prev => {
      const accessOptions = [...prev.accessOptions];
      (accessOptions[index] as any)[field] = value;
      return { ...prev, accessOptions };
    });
  };

  const addAccessOption = () => {
    setFormData(prev => ({ ...prev, accessOptions: [...prev.accessOptions, { type: '', price: '', views: '', validity: '' }] }));
  };

  const removeAccessOption = (index: number) => {
    setFormData(prev => {
      const accessOptions = [...prev.accessOptions];
      accessOptions.splice(index, 1);
      return { ...prev, accessOptions };
    });
  };

  const handleFacultyImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiService.uploadThumbnail(file);
      setFormData(prev => ({
        ...prev,
        faculty: {
          ...prev.faculty,
          image: (res.success && res.url) ? res.url : prev.faculty.image
        }
      }));
      if (!(res.success && res.url)) {
        alert('Failed to upload image');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleNestedArrayChange = (parent: string, child: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: prev[parent][child].map((item: string, i: number) => i === index ? value : item)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        booksIncluded: formData.booksIncluded.filter(item => item.trim() !== ''),
        platforms: formData.platforms.filter(item => item.trim() !== ''),
        systemRequirements: {
          supported: formData.systemRequirements.supported.filter(item => item.trim() !== ''),
          notSupported: formData.systemRequirements.notSupported.filter(item => item.trim() !== '')
        },
        accessOptions: formData.accessOptions
          .filter(opt => opt.type.trim() && opt.price.trim() && opt.validity.trim())
          .map(opt => ({
            type: opt.type,
            price: opt.price ? parseInt(opt.price) : 0,
            views: opt.views ? parseInt(opt.views) : 0,
            validity: opt.validity
          })),
      };
      delete (cleanedData as any)['systemRequirements.supported'];
      delete (cleanedData as any)['systemRequirements.notSupported'];

      const response = await apiService.createCourse(cleanedData);
      
      if (response.success) {
        alert('Course created successfully!');
        router.push('/dashboard/courses');
      } else {
        alert('Failed to create course: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-8 px-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
          <p className="text-gray-600 mt-1">Create a new course with all details</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/courses')}
        >
          ← Back to Courses
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                />
                {uploading && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Thumbnail Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter course description"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="lectures">Number of Lectures</Label>
                <Input
                  id="lectures"
                  type="number"
                  value={formData.lectures}
                  onChange={(e) => handleInputChange('lectures', e.target.value)}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="hours">Total Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="timings">Class Timings</Label>
                <Input
                  id="timings"
                  value={formData.timings}
                  onChange={(e) => handleInputChange('timings', e.target.value)}
                  placeholder="Mon-Fri 6-8 PM"
                />
              </div>
              <div>
                <Label htmlFor="batchStartDate">Batch Start Date</Label>
                <Input
                  id="batchStartDate"
                  type="date"
                  value={formData.batchStartDate}
                  onChange={(e) => handleInputChange('batchStartDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Batch Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preRecorded">Pre-recorded Sessions</Label>
                <Input
                  id="preRecorded"
                  value={formData.batchRecording.preRecorded}
                  onChange={(e) => handleNestedChange('batchRecording', 'preRecorded', e.target.value)}
                  placeholder="e.g., 20 sessions available"
                />
              </div>
              <div>
                <Label htmlFor="newRecording">New Recording</Label>
                <Input
                  id="newRecording"
                  value={formData.batchRecording.newRecording}
                  onChange={(e) => handleNestedChange('batchRecording', 'newRecording', e.target.value)}
                  placeholder="e.g., Live sessions recorded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Pricing & Access Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.accessOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  placeholder="Type (e.g., live, gd 1.2, pd 3)"
                  value={opt.type}
                  onChange={e => handleAccessOptionChange(idx, 'type' as keyof CourseFormData['accessOptions'][0], e.target.value)}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={opt.price}
                  onChange={e => handleAccessOptionChange(idx, 'price' as keyof CourseFormData['accessOptions'][0], e.target.value)}
                />
                <Input
                  placeholder="Views"
                  type="number"
                  value={opt.views}
                  onChange={e => handleAccessOptionChange(idx, 'views' as keyof CourseFormData['accessOptions'][0], e.target.value)}
                  required
                />
                <Input
                  placeholder="Validity (e.g., 1 year)"
                  value={opt.validity}
                  onChange={e => handleAccessOptionChange(idx, 'validity' as keyof CourseFormData['accessOptions'][0], e.target.value)}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeAccessOption(idx)} className="text-red-600">Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addAccessOption}>+ Add Option</Button>
          </CardContent>
        </Card>

        {/* Platform & Language */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Platform & Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="doubtSolvingPlatform">Doubt Solving Platform</Label>
                <Input
                  id="doubtSolvingPlatform"
                  value={formData.doubtSolvingPlatform}
                  onChange={(e) => handleInputChange('doubtSolvingPlatform', e.target.value)}
                  placeholder="e.g., Telegram, WhatsApp"
                />
              </div>
              <div>
                <Label htmlFor="syllabusType">Syllabus Type</Label>
                <Input
                  id="syllabusType"
                  value={formData.syllabusType}
                  onChange={(e) => handleInputChange('syllabusType', e.target.value)}
                  placeholder="e.g., UPSC, CAT, GATE"
                />
              </div>
              <div>
                <Label htmlFor="videoLanguage">Video Language</Label>
                <Input
                  id="videoLanguage"
                  value={formData.videoLanguage}
                  onChange={(e) => handleInputChange('videoLanguage', e.target.value)}
                  placeholder="e.g., English, Hindi"
                />
              </div>
            </div>

            {/* Platforms */}
            <div>
              <Label>Platforms</Label>
              <div className="space-y-2">
                {formData.platforms.map((platform, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={platform}
                      onChange={(e) => handleArrayChange('platforms', index, e.target.value)}
                      placeholder="e.g., YouTube, Udemy"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('platforms', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('platforms')}
                >
                  + Add Platform
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Books Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.booksIncluded.map((book, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={book}
                    onChange={(e) => handleArrayChange('booksIncluded', index, e.target.value)}
                    placeholder="Enter book name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('booksIncluded', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('booksIncluded')}
              >
                + Add Book
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">System Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Supported Systems</Label>
              <div className="space-y-2">
                {formData.systemRequirements.supported.map((system, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={system}
                      onChange={(e) => handleNestedArrayChange('systemRequirements', 'supported', index, e.target.value)}
                      placeholder="e.g., Windows 10, macOS 10.15"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('systemRequirements.supported', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('systemRequirements.supported')}
                >
                  + Add Supported System
                </Button>
              </div>
            </div>

            <div>
              <Label>Not Supported Systems</Label>
              <div className="space-y-2">
                {formData.systemRequirements.notSupported.map((system, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={system}
                      onChange={(e) => handleNestedArrayChange('systemRequirements', 'notSupported', index, e.target.value)}
                      placeholder="e.g., Windows 7, Linux"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('systemRequirements.notSupported', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('systemRequirements.notSupported')}
                >
                  + Add Not Supported System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Faculty Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facultyName">Faculty Name</Label>
                <Input
                  id="facultyName"
                  value={formData.faculty.name}
                  onChange={(e) => handleNestedChange('faculty', 'name', e.target.value)}
                  placeholder="Enter faculty name"
                />
              </div>
              <div>
                <Label htmlFor="facultyImage">Faculty Image URL</Label>
                <Input
                  id="facultyImage"
                  value={formData.faculty.image}
                  onChange={(e) => handleNestedChange('faculty', 'image', e.target.value)}
                  placeholder="https://example.com/faculty.jpg"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="facultyBio">Faculty Bio</Label>
              <textarea
                id="facultyBio"
                value={formData.faculty.bio}
                onChange={(e) => handleNestedChange('faculty', 'bio', e.target.value)}
                placeholder="Enter faculty bio"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facultyExperience">Experience</Label>
                <Input
                  id="facultyExperience"
                  value={formData.faculty.experience}
                  onChange={(e) => handleNestedChange('faculty', 'experience', e.target.value)}
                  placeholder="e.g., 10+ years"
                />
              </div>
              <div>
                <Label htmlFor="facultyStyle">Teaching Style</Label>
                <Input
                  id="facultyStyle"
                  value={formData.faculty.style}
                  onChange={(e) => handleNestedChange('faculty', 'style', e.target.value)}
                  placeholder="e.g., Interactive, Practical"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/courses')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
} 