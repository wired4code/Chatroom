// YOUR CODE HERE:

var app;

$(document).ready(function()  {

  app = {

    server: "https://api.parse.com/1/classes/chatterbox",
    username: 'anonymous',
    room: 'main',
    house: {},

    init: function(){
      var self = this;
      //$('.submit').on('submit', app.handleSubmit);
      $('#send').on('submit', function(event){
        event.preventDefault();
        console.log('submit');
        self.handleSubmit();
      })

      app.fetch();

      setInterval(app.fetch, 10000);
    },

    send: function(message){
      $.ajax({

        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (message) {
         console.log('chatterbox: Message sent. Data: ', message);

       },
        error: function (data) {

          console.error('chatterbox: Failed to send message. Error: ', data);
        }
     });
    },

    fetch: function(message){
      $.ajax({
        //https://api.parse.com/1/classes/chatterbox?where={"username":{"$in":["anonymous"]}}'
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        //data: JSON.stringify(message),
        data:{order: '-createdAt'},
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message received. Data: ', data);
          app.addMessage(data.results);

          app.addRoom(data.results);
        },
        error: function (data) {

          console.error('chatterbox: Failed to fetch data. Error: ', data);
        }
      });
    },


    clearMessages: function(){

      $('.chats').remove();
    },

    addMessage: function(results){
      _.each(results, function(item){
        var txt = $("<div class='chats'></div>").text(item.username + ': ' + item.text);
        $('.chat').prepend(txt);
      });
    },

    addRoom: function(results){


      _.each(results, function(item){
        var room = item.roomname;
        if(room === undefined || null || !room){
          room = 'lobby';
        }
        if(!app.house[room]){
          app.house[room] = true;
          $('#roomSelection').append('<option value="' + room + '">'+ room +'</option>');
        }
      });

    },


    handleSubmit: function(event){


      var message = {
        username: this.username,
        text: $('.message').val(),
        roomname: this.room || 'main'
      };
      this.send(message);
      console.log('sending message');
    },

    addFriend: function(){

    }



  };

app.init()

});
