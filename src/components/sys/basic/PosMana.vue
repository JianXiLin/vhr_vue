<template>
    <div class="container">
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="编号"
                    width="120">
                <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="职位名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="createdate"
                    label="创建时间"
                    width="120"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column width="100">
                <template slot="header" slot-scope="scope">状态
                </template>
                <template slot-scope="scope">
                    <el-tag effect="light" type="success" v-if="scope.row.enabled">
                        已开启
                    </el-tag>
                    <el-tag effect="light" type="danger" v-else>
                        已禁用
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-input
                            placeholder="请输入职位名称"
                            v-model="insertData.name"
                            class="insertInput">
                        <i slot="prefix" class="el-input__icon el-icon-plus"></i>
                    </el-input>
                    <el-button class="insertBtn" type="success" size="medium"
                               @click="handleInsert(insertData.name)">添加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="openEditForm(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="multipleDelBtn" type="danger" icon="el-icon-delete" circle size="small"
                   @click="multipleHandleDelete()" :disabled="multipleBtnIsAble"></el-button>

        <el-dialog title="编辑数据" :visible.sync="dialogFormVisible">
            <el-form :model="updateForm">
                <el-form-item label="职位名称" :label-width="formLabelWidth">
                    <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否开启" :label-width="formLabelWidth">
                    <el-tooltip :content="updateForm.enabled?'已开启':'已关闭'" placement="right">
                        <el-switch
                                style="display: inline"
                                v-model="updateForm.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit(updateForm.name)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data(){
            return {
                tableData: [],
                multipleSelection: [],
                multipleBtnIsAble : true,
                insertData:{
                    name : null,
                    enabled : null
                },
                dialogFormVisible: false,
                updateForm: {
                    id : null,
                    name: '',
                    enabled:null
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length == 0) {
                    this.multipleBtnIsAble = true
                }else{
                    this.multipleBtnIsAble = false
                }
            },
            initTable(){
                this.getRequest("/system/basic/pos/").then(res=>{
                    if (res && res.status == 200) {
                        this.tableData = res.obj;
                    }
                }).catch(e=>{
                    console.log(e);
                })
            },
            // 打开”编辑“表单
            openEditForm(index, row){
                this.dialogFormVisible = true
                this.updateForm.name = row.name
                this.updateForm.id = row.id
                this.updateForm.enabled = row.enabled
            },
            // 编辑部门
            handleEdit(name) {
                if (name) {
                    this.putRequest('/system/basic/pos/', this.updateForm).then(res=>{
                        if (res) {
                            this.initTable();
                            this.dialogFormVisible = false;
                        }
                    }).catch(e=>{
                        console.log(e);
                    })
                }
            },
            // 删除部门
            handleDelete(index, row) {
                this.$confirm('是否确定删除该职位（'+row.name+'）?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+row.id).then(res=>{
                        if (res) {
                            this.initTable();
                        }
                    }).catch(e=>{
                        console.log(e);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            multipleHandleDelete(){
                console.log(this.multipleSelection);
                this.$confirm('是否确定删除所选的多个职位?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?'
                    this.multipleSelection.forEach(item=>{
                        ids += `ids=${item.id}&`
                    })
                    this.deleteRequest("/system/basic/pos/"+ids).then(res=>{
                        if (res) {
                            this.initTable();
                        }
                    }).catch(e=>{
                        console.log(e);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 添加部门
            handleInsert(name){
                if (name) {
                    this.postRequest("/system/basic/pos/",{"name":name}).then(res=>{
                        if (res) {
                            this.initTable();
                            this.insertData.name = '';
                        }
                    }).catch(e=>{
                        console.log(e);
                    })
                }else {
                    this.$message.error("职位名称不能为空");
                }

            }
        },
        mounted() {
            this.initTable();
        }
    }
</script>

<style scoped>
    .container{}
    .container .insertInput{
        width: 300px;
        margin-right: 10px;
    }
    .container .insertBtn{
        background-color: #3caf6f;
    }

    .container .multipleDelBtn{
        margin: 5px 0 0 5px;
    }
</style>