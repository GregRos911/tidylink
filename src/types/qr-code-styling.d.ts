
declare module 'qr-code-styling' {
  export type DrawType = 'square' | 'dot' | 'rounded' | 'classy' | 'extra-rounded';
  
  export interface Options {
    width?: number;
    height?: number;
    type?: 'svg' | 'canvas';
    data?: string;
    image?: string;
    margin?: number;
    qrOptions?: {
      typeNumber?: number;
      mode?: string;
      errorCorrectionLevel?: string;
    };
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      crossOrigin?: string;
      margin?: number;
    };
    dotsOptions?: {
      type?: DrawType;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
    };
    cornersSquareOptions?: {
      type?: DrawType;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
    };
    cornersDotOptions?: {
      type?: DrawType;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
    };
    backgroundOptions?: {
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
    };
    frameOptions?: {
      style?: 'standard' | 'circle' | 'rounded';
      text?: string;
      textColor?: string;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      hideCorners?: boolean;
    };
  }

  interface FileExtension {
    extension: string;
    name: string;
    mimeType: string;
  }

  export default class QRCodeStyling {
    constructor(options: Partial<Options>);
    append(element: HTMLElement): void;
    download(options?: { name?: string; extension?: string }): void;
    update(options: Partial<Options>): void;
    exportImage(type?: string): Promise<string>;
  }
}
