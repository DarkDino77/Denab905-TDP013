

// const btn = document.querySelector("button");

// btn.addEventListener("click", () => {
//     alert("aaaa");
// })

document.getElementById('post').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    let author = document.getElementById("Author").value;
    let msg = document.getElementById("Message").value;
    let  = {
        "author" : author,
        "message" : msg
    }

    // Log the values to the console (or handle them as needed)
    alert("hello");
    console.log(o);
});

// function formPost() {
//     document.getElementById('post').addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the default form submission
    
//         // Log the values to the console (or handle them as needed)
//         alert("hello");
//         //console.log('Message:', message);
//     });


//     // let error = document.getElementById("error_msg");
//     // error.textContent = "Error";
// }


