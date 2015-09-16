function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var clientId = '995600902413-ug01h2ddrevp3vdtn9covibak7obdode';
var apiKey = 'AIzaSyC1ToR7nXuWz5lrAFykwMyUpcLd2YTGp98';
var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
var companyDomain = 'baydin.com';

function signIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var profileID = profile.getId();
    var profileEmail = profile.getEmail();
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({'userId': profileID});
        request.execute(function(response) {
            getInfoAndSendToBackend(response, profileEmail, profileID);
        });
    });
}


function getInfoAndSendToBackend(response, email, profileID) {
    var display_name = response.displayName;
    var username = profileID;
    var first = response.name.givenName;
    var last  = response.name.familyName;
    var picture_url = response.image.url;
    $.post('login_view/', {'username': username, 'picture_url': picture_url, 'display_name': display_name,
                            'first': first, 'last': last, 'email': email }, function(data) { 

        if(data['login_user']) { window.location.replace('/fat/main'); }
        else { 
            $("#error").html("<strong>That email address does not have permission to log in</strong>");
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.disconnect();
        }
    });
}