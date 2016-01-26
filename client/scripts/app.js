// YOUR CODE HERE:

var app;

$(document).ready(function()  {

  app = {

    server: "https://api.parse.com/1/classes/chatterbox",
    username: 'anonymous',
    room: 'main',

    init: function(){

      //$('.submit').on('submit', app.handleSubmit);
      $('form').submit(function(event){
        event.preventDefault();
        app.handleSubmit();
      })

      app.fetch();
    },

    send: function(message){
      $.ajax({

        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
         console.log('chatterbox: Message sent. Data: ', data);
         app.fetch();
       },
        error: function (data) {

        console.error('chatterbox: Failed to send message. Error: ', data);
      }
     });
    },

    fetch: function(message){
      $.ajax({

        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message received. Data: ', data);
          app.addMessage(data.results);
        },
        error: function (data) {

          console.error('chatterbox: Failed to fetch data. Error: ', data);
        }
      });
    },


    clearMessages: function(){
      //app.$chat.html('')
      //$('.chat').
    },

    addMessage: function(results){
      _.each(results, function(item){
        $('.chat').append(item.username + ': ' + item.text);
      });
    },

    addRoom: function(){

    },

    handleSubmit: function(event){


      var message = {
        username: app.username,
        text: $('.message').val(),
        roomname: app.room || 'main'
      };
      app.send(message);
    },

    addFriend: function(){

    }



  };

app.init()

});
