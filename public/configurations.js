//things to modify:
//app_url and url_prefix must match .war name in tomcat web apps folder ex: url_prefix:/bcc-anagrafiche/ and bcc-anagrafiche.war
//REACT_APP_URL_JAVA is the address to make react comunicate with backend. The name after port is the name of the .war in tomcat folder for the backend file

//for localhost:
// app_url: http://localhost:yourPort/
// REACT_APP_URL_JAVA: http://localhost:yourPort
//url_prefix: "/"

let Configs = {
  "app_url": "http://localhost:8080/",
  "REACT_APP_URL_JAVA":"http://localhost:8090",
  "url_prefix": "/"
}

window.defConfigurations = Configs;
