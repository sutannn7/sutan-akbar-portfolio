import { ThreeElements } from '@react-three/fiber';
import React from 'react';

// Use multiple declaration styles to ensure the React 19 compiler finds the types
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {
            // Spline
            'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                url?: string;
                'loading-anim-type'?: string;
                [key: string]: any;
            }, HTMLElement>;
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {
            'spline-viewer': any;
        }
    }
}

export { };
