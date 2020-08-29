<template>
    <div class="container">
        <el-input
                prefix-icon="el-icon-search"
                placeholder="请输入部门名称进行搜索"
                class="selectInput"
                v-model="filterText">
        </el-input>
        <el-tree :data="departmentsData" :props="defaultProps" node-key="id" ref="tree"
                 default-expand-all class="dataTree" :filter-node-method="filterNode"
                 :expand-on-click-node="false">
            <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
                  slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button class="depBtn" type="success" size="mini" circle icon="el-icon-plus"
                                @click="()=>showAddDepView(data,node)">
                    </el-button>
                    <el-button class="depBtn" type="danger" size="mini" circle icon="el-icon-delete"
                                @click="()=>deleteDep(data)">
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog title="编辑数据" :visible.sync="dialogFormVisible">
            <el-form :model="updateForm">
                <el-form-item label="上级部门" :label-width="formLabelWidth">
                    <el-input type="text" v-model="updateForm.parentName" autocomplete="off"
                              style="width: 220px" readonly></el-input>
                </el-form-item>
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="updateForm.name" autocomplete="off"
                              style="width: 220px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd(updateForm.name,updateForm.parentId)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                formLabelWidth: '120px',
                departmentsData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: '',
                updateForm:{
                    name:"",
                    parentName : "",
                    parentId:null
                },
                dialogFormVisible : false
            }
        },
        methods: {
            initDepartmentsData() {
                this.getRequest('/system/basic/departments/').then(resp => {
                    if (resp) {
                        this.departmentsData = resp.obj
                        console.log(resp);
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            showAddDepView(data){
                this.dialogFormVisible = true;
                this.updateForm.parentName = data.name
                this.updateForm.parentId = data.id
            },
            handleAdd(name,parentId){
                if(name && parentId){
                    let data = {"name":name,"parentId":parentId}
                    this.postRequest("/system/basic/departments/",data).then(resp => {
                        if (resp) {
                            this.dialogFormVisible = false;
                            this.addDep2Deps(resp.obj,this.departmentsData)
                            this.updateForm = {}
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            },
            addDep2Deps(dep,deps){
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if(d.id == dep.parentId){
                        d.children = d.children.concat(dep)
                        return
                    }else{
                        this.addDep2Deps(dep,d.children)
                    }
                }
                return;
            },
            deleteDep(data){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/departments/'+data.id).then(resp => {
                        if (resp) {
                            this.deleteFormDeps(data.id,this.departmentsData)
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
            deleteFormDeps(depId,deps){
                if(!deps){
                    return;
                }
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if(d.id == depId){
                        deps.splice(i,1)
                        return;
                    }else {
                        this.deleteFormDeps(depId,d.children)
                    }
                }
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },
        mounted() {
            this.initDepartmentsData()
        }
    }
</script>

<style scoped>
    .container{
        width: 500px;
    }
    .container .selectInput{
        margin-bottom: 10px;
    }
    .depBtn {
        padding: 3px;
    }
</style>