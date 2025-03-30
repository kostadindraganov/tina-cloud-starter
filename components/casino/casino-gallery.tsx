import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Gallery } from "../../types/casino";

interface CasinoGalleryProps {
  gallery?: ({
    __typename?: "CasinoGallery";
    title?: string | null;
    image?: string | null;
  } | null)[] | null;
}

export const CasinoGallery: React.FC<CasinoGalleryProps> = ({ gallery }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prepare gallery items for lightbox
  const gallerySlides = gallery?.filter(Boolean).map((item) => {
    if (!item) return null;
    return {
      src: item.image || '',
      alt: item.title || '',
      title: item.title || '',
      description: `Image ${item.title || ''}`,
    };
  }).filter(Boolean) || [];
  
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Casino Gallery</h2>
      
      {gallery && gallery.length > 0 ? (
        <div className="gallery-grid">
          {gallery.map((item, index) => {
            if (!item || !item.image) return null;
            return (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full h-64">
                  <Image
                    src={item.image}
                    alt={item.title || `Casino image ${index + 1}`}
                    fill
                    className="gallery-item-image"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="gallery-item-overlay">
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                          <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="gallery-item-caption">
                      <h3 className="text-sm font-medium truncate">{item.title || ''}</h3>
                      <p className="text-xs text-gray-300 mt-1">Click to enlarge</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No gallery images available for this casino.</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Check back later for visual updates.</p>
        </div>
      )}
      
      {/* Lightbox component */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={gallerySlides as any}
        plugins={[Zoom, Captions, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
          descriptionMaxLines: 3,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          gap: 16,
          padding: 4,
          showToggle: true,
        }}
      />
    </>
  );
}; 