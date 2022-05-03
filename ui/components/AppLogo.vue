<template>
    <div style="position: relative">
        <img class="app-logo" alt="app-logo" src="/logo.png" />
        <div v-if="badge" style="position: absolute; bottom: 0px; right: 0px">
            <img style="width: 100px; height: 100px; object-fit: contain" src="/money-back.png" />
        </div>
    </div>
</template>

<style>
.app-logo {
    height: 180px;
}
</style>

<script>
export default {
    name: 'Logo',
    props: ['badge'],
};
</script>
