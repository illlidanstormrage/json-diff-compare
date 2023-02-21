<template>
  <div>
    <DiffTreeNode
        :newData="newData"
        :oldData="oldData">
    </DiffTreeNode>
  </div>
</template>

<script>
import DiffTreeNode from "@/components/DiffTreeNode";
export default {
  name: "DiffTree",
  props: {
    oldData: {
      required: true,
    },
    newData: {
      required: true,
    },
  },
  components: {
    DiffTreeNode,
  }
}
</script>

<style scoped>

</style>