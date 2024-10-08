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
    <div class="">
        <ul>
            <li v-for="friend in friends" > 
            <UserButton :user="friend" />
            </li>
        </ul>
        
    </div>
</template>