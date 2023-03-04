<template>
  <div>
    <DiffTree
      v-if="false"
      :newData="test1"
      :oldData="test2"
    ></DiffTree>
    <BaseTree :data="test3"></BaseTree>
  </div>
</template>

<script>
import DiffTree from "@/components/DiffTree";
import {test1, test2, test3, test4} from '@/test.js';
import BaseTree from "@/components/BaseTree";

export default {
  name: 'App',
  data() {
    return {
      test1,
      test2,
      test3,
      test4,
    }
  },
  components: {
    DiffTree,
    BaseTree,
  }
}
</script>

<style>

</style>
