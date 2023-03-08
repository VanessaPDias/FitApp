let api = "";

if (document.URL.startsWith("https://")) {
    api = "https://api-fitapp.azurewebsites.net";
}
else{
    api = "http://localhost:3000";
}

export const urlDaApi = api;