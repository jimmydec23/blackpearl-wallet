<template>
  <div class="nav">
    <img
      class="nav-logo"
      src="@/assets/logo.png"
      alt=""
      @click="handleClickLogo"
    />
    <div
      class="nav-item"
      :class="{ selected: selectedId === item.id }"
      v-for="(item, index) in projects"
      :key="index"
      @click="handleClick(item)"
    >
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      selectedId: 0
    };
  },
  computed: {
    projects() {
      return [{ id: 1, name: "钱包", link: "/" }];
    }
  },
  watch: {
    $route(val) {
      this.calSelected(val.path);
    }
  },
  created() {
    this.calSelected(this.$route.path);
  },
  methods: {
    handleClick(item: any) {
      this.$router.push({ path: item.link });
    },

    calSelected(path: string) {
      let target;
      for (let i = 0; i < this.projects.length; i++) {
        const proj = this.projects[i];
        if (proj.link === path) {
          target = proj;
          break;
        }
      }
      if (!target) {
        this.selectedId = -1;
      } else {
        this.selectedId = target.id;
      }
    },

    handleClickLogo() {
      this.$router.push({ path: "/" });
    }
  }
});
</script>

<style lang="postcss" scoped>
.nav {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  border-bottom: 1px solid var(--color-extra-light-border);
  &-logo {
    width: 30px;
    height: 30px;
    margin: 0 20px;
    cursor: pointer;
  }
  &-item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 100%;
    font-weight: 600;
  }
}

.selected {
  color: var(--color-success);
  position: relative;
  &::after {
    content: "";
    background: var(--color-success);
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 2px;
  }
}
</style>
