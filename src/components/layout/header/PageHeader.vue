<template>
  <div id="header">
    <nav class="container">
      <ul>
        <li>
          <router-link to="/"><img src="@/assets/img/icons/home.svg" alt="Home icon"> Home</router-link>
        </li>
        <li class="split">
          <router-link to="/category"><img src="@/assets/img/icons/category.svg" alt="Home icon"> Category</router-link>
        </li>
        <li>
          <router-link to="/random"><img src="@/assets/img/icons/random.svg" alt="Home icon"> Random</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';

#header {
  background-color: $accent-color;
  padding: 1.5rem 0 0.5rem 0;
}
ul {
  display: flex;
  list-style: none;
  justify-content: flex-end;
  flex-wrap: wrap;
  @media(max-width: 767px) {
    justify-content: flex-start;
  }
  li {
    margin-right: 1rem;
    margin-bottom: 1rem;
    a {
      padding: 0.5rem 1.5rem;
      background-color: $primary-color;
      color: white;
      font-weight: bold;
      font-size: 14px;
      text-decoration: none;
      border-radius: 25px;
      transition: background-color .2s;
      display: flex;
      align-items: center;
      &.router-link-exact-active { 
        background-color: $secondary-color;
      }
      &:hover {
        background-color: $secondary-color;
      }
      img {
        width: 16px;
        margin-right: 10px;
      }
    }
    &.split {
      margin-left: auto;
      margin-right: 1rem;
      @media(max-width: 767px) {
        margin-left: 0;
      }
    }
  }
}

</style>