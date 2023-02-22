<template>
  <DiffTree
      :newData="newData"
      :oldData="oldData"
  ></DiffTree>
</template>

<script>
import DiffTree from "@/components/DiffTree";
import {test1, test2} from '@/test.js';

export default {
  name: 'App',
  data() {
    return {
      oldData: test1,
      newData: test2,
    }
  },
  components: {
    DiffTree,
  }
}
</script>

<style>

</style>
