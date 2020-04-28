var showLoading = function() {
  $(defaults.waitingId).removeClass("hidden");
  $(defaults.resultId).addClass("hidden");
};

var hideLoading = function() {
  $(defaults.waitingId).addClass("hidden");
};

function getTrackFromStorageAndShowHtml() {
  chrome.storage.sync.get(
    {
      foundTracks: "foundTracks"
    },
    function(responseGet) {
      if (responseGet.foundTracks != "foundTracks") {
        var htmlFoundHistory = "";
        if (responseGet.foundTracks.length > 0) {
          htmlFoundHistory += "<ul class='history-ul'>";

          for (i = 0; i < responseGet.foundTracks.length; i++) {
            if (
              responseGet.foundTracks[i].track == undefined ||
              responseGet.foundTracks[i].track == ""
            )
              continue;

            var query = String.format(
              "{0} {1}",
              responseGet.foundTracks[i].track,
              responseGet.foundTracks[i].artist == undefined
                ? ""
                : responseGet.foundTracks[i].artist
            );

            var queryForPopup =
              (query.length > 33 ? query.substring(0, 33) + "..." : query) +
              (responseGet.foundTracks[i].pageName == undefined
                ? ""
                : " - " + responseGet.foundTracks[i].pageName);

            htmlFoundHistory +=
              "<li>" +
              String.format(
                '<button class="searchButton btn btn-success" searchValue="{0}" pageName="{1}"> + </button>',
                encodeURIComponent(query),
                responseGet.foundTracks[i].pageName
              ) +
              queryForPopup +
              "</li>";
          }
          htmlFoundHistory += "</ul>";

          document.getElementById("foundHistory").innerHTML = htmlFoundHistory;

          $("#foundHistory").show();
          $("#notFoundHistory").hide();

          $(".searchButton").click(function() {
            searchQuery($(this).attr("searchValue"), $(this).attr("pageName"));
          });
        } else {
          $("#foundHistory").hide();
          $("#search-history-head").hide();
          $("#notFoundHistory").show();
        }
      } else {
        $("#foundHistory").hide();
        $("#search-history-head").hide();
        $("#notFoundHistory").show();
      }
    }
  );
}

function saveTrackToStorage(foundTrack, callback) {
  var tempfoundTracks;

  chrome.storage.sync.get(
    {
      foundTracks: "foundTracks"
    },
    function(responseGet) {
      if (responseGet.foundTracks == "foundTracks") {
        tempfoundTracks = [];
      } else {
        tempfoundTracks = responseGet.foundTracks;
      }

      var found = false;
      var foundIndex = 0;
      for (var i = 0; i < tempfoundTracks.length; i++) {
        if (tempfoundTracks[i].track == foundTrack.track) {
          // && tempfoundTracks[i].artist == foundTrack.artist
          found = true;
          foundIndex = i;
          break;
        }
      }

      if (found) {
        if (foundIndex !== -1) {
          tempfoundTracks.splice(foundIndex, 1);
        }
      }

      tempfoundTracks.unshift(foundTrack);

      if (tempfoundTracks.length > 50) {
        tempfoundTracks = tempfoundTracks.splice(0, 50);
      }

      chrome.storage.sync.set(
        {
          foundTracks: tempfoundTracks
        },
        function(responseSet) {
          callback(found);
        }
      );
    }
  );
}

//this message can only be sent to background
chrome.runtime.sendMessage({ type: "clearBadge" });

function start() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url.toLowerCase();

    var pageName = getPageName(url);

    if (pageName != undefined) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getTrackInfo", pageName: pageName },
        function(trackInfo) {
          if (
            trackInfo != undefined &&
            trackInfo.success &&
            trackInfo.track != ""
          ) {
            if (trackInfo.artist == undefined) {
              trackInfo.artist = "";
            }

            var query = String.format(
              "{0} {1}",
              trackInfo.track,
              trackInfo.artist
            );
            var url = String.format(
              "{0}{1}?q={2}&p={3}&fromChrome=true",
              defaults.url,
              defaults.searchPath,
              encodeURIComponent(query),
              pageName
            );
            redirect(url);
          } else {
            var url = String.format("{0}?fromChrome=true", defaults.url);
            redirect(url);
          }
        }
      );
    } else {
      var url = String.format("{0}?fromChrome=true", defaults.url);
      redirect(url);
    }
  });
}

function openIframe(url) {
  showIframe(url);
}

function redirect(url) {
  chrome.tabs.create({ url: url });
}

function showIframe(url) {
  $("#iframe").show();
  $("#loading").hide();
  $("#iframe").attr("src", url);
}

$(document).ready(function() {
  start();
});
