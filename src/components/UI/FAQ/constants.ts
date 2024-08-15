type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['FAQs'];
export const mobileHeaderPhrase = ['FAQs'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: 'How do I create an account with compadre?',
    answer:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    question: 'What even is Compadre?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    question: 'How many compadres can I have?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    question: 'Can I have my Compadre forever?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
];
