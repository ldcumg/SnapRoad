// window 객체의 타입 확장
export {};

declare global {
  interface Window {
    dateInput?: HTMLInputElement;
    timeInput?: HTMLInputElement;
  }
}
