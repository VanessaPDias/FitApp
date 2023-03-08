let api = "";

if(document.URL.startsWith("http://localhost")){
  api = "http://localhost:3000"
} 
else if (document.URL.endsWith("azurestaticapps.net")) {
    api = "https://api-fitapp.azurewebsites.net"
}

export const urlDaApi = api;