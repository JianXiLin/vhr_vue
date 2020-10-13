<template>
    <div class="container">
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-input
                        placeholder="请输入员工名称"
                        v-model="searchForm.name"
                        size="mini"
                        @keydown.native.enter="searchEmplyessWithName()"
                        clearable
                        @clear="searchEmplyessWithName()"
                        style="width: 350px;margin-right: 5px">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button type="success" style="background-color: #3caf6f" size="mini"
                           icon="el-icon-search" @click="searchEmplyessWithName()">搜索
                </el-button>
                <el-button type="success" style="background-color: #3caf6f" size="mini"
                           icon="el-icon-search">高级搜索
                </el-button>
            </div>
            <div>
                <el-upload
                        class="upload-demo"
                        style="display: inline-flex;margin-right: 5px"
                        :show-file-list="false"
                        :on-success="uploadSuccess"
                        :before-upload="uploadBefore"
                        :on-error="uploadError"
                        action="/emp/basic/inport">
                    <el-button type="primary" size="mini" :loading="isInport" class="el-icon-download">
                        {{titleOfInport}}
                    </el-button>
                </el-upload>

                <el-button type="primary" size="mini" @click="exportExcel" class="el-icon-upload2">
                    导出数据
                </el-button>
                <el-button type="success" style="background-color: #3caf6f" size="mini" icon="el-icon-plus"
                           @click="showAddDialog">
                    添加员工
                </el-button>
                <el-dialog
                        :title="title"
                        :visible.sync="dialogInsertTableVisible"
                        @close="depPopVisible=false"
                        @open="initInsertDataDialog"
                        width="80%">
                    <div>
                        <el-form :model="emp" :rules="rules" ref="empForm">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="姓名:" prop="name">
                                        <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                                  v-model="emp.name"
                                                  placeholder="请输入员工姓名"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="性别:" prop="gender">
                                        <el-radio-group v-model="emp.gender">
                                            <el-radio label="男">男</el-radio>
                                            <el-radio label="女">女</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="出生日期:" prop="birthday">
                                        <el-date-picker
                                                v-model="emp.birthday"
                                                size="mini"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                style="width: 150px;"
                                                placeholder="出生日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="政治面貌:" prop="politicId">
                                        <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini"
                                                   style="width: 200px;">
                                            <el-option
                                                    v-for="item in politicsstatus"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="民族:" prop="nationId">
                                        <el-select v-model="emp.nationId" placeholder="民族" size="mini"
                                                   style="width: 150px;">
                                            <el-option
                                                    v-for="item in nations"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="籍贯:" prop="nativePlace">
                                        <el-input size="mini" style="width: 120px" prefix-icon="el-icon-edit"
                                                  v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="电子邮箱:" prop="email">
                                        <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                                  v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="联系地址:" prop="address">
                                        <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                                  v-model="emp.address" placeholder="请输入联系地址"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="职位:" prop="posId">
                                        <el-select v-model="emp.posId" placeholder="职位" size="mini"
                                                   style="width: 150px;">
                                            <el-option
                                                    v-for="item in positions"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="职称:" prop="jobLevelId">
                                        <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini"
                                                   style="width: 150px;">
                                            <el-option
                                                    v-for="item in joblevels"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="所属部门:" prop="departmentId">
                                        <el-popover
                                                placement="right"
                                                title="请选择部门"
                                                width="200"
                                                trigger="manual"
                                                v-model="depPopVisible">
                                            <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                                     @node-click="selectDepartment"></el-tree>
                                            <div slot="reference"
                                                 style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                                                 @click="showDepView">{{inputDepName}}
                                            </div>
                                        </el-popover>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="电话号码:" prop="phone">
                                        <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                                  v-model="emp.phone" placeholder="电话号码"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="工号:" prop="workID">
                                        <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                                  v-model="emp.workID" placeholder="工号" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="学历:" prop="tiptopDegree">
                                        <el-select v-model="emp.tipTopDegree" placeholder="学历" size="mini"
                                                   style="width: 150px;">
                                            <el-option
                                                    v-for="item in tipTopDegrees"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="毕业院校:" prop="school">
                                        <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                                  v-model="emp.school" placeholder="毕业院校名称"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="专业名称:" prop="specialty">
                                        <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                                  v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="入职日期:" prop="beginDate">
                                        <el-date-picker
                                                v-model="emp.beginDate"
                                                size="mini"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                style="width: 130px;"
                                                placeholder="入职日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="转正日期:" prop="conversionTime">
                                        <el-date-picker
                                                v-model="emp.conversionTime"
                                                size="mini"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                style="width: 130px;"
                                                placeholder="转正日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="合同起始日期:" prop="beginContract">
                                        <el-date-picker
                                                v-model="emp.beginContract"
                                                size="mini"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                style="width: 130px;"
                                                placeholder="合同起始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="合同终止日期:" prop="endContract">
                                        <el-date-picker
                                                v-model="emp.endContract"
                                                size="mini"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                style="width: 150px;"
                                                placeholder="合同终止日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="身份证号码:" prop="idCard">
                                        <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                                                  v-model="emp.idCard" placeholder="请输入身份证号码"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="聘用形式:" prop="engageForm">
                                        <el-radio-group v-model="emp.engageForm">
                                            <el-radio label="劳动合同">劳动合同</el-radio>
                                            <el-radio label="劳务合同">劳务合同</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="婚姻状况:" prop="wedlock">
                                        <el-radio-group v-model="emp.wedlock">
                                            <el-radio label="已婚">已婚</el-radio>
                                            <el-radio label="未婚">未婚</el-radio>
                                            <el-radio label="离异">离异</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogInsertTableVisible = false">取 消</el-button>
                        <el-button type="primary" @click="isInsert?doAddEmp():doUpdateEmp()">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>

        <el-table
                ref="multipleTable"
                v-loading="loading"
                :data="employeesData"
                tooltip-effect="dark"
                border
                style="width: 100%;margin-top:20px ">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="name"
                    label="姓名"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="工号"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="gender"
                    label="性别"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="birthday"
                    label="出生日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="idCard"
                    label="身份证号码"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="wedlock"
                    label="婚姻状况"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="nation.name"
                    label="民族"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="nativePlace"
                    label="籍贯"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="politicsstatus.name"
                    label="政治面貌"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="电子邮箱"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话号码"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="联系地址"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="department.name"
                    label="部门"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="position.name"
                    label="职位"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="jobLevel.name"
                    label="职称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="engageForm"
                    label="聘用方式"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="beginDate"
                    label="入职日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="conversionTime"
                    label="转正日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="beginContract"
                    label="合同起始日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="endContract"
                    label="合同截至日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="contractTerm"
                    label="合同期限"
                    width="120">
                <template slot-scope="scope">
                    <el-tag type="success">{{scope.row.contractTerm}}</el-tag>
                    年
                </template>
            </el-table-column>
            <el-table-column
                    prop="tipTopDegree"
                    label="最高学历"
                    width="120">
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="280">
                <template slot-scope="scope">
                    <el-button type="button" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini">查看高级资料</el-button>
                    <el-button type="danger" size="mini" @click="doDelEmp(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: space-between;margin-top:30px">
            <el-button type="danger" size="mini">批量删除</el-button>
            <el-pagination
                    background
                    @current-change="currentChangeHandler"
                    @prev-click="prevPageClickHandler"
                    @next-click="nextPageClickHandler"
                    @size-change="sizeChangeHandler"
                    :page-sizes="[7,10,20,50]"
                    :page-size="page.size"
                    layout="sizes,total,prev, pager, next,jumper"
                    :total="page.total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                isInport:false,
                titleOfInport:"导入数据",
                isInsert: true,
                loading: false,
                searchForm: {
                    name: ''
                },
                employeesData: [],
                page: {
                    total: 0,
                    pageNum: 1,
                    size: 7
                },
                emp: {
                    name: "jianxi",
                    gender: "男",
                    birthday: "1998-06-31",
                    idCard: "610122199001011256",
                    wedlock: "未婚",
                    nationId: 1,
                    nativePlace: "陕西",
                    politicId: 13,
                    email: "laowang@qq.com",
                    phone: "18565558897",
                    address: "深圳市南山区",
                    departmentId: null,
                    jobLevelId: 9,
                    posId: 29,
                    engageForm: "劳务合同",
                    tipTopDegree: "本科",
                    specialty: "信息管理与信息系统",
                    school: "深圳大学",
                    beginDate: "2017-12-31",
                    workState: "在职",
                    workID: "00000057",
                    contractTerm: 2,
                    conversionTime: "2018-03-31",
                    notworkDate: null,
                    beginContract: "2017-12-31",
                    endContract: "2019-12-31",
                    workAge: null
                },
                title: '',
                dialogInsertTableVisible: false,
                depPopVisible: false,
                insertFrom: [],
                nations: [],
                joblevels: [],
                politicsstatus: [],
                positions: [],
                tipTopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
                allDeps: [],
                inputDepName: '所属部门',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                    idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                    nationId: [{required: true, message: '请输入您组', trigger: 'blur'}],
                    nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
                    posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
                    engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
                    tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                    school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                    beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
                    workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                    workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
                    conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
                    notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
                    beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
                    endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
                    workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
                }
            }

        },
        methods: {
            emptyEmp() {
                this.emp = {
                    name: "",
                    gender: "",
                    birthday: "",
                    idCard: "",
                    wedlock: "",
                    nationId: 1,
                    nativePlace: "",
                    politicId: 13,
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: null,
                    jobLevelId: 9,
                    posId: 29,
                    engageForm: "",
                    tipTopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: 2,
                    conversionTime: "",
                    notworkDate: null,
                    beginContract: "",
                    endContract: "",
                    workAge: null
                },
                    this.inputDepName = ""
            },
            /**
             * 修改显示的员工数据
             */
            modifyDisplayedEmplyees() {
                this.loading = true
                let params = "?";
                if (this.page.pageNum) {
                    params += "page=" + this.page.pageNum + "&";
                }
                if (this.page.size) {
                    params += "size=" + this.page.size + "&";
                }
                if (this.searchForm.name) {
                    params += "keyWork=" + this.searchForm.name + "&";
                }
                console.log(params);
                this.getRequest("/emp/basic/" + params).then(resp => {
                    if (resp) {
                        this.employeesData = resp.obj.data
                        this.page.total = resp.obj.total
                        this.loading = false
                    }
                }).catch(e => {
                    console.log(e)
                    this.loading = false
                })
            },
            /**
             * 处理页码按钮事件
             * @param currentPage 当前页码
             */
            currentChangeHandler(currentPage) {
                this.page.pageNum = currentPage
                this.modifyDisplayedEmplyees();
            },
            /**
             * ”下一页“按钮的事件处理
             */
            nextPageClickHandler() {
                this.page.pageNum = this.page.pageNum !== this.page.size / this.page.pageNum ? this.page.pageNum + 1 : this.page.pageNum
                this.modifyDisplayedEmplyees();
            },
            /**
             * ”上一页“按钮的事件处理
             */
            prevPageClickHandler() {
                this.page.pageNum = this.page.pageNum !== 1 ? this.page.pageNum - 1 : this.page.pageNum
                this.modifyDisplayedEmplyees();
            },
            /**
             *  切换页面大小的处理
             * @param pageSize 页面大小
             */
            sizeChangeHandler(pageSize) {
                this.page.size = pageSize
                this.modifyDisplayedEmplyees();
            },
            /**
             * 通过员工名称查询员工信息
             */
            searchEmplyessWithName() {
                this.modifyDisplayedEmplyees();
            },

            /**
             * 添加员工弹出框--显示部门信息
             */
            showDepView() {
                this.depPopVisible = !this.depPopVisible
            },

            selectDepartment(data) {
                this.inputDepName = data.name
                this.emp.departmentId = data.id
                this.depPopVisible = false
            },
            showAddDialog() {
                this.isInsert = true;
                this.emptyEmp();
                this.dialogInsertTableVisible = true
            },
            /**
             *  处理添加员工事件
             */
            doAddEmp() {
                console.log(this.emp);

                this.postRequest("/emp/basic/", this.emp).then(resp => {
                    if (resp) {
                        this.dialogInsertTableVisible = false
                        this.modifyDisplayedEmplyees()
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            /**
             * 初始化添加数据弹出框页面
             */
            initInsertDataDialog() {
                //获取政治面貌列表
                this.getRequest("/emp/basic/politics/list/").then(resp => {
                    if (resp) {
                        this.politicsstatus = resp
                    }
                }).catch(e => {
                    console.log(e)
                })
                //获取民族列表
                this.getRequest("/emp/basic/nation/list/").then(resp => {
                    if (resp) {
                        this.nations = resp
                    }
                }).catch(e => {
                    console.log(e)
                })
                //获取部门列表
                this.getRequest("/emp/basic/department/list/").then(resp => {
                    if (resp) {
                        console.log(resp);
                        // this.inputDepName = resp[0].name
                        // this.emp.departmentId = resp[0].id
                        this.allDeps = resp
                    }
                }).catch(e => {
                    console.log(e)
                })
                //获取职位列表
                this.getRequest("/emp/basic/position/list/").then(resp => {
                    if (resp) {
                        this.positions = resp
                    }
                }).catch(e => {
                    console.log(e)
                })
                //获取职称列表
                this.getRequest("/emp/basic/joblevel/list/").then(resp => {
                    if (resp) {
                        this.joblevels = resp
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            /**
             * 处理删除员工事件
             */
            doDelEmp(data) {
                this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (data.id) {
                        this.deleteRequest("/emp/basic/" + data.id).then(resp => {
                            if (resp) {
                                this.modifyDisplayedEmplyees()
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
            /**
             * 显示修改员工信息窗口
             */
            showUpdateDialog(data) {
                this.isInsert = false;
                this.dialogInsertTableVisible = true
                this.emp = data
                this.inputDepName = data.department.name
            },
            /**
             * 修改员工信息
             */
            doUpdateEmp() {
                console.log("update--", this.emp);

                this.putRequest("/emp/basic/", this.emp).then(resp => {
                    if (resp) {
                        this.dialogInsertTableVisible = false
                        this.modifyDisplayedEmplyees()
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            exportExcel() {
                window.open("/emp/basic/export", "_parent");
            },
            uploadSuccess(){
                this.isInport = false;
                this.titleOfInport="导入数据";
                this.$message({
                    message: '导入成功',
                    type: 'success'
                });
            },
            uploadError(){
                this.isInport = false;
                this.titleOfInport="导入数据";
                this.$message({
                    message: '导入失败',
                    type: 'error'
                });
            },
            uploadBefore(){
                this.isInport = true;
                this.titleOfInport="导入数据中";

            }
        },

        mounted() {
            this.modifyDisplayedEmplyees();
        }
    }
</script>

<style>
    .container .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #3caf6f;
    }
</style>