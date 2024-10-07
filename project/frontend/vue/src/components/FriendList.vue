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

<li v-for="friend in friends">
    {{ friend }}
    <UserButton :user="friend" />
</li>

</template>