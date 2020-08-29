<template>
    <div>
        <el-form
                v-loading="loginLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :rules="rules" :model="loginForm" ref="loginForm" class="loginContainer">
            <h3>Login in</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" autocomplete="off"
                          placeholder="username" @keydown.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off"
                          placeholder="password"  @keydown.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked">Remember me</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitForm('loginForm')">Login</el-button>
        </el-form>
    </div>
</template>

<script>
      export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "admin",
                    password: "123"
                },
                loginLoading : false,
                checked: true,
                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}],
                }
            }
        },
        methods:{
            submitForm(formname){
                this.loginLoading = true
                this.$refs.loginForm.validate((valid)=>{
                    if (valid) {
                        this.postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
                            if (resp) {
                                this.loginLoading = false
                                window.sessionStorage.setItem("user",JSON.stringify(resp.obj))
                                this.$router.replace("/home")
                            }
                        })
                    }else{
                         this.$message.error("请输入所有字段");
                        return false
                    }
                });

            }
        },

    }
</script>

<style scoped>
    .loginContainer {
        width: 350px;
        border-radius: 10px;
        background-clip: padding-box;
        margin: 180px auto;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 35px #cac6c6;
    }

    .loginContainer h3 {
        color: #505458;
    }

    .loginContainer button {
        margin: 15px 0 10px 0;
    }
</style>