// YOUR CODE HERE:

var app;

$(document).ready(function()  {

  app = {

    server: "https://api.parse.com/1/classes/chatterbox",
    username: 'anonymous',
    room: 'main',
    house: {},
    friends: {},

    init: function(){

      app.username = window.location.search.substr(10);

      var self = this;

      $('#send').on('submit', function(event){
        event.preventDefault();
        console.log('submit');
        self.handleSubmit();
      })

      $('#roomSelection').change(function(){

        console.log('clicking');
        var roomSelection = $('#roomSelection').val();
        var newRoom = $('#newRoom');
        console.log(roomSelection);

        if (roomSelection === 'New Room'){
          app.addNewRoom('');
        }
      })

      $('.chat').on('click', '.users', function(){
        var x = $(this).text();
        $(this).addClass("username");
        app.friends[x] = true;

        app.fetch()

      })

      app.fetch();

      setInterval(app.fetch, 1000);
    },

    send: function(message){

      console.log(message)
      $.ajax({

        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (message) {
         console.log('this is our message ' + message);
         console.log('chatterbox: Message sent. Data: ', message);
         console.log(message.text)
         app.fetch();
       },
        error: function (message) {

          console.error('chatterbox: Failed to send message. Error: ', message);
        }
     });
    },

    fetch: function(message){

      $.ajax({

        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',

        data:{order: '-createdAt'},
        contentType: 'application/json',
        success: function (data) {

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
      app.clearMessages();

      var roomname = $('#roomSelection').val() || app.room;

      _.each(results, function(item){
        var txt = $("<div class='chats'></div>")

        if(item.roomname === roomname){

          if(app.friends[item.username]){
            var users = $('<span class="username"></span>').text(item.username);
          } else{
            users = $('<span class="users"></span>').text(item.username);
          }
          var message = $("<span class ='userMessages'></span>").text(_.escape(': ' +item.text));
          $('.chat').append(txt);
          users.appendTo(txt);
          message.appendTo(txt);
        };

        });

    },

    addRoom: function(results){

      var creatingRoom = $('.createNewRoom').val();
      app.house[creatingRoom] = true;

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

    addNewRoom: function(){

        console.log('should get a prompt here');
        var createNewRoom = prompt('Name your room');
        if(createNewRoom){
          app.house[createNewRoom] = true;
          $('#roomSelection').append('<option value="' + createNewRoom + '">'+ createNewRoom +'</option>');
        }

        $('#roomSelection').val(createNewRoom);
    },

    handleSubmit: function(event){

      var message = {
        username: app.username,
        text: $('#message').val(),
        roomname: this.room || 'main'
      };
      this.send(message);
      console.log('sending message');
    },

    addFriend: function(results){

    }

  };

app.init()

});

