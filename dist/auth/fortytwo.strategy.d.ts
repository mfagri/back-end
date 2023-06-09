import { Profile } from "passport-42";
declare const Strategy42_base: new (...args: any[]) => any;
export declare class Strategy42 extends Strategy42_base {
    tokens: String;
    refresh: String;
    constructor();
    validate(accessToken: String, refreshToken: string, profile: Profile): Promise<{
        id: any;
        mytoken: {
            accestoken: String;
            refreshtoken: string;
        };
    }>;
}
export {};
