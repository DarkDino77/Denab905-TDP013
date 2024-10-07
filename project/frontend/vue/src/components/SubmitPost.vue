<script setup>

const postModel = defineModel('post');
const errorModel = defineModel('error');

const emit = defineEmits(['newPost']);

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

function messageIsValid(message) {
    return message.length <= 140 &&
    message.length > 0;
}

function sendPost() {
    const trimmed = postModel.value.trim();
    if (messageIsValid(trimmed)) {
        errorModel.value = "";
        
        const request = {
            "message": trimmed
        };

        fetch(`http://localhost:8080/users/${props.id}/wall`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
        },
            credentials: 'include',
            body: JSON.stringify(request)
        })
        .then(() => {
            emit('newPost');
        });

    } else {
        errorModel.value = "Invalid message!";
    }
}

</script>

<template>
    <form id="post" v-on:submit.prevent>
        <div>
            <label for="message">Message:</label>
            <textarea 
            v-model="postModel"
            class="message"></textarea>
            <input @click="sendPost" type="submit" value="Submit">
        </div>
    </form>
    <p>{{ errorModel }}</p>
</template>