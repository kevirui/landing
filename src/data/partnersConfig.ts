export interface Partner {
  name: string;
  logo: string;
  href: string;
}

export const PARTNERS: Partner[] = [
  {
    name: 'Fundación Gran Chaco',
    logo: '/icons/partners/svg/fund.svg',
    href: 'https://gran-chaco.org/es/home/',
  },
  {
    name: 'UTN - Universidad Tecnológica Nacional',
    logo: '/icons/partners/svg/utn.svg',
    href: 'https://www.utn.edu.ar',
  },
  {
    name: 'NerdConf',
    logo: '/icons/partners/svg/nerdconf.svg',
    href: 'https://nerdconf.com',
  },
  {
    name: 'LatinHack',
    logo: '/icons/partners/svg/latinhack.svg',
    href: 'https://latinhack.io/',
  },
];
