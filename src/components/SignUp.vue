<template>
    <div class="signup-box">
        <md-card md-with-hover>
            <md-card-header>
                <div class="md-title">{{ verify ? 'Verification': 'Sign Up' }}</div>
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

            <md-card-actions>
                <md-button @click="reset" v-if="!verify">Reset</md-button>
                <md-button @click="signUp">{{ verify ? 'Verify' : 'Sign Up' }}</md-button>
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
            axios.post('/signup', this.user).then((res) => {
                if (res.data === 'verify') {
                    this.verify = true;
                }
                if (res.data === 'exists') {
                    this.exists = true;
                }
            })
            .catch((err) => {
                console.error(err);
            })
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