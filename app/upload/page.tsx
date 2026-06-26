'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function uploadPost() {
    if (!file) {
      setMessage('Please choose an image first.');
      return;
    }

    setUploading(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('You need to be logged in to upload.');
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file);

    if (uploadError) {
      console.log('Upload error:', uploadError);
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    const postTitle =
  caption.trim().length > 0
    ? caption.trim().slice(0, 60)
    : 'Untitled Frame Post';

    const parsedTags = tags
  .split(' ')
  .map((tag) => tag.trim().replace('#', ''))
  .filter(Boolean);

const { error: postError } = await supabase.from('posts').insert({
  user_id: user.id,
  title: postTitle,
  image_url: publicUrlData.publicUrl,
  caption,
  tags: parsedTags,
});

    if (postError) {
      console.log('Post error:', postError);
      setMessage(postError.message);
      setUploading(false);
      return;
    }

    setFile(null);
    setPreview('');
    setCaption('');
    setMessage('Post uploaded successfully.');
    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Upload
        </h1>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mb-6 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="mb-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-zinc-900 text-zinc-500">
              Choose an image to preview
            </div>
          )}

          <label className="mb-4 block cursor-pointer rounded-full border border-white/20 bg-zinc-900 px-5 py-3 text-center text-sm font-semibold hover:bg-zinc-800">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none"
          />
          <input
  type="text"
  placeholder="Tags e.g. #Photography #mydog #sunset"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none"
/>

          <button
            onClick={uploadPost}
            disabled={uploading}
            className="w-full rounded-full bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Post'}
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