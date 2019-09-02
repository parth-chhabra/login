<template>
    <div class="login-box">
        <md-card md-with-hover>
            <md-card-header>
                <div class="md-title">Login</div>
            </md-card-header>
            <md-card-content>
                <md-tabs class="md-primary" md-alignment="centered">
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
                        <md-button v-if="!getOtp" class="md-raised md-accent" @click="getOTP" :disabled="!user.phone">Get OTP</md-button>
                        <md-field v-if="getOtp">
                            <label>OTP</label>
                            <md-input v-model="otp" type="password" required></md-input>
                            <span class="md-error">Enter valid otp</span>
                        </md-field>
                    </md-tab>
                </md-tabs>
            </md-card-content>

            <md-card-actions>
                <md-button @click="reset">Reset</md-button>
                <md-button @click="submit">Login</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: '',
                phone: '',
            },
            otp: '',
            getOtp: false,
        };
    },
    methods: {
        reset() {
            this.user.email = '';
            this.user.password = '';
            this.user.phone = '';
            this.otp = '';
            this.getOtp = false;
        },
        getOTP() {
            this.getOtp = true;
        },
        submit() {},
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