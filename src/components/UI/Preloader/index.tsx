'use client';
import Image from 'next/image';
import ic_import from '../../../../public/svgs/ic_import.svg';

import { Wrapper, Inner, SecondOverlay } from './styles';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = ({
  setComplete,
}: {
  setComplete: Dispatch<SetStateAction<boolean>>;
}) => {
  const word = ['c', 'o', 'm', 'p', 'a', 'd', 'r', 'e'];

  const spans = useRef<any>([]); // Create a ref to store the span elements
  const imageRef = useRef(null);
  const secondOverlayRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(imageRef.current, {
      y: '-100%',
      ease: 'back.out(1.0)',
      duration: 0.4,
    });
    tl.to(spans.current, {
      y: '-100%',
      ease: 'power2.in',
      duration: 0.4,
      stagger: 0.02,
    });
    tl.to([wrapperRef.current, secondOverlayRef.current], {
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'back.out(1.7)',
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => {
        setComplete(true);
      },
    });
    tl.to(secondOverlayRef.current, {
      scaleY: 0,
      transformOrigin: 'top',
      ease: [0.83, 0, 0.17, 1] as any,
      duration: 0.5,
      delay: -0.45,
    });
  }, [setComplete]);

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <Inner>
          {/* <Image ref={imageRef} src={ic_import} alt="import icon" /> */}
          <div>
            {word.map((t, i) => (
              <div
                key={i}
                ref={(element) => (spans.current[i] = element)}
                style={{
                  fontSize: '20rem',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </Inner>
      </Wrapper>
      <SecondOverlay ref={secondOverlayRef}></SecondOverlay>
    </>
  );
};

export default Preloader;