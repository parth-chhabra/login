<template>
    <div class="login-box">
        <md-card md-with-hover>
            <md-card-header>
                <div class="md-title">Login</div>
                <md-progress-spinner
                    v-if="loading"
                    :md-diameter="30"
                    :md-stroke="3"
                    md-mode="indeterminate">
                </md-progress-spinner>
            </md-card-header>
            <md-card-content>
                <md-tabs md-alignment="centered">
                    <md-tab id="tab-email" md-label="Use Email">
                        <md-field>
                            <label>Email</label>
                            <md-input v-model="user.email" required></md-input>
                            <span class="md-error">Enter valid email</span>
                        </md-field>
                        <md-field>
                            <label>Password</label>
                            <md-input v-model="user.password" type="password" required></md-input>
                            <span class="md-error">Enter valid password</span>
                        </md-field>
                    </md-tab>
                    <md-tab id="tab-phone" md-label="Use Phone">
                        <md-field>
                            <label>Phone</label>
                            <md-input v-model="user.phone" required></md-input>
                            <span class="md-error">Enter valid Phone</span>
                        </md-field>
                        <md-button v-if="!getOtp" class="md-raised" @click="getOTP" :disabled="!user.phone">Get OTP</md-button>
                        <md-field v-if="getOtp">
                            <label>OTP</label>
                            <md-input v-model="user.otp" type="password" required></md-input>
                            <span class="md-error">Enter valid otp</span>
                        </md-field>
                    </md-tab>
                </md-tabs>
            </md-card-content>

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
                <span>Wrong OTP entered Please Retry</span>
            </md-snackbar>
            <md-snackbar
                md-position="center"
                :md-active.sync="invalid"
                md-persistent>
                <span>Unregistered/wrong email or password</span>
            </md-snackbar>

            <md-card-actions>
                <md-button class="md-accent" @click="reset">Reset</md-button>
                <md-button class="md-primary" @click="login">Login</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: '',
                phone: '',
                otp: '',
            },
            getOtp: false,
            retry: false,
            invalid: false,
            wrong: false,
            loading: false,
        };
    },
    methods: {
        reset() {
            this.user.email = '';
            this.user.password = '';
            this.user.phone = '';
            this.user.otp = '';
            this.getOtp = false;
        },
        getOTP() {
            this.getOtp = true;
            this.loading = true;
            axios.post('/getotp', {phone: this.user.phone}).then((res) => {
                this.loading = false;
                if (res.data === 'sent') return;
                this.getOtp = false;
                if (res.data === 'retry') {
                    this.retry = true;
                }
                if (res.data === 'invalid') {
                    this.invalid = true;
                }
            }).catch((err) => {
                console.error(err);
                this.loading = false;
            });
        },
        login() {
            this.loading = true;
            axios.post('/login', this.user).then((res) => {
                if (res.data.type === 'redirect') {
                    this.$router.push('/me');
                }
                if (res.data.type === 'invalid') {
                    this.invalid = true;
                }
                if (res.data.type === 'wrong') {
                    this.wrong = true;
                }
                this.loading = false;
            }).catch((err) => {
                console.error(err);
            });
        },
    },
}
</script>

<style scoped>
    .login-box {
        width: 800px;
        margin: auto;
        padding-top: 50px;
    }
</style>