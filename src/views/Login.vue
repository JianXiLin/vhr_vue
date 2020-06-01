<template>
    <div class="form">
        <el-form :model="loginFrom" :rules="rules" ref="loginFrom">
            <p>登录系统</p>
            <el-form-item prop="username">
                <el-input v-model="loginFrom.username" placeholder="username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginFrom.password" placeholder="password"></el-input>
            </el-form-item>
            <el-button class="submitBtn" type="primary" @click="submitLoginForm('loginFrom')">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginFrom: {
                    username: 'admin',
                    password: "123456"
                },
                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}],
                }
            }
        },
        methods: {
            submitLoginForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('success');
                        this.$message({message: "登录成功", type: 'success'})
                    } else {
                        // this.$message({message: '这是一条消息提示'});
                        return false;
                    }
                })
            }
        }

    }
</script>

<style>
    .form {
        width: 400px;
        margin: 150px auto;
        padding: 2%;
        background: #fff;
        border: 1px solid #eaeaea;
        border-radius: 15px;
        background-clip: padding-box;
        box-shadow: 0 0 25px #cac0c6;
    }

    .form p {
        text-align: center;
        font-size: 22px;
    }

    .form .submitBtn {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 30px;
    }
</style>