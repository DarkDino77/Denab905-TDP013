<script setup lang="ts">
import { Suspense } from 'vue';
</script>


<template>
    <main>    
        <Suspense>
            <router-view></router-view> 
        </Suspense>
    </main>

</template>