'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiService from '@/lib/api';
import { Course } from '@/types';

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

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    lectures: '',
    hours: '',
    timings: '',
    batchStartDate: '',
    batchRecording: { preRecorded: '', newRecording: '' },
    booksIncluded: [''],
    platforms: [''],
    doubtSolvingPlatform: '',
    syllabusType: '',
    videoLanguage: '',
    systemRequirements: { supported: [''], notSupported: [''] },
    faculty: { name: '', bio: '', experience: '', style: '', image: '' },
    thumbnail: '',
    accessOptions: [{ type: '', price: '', views: '', validity: '' }],
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourse(courseId);
      
      if (response.success && response.data) {
        const courseData = response.data;
        setCourse(courseData);
        
        // Format the data for the form
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          lectures: courseData.lectures?.toString() || '',
          hours: courseData.hours?.toString() || '',
          timings: courseData.timings || '',
          batchStartDate: courseData.batchStartDate ? new Date(courseData.batchStartDate).toISOString().split('T')[0] : '',
          batchRecording: {
            preRecorded: courseData.batchRecording?.preRecorded || '',
            newRecording: courseData.batchRecording?.newRecording || ''
          },
          booksIncluded: courseData.booksIncluded?.length ? courseData.booksIncluded : [''],
          platforms: courseData.platforms?.length ? courseData.platforms : [''],
          doubtSolvingPlatform: courseData.doubtSolvingPlatform || '',
          syllabusType: courseData.syllabusType || '',
          videoLanguage: courseData.videoLanguage || '',
          systemRequirements: {
            supported: courseData.systemRequirements?.supported?.length ? courseData.systemRequirements.supported : [''],
            notSupported: courseData.systemRequirements?.notSupported?.length ? courseData.systemRequirements.notSupported : ['']
          },
          faculty: {
            name: courseData.faculty?.name || '',
            bio: courseData.faculty?.bio || '',
            experience: courseData.faculty?.experience || '',
            style: courseData.faculty?.style || '',
            image: courseData.faculty?.image || ''
          },
          thumbnail: courseData.thumbnail || '',
          accessOptions: Array.isArray(courseData.accessOptions)
            ? courseData.accessOptions.map((opt: any) => ({
                type: opt.type || '',
                price: opt.price?.toString() || '',
                views: opt.views?.toString() || '',
                validity: opt.validity || ''
              }))
            : [{ type: '', price: '', views: '', validity: '' }],
        });
      } else {
        setError('Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Error loading course');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAccessOptionChange = (
    index: number,
    field: 'type' | 'price' | 'views' | 'validity',
    value: string
  ) => {
    setFormData(prev => {
      const accessOptions = [...prev.accessOptions];
      accessOptions[index][field] = value;
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
    setSaving(true);

    try {
      // Clean up empty array items and convert string numbers to actual numbers
      const cleanedData = {
        ...formData,
        lectures: formData.lectures ? parseInt(formData.lectures) : undefined,
        hours: formData.hours ? parseInt(formData.hours) : undefined,
        booksIncluded: formData.booksIncluded.filter(item => item.trim() !== ''),
        platforms: formData.platforms.filter(item => item.trim() !== ''),
        systemRequirements: {
          supported: formData.systemRequirements.supported.filter(item => item.trim() !== ''),
          notSupported: formData.systemRequirements.notSupported.filter(item => item.trim() !== '')
        },
        accessOptions: formData.accessOptions.map(opt => ({
          type: opt.type,
          price: opt.price ? parseInt(opt.price) : 0,
          views: opt.views ? parseInt(opt.views) : 0,
          validity: opt.validity
        })),
      };
      delete (cleanedData as any)['systemRequirements.supported'];
      delete (cleanedData as any)['systemRequirements.notSupported'];

      const response = await apiService.updateCourse(courseId, cleanedData);
      
      if (response.success) {
        alert('Course updated successfully!');
        router.push('/dashboard/courses');
      } else {
        alert('Failed to update course: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course');
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
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
      setSaving(false);
    }
  };

  const handleFacultyImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Course</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.push('/dashboard/courses')} variant="outline">
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 px-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-1">Update course details and information</p>
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
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleThumbnailChange}
                  placeholder="https://example.com/image.jpg"
                />
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
                  onChange={e => handleAccessOptionChange(idx, 'type', e.target.value)}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={opt.price}
                  onChange={e => handleAccessOptionChange(idx, 'price', e.target.value)}
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
                  onChange={e => handleAccessOptionChange(idx, 'validity', e.target.value)}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFacultyImageChange}
                  className="mt-2"
                />
                {formData.faculty.image && (
                  <img src={formData.faculty.image} alt="Faculty Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
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
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {saving ? 'Updating...' : 'Update Course'}
          </Button>
        </div>
      </form>
    </div>
  );
} 