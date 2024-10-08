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

<div class="bg-sky-800 rounded-xl flex flex-col space-y-4 text-stone-300">
    <div class="font-bold">
    {{ post.author  }}
    </div>
    <div>
        {{ post.message  }}
    </div>
    <div class="italic">
        {{ formatDate(new Date(post.date))  }}
    </div>
</div>

</template>
