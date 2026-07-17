import { ImageResponse } from 'next/og';
import { supabase } from '../../../../../lib/supabase';

export const runtime = 'edge';

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from('posts')
    .select('image_url, thumbnail_url, user_id')
    .eq('id', id)
    .single();

  if (error || !post) {
    return new Response('Post not found', { status: 404 });
  }

  const { data: creator } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('id', post.user_id)
    .single();

  const postImage = post.thumbnail_url || post.image_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        <img
          src={postImage}
          width="1200"
          height="630"
          style={{
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '45px',
            color: '#fff',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
              }}
            >
              {creator?.display_name || 'Frame Creator'}
            </span>

            <span
              style={{
                marginTop: '7px',
                fontSize: '22px',
              }}
            >
              @{creator?.username || 'creator'}
            </span>
          </div>

          <span
            style={{
              padding: '14px 26px',
              border: '2px solid white',
              borderRadius: '999px',
              fontSize: '25px',
              fontWeight: 700,
            }}
          >
            FRAME
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}