const path = 'http://localhost:3000';

async function get_messages()
{
    const response = await fetch(path + "/messages");
    let json = await response.json();

    return json;
}

async function render_messages() 
{
    let list = document.getElementById("message_list");
    list.innerHTML = "";

    let messages = await get_messages();

    for (let i = 0; i < messages.length; i++) {
        add_message(messages[i]);
    }
}

window.onload = () => {
    render_messages();
}

async function save_message(author, message)
{
    const request = {
        "author" : author,
        "message": message,
        "read" :  "false",
        "time" : 0
    };

    const response = await fetch(path + "/messages", ({
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }));

    if (response.status == 200) {
        add_message(await response.json());
    } else{
        let error = document.getElementById("error_msg");
        error.textContent = response.statusText + response.status
    }
}

async function change_read_status(id)
{
    let post = document.getElementById(id);
    let checkbox = post.getElementsByClassName("read")[0];

    const request = {
        "read" : "" + checkbox.checked
    };

    const url = path + "/messages/" + id;
    const response = await fetch(url, ({
        method: "PATCH",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }));

    if (response.status == 200) {
        // TODO: returnera true
        if (checkbox.checked) {
            post.classList.add("class", "checked");
        } else {
            post.classList.remove("checked");
        }

        checkbox.setAttribute("checked", json.read);
    } 
    else{
        let error = document.getElementById("error_msg");
        error.textContent = response.statusText + response.status
    }
}

function add_message(msg)
{
    let item = document.createElement("li");
    item.addEventListener('change', async function (event) {
        event.preventDefault();
        change_read_status(msg._id);
    })

    item.setAttribute("id", msg._id);
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

    if (msg.read === true) {
        checkbox.setAttribute("checked", true);
        item.classList.add("class", "checked");
    }

    middle.appendChild(checkbox);
    
    item.appendChild(middle);

    let time = document.createElement("div");
    time.setAttribute("class", "time");
    const date = new Date(msg.time);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const date_string = date.toLocaleString('sv-SE', options).replace(',', '');
    
    time.innerHTML = "Posted on " + date_string;
    item.appendChild(time);
    let list = document.getElementById("message_list")
    list.insertBefore(item, list.firstChild);
}

document.getElementById('post').addEventListener('submit', async function(event) {
    event.preventDefault();

    let author = document.getElementById("Author").value;
    let msg = document.getElementById("Message").value;

    let error = document.getElementById("error_msg");
    error_msg = ""
    if (msg.length === 0 || msg.replaceAll(" ","").length === 0) {
        error_msg = "Message can not be empty.";
    } else if (msg.length > 140 || author.length > 140) {
        error_msg = "Message can not be longer than 140 characters.";
    } else {
        document.getElementById("Message").value = "";

        save_message(
            (author.length == 0) ? "Author" : author,
            msg);
    }
    
    error.textContent = error_msg;
});
