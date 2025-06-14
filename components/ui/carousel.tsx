"use client";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState, useRef, useId, useEffect, useMemo } from "react";
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { components } from "../mdx-components";
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Link from "next/link";

interface SlideData {
  title: string;
  button: string;
  button2?: string;
  src: string;
  url?: string;
  url2?: string;
  excerpt?: any;
  start_date?: string;
  end_date?: string;
  affiliate_url?: string;
  actions?: Array<{
    label: string;
    type: string;
    icon: boolean;
    link: string;
  }>;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  slides: SlideData[];
  showTitles?: boolean;
}

const Slide = ({ slide, index, current, handleSlideClick, slides, showTitles = true }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, button2, title, url, url2, excerpt, actions } = slide;

  // Map legacy URLs to actions if actions aren't present
  const displayActions = actions || [
    ...(url ? [{ label: button || "Learn More", type: "button", icon: false, link: url }] : []),
    ...(url2 ? [{ label: button2 || "View Details", type: "link", icon: false, link: url2 }] : [])
  ];

  const isActive = current === index;
  const isPrev = (index === current - 1) || (current === 0 && index === slides.length - 1);
  const isNext = (index === current + 1) || (current === slides.length - 1 && index === 0);

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d] w-screen">
      <li
        key={`admin-slide-${index}`}
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-500 ease-out w-screen  object-fill  aspect-[3/2] max-h-[800px] z-10"
        onClick={() => handleSlideClick(index)}
        style={{
          transform:
            current !== index
              ? "scale(0.95) rotateY(6deg)"
              : "scale(1) rotateY(0deg)",
          transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          transformOrigin: "center",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-green-600 overflow-hidden transition-all duration-700 ease-out"
        >
          <div className="relative w-full h-full">
            <img
              className="absolute inset-0 w-full h-full object-fill  aspect-[3/2] transition-all duration-700 ease-out"
              style={{
                opacity: isActive ? 1 : 0.4,
                transform: isActive 
                  ? "scale(1.02)" 
                  : isPrev 
                    ? "scale(1.1) translateX(-5%)" 
                    : isNext 
                      ? "scale(1.1) translateX(5%)" 
                      : "scale(1)",
                filter: isActive ? "brightness(1)" : "brightness(0.7) blur(2px)",
                
              }}
              alt={title ? `Carousel Slide - ${title}` : 'Carousel Slide'}
              src={src}
              onLoad={imageLoaded}
              loading="eager"
              decoding="sync"
            />
          </div>
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-all duration-1000" />
          )}
        </div>

        <article
          className="relative w-full transition-all duration-700 ease-out flex flex-col items-center justify-end px-4 md:px-6 max-w-3xl mx-auto mt-auto pb-10 md:pb-28"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(30px)",
            pointerEvents: isActive ? "auto" : "none"
          }}
        >
   
          
          {/* <div className="">
            {excerpt ? (
              <div className="text-white mb-2 md:mb-8 text-sm md:text-lg lg:text-2xl bg-black/60 p-2 md:p-4 rounded-2xl max-w-3xl">
                <TinaMarkdown content={excerpt} />
              </div>
            ) : (
              <div className="prose dark:prose-dark text-white mb-2 md:mb-8 text-base md:text-lg lg:text-2xl bg-black/70 p-2 md:p-4 rounded-lg max-w-3xl">
                <TinaMarkdown
                  content={excerpt}
                  components={{
                    ...components,
                  }}
                />
              </div>
            )}
          </div> */}
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-2 md:mt-6 text-gray-500">
            {displayActions.length > 0 && displayActions.map((action, actionIndex) => (
              <a 
                key={actionIndex}
                href={action.link}
                target={action.link.startsWith('http') ? "_blank" : undefined}
                rel={action.link.startsWith('http') ? "noopener noreferrer" : undefined}
                className="p-4 md:p-7 mx-2 md:mx-4 w-fit text-green-600 bg-white h-9 md:h-12 border-2 border-green-700 flex justify-center items-center rounded-2xl hover:bg-green-600 hover:text-white hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.4)]"
              >
                <span className="flex items-center font-bold text-xs md:text-sm lg:text-xl">
                  {action.label}
                  {action.icon && (
                    <span className="ml-2 transition-transform duration-300">
                      <HiOutlineArrowNarrowRight className="font-thin text-sm transform group-hover:translate-x-1 transition-transform duration-300 opacity-60 group-hover:opacity-100" />
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`absolute top-0 ${
        type === "previous" ? "left-0" : "right-0"
      } h-full w-8 sm:w-12 md:w-24 flex items-center justify-center bg-black/1 hover:bg-black/30 transition-all duration-300 z-20 focus:outline-none`}
      title={title}
      onClick={handleClick}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full bg-black/1 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300">
        <MdKeyboardArrowRight
          className={`text-white text-2xl sm:text-3xl md:text-5xl opacity-60 hover:opacity-100 transition-opacity duration-300 ${
            type === "previous" ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  autoPlay?: boolean;
  showTitles?: boolean;
}

export function Carousel({ slides: allSlides, autoPlay = false, showTitles = true }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);
  const id = useId();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter slides based on date range
  const slides = useMemo(() => {
    const now = new Date();
    return allSlides.filter(slide => {
      if (!slide.start_date && !slide.end_date) return true;
      
      const startDate = slide.start_date ? new Date(slide.start_date) : new Date(0);
      const endDate = slide.end_date ? new Date(slide.end_date) : new Date(8640000000000000); // Max date
      
      return startDate <= now && now <= endDate;
    });
  }, [allSlides]);

  const handlePreviousClick = () => {
    if (isAnimating || slides.length === 0) return;
    
    setIsAnimating(true);
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleNextClick = () => {
    if (isAnimating || slides.length === 0) return;
    
    setIsAnimating(true);
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index && !isAnimating) {
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slides.length === 0) return;
      if (e.key === 'ArrowLeft') handlePreviousClick();
      if (e.key === 'ArrowRight') handleNextClick();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, isAnimating, slides.length]);

  // Autoplay effect
  useEffect(() => {
    if (autoPlay && !isAnimating && slides.length > 0) {
      autoPlayInterval.current = setInterval(() => {
        handleNextClick();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
        autoPlayInterval.current = null;
      }
    };
  }, [autoPlay, isAnimating, current, slides.length]);

  // If no valid slides after filtering, show nothing
  if (slides.length === 0) {
    return (
      <div className="w-full aspect-video max-h-[200px] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">No active sliders available</span>
      </div>
    );
  }

  return (
    <div role="region" className="carousel relative w-full aspect-video max-h-[700px] bg-[#1D1F2F]" aria-roledescription="carousel" aria-label="Gallery">
      {slides.length > 1 && isClient && (
        <>
          <CarouselControl
            type="previous"
            title="Previous Slide"
            handleClick={handlePreviousClick}
          />
          <CarouselControl
            type="next"
            title="Next Slide"
            handleClick={handleNextClick}
          />
        </>
      )}
      <div className="absolute w-full h-full">

        {slides.map((slide, index) => (
          <Link 
            key={`slide-link-${index}`}
            rel="stylesheet" 
            href={slide.affiliate_url || ''} 
            target="_self" 
            className="no-underline cursor-pointer"
          >
            <div 
              className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-out"
              style={{
                transform: `translateX(${(index - current) * 100}%)`,
                zIndex: index === current ? 1 : 0,
                opacity: Math.abs(index - current) > 1 ? 0 : 1
              }}
            >
              <Slide
                slide={slide}
                index={index}
                current={current}
                handleSlideClick={handleSlideClick}
                slides={slides}
                showTitles={showTitles}
              />
            </div>
          </Link>
        ))}
     

      </div>

      <div className="absolute flex justify-center w-full bottom-2 sm:bottom-4 md:bottom-6 z-10">
        <div className="flex items-center px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-black/30 backdrop-blur-sm">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mx-0.5 sm:mx-1 rounded-full transition-all duration-300 ${
                current === index 
                  ? "bg-white w-3 sm:w-4 md:w-6" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
