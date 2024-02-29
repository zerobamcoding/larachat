import { AxiosInstance } from 'axios';
import Echo from 'laravel-echo';
import ziggyRoute, { Config as ZiggyConfig } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: any;
        Echo: Echo
    }

    var route: typeof ziggyRoute;
    var Ziggy: ZiggyConfig;
}
