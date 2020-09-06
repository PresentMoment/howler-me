const mixes = {
  id: 1,
  title: "First Mix",
  url: "http://www.uscis.gov/files/nativedocuments/Track%2093.mp3",
};

function sec2time(timeInSeconds) {
  var pad = function (num, size) {
      return ("000" + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);

  if (hours > 0) {
    return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
  } else {
    return pad(minutes, 2) + ":" + pad(seconds, 2);
  }
}

let self = this;

function step() {
  requestAnimationFrame(self.step.bind(self));
  $("#progress").css({
    width: ((sound.seek() / sound.duration()) * 100 || 0) + "%",
  });
  $("#current-position").text(sec2time(sound.seek()));
}

function volume() {
  $("#volume").css({ width: sound.volume() * 100 + "%" });
}

var sound = new Howl({
  src: [mixes.url],
  volume: 0.5,
  onplay: function () {
    requestAnimationFrame(self.step.bind(self));
    audioPlayed = true;
    $("i.play").addClass("hide");
    $("i.pause").removeClass("hide");
  },
  onseek: function () {
    // Start upating the progress of the track.
    requestAnimationFrame(this.step.bind(this));
  },

  onload: function () {
    step();
    volume();
    $("#duration").text(sec2time(sound.duration()));
  },

  onpause: function () {
    $("i.play").removeClass("hide");
    $("i.pause").addClass("hide");
  },

  onend: function () {
    $("i.play").removeClass("hide");
    $("i.pause").addClass("hide");
    $("#sound").toggleClass("playing");
  },
});

// Play/Pause btn
$("#sound").click(function () {
  $(this).toggleClass("playing");
  if ($(this).hasClass("playing")) {
    sound.play();
  } else {
    sound.pause();
  }
});

$("#progress-icons").click(function (event) {
  width = $("#progress-icons").width();
  offset = $("#progress-icons").offset().left;
  sound.seek(((event.clientX - offset) / width) * sound.duration());
});

$("#volume-bg").click(function (event) {
  width = $("#volume-bg").width();
  offset = $("#volume-bg").offset().left;
  sound.volume((event.clientX - offset) / width);
  volume();
});
