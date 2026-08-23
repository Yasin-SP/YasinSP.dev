import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { smoothEase } from "../constants/theme.js";
import { useTheme } from "../context/ThemeContext.jsx";
import photoDark from "../assets/yasin-dark.webp";
import photoLight from "../assets/yasin-light.webp";

/* ============================================================
   بلاب مورف‌شونده - اسکیل و شفافیتش وابسته به موقعیت خودشه
   و شدتش بر اساس تم فعلی تنظیم می‌شه
   ============================================================ */
function MorphBlob({ sizeClass, positionClass, gradient, rotateDuration, morphDuration, delay = 0, isLight, visibilityClass = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const peak = isLight ? 0.12 : 0.4;
  const base = isLight ? 0.04 : 0.15;

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [base, peak, peak, base]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className={`absolute ${sizeClass} ${positionClass} ${visibilityClass}`}>
      <motion.div
        className="w-full h-full"
        style={{
          backgroundImage: gradient,
          boxShadow: "var(--shadow-glow-soft)",
          scale,
          opacity,
          y,
        }}
        animate={{
          rotate: [15, 375],
          borderRadius: [
            "60% 40% 30% 70% / 40% 50% 60% 30%",
            "30% 60% 70% 40% / 50% 30% 60% 40%",
            "50% 30% 60% 40% / 30% 60% 40% 50%",
            "60% 40% 30% 70% / 40% 50% 60% 30%",
          ],
        }}
        transition={{
          rotate: { duration: rotateDuration, ease: "linear", repeat: Infinity, delay },
          borderRadius: { duration: morphDuration, ease: "easeInOut", repeat: Infinity, delay },
        }}
      />
    </div>
  );
}

/* ============================================================
   پرتوی نورانی عمودی - فقط دسکتاپ بزرگ (lg به بالا)
   ============================================================ */
function ProgressBeam({ scrollYProgress, isLight }) {
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const peakOpacity = isLight ? 0.25 : 0.5;
  const beamOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, peakOpacity, peakOpacity, 0]
  );

  return (
    <div className="absolute left-3 md:left-6 top-0 bottom-0 w-px hidden lg:block">
      <motion.div
        className="absolute inset-0 w-full"
        style={{
          background: `linear-gradient(to bottom, transparent, var(--color-purple-1), transparent)`,
          opacity: beamOpacity,
        }}
      />
      <motion.div
        className="absolute w-2 h-2 -left-[3.5px] rounded-full"
        style={{
          top: dotTop,
          backgroundImage: "linear-gradient(135deg, var(--color-purple-1), var(--color-purple-2))",
          boxShadow: "var(--shadow-glow-strong)",
        }}
      />
    </div>
  );
}

/* ============================================================
   نور محیطی بسیار آروم و مستقل از اسکرول
   ============================================================ */
function AuroraSweep({ isLight }) {
  const alpha = isLight ? 0.06 : 0.18;

  return (
    <motion.div
      className="absolute hidden md:block w-[700px] h-[700px] lg:w-[900px] lg:h-[900px] rounded-full blur-[110px] lg:blur-[160px]"
      style={{
        background: `radial-gradient(circle, rgba(147,51,234,${alpha}), transparent 65%)`,
      }}
      animate={{
        top: ["10%", "55%", "20%", "70%", "10%"],
        left: ["-15%", "50%", "80%", "20%", "-15%"],
      }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ============================================================
   درخشش پایانی - فقط نزدیک انتهای صفحه
   ============================================================ */
function FinaleGlow({ scrollYProgress, isLight }) {
  const peak = isLight ? 0.15 : 0.4;
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, peak]);
  const scale = useTransform(scrollYProgress, [0.85, 1], [0.6, 1]);

  return (
    <motion.div
      className="absolute hidden sm:block bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[250px] lg:w-[500px] lg:h-[300px] rounded-full blur-[80px] lg:blur-[100px]"
      style={{
        background: "radial-gradient(circle, rgba(147,51,234,0.5), transparent 70%)",
        opacity,
        scale,
      }}
    />
  );
}

/* ============================================================
   عکس پروفایل - فوری و بدون انیمیشن، هم‌زمان با تغییر تم عوض می‌شه
   لبه‌هاش با یه ماسک گرادیانتی محو می‌شه تا با پس‌زمینه یکی بشه
   ============================================================ */
function ThemedPhoto({ theme, className = "" }) {
  const src = theme === "light" ? photoLight : photoDark;

  return (
    <img
      key={theme}
      src={src}
      alt="Profile"
      className={`w-full h-full object-cover object-top ${className}`}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 78% at 50% 42%, black 58%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 80% 78% at 50% 42%, black 58%, transparent 100%)",
      }}
    />
  );
}

