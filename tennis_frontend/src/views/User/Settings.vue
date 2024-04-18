<script setup>
import { ref } from 'vue';
import InputWithLabel from '@/components/BaseForm/InputWithLabel.vue';
import UserService from '@/services/UserService';

const props = defineProps(['user'])
const editMode = ref(false)
const editForm = ref({...props.user, password: ''})
const confirmPw = ref(null)
const validPw = ref(null)
const matchedPw = ref(null)

const testPw = () => {
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(editForm.value.password)
    validPw.value = hasSpecialCharacter
}

const matchPw = () => {
    if (editForm.value.password === confirmPw.value) {
        matchedPw.value = true
    } else {
        matchedPw.value = false
    }
}

const submitForm = () => {
    if (editForm.value.password === '') {
        delete editForm.value.password
    }
    if (validPw && matchedPw) {
        UserService.edit(props.user.id, editForm.value)
        .then(() => {
            editMode.value = false
            window.location.reload()
        })
        .catch(error => console.log(error))
    }
}

const deleteAccount = () => {
    UserService.delete(props.user.id)
    .then(() => {
        console.log('user deleted')
    })
    .catch(error => console.log(error))
}
</script>

<template>
    <div class="view-account">
        <div class="buttons">
            <button v-if="!editMode" @click="editMode = true">Edit account</button>
            <button v-if="editMode" @click="submitForm">Save changes</button>
            <button v-if="editMode" @click="editMode = false">Cancel</button>
            <button @click="deleteAccount">Delete account</button>
        </div>

        <div class="view" v-if="!editMode">
            <dl>
                <dt>Username</dt>
                <dd>{{ user.username }}</dd>
                
                <dt>Name</dt>
                <dd>{{ user.first_name }} {{ user.last_name }}</dd>

                <dt>Email</dt>
                <dd>{{ user.email }}</dd>

                <dt>Password</dt>
                <dd><input type="password" readonly disabled :value="user.password" /></dd>
            </dl>
        </div>
        <div class="edit" v-else>
            <form>
                <InputWithLabel type="text" label="First Name" v-model="editForm.first_name" />
                <InputWithLabel type="text" label="Last Name" v-model="editForm.last_name" />
                <InputWithLabel type="email" label="Email" v-model="editForm.email" />
                <InputWithLabel type="password" label="Password" v-model="editForm.password" @blur="testPw, matchPw" />
                <InputWithLabel type="password" label="Confirm Password" v-model="confirmPw" @blur="matchPw" />
            </form>
            <div v-if="matchedPw === false">Passwords must match.</div>
            <div v-if="validPw === false">Password must have at least one number and one special character.</div>
        </div>
    </div>
</template>

<style>
.view-account {
    display: flex;
    flex-direction: column;
}

.buttons {
    margin-left: auto;
}

button {
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    cursor: pointer;
    border: 2px solid var(--blue-border);
    background-color: var(--color-background-mute);
    color: var(--color-text)
}

dt {
    font-weight: bold;
    margin-top: 0.25rem;
}

dd {
    padding-left: 3rem;
    margin-bottom: 0.25rem;
}

form {
    display: flex;
    flex-direction: column;
}

form > input {
    margin: 0.5rem;
    background-color: transparent;
    outline: transparent;
    border: none;
    color: var(--color-text);
}
</style>