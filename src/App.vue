<template>
  <div>
    <DiffTreeLineMode
      :oldData="test1"
      :newData="test2"
    ></DiffTreeLineMode>
  </div>
</template>

<script>
import DiffTreeLineMode from "@/components/DiffTreeLineMode";
import {test1, test2} from '@/test.js';
import {getLCS} from "@/util/ArrayDiff";

export default {
  name: 'App',
  data() {
    return {
      test1,
      test2,
    }
  },
  components: {
    DiffTreeLineMode,
  },
  methods: {
    getLCS,
  },
}
</script>

<style>

</style>
