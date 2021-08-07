export const recollector = `
    window.telemetric = {
        __data: {},
        set recollect(data) {
            this.__data = data;
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
    };
`;
