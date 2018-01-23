$(document).ready(function() {
  var twitch = "https://www.twitch.tv/";
  var channels = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas",
    "brunofin"
  ];
  var online = [];
  var offline = [];

  function streams(name, status, title, img, link) {
    this.name = name;
    this.status = status;
    this.title = title;
    this.img = img;
    this.link = link;
  }

  function transform(arr, color) {
    $.each(arr, function(i, value) {
      $("#show").append(
        '<tr><td><a target="_blank" href="' +
          value.link +
          '"><img src="' +
          value.img +
          '"></a></td><td><a target="_blank" style="color:' +
          color +
          '" href="' +
          value.link +
          '" id="name">' +
          value.name +
          "</a></td><td>" +
          value.status +
          "</td><td>" +
          value.title +
          '</td><td><button id="'+value.name+'" class="btn btn-danger fa fa-trash"></button></td></tr>'
      );
    });
  }

  function show(str) {
    if (str == "online") {
      transform(online, "green");
    } else if (str == "offline") {
      transform(offline, "red");
    } else {
      transform(online, "green");
      transform(offline, "red");
    }
  }

  function get() {
    $.each(channels, function(i, value) {
      $.getJSON(
        "https://wind-bow.glitch.me/twitch-api/streams/" + value,
        function(data) {
          if (data.stream === null) {
            $.getJSON(
              "https://wind-bow.glitch.me/twitch-api/channels/" + value,
              function(a) {
                if (a.hasOwnProperty("error")) {
                  offline.push(new streams(value, a.error, a.message));
                } else
                  offline.push(
                    new streams(
                      value,
                      "Offline",
                      a.status,
                      a.logo,
                      twitch + value
                    )
                  );
              }
            );
          } else {
            online.push(
              new streams(
                value,
                "Online",
                data.stream.channel.status,
                data.stream.channel.logo,
                twitch + value
              )
            );
          }
        }
      );
    });
    setTimeout(show, 1000);
  }

  get();

  $("#all").click(function() {
    $("td").remove();
    $("#online, #offline").parent().removeClass("active");
    $("#all").parent().addClass("active");
    show();
    $("#erase1").remove();
  });

  $("#online").click(function() {
    $("td").remove();
    $("#all, #offline").parent().removeClass("active");
    $("#online").parent().addClass("active");
    show("online");
  });

  $("#offline").click(function() {
    $("td").remove();
    $("#all, #online").parent().removeClass("active");
    $("#offline").parent().addClass("active");
    show("offline");
  });

  $("#add").submit(function() {
    var form = $("input").val();
    form = form.replace(/\s/g, "");
    channels.push(form);
    $("td").remove();
    online = [];
    offline = [];
    get();
  });

  $("#show").on("click","button.fa", function() {
    var parent=$(this).parent().parent()
    var name= parent.find("#name").text();
    channels=channels.filter(function(el){
      return el!== name;
    })
    online=online.filter(function(el){
      return el.name !== name;
    });
    offline=offline.filter(function(el){
      return el.name!==name;
    });
    parent.remove();
  });
});
