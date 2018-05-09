var link = location.href;

url(link);

var polarising_score;

function url(link) {
    console.log("AJAX Start");
    var data = {js_link: link}
    $.ajax({
        dataType: "text",
        type: "POST",
        url : "https://35.185.133.86/check.php",
        data: {
          'url' : link,
        },
        success : function(response){
          if(response=="0") {
			console.log("in here");
            $.ajax({
              url: 'https://35.185.133.86:5000/postmethod',
              data: JSON.stringify(data),
              type: 'POST',
              success: function (response) {
                    console.log("AJAX Success. SCORE =>");
      			        console.log(response);
                    console.log(response.score); //T  his works
              			polarising_score = response.score;
              			chrome.runtime.sendMessage({score: response.score}, function(response) {});
                    $.ajax({
                        url: 'https://35.185.133.86/insert.php',
                        data: {
                          'url' : link,
                          'score' : response.score,
                          'magnitude' : response.magnitude,
                        },
                        type: 'POST',
                        success: function (response) {
                          console.log(response);
                        },
                        error: function (error) {
                            console.log(error);
                        },
                        dataType: "text",
                    });
              },
              error: function (error) {
                  console.log("AJAX Error. Error =>");
                  console.log(error);
              },
              dataType: "json",
              contentType: 'application/json;charset=UTF-8',
          });
        }
        else {
            console.log("else");
            console.log(response);
            var result = JSON.parse(response);
            console.log(result.score);
            polarising_score = result.score;
            chrome.runtime.sendMessage({score: result.score}, function(result) {});
        }
      }
      })
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
			sendResponse(polarising_score);
			});