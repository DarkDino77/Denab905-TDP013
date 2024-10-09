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
    <div class="w-full text-stone-300 bg-navy rounded-xl m-16">
        <div class="bg-sky-900 rounded-xl m-2 p-2 ">
            Friend List
        </div>
        <ul>
            <li v-for="friend in friends">
                <div class=" bg-sky-900 rounded-xl m-2 p-2">
                    <UserButton :user="friend" />
                </div>
            </li>
        </ul>

    </div>
</template>