<template>
    <div>
        <div v-if="user" class="user-box">
            <md-card>
                <md-card-header>
                    <div class="md-title">WELCOME</div>
                </md-card-header>

                <md-card-content>
                    Hi {{ user.name }}
                </md-card-content>

                <md-card-actions>
                    <md-button class="md-raised md-accent" @click="logout">Logout</md-button>
                </md-card-actions>
            </md-card>
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
  data() {
      return {
          user: null,
      };
  },
  created() {
      const userToken = this.$cookies.get('userToken');
      if (!this.user && userToken) {
          axios.post('/login', null, {headers: {userToken}}).then((res) => {
              if (res.data.type === 'redirect') {
                  this.user = res.data.user;
              }
          });
      }
  },
  methods: {
      logout() {
          this.$cookies.remove('userToken');
          this.$router.go();
      },
  },
}
</script>

<style scoped>
    .user-box {
        width: 900px;
        margin: auto;
        padding-top: 50px;
    }
</style>