/* ============================================================
   نسخه‌ی دسکتاپ ناحیه‌ی هیرو - فقط از lg به بالا نمایش داده می‌شه
   ============================================================ */
function HeroVisualDesktop({ isLight, theme }) {
  return (
    <div className="hidden lg:block relative w-full h-full max-w-7xl mx-auto px-6 md:px-12">
      <div className="relative w-full h-130">
        <div
          className="absolute w-[560px] h-[560px] top-[80%] right-[-240px]"
          style={{ transform: "translateY(-50%)" }}
        >
          <motion.div
            className="w-full h-full"
            style={{
              backgroundImage: "linear-gradient(135deg, #a855f7, #6b21a8 45%, #3b0764)",
              boxShadow: "var(--shadow-glow-soft)",
              opacity: isLight ? 0.55 : 1,
            }}
            initial={{
              x: 200,
              opacity: 0,
              rotate: 20,
              borderRadius: "60% 40% 30% 70% / 40% 50% 60% 30%",
            }}
            animate={{
              x: 0,
              opacity: isLight ? 0.55 : 1,
              rotate: [35, 395],
              borderRadius: [
                "60% 40% 30% 70% / 40% 50% 60% 30%",
                "30% 60% 70% 40% / 50% 30% 60% 40%",
                "50% 30% 60% 40% / 30% 60% 40% 50%",
                "60% 40% 30% 70% / 40% 50% 60% 30%",
              ],
            }}
            transition={{
              x: { duration: 1, ease: smoothEase, delay: 0.2 },
              opacity: { duration: 1, ease: smoothEase, delay: 0.2 },
              rotate: { duration: 22, ease: "linear", repeat: Infinity, delay: 0.2 },
              borderRadius: { duration: 10, ease: "easeInOut", repeat: Infinity, delay: 0.2 },
            }}
          />
        </div>

        <motion.div
          className="absolute z-20 rounded-3xl overflow-hidden w-[300px] h-[300px] top-1/2 right-[10%]"
          style={{
            transform: "translateY(-50%)",
            backgroundColor: "var(--color-bg)",
            boxShadow: "var(--shadow-glow-strong), 0 25px 60px rgba(0,0,0,0.35)",
            border: "1px solid var(--color-border-strong)",
          }}
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase, delay: 0.7 }}
        >
          <ThemedPhoto theme={theme} />
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   نسخه‌ی موبایل + تبلت - آواتار گرد با حلقه‌ی گرادیانت
   ============================================================ */
function Background() {
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="relative w-full h-screen flex items-center">
        <HeroVisualDesktop isLight={isLight} theme={theme} />
      </div>

      <AuroraSweep isLight={isLight} />
      <ProgressBeam scrollYProgress={scrollYProgress} isLight={isLight} />

      <MorphBlob
        sizeClass="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] md:w-[340px] md:h-[340px]"
        positionClass="top-[40%] left-[-90px] sm:left-[-130px] md:left-[-160px]"
        gradient="linear-gradient(135deg, #6b21a8, #3b0764)"
        rotateDuration={28}
        morphDuration={12}
        isLight={isLight}
        visibilityClass="hidden md:block"
      />
      <MorphBlob
        sizeClass="w-[150px] h-[150px] sm:w-[210px] sm:h-[210px] md:w-[270px] md:h-[270px]"
        positionClass="top-[75%] right-[-70px] sm:right-[-100px] md:right-[-120px]"
        gradient="linear-gradient(135deg, #7e22ce, #4c1d95)"
        rotateDuration={22}
        morphDuration={10}
        delay={0.1}
        isLight={isLight}
        visibilityClass="hidden md:block"
      />

      <FinaleGlow scrollYProgress={scrollYProgress} isLight={isLight} />
    </div>
  );
}

export default Background;
