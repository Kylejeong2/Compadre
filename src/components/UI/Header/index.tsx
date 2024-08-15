'use client';

import Image from 'next/image';
import {
  Wrapper,
  Inner,
  LogoContainer,
  Nav,
  CallToActions,
  AbsoluteLinks,
  BurgerMenu,
} from './styles';
import ic_bars from '../../../../public/svgs/ic_bars.svg';
import { GetStartedButton } from '@/components';
import AnimatedLink from '@/components/Common/AnimatedLink';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { links, menu } from './constants';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Wrapper>
      <Inner className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="compadre_logo" width={140} height={30} priority />
          </Link>
          <BurgerMenu onClick={() => setIsOpen(!isOpen)} className="ml-4 md:hidden">
            <motion.div
              variants={menu}
              animate={isOpen ? 'open' : 'closed'}
              initial="closed"
            ></motion.div>
            <Image src={ic_bars} alt="bars" />
          </BurgerMenu>
        </div>
        <Nav className={`flex-grow justify-center ${isOpen ? 'active' : 'hidden md:flex'}`}>
          {links.map((link, i) => (
            <Link href={link.url} key={i} className="mx-4">
              <AnimatedLink key={i} title={link.linkTo} />
            </Link>
          ))}
        </Nav>
        <CallToActions className={`flex items-center ${isOpen ? 'active' : 'hidden md:flex'}`}>
          <Link href="/dashboard" className="mr-4">
            <AnimatedLink title="Login" />
          </Link>
          <GetStartedButton padding="0.5rem 0.75rem" />
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;