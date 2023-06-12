<template>
  <div class="default">
    <div class="default-main">
      <div class="default-main-nav">
        <Navigator />
      </div>
      <div class="default-main-page">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navigator from "@/components/Navigator.vue";

export default Vue.extend({
  components: { Navigator }
});
</script>

<style lang="postcss" scoped>
.default {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  display: flex;
  &-main {
    width: 100%;
    height: 100%;
    margin: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-page {
      flex: 1;
      overflow: auto;
    }
    &-nav {
      height: 50px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
