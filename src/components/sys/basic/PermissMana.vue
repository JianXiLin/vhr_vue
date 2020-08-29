<template>
    <div class="container" style="width:750px">
        <el-input
                placeholder="请输入角色英文名称"
                v-model="insertData.name"
                class="insertInput">
            <template slot="prepend">ROLE_</template>
        </el-input>
        <el-input
                placeholder="请输入角色中文名称"
                v-model="insertData.nameZh"
                class="insertInput">
            <i slot="prefix" class="el-input__icon el-icon-plus"></i>
        </el-input>

        <el-button class="insertBtn" type="success" size="medium"
                   @click="insertRole(insertData)">添加
        </el-button>

        <el-collapse v-model="activeName" accordion v-for="(role,index) in roles" :key="index" @change="change">
            <el-collapse-item :title="role.nameZh" :name="role.id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>可访问资源</span>
                        <el-button style="float: right; padding: 3px 0;color: #f00" type="text"
                                   icon="el-icon-delete" @click="deleteRole(role.id)"></el-button>
                    </div>
                    <el-tree
                            :data="allMenuData"
                            :props="defaultProps"
                            ref="permissionTree"
                            accordion
                            show-checkbox
                            node-key="id"
                            :key="index"
                            :default-checked-keys="selectedMenuIds">
                    </el-tree>
                    <div class="updataBtnDiv">
                        <el-button class="updateBtn" type="success" size="small"
                                   icon="el-icon-check" @click="updateData(role.id,index)">修改
                        </el-button>
                    </div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                insertData: {
                    name: null,
                    nameZh: null
                },
                roles: [],
                activeName: -1,
                allMenuData: [],
                selectedMenuIds: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        methods: {
            /**
             * 折叠面板打开、关闭的回调函数
             * @param name 面板name
             */
            change(name) {
                // 打开面板后的操作
                if (name) {
                    if (this.allMenuData.length == 0) {
                        this.initMenu()
                    }
                    this.initSelectedMenu(name)
                }
            },
            /**
             * 初始化角色信息
             */
            initRoles() {
                this.getRequest('/system/basic/permission/roles').then(res => {
                    if (res) {
                        this.roles = res.obj
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            /**
             *  初始化角色的资源菜单
             */
            initMenu() {
                this.getRequest('/system/basic/permission/menu').then(res => {
                    if (res) {
                        this.allMenuData = res.obj
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            /**
             *  初始化角色资源菜单的开启状态
             * @param rid
             */
            initSelectedMenu(rid) {
                this.getRequest('/system/basic/permission/mIds/' + rid).then(res => {
                    if (res) {
                        this.selectedMenuIds = res.obj
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            handleNodeClick(data) {
                console.log(data);
            },
            //
            updateData(rid, index) {
                let selectedMenuIds = this.$refs.permissionTree[index].getCheckedKeys(true)
                let mids = '';
                selectedMenuIds.forEach(item => {
                    mids += `mids=${item}&`
                })
                this.putRequest('/system/basic/permission/?rid=' + rid + '&' + mids).then(res => {
                    if (res) {
                        // this.initRoles()
                        this.activeName = -1
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            /**
             * 删除角色
             * @param rid
             */
            deleteRole(rid) {
                this.$confirm('此操作将永久删除该角色(rid:' + rid + '), 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/permission/roles/' + rid).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /**
             * 添加角色
             * @param insertData 角色信息
             */
            insertRole(insertData) {
                insertData.name = 'ROLE_' + insertData.name
                this.postRequest('/system/basic/permission/roles', insertData).then(resp => {
                    if (resp) {
                        insertData.name = ''
                        insertData.nameZh = ''
                        this.initRoles();
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        },
        mounted() {
            this.initRoles()
        }
    }
</script>

<style scoped>
    .container {
    }

    .container .insertInput {
        width: 300px;
        margin-right: 10px;
    }

    .container .insertBtn {
        background-color: #3caf6f;
    }

    .container .updataBtnDiv {
        display: flex;
        justify-content: flex-end;
    }

    .container .updataBtnDiv .updateBtn {
        background-color: #3caf6f;
    }

    .container .el-collapse {
        border: none;
    }
</style>