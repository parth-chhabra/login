<template>
    <div class="signup-box">
        <md-card md-with-hover>
            <md-card-header>
                <div class="md-title">{{ verify ? 'Verification': 'Sign Up' }}</div>
                <md-progress-spinner
                    v-if="loading"
                    :md-diameter="30"
                    :md-stroke="3"
                    md-mode="indeterminate">
                </md-progress-spinner>
            </md-card-header>

            <md-card-content>
                <md-field v-if="!verify">
                    <label>Name</label>
                    <md-input v-model="user.name" required></md-input>
                    <span class="md-error">Enter valid name</span>
                </md-field>
                <md-field v-if="!verify">
                    <label>Email</label>
                    <md-input v-model="user.email" required></md-input>
                    <span class="md-error">Enter valid email</span>
                </md-field>
                <md-field v-if="!verify">
                    <label>Phone</label>
                    <md-input v-model="user.phone" required></md-input>
                    <span class="md-error">Enter valid phone</span>
                </md-field>
                <md-field v-if="!verify">
                    <label>Password</label>
                    <md-input v-model="user.password" type="password" required></md-input>
                    <span class="md-error">Enter valid password</span>
                </md-field>
                <md-field v-if="verify">
                    <label>Verfiy OTP</label>
                    <md-input v-model="user.otp" type="password" required></md-input>
                    <span class="md-error">Enter valid password</span>
                </md-field>
            </md-card-content>
            <md-snackbar
                md-position="center"
                :md-active.sync="exists"
                md-persistent>
                <span>Account with email or phone already exists</span>
            </md-snackbar>
            <md-snackbar
                md-position="center"
                :md-active.sync="retry"
                md-persistent>
                <span>Something messed up! Please Retry</span>
            </md-snackbar>
            <md-snackbar
                md-position="center"
                :md-active.sync="wrong"
                md-persistent>
                <span>Wrong OTP entered</span>
            </md-snackbar>

            <md-card-actions>
                <md-button class="md-accent" @click="reset" v-if="!verify" :disabled="loading">Reset</md-button>
                <md-button class="md-primary" @click="signUp" :disabled="loading">{{ verify ? 'Verify' : 'Sign Up' }}</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SignUp',
    data() {
        return {
            user: {
                name: '',
                email: '',
                phone: '',
                password: '',
                user: '',
            },
            verify: false,
            exists: false,
            retry: false,
            wrong: false,
            loading: false,
        };
    },
    methods: {
        reset() {
            this.user.name = '';
            this.user.email = '';
            this.user.phone = '';
            this.user.password = '';
            this.user.otp = '';
        },
        signUp() {
            this.loading = true;
            axios.post('/signup', this.user).then((res) => {
                if (res.data.type === 'verify') {
                    this.verify = true;
                }
                if (res.data.type === 'exists') {
                    this.exists = true;
                }
                if (res.data.type === 'retry') {
                    this.retry = true;
                }
                if (res.data.type === 'wrong') {
                    this.wrong = true;
                }
                if (res.data.type === 'redirect') {
                    this.$router.push('/me');
                }
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
            });
        },
    }
}
</script>

<style scoped>
    .signup-box {
        width: 800px;
        margin: auto;
        padding-top: 50px;
    }
</style>