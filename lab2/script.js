

// const btn = document.querySelector("button");

// btn.addEventListener("click", () => {
//     alert("aaaa");
// })

/*
        <li class="post">
            <div class="author">
                Author
            </div>
            <div class="middle">
                <div class="message">
                    Message
                </div>

                <input type="checkbox" class="read">
            </div>
            <div class="time">
                Time
            </div>
        </li>  
*/


async function get_messages()
{
    const url = 'http://localhost:3000/messages';

    const response = await fetch(url);
    let json = await response.json();

    return json;
    /*
    let cookie = `; ${document.cookie}`.match("messages=([^;]+)");

    if (cookie === null) {
        return [];
    }

    let result = JSON.parse(cookie[1]);

    if (Array.isArray(result) === false) {
        result = [result];
    }

    return result;
    */
}

async function render_messages() 
{
    let list = document.getElementById("message_list");
    list.innerHTML = "";

    let messages = await get_messages();

    for (let i = 0; i < messages.length; i++) {
        add_message(messages[i], i);
    }
}

window.onload = () => {
    render_messages();
}

function save_to_cookie(messages)
{
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "messages=" + JSON.stringify(messages);

    render_messages();
}

async function save_message()
{
    // Försök spara meddelandet
    // Om det misslyckades, visa felmeddelande
    // Om det lyckades, visa upp meddelandet som returnerades
    // Hur gör man med index för checkbox när man gör såhär, 
    // eftersom vi inte ska rendera om hela sidan?
}

function change_read_status(checkbox)
{
    let messages = get_messages();

    messages[checkbox.id].read = "" + checkbox.checked;

    save_to_cookie(messages);
    render_messages();
}

function add_message(msg, index)
{
    let item = document.createElement("li");
    item.setAttribute("class", "post");

    let author = document.createElement("div");
    author.setAttribute("class", "author");
    author.innerHTML = msg.author;
    item.appendChild(author);

    let middle = document.createElement("div");
    middle.setAttribute("class", "middle");

    let message = document.createElement("div");
    message.setAttribute("class", "message");
    message.innerHTML = msg.message;

    middle.appendChild(message);

    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "read form-check-input");
    checkbox.setAttribute("id", index);
    checkbox.setAttribute("onchange", "change_read_status(this)");

    if (msg.read === "true") {
        checkbox.setAttribute("checked", true);
        item.classList.add("class", "checked");
    }

    middle.appendChild(checkbox);
    
    item.appendChild(middle);

    let time = document.createElement("div");
    time.setAttribute("class", "time");
    date = new Date(msg.time);
    date_string = date.getFullYear() + "-" + (date.getMonth() + 1) +
    "-" + date.getDate() + " " + date.toLocaleTimeString([],{hour12 : false, hour:"2-digit", minute : "2-digit"});
    time.innerHTML = "Posted on " + date_string;
    item.appendChild(time);

    document.getElementById("message_list").appendChild(item);
}

document.getElementById('post').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    let author = document.getElementById("Author").value;
    let msg = document.getElementById("Message").value;

    let error = document.getElementById("error_msg");
    error_msg = ""
    if (msg.length === 0) {
        // Log the values to the console (or handle them as needed)
        error_msg = "Message can not be empty.";
    } else if (msg.length > 140) {
        error_msg = "Message can not be longer than 140 characters.";
    } else {
        let request = {
            "author": (author.length === 0) ? "Author" : author,
            "message": msg,
            "time": Date.now(),
            "read": "false"
        }
  
        // let messages = await get_messages();
        // messages.unshift(request);

        document.getElementById("Message").value = "";
    }
    
    error.textContent = error_msg;
});
