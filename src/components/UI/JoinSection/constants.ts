import { StaticImageData } from 'next/image';
import robert_fox from '../../../../public/images/robert_fox.png';
import cameron_williamson from '../../../../public/images/cameron_williamson.png';
import esther_howard from '../../../../public/images/esther_howard.png';

export type Props = {
  testimony: string;
  person: string;
  avatar: StaticImageData;
};

export const testimonials = [
  {
    testimony:
      "compadre has transformed my approach to finance. Their smart investing options have helped me grow my wealth, and their user-friendly platform makes managing my money a breeze. I&apos;ve never felt more confident about my financial future.",
    person: 'Robert Fox',
    avatar: robert_fox,
  },
  {
    testimony:
      "I can&apos;t express how grateful I am to compadre. Their wealth management services have been a game-changer for my family&apos;s financial security. The expert guidance and personalized strategies have given us peace of mind, knowing that our future is in capable hands.",
    person: 'Cameron Williamson',
    avatar: cameron_williamson,
  },
  {
    testimony:
      "compadre&apos;s financial planning services have been a lifeline for me. I always struggled with managing my money, but their team created a tailored plan that addressed my goals and concerns. It&apos;s been a game-changer in achieving my financial dreams",
    person: 'Esther Howard',
    avatar: esther_howard,
  },
  {
    testimony:
      "I can&apos;t express how grateful I am to compadre. Their wealth management services have been a game-changer for my family&apos;s financial security. The expert guidance and personalized strategies have given us peace of mind, knowing that our future is in capable hands.",
    person: 'Cameron Williamson',
    avatar: cameron_williamson,
  },
  {
    testimony:
      "compadre has transformed my approach to finance. Their smart investing options have helped me grow my wealth, and their user-friendly platform makes managing my money a breeze. I&apos;ve never felt more confident about my financial future.",
    person: 'Robert Fox',
    avatar: robert_fox,
  },
];

export const desktopHeaderPhrase = ['Join over 3 million', 'members'];