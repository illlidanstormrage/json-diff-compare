<template>
  <div>
    <DiffDetailUnified
      :oldData="test1"
      :newData="test2"
    ></DiffDetailUnified>
  </div>
</template>

<script>
import {test1, test2} from '@/test.js';
import {getLCS} from "@/util/ArrayDiff";
import DiffDetailUnified from "@/components/DiffDetailUnified";

export default {
  name: 'App',
  data() {
    return {
      test1,
      test2,
    }
  },
  components: {
    DiffDetailUnified,
  },
  methods: {
    getLCS,
  },
}
</script>

<style>

</style>
