"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  slides: SlideData[];
}

const Slide = ({ slide, index, current, handleSlideClick, slides }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  const isActive = current === index;
  const isPrev = (index === current - 1) || (current === 0 && index === slides.length - 1);
  const isNext = (index === current + 1) || (current === slides.length - 1 && index === 0);

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d] w-screen">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-500 ease-out w-screen h-[500px] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] overflow-hidden transition-all duration-700 ease-out"
          style={{
            transform: isActive
              ? "translate3d(calc(var(--x) / 25), calc(var(--y) / 25), 0)"
              : "none",
            boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              opacity: isActive ? 1 : 0.4,
              transform: isActive 
                ? "scale(1.05)" 
                : isPrev 
                  ? "scale(1.1) translateX(-5%)" 
                  : isNext 
                    ? "scale(1.1) translateX(5%)" 
                    : "scale(1)",
              filter: isActive ? "brightness(1)" : "brightness(0.5) blur(2px)",
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-1000" />
          )}
        </div>

        <article
          className="relative w-full transition-all duration-700 ease-out flex flex-col items-center justify-center"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(30px)",
            pointerEvents: isActive ? "auto" : "none"
          }}
        >
          <h2 
            className="text-2xl md:text-3xl lg:text-5xl font-semibold mb-4 relative"
            style={{
              textShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
            }}
          >
            {title}
          </h2>
          <div className="flex justify-center">
            <button 
              className="px-6 py-3 w-fit mx-auto text-sm text-black bg-white h-12 border border-transparent flex justify-center items-center rounded-full hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.2)]"
            >
              {button}
            </button>
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
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePreviousClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleNextClick = () => {
    if (isAnimating) return;
    
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

  const id = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePreviousClick();
      if (e.key === 'ArrowRight') handleNextClick();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, isAnimating]);

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <div className="absolute w-full h-full">
        {slides.map((slide, index) => (
          <div 
            key={index}
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
            />
          </div>
        ))}
      </div>

      <div className="absolute flex justify-center w-full bottom-6 z-10">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <div className="flex items-center mx-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                current === index 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
