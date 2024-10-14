<script setup>

import * as store from '../store.js';

const userStore = store.loggedInUserStore();
const postModel = defineModel('post');
const errorModel = defineModel('error');

const emit = defineEmits(['clickSend']);

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});



function sendMessage() {
    emit('clickSend', postModel.value);
}

</script>

<template>
    <form id="post" v-on:submit.prevent>
        <div class="flex flex-row space-x-2 m-2">
            <textarea 
            v-model="postModel"
            placeholder="Message"
            class = "flex-grow resize-none rounded-xl px-2"></textarea>
            <input @click="sendMessage" type="submit" value="Submit" class="button-primary w-fit w-28">
        </div>
    </form>
    <p>{{ errorModel }}</p>
</template>