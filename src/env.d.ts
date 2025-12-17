/// <reference types="astro/client" />

// Extend React component props to include Astro client directives
declare module 'react' {
  interface Attributes {
    'client:load'?: boolean;
    'client:idle'?: boolean;
    'client:visible'?: boolean;
    'client:media'?: string;
    'client:only'?: string | boolean;
  }
}
