<template>
  <login-form @register="handleShowRegister" v-if="!isRegister"/>
  <login-register-form @back="handleShowRegister" v-else/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '~/components/login/Form.vue'
import LoginRegisterForm from '~/components/login/RegisterForm.vue'

const isRegister = ref(false)

const handleShowRegister = () => {
  isRegister.value = !isRegister.value
}
</script>
