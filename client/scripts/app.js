// YOUR CODE HERE:

var app;

$(document).ready(function()  {

  app = {

    server: "https://api.parse.com/1/classes/chatterbox",
    username: 'anonymous',
    room: 'main',
    house: {},

    init: function(){

      app.username = window.location.search.substr(10);
      //$('#roomSelection').val() = 'main';
      var self = this;
      //$('.submit').on('submit', app.handleSubmit);


      $('#send').on('submit', function(event){
        event.preventDefault();
        console.log('submit');
        self.handleSubmit();
      })


      $('#roomSelection').change(function(){
        //event.preventDefault();
        console.log('clicking');
        var roomSelection = $('#roomSelection').val();
        var newRoom = $('#newRoom');
        console.log(roomSelection);

        if (roomSelection === 'New Room'){
          app.addNewRoom();
        }
      })

      app.fetch();

      setInterval(app.fetch, 10000);
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
        //https://api.parse.com/1/classes/chatterbox?where={"username":{"$in":["anonymous"]}}'
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        //data: JSON.stringify(message),
        data:{order: '-createdAt'},
        contentType: 'application/json',
        success: function (data) {
         // console.log('chatterbox: Message received. Data: ', data);
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
      _.each(results, function(item){
        var txt = $("<div class='chats'></div>").text(item.username + ': ' + item.text);
        $('.chat').append(txt);
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
      //var roomSelection = $('#roomSelection').val();

      //if(roomSelection === 'New Room'){
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

    addFriend: function(){

    }



  };

app.init()

});
