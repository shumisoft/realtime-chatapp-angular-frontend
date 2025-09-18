export interface AppEnvironment {
  production: boolean;
  gatewayUri: string;
  urlMaps: Record<string, string>;
}
