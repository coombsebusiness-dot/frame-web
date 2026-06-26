'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function UploadStoryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [storyText, setStoryText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function uploadStory() {
    if (!file) {
      setMessage('Please choose an image or video first.');
      return;
    }

    setUploading(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('You need to be logged in.');
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `stories/${fileName}`;
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';

    const { error: uploadError } = await supabase.storage
      .from('story-media')
      .upload(filePath, file);

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('story-media')
      .getPublicUrl(filePath);

    const { error: storyError } = await supabase.from('stories').insert({
      user_id: user.id,
      media_url: publicUrlData.publicUrl,
      media_type: mediaType,
      thumbnail_url: mediaType === 'image' ? publicUrlData.publicUrl : null,
      story_text: storyText.trim() || 'EMPTY',
      text_color: '#FFFFFF',
      text_x: 40,
      text_y: 420,
    });

    if (storyError) {
      setMessage(storyError.message);
      setUploading(false);
      return;
    }

    setFile(null);
    setPreview('');
    setStoryText('');
    setMessage('Story uploaded successfully.');
    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Upload Story
        </h1>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          {preview ? (
            file?.type.startsWith('video') ? (
              <video src={preview} controls className="mb-6 w-full rounded-2xl" />
            ) : (
              <img src={preview} alt="" className="mb-6 w-full rounded-2xl" />
            )
          ) : (
            <div className="mb-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-zinc-900 text-zinc-500">
              Choose story media
            </div>
          )}

          <label className="mb-4 block cursor-pointer rounded-full border border-white/20 bg-zinc-900 px-5 py-3 text-center text-sm font-semibold hover:bg-zinc-800">
            Choose Image or Video
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Story text optional..."
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none"
          />

          <button
            onClick={uploadStory}
            disabled={uploading}
            className="w-full rounded-full bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Post Story'}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-zinc-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}