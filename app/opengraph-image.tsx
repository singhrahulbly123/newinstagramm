import { ImageResponse } from 'next/og';

export const alt = 'globltools public Instagram media utilities';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '82px',
          color: 'white',
          background: 'linear-gradient(135deg, #020617 0%, #064e3b 55%, #0f766e 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: 34, fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 18, background: 'white', color: '#064e3b' }}>G</div>
          globltools
        </div>
        <div style={{ display: 'flex', marginTop: 52, maxWidth: 980, fontSize: 68, lineHeight: 1.08, fontWeight: 800 }}>
          Public Instagram media tools
        </div>
        <div style={{ display: 'flex', marginTop: 30, fontSize: 30, color: '#d1fae5' }}>
          Reels · Videos · Photos · Audio · Stories
        </div>
      </div>
    ),
    size,
  );
}
