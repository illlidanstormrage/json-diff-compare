<template>
  <div>
    <DiffTreeLineMode
      :newData="test1"
      :oldData="test2"
    ></DiffTreeLineMode>
  </div>
</template>

<script>
import DiffTreeLineMode from "@/components/DiffTreeLineMode";
import {test1, test2} from '@/test.js';

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
  }
}
</script>

<style>

</style>
