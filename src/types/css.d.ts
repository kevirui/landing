// Type declarations for CSS imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Handle CSS imports with path aliases
declare module '@styles/*.css' {
  const content: Record<string, string>;
  export default content;
}
