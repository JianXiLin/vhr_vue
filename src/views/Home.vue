<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="homeTitle"><a href="#/home">微人事</a></div>
                <div>
                    <el-dropdown class="userInfo" @command="commandHandler">
                          <span class="el-dropdown-link">
                            {{user.name}}
                              <i><img :src="user.userface" alt="" class="img"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container class="container">
                <el-aside width="200px">
                    <el-menu
                            class="el-menu-vertical-demo menu"
                            router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routers" v-if="!item.hidden" :key="index">
                            <template slot="title">
                                <i :class="item.iconCls" class="menuIcon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item-group v-for="(childItem,index_1) in item.children" :key="index_1">
                                <el-menu-item :index="childItem.path">{{childItem.name}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main class="containerMain">
                    <el-breadcrumb separator="/" class="breadcrumb" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div v-if="this.$router.currentRoute.path=='/home'" class="homeDiv">
                        欢迎来到微人事！
                    </div>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {
            routers() {
                return this.$store.state.router;
            }
        },
        methods: {
            commandHandler(cmd) {
                if (cmd == "logout") {
                    this.$confirm('是否确认退出账号?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/logout");
                        window.sessionStorage.removeItem("user")
                        this.$store.commit('initRouter', [])
                        this.$router.replace("/")
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style scoped>
    a{
        color: white;
        text-decoration: none;
    }
    .homeHeader {
        background-color: mediumseagreen;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .homeTitle {
        font-size: 30px;
        font-family: 华文新魏,serif;
        color: white;
    }

    .userInfo {
        cursor: pointer;
        color: white;
        font-size: 16px;
        letter-spacing: 1px;
        font-weight: 600;
    }

    .userInfo .el-dropdown-link {
        display: flex;
        align-items: center;
    }

    .userInfo .el-dropdown-link .img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
    }

    .menu .menuIcon {
        color: mediumseagreen;
        margin-right: 5px;
    }

    .container .containerMain .breadcrumb {
        margin: 0 0 20px 5px
    }

    .homeDiv {
        text-align: center;
        font-family: 华文新魏,serif;
        color: mediumseagreen;
        font-size: 40px;
        margin-top: 50px;
    }
</style>