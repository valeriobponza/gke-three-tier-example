export const environment = {

    production: true,
    apiUrl: (window as any)["env"] ? (window as any)["env"]["apiUrl"] : "default"

};