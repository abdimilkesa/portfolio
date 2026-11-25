import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useProfile } from '../../hooks/usePortfolio';
import { startPortraitIntro } from '../intro/portraitIntro';

const ROLE = 'AI Engineer & Software Developer';

export function Hero() {
  const reduce = useReducedMotion();
  const { content: profile } = useProfile();
  const name = (profile?.name || 'Abdi Milki').toUpperCase();
  const imageUrl = profile?.profileImage || '';
  const rootRef = useRef(null);
  const waterRef = useRef(null);
  const fxRef = useRef(null);
  const photoRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const wrapRef = useRef(null);
  const portraitRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let dead = false;
    let api = null;
    startPortraitIntro({
      root,
      waterCanvas: waterRef.current,
      fxCanvas: fxRef.current,
      photoCanvas: photoRef.current,
      nameEl: nameRef.current,
      roleEl: roleRef.current,
      wrapEl: wrapRef.current,
      portraitEl: portraitRef.current,
      name,
      role: ROLE,
      imageUrl,
      reduced: Boolean(reduce),
    }).then((handle) => {
      if (dead) handle.destroy();
      else api = handle;
      apiRef.current = dead ? null : handle;
    });
    return () => {
      dead = true;
      api?.destroy();
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [imageUrl, name, reduce]);

  return (
    <section id="home" ref={rootRef} className="cine" aria-label="Introduction">
      <canvas ref={waterRef} className="cine-water" aria-hidden="true" />
      <canvas ref={fxRef} className="cine-fx" aria-hidden="true" />
      <div className="cine-vignette" aria-hidden="true" />
      <div className="cine-grid">
        <div className="cine-copy">
          <h1 ref={nameRef} className="cine-name" aria-label={name} />
          <h2 ref={roleRef} className="cine-role" aria-label={ROLE} />
          <p className="cine-sub cine-late">Software Engineering Student at Jimma University</p>
          <div className="cine-cta cine-late" style={{ '--d': '.2s' }}>
            <a className="cine-btn cine-primary" href="#projects">
              View My Work
            </a>
            <a className="cine-btn cine-glass" href="#contact">
              Contact Me
            </a>
          </div>
        </div>
        <div ref={wrapRef} className="cine-pwrap">
          <div ref={portraitRef} className="cine-portrait">
            <canvas ref={photoRef} role="img" aria-label={`Portrait of ${profile?.name || 'Abdi Milki'}`} />
          </div>
        </div>
      </div>
      <div className="cine-ctrl">
        <button type="button" onClick={() => apiRef.current?.skip()}>
          Skip intro
        </button>
        <button type="button" onClick={() => apiRef.current?.replay()}>
          Replay
        </button>
      </div>
    </section>
  );
}
