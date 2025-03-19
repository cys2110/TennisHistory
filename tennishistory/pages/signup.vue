<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

definePageMeta({
  name: "signup",
  layout: "visitor-layout"
})
useHead({
  title: "Sign Up",
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
  },
  {
    name: "name",
    type: "text" as const,
    label: "Name",
    placeholder: "Enter your name",
    required: true
  },
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Enter your email",
    required: true
  }
]

const schema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain a number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  email: z.string().email("Invalid email"),
  name: z.string()
})

type Schema = z.output<typeof schema>

const handleSignUp = async (payload: FormSubmitEvent<Schema>) => {
  errorMessage.value = null

  try {
    const response = await $fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload.data)
    })

    if (response.status === 201) {
      localStorage.setItem("session", JSON.stringify(response.body))
      navigateTo({ name: "dashboard" })
    } else if (response.status === 409) {
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
          title="Sign Up"
          :icon="ICONS.person"
          :schema
          :fields
          @submit="handleSignUp"
        />
        <div
          v-if="errorMessage"
          class="text-sm text-red-600 dark:text-red-400 text-center w-full"
        >
          {{ errorMessage }}
        </div>
        <u-link
          to="/login"
          class="text-center mx-auto mt-4 hover-link text-sm"
        >
          Already have an account? Log in
        </u-link>
      </u-page-card>
    </u-page-body>
  </u-page>
</template>
