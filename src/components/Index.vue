<template>
<div>
  <h1>Just a test page</h1>
  <h2>{{mode}}</h2>
  <span>{{count}}</span>
  <button @click="count++">+1</button>
</div>
</template>
<script>
export default {
  data () {
    return {
      mode: process.env.VUE_ENV === 'server' ? 'server' : 'client',
      count: 2
    }
  }
}
</script>