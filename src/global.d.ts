export {};

declare global {
  interface Window {
    cj: any;
    setLoadedBytes: Function;
    localLoadedBytes: number;
    TOTAL_INIT_BYTES: number;
    proCon: any;
  }
}
