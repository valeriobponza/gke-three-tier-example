
export const environment = {
    production: false,
    apiUrl: (window as any)["env"] ? (window as any)["env"]["apiUrl"] : "default"
};