<script setup>

import HeaderBar from './components/HeaderBar.vue';
import * as utils from './utils.js';

</script>

<template>
    <main>    
        <HeaderBar v-if="utils.isLoggedIn()"/>
        <router-view></router-view> 
    </main>

</template>