<template>
    <div class="container">
        <div class="searchForm">
            <el-input v-model="searchForm.keywork" placeholder="请输入用户名称"
                      prefix-icon="el-icon-search" class="searchInput" size="small"
                      @keydown.enter.native="searchHrs(searchForm.keywork)"></el-input>
            <el-button type="primary" class="searchBtn" size="small" @click="searchHrs(searchForm.keywork)">搜索</el-button>
        </div>
        <div class="cards">
            <el-card class="box-card" v-for="(hr,index) in hrsData" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"
                               @click="deleteHr(hr.id)"></el-button>
                </div>
                <div class="hrData">
                    <div class="hrImgDiv">
                        <el-image
                                class="hrImg"
                                :src="hr.userFace"></el-image>
                    </div>
                    <div>手机号码：{{hr.phone}}</div>
                    <div>电话号码：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div>启用：
                        <el-tooltip :content="hr.enabled ?'开启':'禁用'" placement="right">
                            <el-switch
                                    :key="index"
                                    @change="enabledChange(hr)"
                                    v-model="hr.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </el-tooltip>
                    </div>

                    <div>
                        角色：
                        <el-tag v-for="(role,index) in hr.roles" :key="index"
                                style="margin: 0 10px 0 0">{{role.nameZh}}
                        </el-tag>
                        <el-popover
                                placement="right"
                                @show="initRoles(hr)"
                                @hide="updateRoles(hr.id,selectedRoles)"
                                title="角色列表"
                                width="200"
                                trigger="click">
                            <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                <el-option
                                        v-for="(role,indexR) in allRoles"
                                        :key="indexR"
                                        :label="role.nameZh"
                                        :value="role.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" type="text" style="color: #3caf6f;font-size:20px;">...
                            </el-button>
                        </el-popover>
                    </div>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                searchForm: {
                    keywork: ''
                },
                hrsData: [],
                allRoles: [],
                selectedRoles: [],
            }
        },
        methods: {
            initHrData() {
                this.getRequest('/system/hr/').then(resp => {
                    if (resp) {
                        this.hrsData = resp.obj
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            initRoles(hr) {
                this.initSelectedRoles(hr)
                this.getRequest('system/hr/roles').then(resp => {
                    if (resp) {
                        this.allRoles = resp.obj;
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            initSelectedRoles(hr) {
                let roleIds = []
                hr.roles.forEach(role => {
                    roleIds.push(role.id)
                })
                this.selectedRoles = roleIds
            },

            updateRoles(hid, roleIds) {
                if (hid && roleIds) {
                    let  url =  "/system/hr/roles"
                    url += `?hId=${hid}&`
                    roleIds.forEach(rId=>{
                        url += `roleIds=${rId}&`
                    })
                    this.putRequest(url).then(resp => {
                        if (resp) {
                            this.initHrData()
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            },
            enabledChange(hr) {
                this.putRequest('/system/hr/', hr).then(resp => {
                    if (resp) {
                        console.log(resp);
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            deleteHr(hId) {
                this.$confirm('此操作将永久删除该Hr, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (hId){
                        this.deleteRequest("/system/hr/"+hId).then(resp => {
                            if (resp) {
                                this.initHrData()
                            }
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            searchHrs(keyword){
                if (keyword) {
                    this.getRequest("/system/hr/?keywork="+keyword).then(resp => {
                        if (resp) {
                            this.hrsData = resp.obj
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }else {
                    this.initHrData()
                }

            }
        },
        mounted() {
            this.initHrData()
        }

    }
</script>

<style scoped>
    .container {
    }

    .container .searchForm {
        text-align: center;
        margin-bottom: 20px;
    }

    .container .searchForm .searchInput {
        width: 500px;
        margin-right: 10px;
    }

    .container .searchForm .searchBtn {
        background-color: #3caf6f;
    }

    .container .cards {
        text-align: center;
    }

    .container .box-card {
        display: inline-block;
        width: 350px;
        margin: 10px 20px;
        text-align: left;
    }

    .container .box-card .hrData {
    }

    .container .box-card .hrData div {
        margin-bottom: 5px;
    }

    .container .box-card .hrData .hrImgDiv {
        width: 60px;
        height: 60px;
        margin: auto;
        border-radius: 50%;
    }

    .container .box-card .hrData .hrImgDiv .hrImg {
        border-radius: 50%;
        width: 60px;
        height: 60px;
    }
</style>