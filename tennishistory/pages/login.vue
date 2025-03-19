<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

definePageMeta({
  name: "login",
  layout: "visitor-layout"
})
useHead({
  title: "Log In",
  templateParams: { subPage: null }
})
const errorMessage = ref<string | null>(null)

const fields = [
  {
    name: "username",
    type: "text" as const,
    label: "Username",
    placeholder: "Enter your username",
    required: true
  },
  {
    name: "password",
    type: "password" as const,
    label: "Password",
    placeholder: "Enter your password",
    required: true
  }
]

const schema = z.object({
  username: z.string(),
  password: z.string()
})

type Schema = z.output<typeof schema>

const handleLogIn = async (payload: FormSubmitEvent<Schema>) => {
  errorMessage.value = null

  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(payload.data)
    })

    if (response.status === 201) {
      localStorage.setItem("session", JSON.stringify(response.body))
      navigateTo({ name: "dashboard" })
    } else if (response.status === 401) {
      errorMessage.value = response.body.message
    } else {
      errorMessage.value = "An unexpected error occurred."
    }
  } catch (error: any) {
    if (error.status === 409) {
      errorMessage.value = error.data.message
    } else {
      errorMessage.value = "An unexpected error occurred."
    }
  }
}
</script>

<template>
  <u-page class="lg:w-4/5 mx-auto">
    <u-page-body>
      <u-page-card class="max-w-md mx-auto mt-40 shadow-none hover:shadow-none">
        <u-auth-form
          title="Log In"
          :icon="ICONS.person"
          :schema
          :fields
          @submit="handleLogIn"
        />
        <div
          v-if="errorMessage"
          class="text-sm text-red-600 dark:text-red-400 text-center w-full"
        >
          {{ errorMessage }}
        </div>
        <u-link
          to="/signup"
          class="text-center mx-auto mt-4 hover-link text-sm"
        >
          Don't have an account? Sign up
        </u-link>
      </u-page-card>
    </u-page-body>
  </u-page>
</template>
