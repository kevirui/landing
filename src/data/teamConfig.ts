export type TeamMemberId = 'martin' | 'andres' | 'mateo' | 'kevin';

export interface TeamMember {
  id: TeamMemberId;
  name: string;
  image: string;
  linkedin: string;
  linkedinProfile: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'martin',
    name: 'Martín Lago',
    image: '/imgs/we/martin.jpg',
    linkedin: 'https://linkedin.com/in/martinlago',
    linkedinProfile: 'martinlago',
  },
  {
    id: 'andres',
    name: 'Andres Chanchi',
    image: '/imgs/we/andres.jpg',
    linkedin: 'https://linkedin.com/in/andreschanchi',
    linkedinProfile: 'andreschanchi',
  },
  {
    id: 'mateo',
    name: 'Mateo Rivera',
    image: '/imgs/we/mateo.jpg',
    linkedin: 'https://linkedin.com/in/facundo-mateo-rivera',
    linkedinProfile: 'facundo-mateo-rivera',
  },
  {
    id: 'kevin',
    name: 'Kevin Ruiz',
    image: '/imgs/we/kevin.jpg',
    linkedin: 'https://linkedin.com/in/kevinagustin',
    linkedinProfile: 'kevinagustin',
  },
];
