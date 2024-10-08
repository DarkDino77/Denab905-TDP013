<script setup>

defineProps({
    post: {
        type: Object,
        required: true
    }
})

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const date_string = date.toLocaleString('sv-SE', options).replace(',', '');
    return date_string;
}

</script>

<template>

<div>
    <p> {{ formatDate(new Date(post.date))  }}</p>
    <p> {{ post.author  }}</p>
    <p> {{ post.message  }}</p>
</div>

</template>
