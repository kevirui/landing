export interface MetricData {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

export const METRICS_CONFIG: MetricData[] = [
  {
    id: 'investment',
    imageSrc: '/imgs/index/image_1.jpg',
    imageAlt: 'Agricultural field',
  },
  {
    id: 'savings',
    imageSrc: '/imgs/index/image_2.jpg',
    imageAlt: 'Forest landscape',
  },
  {
    id: 'organizations',
    imageSrc: '/imgs/index/image_3.jpg',
    imageAlt: 'Rural scene',
  },
  {
    id: 'identities',
    imageSrc: '/imgs/index/image_4.jpg',
    imageAlt: 'Person working in field',
  },
];
