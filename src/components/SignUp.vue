<template>
    <div class="signup-box">
        <md-card md-with-hover>
            <md-card-header>
                <div class="md-title">Signup</div>
            </md-card-header>

            <md-card-content>
                <md-field>
                    <label>Name</label>
                    <md-input v-model="user.name" required></md-input>
                    <span class="md-error">Enter valid name</span>
                </md-field>
                <md-field>
                    <label>Email</label>
                    <md-input v-model="user.email" required></md-input>
                    <span class="md-error">Enter valid email</span>
                </md-field>
                <md-field>
                    <label>Phone</label>
                    <md-input v-model="user.phone" required></md-input>
                    <span class="md-error">Enter valid phone</span>
                </md-field>
                <md-field>
                    <label>Password</label>
                    <md-input v-model="user.password" type="password" required></md-input>
                    <span class="md-error">Enter valid password</span>
                </md-field>
            </md-card-content>

            <md-card-actions>
                <md-button @click="reset">Reset</md-button>
                <md-button>Submit</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
export default {
    name: 'SignUp',
    data() {
        return {
            user: {
                name: '',
                email: '',
                phone: '',
                password: '',
            }
        };
    },
    methods: {
        reset() {
            this.user.name = '';
            this.user.email = '';
            this.user.phone = '';
            this.user.password = '';
        },
    },
}
</script>

<style scoped>
    .signup-box {
        width: 800px;
        margin: auto;
        padding-top: 50px;
    }
</style>