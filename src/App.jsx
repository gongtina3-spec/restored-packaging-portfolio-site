import React, { useEffect, useRef, useState } from 'react';
import BorderGlow from './BorderGlow';
import {
  beautyAllGroups,
  beautyAllImages,
  beautyShowcase,
  introduceInfo,
  siteInfo,
  strengths,
  wineAllImages,
  wineShowcase,
} from './portfolioData';

const Grainient = React.lazy(() => import('./Grainient'));

const USE_IP_HERO_TRIAL = true;
const COMPACT_VIEW_QUERY = '(max-width: 980px)';
const MOBILE_BEAUTY_ITEMS_PER_GROUP = 4;
const MOBILE_WINE_ARCHIVE_COUNT = 10;

function getCompactViewport() {
  return typeof window !== 'undefined' && window.matchMedia?.(COMPACT_VIEW_QUERY).matches;
}

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(getCompactViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(COMPACT_VIEW_QUERY);
    if (!mediaQuery) return undefined;

    const handleChange = () => setIsCompact(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleChange);
    };
  }, []);

  return isCompact;
}

const workGlowProps = {
  edgeSensitivity: 24,
  glowColor: '38 70 76',
  backgroundColor: '#f3efe6',
  borderRadius: 8,
  glowRadius: 28,
  glowIntensity: 0.72,
  coneSpread: 21,
  animated: false,
  fillOpacity: 0.24,
  colors: ['#f3dfb0', '#d86b65', '#d8c5aa'],
};

function WorkGlow({ children, className = '', style }) {
  return (
    <BorderGlow className={`work-glow-card ${className}`.trim()} style={style} {...workGlowProps}>
      {children}
    </BorderGlow>
  );
}

function PortfolioImage({ eager = false, ...props }) {
  return (
    <img
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : 'auto'}
      {...props}
    />
  );
}

function DeferredGrainient({ className = '', disabled = false, ...props }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (disabled) {
      setReady(false);
      return undefined;
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduceMotion) return undefined;

    let idleId;
    let timerId;
    let cancelled = false;
    const load = () => {
      if (!cancelled) setReady(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1800 });
    } else {
      timerId = window.setTimeout(load, 900);
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(timerId);
    };
  }, [disabled]);

  if (disabled || !ready) return <div className={className} aria-hidden="true" />;

  return (
    <React.Suspense fallback={<div className={className} aria-hidden="true" />}>
      <Grainient className={className} {...props} />
    </React.Suspense>
  );
}

function usePortfolioMotion(disabled = false) {
  useEffect(() => {
    if (disabled) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const motionSets = [
      ['.section-heading', 'motion-heading'],
      ['.beauty-showcase', 'motion-section'],
      ['.beauty-showcase-head', 'motion-heading'],
      ['.beauty-curated-grid', 'motion-group'],
      ['.beauty-index-row', 'motion-group'],
      ['.beauty-all-head', 'motion-heading'],
      ['.beauty-category', 'motion-section'],
      ['.profile-section', 'motion-section'],
      ['.portrait-panel', 'motion-card'],
      ['.profile-title-block', 'motion-heading'],
      ['.profile-lead-copy', 'motion-item'],
      ['.profile-stat', 'motion-item'],
      ['.profile-info-block', 'motion-item'],
      ['.stat-item', 'motion-item'],
      ['.work-glow-card', 'motion-card'],
      ['.tag-row span', 'motion-chip'],
    ];
    const motionTargets = new Set();

    motionSets.forEach(([selector, className]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add(className);
        element.style.setProperty('--motion-order', index % 14);
        motionTargets.add(element);
      });
    });

    document.querySelectorAll('[data-motion]').forEach((element, index) => {
      element.style.setProperty('--motion-order', index % 14);
      motionTargets.add(element);
    });

    const revealVisibleTargets = () => {
      const viewportHeight = window.innerHeight || 1;
      motionTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.98 && rect.bottom > viewportHeight * -0.08) {
          element.classList.add('is-visible');
        }
      });
    };

    window.requestAnimationFrame(() => {
      revealVisibleTargets();
      document.body.classList.add('motion-ready');
    });

    const visibilityFallback = window.setTimeout(() => {
      motionTargets.forEach((element) => element.classList.add('is-visible'));
    }, 1800);

    if (reduceMotion) {
      motionTargets.forEach((element) => element.classList.add('is-visible'));
      return () => {
        window.clearTimeout(visibilityFallback);
      };
    }

    if (!('IntersectionObserver' in window)) {
      motionTargets.forEach((element) => element.classList.add('is-visible'));
      return () => {
        window.clearTimeout(visibilityFallback);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.18,
      },
    );

    motionTargets.forEach((element) => observer.observe(element));

    return () => {
      window.clearTimeout(visibilityFallback);
      observer.disconnect();
    };
  }, [disabled]);

  useEffect(() => {
    if (disabled) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduceMotion) return undefined;

    const parallaxTargets = Array.from(
      document.querySelectorAll(
        '.beauty-hero-shot img, .beauty-side-shot img, .beauty-mini-shot img, .portrait-photo img, [data-parallax]',
      ),
    );
    if (!parallaxTargets.length) return undefined;

    parallaxTargets.forEach((element) => {
      element.classList.add('parallax-image');
      element.style.setProperty('--parallax-y', '0px');
    });

    let rafId = 0;
    const updateParallax = () => {
      const viewportHeight = window.innerHeight || 1;
      parallaxTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;
        const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const strength = Number.parseFloat(element.dataset.parallax || '12');
        element.style.setProperty('--parallax-y', `${(-progress * strength).toFixed(2)}px`);
      });
      rafId = 0;
    };

    const requestUpdate = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [disabled]);
}

