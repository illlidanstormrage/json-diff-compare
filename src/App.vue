<template>
  <div>
<!--    <DiffTree-->
<!--      :newData="newData"-->
<!--      :oldData="oldData"-->
<!--    ></DiffTree>-->
    <NormalTree
      :data="testData"
    ></NormalTree>
  </div>
</template>

<script>
// import DiffTree from "@/components/DiffTree";
import {test1, test2, test3} from '@/test.js';
import NormalTree from "@/components/NormalTree";

export default {
  name: 'App',
  data() {
    return {
      oldData: test1,
      newData: test2,
      testData: test3,
    }
  },
  components: {
    // DiffTree,
    NormalTree,
  }
}
</script>

<style>

</style>
