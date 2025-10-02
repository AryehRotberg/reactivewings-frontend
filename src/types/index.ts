export interface Flight {
    airlineCode: string;
    flightNumber: string;
    scheduledTime: string;
    estimatedTime: string;
    airlineName: string;
    cityEn: string;
    countryEn: string;
    statusEn: string;
    terminal: string;
    counters: string;
    checkinZone: string;
    lastUpdated: string;
}

export interface UserInfo {
    email: string;
    subscriptions: Flight[];
}

export type AuthHeaders = Record<string, string>;
