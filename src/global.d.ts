export {};

declare global {
  interface Window {
    cheerpjReady: boolean;
    cj: any;
    setLoadedBytes: Function;
    localLoadedBytes: number;
    TOTAL_INIT_BYTES: number;
    proCon: any;
  }
}
