<template>
  <DiffTree
      :newData="newData"
      :oldData="oldData"
  ></DiffTree>
</template>

<script>
import DiffTree from "@/components/DiffTree";

export default {
  name: 'App',
  data() {
    return {
      oldData: [
        {
          a: 'b',
          b: 'c',
        },
        {
          a: 'a',
          b: 'b',
        }
      ],
      newData: [
        {
          a: 'a',
          b: 'b'
        },
        {
          a: 'b',
          b: 'c',
        },
        {
          a: 'a',
          b: 'c',
        }
      ],
    }
  },
  components: {
    DiffTree,
  }
}
</script>

<style>

</style>
