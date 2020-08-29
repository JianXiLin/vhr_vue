<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="部门管理" name="DepMana"><DepMana></DepMana> </el-tab-pane>
        <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
        <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana></JobLevelMana></el-tab-pane>
        <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
        <el-tab-pane label="奖惩规则" name="EcMana"><EcMana></EcMana></el-tab-pane>
    </el-tabs>
</template>

<script>
    const DepMana = () => import("../../components/sys/basic/DepMana");
    // import DepMana from "../../components/sys/basic/DepMana";
    const EcMana = () => import("../../components/sys/basic/EcMana");
    // import EcMana from "../../components/sys/basic/EcMana";
    const JobLevelMana = () => import("../../components/sys/basic/JobLevelMana");
    // import JobLevelMana from "../../components/sys/basic/JobLevelMana";
    const PermissMana = () => import("../../components/sys/basic/PermissMana");
    // import PermissMana from "../../components/sys/basic/PermissMana";
    const PosMana = () => import("../../components/sys/basic/PosMana");
    // import PosMana from "../../components/sys/basic/PosMana";

    export default {
        name: "SysRecord",
        data() {
            return {
                activeName: 'DepMana'
            };
        },
        components :{
            // 'name':DepMana,
            DepMana,EcMana,JobLevelMana,PermissMana,PosMana
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.$options.propsData, event);
            }
        }
    }
</script>

<style scoped>

</style>