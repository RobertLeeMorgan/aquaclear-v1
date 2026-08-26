export {};

declare global {
  interface Window {
    modal: {
      open(id: string): void;
      close(id: string): void;
    };
  }
}