function useTypewriter(text, speed = 24, startDelay = 520) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let index = 0;
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [speed, startDelay, text]);

  return { displayed, done };
}

function App() {
  const heroRef = useRef(null);
  const isCompact = useCompactViewport();
  const visibleBeautyGroups = isCompact
    ? beautyAllGroups.map((group) => ({
        ...group,
        items: group.items.slice(0, MOBILE_BEAUTY_ITEMS_PER_GROUP),
      }))
    : beautyAllGroups;
  const visibleBeautyCount = visibleBeautyGroups.reduce((total, group) => total + group.items.length, 0);
  const visibleWineImages = isCompact ? wineAllImages.slice(0, MOBILE_WINE_ARCHIVE_COUNT) : wineAllImages;
  const { displayed: typedDescription, done: typewriterDone } = useTypewriter(
    siteInfo.heroDescription,
  );
  usePortfolioMotion(isCompact);

  useEffect(() => {
    if (isCompact) return undefined;

    const hero = heroRef.current;
    if (!hero) return undefined;

    let previousX = window.innerWidth / 2;
    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const delta = event.clientX - previousX;
      previousX = event.clientX;

      const currentScrub = Number.parseFloat(hero.style.getPropertyValue('--scrub')) || 0;
      const nextScrub = Math.max(-1, Math.min(1, currentScrub + delta / rect.width));

      hero.style.setProperty('--hero-x', x.toFixed(3));
      hero.style.setProperty('--hero-y', y.toFixed(3));
      hero.style.setProperty('--scrub', nextScrub.toFixed(3));
    };

    const handlePointerLeave = () => {
      hero.style.setProperty('--hero-x', '0.5');
      hero.style.setProperty('--hero-y', '0.5');
      hero.style.setProperty('--scrub', '0');
    };

    hero.addEventListener('pointermove', handlePointerMove);
    hero.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      hero.removeEventListener('pointermove', handlePointerMove);
      hero.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isCompact]);

  return (
    <main className="portfolio-shell">
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#top" aria-label="返回首页">
            <span className="brand-mark">PD</span>
            <span>
              <strong>{siteInfo.brandName}</strong>
              <small>{siteInfo.brandSubline}</small>
            </span>
          </a>
          <nav aria-label="页面导航">
            <a href="#top">About</a>
            <a href="#works">Works</a>
            <a href="#introduce">Introduce</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-motion-field" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="container hero-stage">
          <div className="hero-title-stack">
            <p className="hero-mini-label">{siteInfo.heroKicker}</p>
            <h1 aria-label={siteInfo.heroTitle}>{siteInfo.heroDisplayTitle}</h1>
          </div>

          {USE_IP_HERO_TRIAL ? (
            <figure className="hero-ip-stage" aria-label="个人 IP 形象动态展示">
              <span className="hero-ip-card hero-ip-card-left" aria-hidden="true">
                <em>Beauty</em>
                <strong>Skincare</strong>
              </span>
              <span className="hero-ip-card hero-ip-card-right" aria-hidden="true">
                <em>Gift Box</em>
                <strong>Packaging</strong>
              </span>
              <span className="hero-ip-character-wrap">
                <PortfolioImage eager className="hero-ip-character" src={siteInfo.heroIpImage} alt="个人 IP 形象" />
              </span>
            </figure>
          ) : (
            <figure className="hero-product" aria-label="高端护肤包装动态展示">
              <div className="product-orbit product-orbit-one" />
              <div className="product-orbit product-orbit-two" />
              <div className="product-card product-card-back">
                <span>FORMULA</span>
                <strong>NO. 01</strong>
              </div>
              <div className="product-bottle">
                <span className="bottle-cap" />
                <span className="bottle-label">SKINCARE</span>
              </div>
              <div className="product-box">
                <span>GIFT BOX</span>
                <strong>PACKAGING</strong>
              </div>
              <div className="product-card product-card-front">
                <span>PRINT</span>
                <strong>CMYK</strong>
              </div>
            </figure>
          )}

          <div className="hero-copy-block hero-copy-left">
            <span>Portfolio / 2026</span>
            <h2>{siteInfo.heroTitle}</h2>
            <p>{siteInfo.heroLead}</p>
          </div>

          <div className="hero-copy-block hero-copy-right">
            <span>Brand System</span>
            <p>
              {typedDescription}
              {!typewriterDone && <i className="type-cursor" aria-hidden="true" />}
            </p>
          </div>

          <a className="hero-round-link" href="#works" aria-label="查看精选案例">
            <span>View</span>
            <strong>Works</strong>
          </a>

          <div className="hero-ticket" aria-hidden="true">
            Packaging<br />
            Designer
          </div>
        </div>
      </section>

      <div className="below-hero-surface">
        <DeferredGrainient
          className="below-hero-grainient"
          disabled={isCompact}
          color1="#fbfad3"
          color2="#c8c4ba"
          color3="#e4a2a2"
          timeSpeed={0.16}
          colorBalance={0.02}
          warpStrength={0.82}
          warpFrequency={4.2}
          warpSpeed={0.9}
          warpAmplitude={58}
          blendAngle={8}
          blendSoftness={0.08}
          rotationAmount={260}
          noiseScale={1.8}
          grainAmount={0.08}
          grainScale={2.4}
          grainAnimated={false}
          contrast={1.15}
          gamma={1}
          saturation={0.58}
          centerX={0.02}
          centerY={-0.08}
          zoom={0.88}
        />
        <div className="below-hero-content">
          <section className="intro-strip" aria-label="作品集特点">
            <div className="container stats-grid">
              {strengths.map((item) => (
                <article className="stat-item" key={item.label}>
                  <strong>{item.value}</strong>
                  <div>
                    <span>{item.label}</span>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="works">
            <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected Cases</p>
              <h2>精选案例</h2>
            </div>
            <p>
              自主独立完成美妆护肤、酒类及各类商业设计项目，全程把控创意与落地执行。
            </p>
          </div>

          <div className="case-list">
            <article className="beauty-showcase">
              <div className="beauty-showcase-head">
                <div>
                  <div className="case-kicker">
                    <span>{beautyShowcase.label}</span>
                    <span>{beautyShowcase.titleEn}</span>
                    <span>{beautyShowcase.year}</span>
                  </div>
                  <h3>{beautyShowcase.title}</h3>
                </div>
                <p>{beautyShowcase.summary}</p>
              </div>

              <div className="beauty-curated-grid">
                <WorkGlow className="work-glow-feature">
                  <a
                    className="beauty-hero-shot"
                    href={beautyShowcase.hero.image}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <PortfolioImage src={beautyShowcase.hero.image} alt={beautyShowcase.hero.title} />
                    <span>{beautyShowcase.hero.label}</span>
                    <strong>{beautyShowcase.hero.title}</strong>
                  </a>
                </WorkGlow>

                <div className="beauty-side-stack">
                  {beautyShowcase.side.map((item) => (
                    <WorkGlow className="work-glow-side" key={item.title}>
                      <a className="beauty-side-shot" href={item.image} target="_blank" rel="noreferrer">
                        <PortfolioImage src={item.image} alt={item.title} />
                        <span>{item.label}</span>
                        <strong>{item.title}</strong>
                      </a>
                    </WorkGlow>
                  ))}
                </div>
              </div>

              <div className="beauty-index-row">
                <div className="beauty-index-copy beauty-index-guide">
                  <span>Curated Image Index</span>
                  <figure className="index-ip-guide" aria-hidden="true">
                    <PortfolioImage src={siteInfo.indexGuideImage} alt="" />
                  </figure>
                  <p>围绕产品功效、包装结构、材质细节与系列陈列展开，快速呈现护肤包装从单品到套组的完整视觉逻辑。</p>
                </div>
                <div className="beauty-mini-gallery">
                  {beautyShowcase.gallery.map((item, index) => (
                    <WorkGlow className="work-glow-mini" key={item.title}>
                      <a className="beauty-mini-shot" href={item.image} target="_blank" rel="noreferrer">
                        <PortfolioImage src={item.image} alt={item.title} />
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.label}</small>
                        </div>
                      </a>
                    </WorkGlow>
                  ))}
                </div>
              </div>

              <div className="tag-row beauty-tag-row">
                {beautyShowcase.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="beauty-all-works">
                <div className="beauty-all-head">
                  <span>Complete Beauty Archive</span>
                  <strong>{isCompact ? visibleBeautyCount : beautyAllImages.length} visuals</strong>
                  <p>覆盖护肤套盒、礼盒系统、功效精华、面霜瓶罐与日化单品，呈现从系列规划到包装细节的完整美妆视觉方案。</p>
                </div>

                <div className="beauty-category-list">
                  {visibleBeautyGroups.map((group) => (
                    <section className="beauty-category" key={group.title}>
                      <div className="beauty-category-head">
                        <span>{group.titleEn}</span>
                        <strong>{group.title}</strong>
                        <p>{group.description}</p>
                      </div>

                      <div className="beauty-all-grid beauty-category-grid">
                        {group.items.map((item, index) => (
                          <WorkGlow className="work-glow-archive" key={item.image}>
                            <a className="beauty-all-card" href={item.image} target="_blank" rel="noreferrer">
                              <figure>
                                <PortfolioImage src={item.image} alt={item.title} />
                              </figure>
                              <div>
                                <span>{String(index + 1).padStart(2, '0')}</span>
                                <strong>{item.title}</strong>
                                <small>{item.label}</small>
                              </div>
                            </a>
                          </WorkGlow>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </article>

            <article className="beauty-showcase wine-showcase">
              <div className="beauty-showcase-head">
                <div>
                  <div className="case-kicker">
                    <span>{wineShowcase.label}</span>
                    <span>{wineShowcase.titleEn}</span>
                    <span>{wineShowcase.year}</span>
                  </div>
                  <h3>{wineShowcase.title}</h3>
                </div>
                <p>{wineShowcase.summary}</p>
              </div>

              <div className="beauty-curated-grid">
                <WorkGlow className="work-glow-feature">
                  <a
                    className="beauty-hero-shot"
                    href={wineShowcase.hero.image}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <PortfolioImage src={wineShowcase.hero.image} alt={wineShowcase.hero.title} />
                    <span>{wineShowcase.hero.label}</span>
                    <strong>{wineShowcase.hero.title}</strong>
                  </a>
                </WorkGlow>

                <div className="beauty-side-stack">
                  {wineShowcase.side.map((item) => (
                    <WorkGlow className="work-glow-side" key={item.title}>
                      <a className="beauty-side-shot" href={item.image} target="_blank" rel="noreferrer">
                        <PortfolioImage src={item.image} alt={item.title} />
                        <span>{item.label}</span>
                        <strong>{item.title}</strong>
                      </a>
                    </WorkGlow>
                  ))}
                </div>
              </div>

              <div className="beauty-index-row">
                <div className="beauty-index-copy beauty-index-guide wine-index-guide">
                  <span>Curated Wine Index</span>
                  <figure className="index-ip-guide" aria-hidden="true">
                    <PortfolioImage src={siteInfo.indexGuideImage} alt="" />
                  </figure>
                  <p>围绕坛瓶器型、瓶标纹样、礼盒结构与红金/青瓷色系展开，快速呈现酒类礼赠包装从瓶身到成套陈列的完整视觉逻辑。</p>
                </div>
                <div className="beauty-mini-gallery">
                  {wineShowcase.gallery.map((item, index) => (
                    <WorkGlow className="work-glow-mini" key={item.title}>
                      <a className="beauty-mini-shot" href={item.image} target="_blank" rel="noreferrer">
                        <PortfolioImage src={item.image} alt={item.title} />
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.label}</small>
                        </div>
                      </a>
                    </WorkGlow>
                  ))}
                </div>
              </div>

              <div className="tag-row beauty-tag-row">
                {wineShowcase.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="beauty-all-works">
                <div className="beauty-all-head">
                  <span>Complete Wine Archive</span>
                  <strong>{visibleWineImages.length} visuals</strong>
                  <p>围绕坛酒器型、瓷瓶造型、瓶标纹样与礼盒结构展开，呈现从单瓶识别到成套礼赠包装的完整酒类视觉方案。</p>
                </div>

                <div className="beauty-all-grid">
                  {visibleWineImages.map((item, index) => (
                    <WorkGlow className="work-glow-archive" key={item.image}>
                      <a className="beauty-all-card" href={item.image} target="_blank" rel="noreferrer">
                        <figure>
                          <PortfolioImage src={item.image} alt={item.title} />
                        </figure>
                        <div>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <strong>{item.title}</strong>
                          <small>{item.label}</small>
                        </div>
                      </a>
                    </WorkGlow>
                  ))}
                </div>
              </div>
            </article>
          </div>
            </div>
          </section>

          <section className="section profile-section" id="introduce">
            <div className="container profile-layout profile-editorial-layout">
          <div className="portrait-panel">
            <div className="portrait-photo">
              <PortfolioImage src={introduceInfo.photo} alt={`${introduceInfo.name}个人照片`} />
            </div>
            <div className="portrait-ip-wrap" aria-hidden="true">
              <PortfolioImage src={siteInfo.heroIpImage} alt="" />
            </div>
            <p>Personal Portrait / Packaging Designer</p>
          </div>

          <div className="profile-copy profile-editorial-copy">
            <div className="profile-title-block">
              <p className="eyebrow">INTRODUCE</p>
              <h2>{introduceInfo.name}</h2>
              <span>{introduceInfo.roles.join(' / ')}</span>
            </div>

            <div className="profile-lead-copy">
              <h3>{introduceInfo.headline}</h3>
              <p>{introduceInfo.summary}</p>
            </div>

            <div className="profile-stat-row">
              {introduceInfo.stats.map((item) => (
                <div className="profile-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="profile-info-grid">
              <section className="profile-info-block" id="contact">
                <h3>CONTACT</h3>
                <span>联系方式</span>
                <dl className="profile-line-list">
                  {introduceInfo.contacts.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>
                        {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="profile-info-block">
                <h3>BASIC INFO</h3>
                <span>基本信息</span>
                <dl className="profile-line-list">
                  {introduceInfo.basicInfo
                    .filter((item) => ['出生年月', '毕业院校', '学历', '求职意向'].includes(item.label))
                    .map((item) => (
                      <div key={item.label}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                </dl>
              </section>

              <section className="profile-info-block profile-skill-block">
                <h3>CAPABILITY</h3>
                <span>核心能力</span>
                <div className="profile-skill-list">
                  {introduceInfo.skills.map((item) => (
                    <span key={item.name}>{item.name}</span>
                  ))}
                </div>
                <p>Software / {introduceInfo.software.join(' / ')}</p>
              </section>
            </div>
          </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
