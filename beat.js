var moodScore = 0;
var moodTime = [];
var moodReason = [];
var moodPoints = [];

$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBQV4UZxIG_xYJyNP2AI9cyxNcdwiAjFUw",
        authDomain: "beat-693c5.firebaseapp.com",
        databaseURL: "https://beat-693c5.firebaseio.com",
        projectId: "beat-693c5",
        storageBucket: "beat-693c5.appspot.com",
        messagingSenderId: "700830054578"
    };
    firebase.initializeApp(config);
    var auth = firebase.auth();



    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            $("#loginForm").fadeOut("slow", function() {
                $("#inputForm").fadeIn("slow");
            });
            $("#logout").fadeIn("slow");
            $("#menu").fadeIn("slow");
        } else {
            // No user is signed in.
            $("#menuBox").fadeOut("slow", function() {
                $("#regForm").fadeOut("slow", function() {
                    $("#inputForm").fadeOut("slow", function() {
                        $("#graphForm").fadeOut("slow", function() {
                            $("#loginForm").fadeIn("slow");
                        });
                    });
                });
            });
        }
    });

    $("#wrapper").hide().fadeIn("slow");

    $("#register").click(function() {
        var email = document.getElementById("newUser").value;
        var pass = document.getElementById("newPassword").value;
        if (pass.length >= 6) {
            
            firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
                console.log(error.message);
                alert(error.message);
            });
            alert("Registration successful");
            $("#regForm").fadeOut("slow", function() {
                $("#loginForm").fadeIn("slow");
            });

        } else {
            alert("Passwords must be equal to or greater than 6 characters!");
        }
    });
    $("#login").click(function() {
        var email = document.getElementById("userName").value;
        var pass = document.getElementById("password").value;
        if (pass.length >= 6) {
            firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
                console.log(error.message);
                alert(error.message);
            });
        } else {
            alert("Passwords must be equal to or greater than 6 characters!");
        }
    });



    $("#create").click(function() {
        $("#loginForm").fadeOut("slow", function() {
            $("#regForm").fadeIn("slow");
        });
    });

    $("#back").click(function() {
        $("#regForm").fadeOut("slow", function() {
            $("#loginForm").fadeIn("slow");
        });
    });

    $("#clear").click(function() {

        var userPrompt = confirm("Reset mood data?");
        if (userPrompt == true) {
            moodTime.length = 0;
            moodPoints.length = 0;
            moodReason.length = 0;
            localStorage.setItem("time", JSON.stringify(moodTime));
            localStorage.setItem("points", JSON.stringify(moodPoints));
            localStorage.setItem("reason", JSON.stringify(moodReason));
        }
    });

    $("#menu").click(function() {
        $("#loginForm").fadeOut("slow", function() {
            $("#regForm").fadeOut("slow", function() {
                $("#inputForm").fadeOut("slow", function() {
                    $("#graphForm").fadeOut("slow", function() {
                        $("#userForm").fadeOut("slow", function() {
                            $("#menuBox").fadeIn("slow");

                        });
                    });
                });
            });
        });

    });

    $("#mood").click(function() {
        $("#menuBox").fadeOut("slow", function() {
            $("#inputForm").fadeIn("slow");
        });
    });

    $("#update").click(function() {
        var oldPass = document.getElementById("oldPassword").value;
        var newPass = document.getElementById("changePassword").value;
        var user = firebase.auth().currentUser;
        email = user.email;
        if (newPass.length >= 6 && oldPass != newPass) {

            var credential = firebase.auth.EmailAuthProvider.credential(email, oldPass);
            user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
                user.updatePassword(newPass).then(function() {
                    alert("Password updated!")
                    $("#oldPassword").val("");
                    $("#changePassword").val("");
                }).catch(function(error) {
                    console.log(error.message);
                    alert(error.message);
                });
            }).catch(function(error) {
                console.log(error.message);
                alert(error.message);
            });


        } else {
            alert("Passwords must be equal to or greater than 6 characters!");
        }

    });


    $("#settings").click(function() {
        $("#menuBox").fadeOut("slow", function() {
            $("#userForm").fadeIn("slow");
        });
    });

    $("#graph").click(function() {
        $("#menuBox").fadeOut("slow", function() {
            $("#graphForm").fadeIn("slow");
        });
        if (localStorage.getItem("time") != null) {
            var localData = localStorage.getItem("time");
            var localData2 = localStorage.getItem("points");
            var localData3 = localStorage.getItem("reason");
            moodTime = JSON.parse(localData);
            moodPoints = JSON.parse(localData2);
            moodReason = JSON.parse(localData3);
            var ctx = $("#myChart");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: moodTime,
                    datasets: [{
                        label: moodReason,
                        data: moodPoints,
                        borderWidth: 1
                    }]

                },
                options: {
                    responsive: true,
                }
            });
        }


    });

    $("#back").click(function() {
        $("#regForm").fadeOut("slow", function() {
            $("#loginForm").fadeIn("slow");
        });
    });

    $("#logout").click(function() {
        $("#inputForm").fadeOut("slow", function() {
            $("#loginForm").fadeIn("slow");
        });
        $("#logout").fadeOut("slow");
        $("#menu").fadeOut("slow");
        $("#graphForm").fadeOut("slow");
        $("#userForm").fadeOut("slow");
        firebase.auth().signOut();
    });

    $("#plus").click(function() {
        if (moodScore < 10) {
            moodScore++;
            $("#value").text(moodScore);
        }

    });

    $("#neg").click(function() {
        if (moodScore != 0) {
            moodScore--;
            $("#value").text(moodScore);
        }

    });

    $("#start").click(function() {
        var date = new Date();
        var n = date.getHours();
        if (localStorage.getItem("time") != null) {
            var localData = localStorage.getItem("time");
            var localData2 = localStorage.getItem("points");
            var localData3 = localStorage.getItem("reason");
            moodTime = JSON.parse(localData);
            moodPoints = JSON.parse(localData2);
            moodReason = JSON.parse(localData3);

        }
        if (moodTime.length < 10 && moodTime[moodTime.length - 1] < n || typeof moodTime[0] === 'undefined') {
            moodTime.push(n);
            moodPoints.push(moodScore);
            moodReason.push($("#activity").val());

            localStorage.setItem("time", JSON.stringify(moodTime));
            localStorage.setItem("points", JSON.stringify(moodPoints));
            localStorage.setItem("reason", JSON.stringify(moodReason));

            $("#value").val(0);
            $("#activity").val("");
            alert("Mood Logged!");

        } else if (moodTime.length == 10) {
            var userPrompt = confirm("You have a previously completed mood graph, reset data?");
            if (userPrompt == true) {
                moodTime.length = 0;
                moodPoints.length = 0;
                moodReason.length = 0;
                localStorage.setItem("time", JSON.stringify(moodTime));
                localStorage.setItem("points", JSON.stringify(moodPoints));
                localStorage.setItem("reason", JSON.stringify(moodReason));
            }
        } else {
            alert("You have already populated the table for this hour!")
        }


    });




});