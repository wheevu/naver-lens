import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 rotate-180">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.667 13l5-5-5-5"
    ></path>
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.667 13l5-5-5-5"
    ></path>
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
    <path
      fillRule="evenodd"
      d="M7.084 4.375c.69 0 1.25.56 1.25 1.25v8.75a1.25 1.25 0 11-2.5 0v-8.75c0-.69.56-1.25 1.25-1.25zm5.834 0c.69 0 1.25.56 1.25 1.25v8.75a1.25 1.25 0 01-2.5 0v-8.75c0-.69.56-1.25 1.25-1.25z"
      clipRule="evenodd"
    />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
    <path
      fillRule="evenodd"
      d="M14.921 8.724c.944.59.944 1.964 0 2.554l-6.808 4.256a1.506 1.506 0 01-2.304-1.278v-8.51a1.506 1.506 0 012.304-1.278l6.809 4.256z"
      clipRule="evenodd"
    />
  </svg>
);

const slidesData = [
  {
    id: 1,
    imageUrl: "https://placehold.co/540x256/000000/FFFFFF?text=MacBook+Pro",
    title: "MacBook Pro",
    subtitle: "M5 칩 탑재 지금 사전예약 하세요",
    alt: "MacBook Pro M5 론칭",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/540x256/BF3A3A/FFFFFF?text=Pepero+Event",
    title: "지금배달 빼스티벌",
    subtitle: "빼빼로 선물 준비 끝",
    alt: "지금배달 빼스티벌",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/540x256/4A00E0/FFFFFF?text=Kurly+Event",
    title: "컬리N마트",
    subtitle: "수능 대박 기원",
    alt: "컬리N마트 수능 대박 기원",
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/540x256/1a1a1a/FFFFFF?text=Fashion+Event",
    title: "네이버 패션",
    subtitle: "블랙프라이데이",
    alt: "네이버 패션 블랙프라이데이",
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/540x256/03C75A/FFFFFF?text=Naver+Event",
    title: "Special Event",
    subtitle: "Naver Special",
    alt: "Naver Event",
  },
];

const EventCarousel = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, containScroll: "trimSnaps" },
    [Autoplay({ delay: 4000, stopOnInteraction: false, playOnInit: true })]
  );

  const updateProgress = useCallback(() => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();
    const progress = Math.max(0, Math.min(1, scrollProgress));
    setProgress(progress * 100);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", updateProgress);
    emblaApi.on("reInit", updateProgress);
    updateProgress();
    const autoplay = emblaApi.plugins().autoplay;
    if (autoplay) setIsPlaying(autoplay.isPlaying());
    return () => {
      emblaApi.off("scroll", updateProgress);
      emblaApi.off("reInit", updateProgress);
    };
  }, [emblaApi, updateProgress]);

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex max-w-7xl mx-auto px-4">
          {slidesData.map((slide) => (
            <div
              className="shrink-0 grow-0"
              style={{ flexBasis: "552px" }}
              key={slide.id}
            >
              <div className="px-1.5 h-full">
                <div
                  className="relative h-64 rounded-xl overflow-hidden"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-[45px] left-[26px] w-[320px]">
                    <h2
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-secondary)" }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className="text-lg text-white/90 mt-1.5"
                      style={{ fontFamily: "var(--font-secondary)" }}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center mt-4 h-5">
          <div className="grow h-0.5 bg-gray-600 relative">
            <div
              className="absolute top-0 left-0 h-0.5"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--naver-green)",
                transition: "width 0.1s ease-out",
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 ml-4">
            <div
              className="flex items-center gap-1 p-1"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <button
                onClick={scrollPrev}
                className="p-1 text-(--text-primary) opacity-70 hover:opacity-100 transition-colors"
                aria-label={t("home.carousel.prev")}
              >
                <ChevronLeftIcon />
              </button>
              <div className="h-3 w-px bg-white/40"></div>
              <button
                onClick={scrollNext}
                className="p-1 text-(--text-primary) opacity-70 hover:opacity-100 transition-colors"
                aria-label={t("home.carousel.next")}
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div
              className="p-1"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <button
                onClick={toggleAutoplay}
                className="p-1 text-(--text-primary) opacity-70 hover:opacity-100 transition-colors"
                aria-label={
                  isPlaying ? t("home.carousel.pause") : t("home.carousel.play")
                }
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;
