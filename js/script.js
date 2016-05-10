var usersRef = new Firebase('https://radiant-heat-4748.firebaseio.com/');
function userExistsCallback(email, exists) {
  if (exists) {
    console.log('user ' + email + ' exists!');
  } else {
    console.log('user ' + email + ' does not exist!');
    userRef.set({email: profile.getEmail(), count: 0});
  }
}

function energised() {
  document.getElementById("mp4vid").src = "background/night-street.mp4";
  document.getElementById("bgvid").load();
}

function inspired() {
  document.getElementById("mp4vid").src = "background/bokeh2.mp4";
  document.getElementById("bgvid").load();
}

function mysterious() {
  document.getElementById("mp4vid").src = "background/raining-light.mp4";
  document.getElementById("bgvid").load();
}

function tranquil() {
  document.getElementById("mp4vid").src = "background/red-abstract.mp4";
  document.getElementById("bgvid").load();
}

function wdi2() {
  $("div#nav-signin").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
  $("div#article-gmail").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
  $("div#aside-event").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
  $("div#nav-logout").css({"visibility": "hidden"});
  $("div#profile").html();
  $("div#name").html();
  $("div#email").html();
  $("div#head-container").css({"background": "rgba(0, 0, 0, 0)", "opacity": "0.1"});
  $("header").css({"background": "rgba(0, 0, 0, 0)", "opacity": "0.1"});
  $("div.g-signin2").css({"background": "rgba(0, 0, 0, 0)", "opacity": "0.03"});
  $("div#chicken").css({"background": "rgba(0, 0, 0, 0)", "opacity": "0.1"});
  document.getElementById("mp4vid").src = "background/wdi2.mp4";
  document.getElementById("bgvid").load();
}

// Tests to see if /users/<userId> has any data.
function checkIfUserExists(email) {
  usersRef.child(email).once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    userExistsCallback(email, exists);
  });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      $("div#nav-signin").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
      $("div#article-gmail").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
      $("div#aside-event").css({"width": "0", "height": "0", "background": "rgba(0, 0, 0, 0)", "opacity": "0"});
      $("div#nav-logout").css({"visibility": "hidden"});
      $("div#profile").html();
      $("div#name").html();
      $("div#email").html();
    });
}

function onSignIn(googleUser) {
  $("div#nav-logout").css({"visibility": "visible"});
  var options = new gapi.auth2.SigninOptionsBuilder(
        {'scope': 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly'}
      );
  googleUser.grant(options).then(
    function(success){
      console.log("gmail and calendar access granted");
      loadGmailApi();
      loadCalendarApi();
    },
    function(fail){
      console.log("gmail and calendar access failed");
    });
  var profile = googleUser.getBasicProfile();
  var scopetypes = googleUser.getGrantedScopes();
  $("div#nav-signin").css({"width": "250px", "height": "220px", "background": "rgba(0, 0, 0, 0.6)", "opacity": "1"});
  $("div#profile").css({"background": "url("+profile.getImageUrl()+") no-repeat"});
  $("div#details").html("<p>Welcome "+profile.getName()+"<br>"+profile.getEmail()+"</p>");
  checkIfUserExists(profile.getEmail());

  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Scopes: ' + scopetypes);
}

      //
      // Load Gmail API client library. List labels once client library
      // is loaded.
      //
     function loadGmailApi() {
       gapi.client.load('gmail', 'v1', listThreads);
     }

      //
      // Print all Labels in the authorized user's inbox. If no labels
      // are found an appropriate message is printed.
      //
     function listThreads() {
       var request = gapi.client.gmail.users.threads.list({
         'userId': 'me'
       });
       $("div#article-gmail").css({"width": "100%", "height": "500px", "background": "rgba(0, 0, 0, 0.6)", "opacity": "1"});
       request.execute(function(resp) {
         var threads = resp.threads;

         if (threads && threads.length > 0) {
           for (i = 0; i < threads.length; i++) {
             var thread = threads[i];
             appendGmail(thread.snippet)
           }
         } else {
           appendGmail('No Threads found.');
         }
       });
     }

      //
      // Append a pre element to the body containing the given message
      // as its text node.
      //
      // @param {string} message Text to be placed in pre element.
      //
     function appendGmail(message) {
       var preGmail = document.getElementById('gmail');
       var mailContent = document.createTextNode(message + '\n');
       var h = document.createElement("hr");
       h.appendChild(mailContent);
       preGmail.appendChild(h);
     }

//
// Load Google Calendar client library. List upcoming events
// once client library is loaded.
//
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

//
// Print the summary and start datetime/date of the next ten events in
// the authorized user's calendar. If no events are found an
// appropriate message is printed.
//
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });
  $("div#aside-event").css({"width": "300px", "height": "500px", "background": "rgba(0, 0, 0, 0.6)", "opacity": "1"});

  request.execute(function(resp) {
    var events = resp.items;

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendCal(event.summary + ' (' + when + ')')
      }
    } else {
      appendCal('No upcoming events found.');
    }

  });
}

//
// Append a pre element to the body containing the given message
// as its text node.
//
// @param {string} message Text to be placed in pre element.
//
function appendCal(message) {
  var preCalendar = document.getElementById('calendar');
  var calendarContent = document.createTextNode(message + '\n');
  var hr = document.createElement("hr");
  hr.appendChild(calendarContent);
  preCalendar.appendChild(hr);
}
