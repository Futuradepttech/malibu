//////////////////////////
//
// News Feed
// See the "News Feed" section on https://developers.facebook.com/mobile
//
//////////////////////////

//Publish a story to the user's own wall
function publishStory() {
  FB.ui({
	  
    method: 'feed',
    name: 'First Time App',
    caption: document.getElementById("global_title").value,
    description: document.getElementById("global_description").value,
    link: 'http://apps.facebook.com/mobile-start/',
    picture: encodeURI(document.getElementById("share_pic").value),
    actions: [{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }],
  }, 
  function(response) {
    console.log('publishStory UI response: ', response);
  });
}

//Publish a story to the user's friend's wall
function publishStoryFriend() {
  randNum = Math.floor ( Math.random() * friendIDs.length ); 

  var friendID = friendIDs[randNum];
  
  console.log('Opening a dialog for friendID: ', friendID);
  
  FB.ui({
    method: 'feed',
//    to: '3',
    name: 'I\'m using the quiz app',
    caption: 'quiz for Mobile Web.',
    description: 'Check out quiz for Mobile Web to learn how you can make your web apps social using Facebook Platform.',
//    link: 'http://apps.facebook.com/mobile-start',
//    picture: 'http://www.facebookmobileweb.com/quiz/img/facebook_icon_large.png',
    actions: [{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }],
//    user_message_prompt: 'Tell your friends about building social web apps.'
  }, 
  function(response) {
    console.log('publishStoryFriend UI response: ', response);
  });
}