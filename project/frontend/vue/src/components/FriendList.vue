<script setup>
import UserButton from './UserButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();


defineProps({
    friends: {
        type: Array,
        required: true
    }
})

function goToChat(id) {

    router.push('/chat/' + id);

}

</script>

<template>
    <div class="w-full text-stone-300 bg-navy rounded-xl m-16">
        <div class="bg-sky-900 rounded-xl m-2 p-2 ">
            Friend List
        </div>
        <ul>
            
            <li v-for="friend in friends">
                <div class="flex flex-row bg-sky-900 rounded-xl m-2 p-2">
                    <UserButton :user="friend" />
                    <div  class="flex-grow">
                    <button @click="goToChat(friend.chat)" class="button-primary bg-green-600 hover:bg-green-400">Chat</button>
                </div>
                </div>
            </li>
        </ul>

    </div>
</template>