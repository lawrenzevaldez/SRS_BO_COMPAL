<template>
    <div class="panel-body">
        {{ message }} <br>
        {{ count }}
        <button class="btn" v-on:click="pressed">
                Notification <span class="badge badge-primary"></span>
        </button>
    </div>
</template>

<script>
export default {
  computed: {
      message() {
          return this.$store.getters.message
      },
      count() {
          return this.$store.getters.counter
      }
  },
  methods: {
      pressed() {
          this.$store.dispatch('increment', 10)
      }
  }
}
</script>
