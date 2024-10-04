<script setup>
import { onMounted, Suspense } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const user = defineModel('user');

onMounted(async () => {
    const path = `http://localhost:8080/users/${props.id}`;
    console.log(document.cookie)
    const response = await fetch(path, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status == 200) {
        user.value = await response.json();

    } else {
        // TODO: gör detta på ett mindre dåligt sätt
        router.go(-1);
        return;
    }


    console.log(user.value)
})


</script>

<template>
    <div>
        <p>{{ id }}</p>
    </div>
</template>