import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 75% 35%, #7B5CFF 0%, rgba(123,92,255,0.25) 30%, #0A0A0B 65%)',
          color: '#F2F2F2',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, opacity: 0.6, textTransform: 'uppercase' }}>Showreel · Portfolio</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 110, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 40, marginTop: 20, color: '#9999FF' }}>
            {`${site.title} — ${site.specialty}`}
          </div>
        </div>
        <div style={{ display: 'flex', height: 4, width: '100%', background: 'linear-gradient(90deg, #9999FF, #7B5CFF, #FF6B3D)' }} />
      </div>
    ),
    size,
  );
}
