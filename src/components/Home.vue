<template>
    <div>
        <div v-if="user">
            <span>WELCOME {{ user.name }}</span>
            <md-button class="md-accent" @click="logout">Logout</md-button>
        </div>
        <div v-else>
            <router-link to="/login">
                <md-button class="md-raised md-primary">Login</md-button>
            </router-link>
            <router-link to="/signup">
                <md-button class="md-raised md-primary">Sign Up</md-button>
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  created() {
      const userToken = this.$cookie.get('userToken');
      if (userToken) {
          axios.post('/login', null, {headers: {userToken}}).then((res) => {
              if (res.data.type === 'success') {
                  this.$router.go();
                  this.user = res.data.user;
              }
          });
      }
  },
  data() {
      return {
          user: null,
      }
  },
  methods: {
      logout() {},
  },
}
</script>