<template>
    <div>
        <router-link to="/login">
            <md-button class="md-raised md-primary">Login</md-button>
        </router-link>
        <router-link to="/signup">
            <md-button class="md-raised md-primary">Sign Up</md-button>
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>