<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal'

  defineProps<{
    title?: string
  }>()

  const emit = defineEmits<{
    (e: 'confirm'): void
  }>()
  </script>

  <template>
    <VueFinalModal
      class="confirm-modal"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
    >
      <h1>{{ title }}</h1>
      <slot />
      <button @click="emit('confirm')">
        Ok
      </button>
    </VueFinalModal>
  </template>

  <style>
  .confirm-modal {
    display: flex;
    justify-content: center;
    padding: 1rem;
    align-items: center;
  }
  .confirm-modal-content {
    font-family: Arial, Helvetica, sans-serif; 
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #fff;
    border-radius: 0.5rem;
  }
  .confirm-modal-content > * + *{
    margin: 0.5rem 0;
  }
  .confirm-modal-content h1 {
    font-size: 1.375rem;
  }
  .confirm-modal-content button {
    margin: 0.25rem 0 0 auto;
    padding: 0 8px;
    border: 1px solid;
    border-radius: 0.5rem;
  }
  .dark .confirm-modal-content {
    background: #000;
  }
  </style>