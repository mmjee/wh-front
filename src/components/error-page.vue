<template>
  <div>
    <p>Sorry, we caught this error: <code>{{ this.error.toString() }}</code></p>
    <p>Try refreshing the page.</p>
  </div>
</template>

<script>
export default {
  name: 'WHErrorPage',
  props: ['error']
}
</script>
