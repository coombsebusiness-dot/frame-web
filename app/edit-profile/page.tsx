'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const INTERESTS = [
  'Photography',
  'Film Photography',
  'Art',
  'Drawing',
  'Painting',
  'Illustration',
  'Design',
  'Digital Art',
  'Architecture',
  'Fashion',
  'Beauty',
  'Colorist',
  'Hair & Colour',
  'Music',
  'Video',
  'Filmmaking',
  'Writing',
  'Crafts',
  'Content Creation',
  'Gaming',
  'Technology',
  'Nature',
  'Travel',
];

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [creativeInterests, setCreativeInterests] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [gear, setGear] = useState('');
  const [favouriteCamera, setFavouriteCamera] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
      setGear(data.gear || '');
      setFavouriteCamera(data.favourite_camera || '');
      setAvatarUrl(data.avatar_url || '');
      setCreativeInterests(data.creative_interests || []);
    }

    setLoading(false);
  }
async function uploadAvatar(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) {
    console.error(error);
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  setAvatarUrl(data.publicUrl);

  setUploading(false);
}
  function toggleInterest(interest: string) {
  setCreativeInterests((current) =>
    current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest]
  );
}
  async function saveProfile() {
    setSaving(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
  display_name: displayName,
  bio,
  gear,
  favourite_camera: favouriteCamera,
  avatar_url: avatarUrl,
  creative_interests: creativeInterests,
})
      
      .eq('id', user.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile updated successfully.');
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-black text-white px-6 py-10">
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Edit Profile
      </h1>

      <div className="space-y-4">
        <div className="mb-8 text-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="mx-auto mb-4 h-28 w-28 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-zinc-800 border border-white/20" />
          )}

          <label className="inline-block cursor-pointer rounded-full border border-white/20 bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
            {uploading ? 'Uploading...' : 'Change Profile Photo'}

            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
            />
          </label>
        </div>
        <div>
  <h2 className="mb-3 text-lg font-semibold">
    Creative Interests
  </h2>

  <div className="flex flex-wrap gap-2">
    {INTERESTS.map((interest) => (
      <button
        key={interest}
        type="button"
        onClick={() => toggleInterest(interest)}
        className={`rounded-full px-4 py-2 text-sm transition ${
          creativeInterests.includes(interest)
            ? 'bg-white text-black'
            : 'bg-zinc-900 text-white border border-zinc-700'
        }`}
      >
        {interest}
      </button>
    ))}
  </div>
</div>

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
        />

        <input
          type="text"
          placeholder="Favourite Camera"
          value={favouriteCamera}
          onChange={(e) => setFavouriteCamera(e.target.value)}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
        />

        <input
          type="text"
          placeholder="Camera Gear"
          value={gear}
          onChange={(e) => setGear(e.target.value)}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
        />

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full rounded-xl bg-white py-3 font-semibold text-black"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        {message && (
          <p className="text-center text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  </main>
);
}