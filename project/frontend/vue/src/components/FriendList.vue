<script setup>
import UserButton from './UserButton.vue';


defineProps({
    friends: {
        type: Array,
        required: true
    }
})

</script>

<template>
    <div class="w-full text-stone-300">
        <div class="bg-sky-900 ">
            Friend List
        </div>
        <ul>
            <li v-for="friend in friends" > 
            <UserButton :user="friend" />
            </li>
        </ul>
        
    </div>
</template>