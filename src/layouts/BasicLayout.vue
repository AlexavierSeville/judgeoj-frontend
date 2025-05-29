<template>
  <div id="basicLayouts">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://localhost:8080" target="_blank"> OJ判题系统-by元仔 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayouts {
}

#basicLayouts .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayouts .content {
  background: linear-gradient(to right, #6dbfe4, #f4f4f4);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayouts .footer {
  background-color: #f59a67;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
