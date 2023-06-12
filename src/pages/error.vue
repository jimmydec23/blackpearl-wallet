<template>
  <div class="home">
    <div class="home-img">
      <img src="@/assets/anim/ship.gif" alt="" />
    </div>
    <div class="home-desc">扬帆，起航，探索区块链世界.</div>
  </div>
</template>

<style lang="postcss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vh;
  &-img {
    margin: auto;
    img {
      border-radius: 30px;
      width: 300px;
    }
  }
  &-desc {
    margin-top: 20px;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 3px;
    font-style: oblique;
  }
}
</style>
