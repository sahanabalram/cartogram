$(document).ready(function(){
	console.log("version 0.6");
	window.fbAsyncInit = function() {
		FB.init ({
			appId      : '258846137957143',
			xfbml      : true,
			version    : 'v2.6'
		});
	};

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	} (document, 'script', 'facebook-jssdk'));
});

// user settings:
var user = {
	loggedIn: false,
	name: "",
	avatar: "",
	email: ""
}

// Initialize Firebase
var config = {
	apiKey: "AIzaSyCVEtucj21-LUbWrsaQkTmr4RLT_gmEGww",
	authDomain: "cartogram-users.firebaseapp.com",
	databaseURL: "https://cartogram-users.firebaseio.com",
	projectId: "cartogram-users",
	storageBucket: "cartogram-users.appspot.com",
	messagingSenderId: "87773780260"
	};
firebase.initializeApp(config);
database = firebase.database();

function facebookSignin() {
	var provider = new firebase.auth.FacebookAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		$("#facebook-logout").show();
		loginUser(result.user);
	}).catch(function(error) {
		console.log(error.code, error.message);
	});
}
function facebookSignout(){
	firebase.auth().signOut().then(function() {
		console.log('User signed out of Facebook')
	}, function(error) {
		console.log('Unable to sign out from Facebook')
	});
}

function googleSignin(){
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function (result) {
		// This gives you a Google Access Token. You can use it to access the GitHub API.
		var token = result.credential.accessToken;
		$("#google-logout").show();
		loginUser(result.user);
	}).catch(function (error) {
		console.log(error.code, error.message);
	});
}
function googleSignout(){
	firebase.auth().signOut().then(function(){
		console.log('User signed out of Google')
	}).catch(function(error){
		console.log('Unable to sign out from Google')
	});
}

function loginUser(newUser){
	$("#google-login, #facebook-login").hide();
	console.log(newUser);
	user.loggedIn = true;
	user.name = newUser.displayName;
	user.avatar = newUser.photoURL;
	user.email = newUser.email;
	user.id = newUser.uid;
}

var refUsers = database.ref("/users");
var refThisUser;

// TODO change to once
refUsers.on("value", function(snap){
	// if this user already exists, pull their data
	if( snap.child(user.id).exists() ){
		// authentication is pointless if it lives on the frontend like this
	}else{ // else add new user to database
		var player2Ref = refPlayers.child(user.id);
		player2Ref.set({
			history: [],
			apps: {
				weather: true
			}
		});
	}
	refThisUser = database.ref("/users/" + user.id);
});

$("#login-button").on("click", function(){
	$("#login-options").fadeToggle(300);
});

$("#google-logout, #facebook-logout").hide();
$("#facebook-login").on("click", facebookSignin);
$("#facebook-logout").on("click", facebookSignout);
$("#google-login").on("click", googleSignin);
$("#google-logout").on("click", googleSignout);