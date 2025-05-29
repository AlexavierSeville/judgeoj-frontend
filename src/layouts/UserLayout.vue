<template>
  <div id="basicLayouts">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/yuan.png" class="logo" />
          <div>元 OJ</div>
        </a-space>
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
  text-align: center;
}

#basicLayouts .header {
  margin-top: 27px;
  margin-bottom: 0;
}

#basicLayouts .content {
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

#basicLayouts .logo {
  height: 64px;
  width: 64px;
}
</style>
<script setup lang="ts"></script>
