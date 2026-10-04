"use client";

import { useEffect, useRef, useState } from "react";

const journey = [
  { progress: 0, x: 800, y: 450, width: 1600 },
  { progress: 0.17, x: 800, y: 425, width: 690 },
  { progress: 0.38, x: 800, y: 515, width: 440 },
  { progress: 0.61, x: 1040, y: 270, width: 230 },
  { progress: 0.8, x: 1100, y: 292, width: 190 },
  { progress: 0.92, x: 1120, y: 315, width: 180 },
  { progress: 1, x: 1120, y: 315, width: 180 },
];

const chapters = [
  {
    progress: 0,
    title: "A quiet night at home",
    description: "Somewhere between the day and the stars.",
  },
  {
    progress: 0.17,
    title: "Beyond the window",
    description: "The world feels a little bigger from here.",
  },
  {
    progress: 0.38,
    title: "Across the mountains",
    description: "Following the silver edge of the night.",
  },
  {
    progress: 0.61,
    title: "A moonlit passage",
    description: "A familiar light, seen from a new distance.",
  },
  {
    progress: 0.8,
    title: "Into the quiet",
    description: "An unexpected silhouette crosses the stars.",
  },
  {
    progress: 0.92,
    title: "The International Space Station",
    description: "A human home, moving silently above the Earth.",
  },
];

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export default function HorizonHeroSection() {
  const storyRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    let frame = 0;
    let currentChapter = -1;

    const updateScene = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const story = storyRef.current;
        const scene = sceneRef.current;
        if (!story || !scene) return;

        const bounds = story.getBoundingClientRect();
        const scrollableDistance = story.offsetHeight - window.innerHeight;
        const progress =
          scrollableDistance > 0
            ? Math.min(1, Math.max(0, -bounds.top / scrollableDistance))
            : 0;

        let segmentIndex = journey.findIndex(
          (stop) => stop.progress >= progress,
        );
        if (segmentIndex < 1) segmentIndex = 1;

        const start = journey[segmentIndex - 1];
        const end = journey[segmentIndex];
        const segmentProgress =
          (progress - start.progress) / (end.progress - start.progress);
        const amount = smoothStep(Math.min(1, Math.max(0, segmentProgress)));
        const centerX = start.x + (end.x - start.x) * amount;
        const centerY = start.y + (end.y - start.y) * amount;
        const width = start.width + (end.width - start.width) * amount;
        const height = width * (900 / 1600);
        progressRef.current?.style.setProperty(
          "transform",
          `scaleX(${progress})`,
        );

        scene.setAttribute(
          "viewBox",
          `${centerX - width / 2} ${centerY - height / 2} ${width} ${height}`,
        );

        const chapterIndex = chapters.findLastIndex(
          (stop) => progress >= stop.progress,
        );

        if (chapterIndex !== currentChapter) {
          currentChapter = chapterIndex;
          setActiveChapter(chapterIndex);
        }
      });
    };

    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("resize", updateScene);
    updateScene();

    return () => {
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("resize", updateScene);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="bg-[#070b14] text-white">
      <section
        ref={storyRef}
        aria-label="A journey from a room on Earth to the International Space Station"
        className="relative h-[700svh]"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <svg
            ref={sceneRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="room-wall" x2="0" y2="1">
                <stop stopColor="#252535" />
                <stop offset="1" stopColor="#111522" />
              </linearGradient>
              <linearGradient id="night-sky" x2="0" y2="1">
                <stop stopColor="#071024" />
                <stop offset="0.56" stopColor="#172b4e" />
                <stop offset="1" stopColor="#b27680" />
              </linearGradient>
              <linearGradient id="window-glass" x2="1" y2="1">
                <stop stopColor="#9ad4ff" stopOpacity="0.12" />
                <stop offset="0.48" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#b9d7ff" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="mountain-back" x2="0" y2="1">
                <stop stopColor="#9aaac2" />
                <stop offset="1" stopColor="#566a88" />
              </linearGradient>
              <linearGradient id="mountain-front" x2="0" y2="1">
                <stop stopColor="#586a85" />
                <stop offset="1" stopColor="#29384e" />
              </linearGradient>
              <linearGradient id="wood-frame" x2="1" y2="1">
                <stop stopColor="#8b624b" />
                <stop offset="0.5" stopColor="#503b35" />
                <stop offset="1" stopColor="#30282b" />
              </linearGradient>
              <radialGradient id="moon-glow">
                <stop stopColor="#fff8dc" stopOpacity="0.55" />
                <stop offset="0.42" stopColor="#f7e7b2" stopOpacity="0.16" />
                <stop offset="1" stopColor="#f7e7b2" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="moon-surface" cx="35%" cy="30%">
                <stop stopColor="#fffbea" />
                <stop offset=".68" stopColor="#e7e0cb" />
                <stop offset="1" stopColor="#aaa79f" />
              </radialGradient>
              <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <clipPath id="window-opening">
                <rect x="408" y="130" width="784" height="594" rx="4" />
              </clipPath>
              <pattern id="stars" width="180" height="140" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="22" r="1.4" fill="#fff" opacity=".78" />
                <circle cx="88" cy="17" r="1" fill="#cde3ff" opacity=".66" />
                <circle cx="150" cy="52" r="1.6" fill="#fff" opacity=".82" />
                <circle cx="44" cy="84" r="1" fill="#fff" opacity=".62" />
                <circle cx="123" cy="111" r="1.2" fill="#d9e8ff" opacity=".7" />
                <circle cx="171" cy="126" r=".8" fill="#fff" opacity=".76" />
                <circle cx="69" cy="132" r=".8" fill="#fff" opacity=".55" />
              </pattern>
            </defs>

            <rect width="1600" height="900" fill="#060a13" />
            <rect width="1600" height="900" fill="url(#room-wall)" />
            <path d="M0 0h1600v48H0z" fill="#090d17" opacity=".75" />
            <path d="M0 0h38v900H0zM1562 0h38v900h-38z" fill="#090d17" opacity=".7" />

            <g clipPath="url(#window-opening)">
              <rect x="408" y="130" width="784" height="594" fill="url(#night-sky)" />
              <rect x="408" y="130" width="784" height="450" fill="url(#stars)" />

              <ellipse cx="788" cy="378" rx="355" ry="48" fill="#e4b4be" opacity=".08" filter="url(#soft-glow)" />
              <path d="M420 524q116-39 243-8t235 0q143-30 275 11" fill="none" stroke="#f2bdc4" strokeWidth="26" opacity=".09" filter="url(#soft-glow)" />

              <circle cx="1043" cy="269" r="144" fill="url(#moon-glow)" />
              <circle cx="1043" cy="269" r="56" fill="url(#moon-surface)" />
              <path d="M1047 213a56 56 0 0 1 37 86 51 51 0 0 0-37-86" fill="#817f7b" opacity=".12" />
              <circle cx="1024" cy="251" r="8" fill="#bdb7a5" opacity=".32" />
              <circle cx="1060" cy="280" r="12" fill="#bdb7a5" opacity=".24" />
              <circle cx="1038" cy="294" r="5" fill="#aaa493" opacity=".32" />
              <circle cx="1060" cy="244" r="4" fill="#aaa493" opacity=".26" />
              <circle cx="1011" cy="276" r="3" fill="#aaa493" opacity=".3" />

              <path
                d="M390 565 515 406l66 81 103-164 66 97 115-197 94 147 70-81 83 125 92-96 112 148v300H390z"
                fill="url(#mountain-back)"
              />
              <path
                d="m684 323 66 97-39-20-25 30-17-44-30 7zm66-100 94 147-54-37-22 25-35-44-38 24-28-15zm185 66 70 105-42-20-19 22-22-31-29 8-20-18z"
                fill="#e6edf3"
                opacity=".86"
              />
              <path
                d="M370 596 516 480l83 68 102-100 84 91 136-121 105 107 106-92 86 78v223H370z"
                fill="url(#mountain-front)"
              />
              <path
                d="m516 480 83 68-29-7-24 20-30-26-29 13zm287-32 118-103 105 107-37-17-26 21-36-30-33 20-28-29zm297 23 86-75 86 78-43-9-22 17-36-20-30 17z"
                fill="#a9b8ce"
                opacity=".54"
              />
              <path
                d="M408 620q125-35 230 17t218 0q126-42 336 11v110H408z"
                fill="#25394a"
              />
              <path
                d="M400 660q140-35 276 10t236 1q135-32 310 7v58H400z"
                fill="#172b32"
              />
              <rect x="408" y="130" width="784" height="594" fill="url(#window-glass)" />

              <g transform="translate(1120 315) scale(.42)" stroke="#e7edf2" strokeLinecap="round" strokeLinejoin="round">
                <g fill="#6d9cb8" stroke="#d5e7f2" strokeWidth="3">
                  <path d="M-73-13h-41v26h41zM114-13h41v26h-41z" />
                  <path d="M-67-13v26m12-26v26m12-26v26m12-26v26M122-13v26m12-26v26m12-26v26m12-26v26" strokeWidth="1.4" />
                </g>
                <g fill="none" strokeWidth="5">
                  <path d="M-73 0h25l17-12h53l20 12h72" />
                  <path d="M-26-12-8-28h39l18 16M-26 12-8 28h39l18-16" />
                  <path d="M-8-28v56m39-56v56M-48 0h96" strokeWidth="3" />
                </g>
                <g fill="#f0eee7" strokeWidth="2">
                  <rect x="-9" y="-9" width="20" height="18" rx="5" />
                  <circle cx="22" cy="0" r="8" />
                  <path d="M-36-5h18v10h-18z" />
                </g>
                <path d="M-8-28v56m39-56v56M-35-5h17m-17 10h17" fill="none" stroke="#9cb4c2" strokeWidth="1" opacity=".8" />
                <path d="M-140-16h28m286 32h28" fill="none" stroke="#fff" strokeWidth="1" opacity=".48" />
                <path d="M-112 0h-19m286 0h19" strokeWidth="2" opacity=".8" />
                <circle r="92" fill="none" stroke="#fff" strokeWidth="1" opacity=".22" />
              </g>
            </g>

            <rect x="378" y="100" width="844" height="36" rx="7" fill="url(#wood-frame)" />
            <rect x="378" y="100" width="844" height="8" rx="4" fill="#d3a17d" opacity=".4" />
            <rect x="378" y="724" width="844" height="36" rx="5" fill="url(#wood-frame)" />
            <rect x="378" y="752" width="844" height="14" rx="4" fill="#201b20" />
            <rect x="378" y="100" width="30" height="660" rx="5" fill="url(#wood-frame)" />
            <rect x="1192" y="100" width="30" height="660" rx="5" fill="url(#wood-frame)" />
            <rect x="787" y="130" width="25" height="594" fill="url(#wood-frame)" />
            <rect x="408" y="422" width="784" height="23" fill="url(#wood-frame)" />

            <path d="M365 100h13v660h-13zM1222 100h13v660h-13z" fill="#17151b" />
            <path d="M340 85q65 40 65 132v400q-20 94-65 142z" fill="#262130" opacity=".9" />
            <path d="M1260 85q-65 40-65 132v400q20 94 65 142z" fill="#262130" opacity=".9" />
            <path d="M352 92q37 98 17 227v270q20 107-17 159" fill="none" stroke="#88717e" strokeWidth="4" opacity=".32" />
            <path d="M1248 92q-37 98-17 227v270q-20 107 17 159" fill="none" stroke="#88717e" strokeWidth="4" opacity=".32" />

            <path d="M0 793q225-68 454 9v98H0z" fill="#10131d" />
            <path d="M1150 787q244-64 450 3v110h-450z" fill="#10131d" />
            <path d="M0 882h1600v18H0z" fill="#080b12" />
            <path d="M88 791v-99h15v99m-28-68h40m-37-15h35" fill="none" stroke="#24392f" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="96" cy="706" rx="48" ry="20" fill="#263c31" />
            <ellipse cx="70" cy="683" rx="32" ry="16" transform="rotate(-32 70 683)" fill="#304b3c" />
            <ellipse cx="119" cy="672" rx="34" ry="17" transform="rotate(28 119 672)" fill="#344f3d" />
            <path d="M80 809h52l-7 56H87z" fill="#604c44" />
            <rect x="1340" y="768" width="156" height="17" rx="5" fill="#564238" />
            <path d="M1355 785v90m126-90v90" stroke="#322923" strokeWidth="12" />
            <path d="M1370 747q24-39 48 0m-48 0h48l-8 21h-32z" fill="#d3a16c" opacity=".8" />
            <ellipse cx="1394" cy="767" rx="77" ry="50" fill="#d3a16c" opacity=".12" filter="url(#soft-glow)" />
            <path d="M1314 731q44-29 84 0m-84 14q43-26 86 0" fill="none" stroke="#72594b" strokeWidth="7" strokeLinecap="round" />
          </svg>

          <div aria-hidden="true" className="cinema-vignette pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="cinema-grain pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[5vh] bg-black/80" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[5vh] bg-black/80" />

          <div className="pointer-events-none absolute left-6 top-[7vh] flex items-center gap-3 sm:left-12">
            <span className="h-px w-7 bg-amber-200/70" />
            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
              Horizon Pictures <span className="px-1.5 text-amber-100/70">/</span> No. 01
            </span>
          </div>

          <div
            key={activeChapter}
            className="cinema-caption pointer-events-none absolute bottom-[11vh] left-6 max-w-[min(28rem,78vw)] sm:left-12 sm:bottom-[12vh]"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[10px] font-medium tabular-nums tracking-[0.24em] text-amber-100/80">
                {String(activeChapter + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-amber-100/55" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                {String(chapters.length).padStart(2, "0")} scenes
              </span>
            </div>
            <h1 className="font-serif text-2xl font-medium tracking-wide text-white drop-shadow-lg sm:text-4xl">
              {chapters[activeChapter].title}
            </h1>
            <p className="mt-2 text-xs tracking-wide text-white/70 drop-shadow sm:text-sm">
              {chapters[activeChapter].description}
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-[7vh] right-6 flex items-center gap-3 sm:right-12">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">
              {activeChapter === chapters.length - 1 ? "Arrival" : "Scroll to continue"}
            </span>
            <span className="h-5 w-3 rounded-full border border-white/45 p-[3px]">
              <span className="block h-1 w-full animate-bounce rounded-full bg-amber-100/80" />
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-white/15">
            <div
              ref={progressRef}
              className="h-full origin-left bg-gradient-to-r from-amber-100 via-white to-cyan-100 shadow-[0_0_12px_rgba(255,241,200,0.8)]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </section>

      <div className="flex min-h-[70svh] flex-col items-center justify-center bg-[#070b14] px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
          A little closer to the extraordinary
        </p>
        <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          The view is only the beginning.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
          From a quiet room on Earth to a home among the stars, there is always
          another horizon waiting to be explored.
        </p>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-9 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
        >
          Take the journey again
        </a>
      </div>
    </main>
  );
}
