/// <reference types="@devvit/public-api" />

declare global {
    namespace JSX {
        interface IntrinsicElements {
            vstack: any;
            hstack: any;
            zstack: any;
            spacer: any;
            text: any;
            button: any;
            image: any;
            icon: any;
            textfield: any;
        }
    }
}

export {};
