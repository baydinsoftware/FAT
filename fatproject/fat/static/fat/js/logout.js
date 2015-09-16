function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   
   auth2.disconnect().then(function () {
     location = "/fat/";
     window.replace(location);
   });
 }