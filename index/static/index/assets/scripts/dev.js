/*
    This file is intended to add functionality
    to the development page 

    1/11/2019

    Syncronosys
*/

var activate
var ac
var message
var pre
window.onload = () => 
{
    // element definitions
    activate = document.getElementById("b-activate");
    ac = document.getElementById("accesscode");
    message = document.getElementsByClassName("message")[0];
    pre = document.getElementsByClassName("preloader-loader")[0];

    // event handles
    activate.addEventListener("click", activateClick);
}

// handles
function activateClick() // Check AC validity
{
    var header = [{name: "ac", value: ac.value}];
    if(ac.value)
    {
        pre.style.visibility = "visible";

        loadDocument("http://127.0.0.1:8000/check/", header, "?action=checkAC", acResponse);
    }
    else // If nothing is entered
    {
        ac.style.borderColor = "#B00020";

        message.innerHTML = "Enter an Access Code";
        message.style.visibility = "visible";  
    }
}

// callbacks
function acResponse(success, data, error)
{
    pre.style.visibility = "hidden";

    if(success) // Request successful; doesn't mean valid code
    {
        data = JSON.parse(data);
        if(data.type)
        {
            if(data["type"] == "data")
            {
                if(data.value == "non_exist")
                {
                    // Invalid AC
                    ac.style.borderColor = "#B00020";

                    message.innerHTML = "Invalid Access Code";
                    message.style.visibility = "visible";

                    console.log("Invalid access code");
                }
                else if(data.value == "exists")
                {
                    // Valid AC
                    ac.style.borderColor = "rgb(0, 215, 210)";

                    message.style.visibility = "hidden";
                }
            }
        }
    }
    else // Handle error
    {
        console.log("Internal error: " + error);
    }
}

// framework
function loadDocument(url, headers, trail, callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => 
    {
        if(xhttp.readyState == 4 && xhttp.status == 200) 
        {
            console.log("Response received: " + xhttp.responseText);

            callback(true, xhttp.responseText);
        }
        else if(xhttp.status != 200)
        {
            console.log("State changed: " + xhttp.status);
        }
        else if(xhttp.status != 200 && xhttp.status != "" && xhttp.readyState == 4)
        {
            callback(false, null, xhhtp.status);
        }
    };
    xhttp.open("POST", encodeURI(url + trail));

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'))
    
    var payload = "";
    if(headers !== null)
    {
        for(var i = 0; i < headers.length; i++)
        {
            console.log("Created header: " + headers[i]["name"] + " => " + headers[i]["value"]);

            payload = (payload + "&" + headers[i]["name"] + "=" + headers[i]["value"]);
        }
    }
    

    if(!trail)
    {
        trail = "";
    }
    xhttp.send(payload);

    console.log("Sent data to: " + url + trail);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}