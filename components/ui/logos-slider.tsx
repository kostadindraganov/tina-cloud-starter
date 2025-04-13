'use client';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { LogoItem } from '../blocks/logos-slider-block';

const defaultLogos = [
  {
    id: "logo-2",
    description: "Figma",
    image: "https://www.shadcnblocks.com/images/block/logos/figma.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-3",
    description: "Next.js",
    image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-6",
    description: "Supabase",
    image: "https://www.shadcnblocks.com/images/block/logos/supabase.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "https://www.shadcnblocks.com/images/block/logos/vercel.svg",
    className: "h-7 w-auto",
  },
];

export function LogosSlider({ logos = defaultLogos }: { logos?: LogoItem[] }) {
  const displayLogos = logos.length > 0 ? logos : defaultLogos;
  
  return (
    <div className='relative h-[100px] w-full overflow-hidden mb-8'>
      <InfiniteSlider 
        className='flex h-full w-full items-center' 
        speed={40}
        gap={100}
      >
        {displayLogos.map((logo) => (
          <div 
            key={String(logo.id)} 
            className='flex w-32 items-center justify-center'
          >
            {logo.url ? (
              <a 
                href={logo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block cursor-pointer"
              >
                <img
                  src={logo.image}
                  alt={logo.description}
                  className={logo.className}
                />
              </a>
            ) : (
              <img
                src={logo.image}
                alt={logo.description}
                className={logo.className}
              />
            )}
          </div>
        ))}
      </InfiniteSlider>
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 left-0 h-full w-[200px]'
        direction='left'
        blurIntensity={1}
      />
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 right-0 h-full w-[200px]'
        direction='right'
        blurIntensity={1}
      />
    </div>
  );
} 