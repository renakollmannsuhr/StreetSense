<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal'

  defineProps<{
    title?: string
  }>()

  const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'delete'): void
  }>()
  </script>

  <template>
    <VueFinalModal
      class="confirm-modal"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
    >
      <slot />
      <div class="buttons">
        <button @click="emit('delete')">
          Undo
        </button>
        <button @click="emit('confirm')">
          Ok
        </button>
      </div>
    </VueFinalModal>
  </template>

  <style>
  .confirm-modal {
    padding-top: 0;
    display: flex;
    justify-content: center;
    padding: 1rem;
    align-items: center;
    width: 100%;
  }
  .confirm-modal-content {
    font-family: Arial, Helvetica, sans-serif; 
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #fff;
    border-radius: 0.5rem;
    max-width: 1000px; 
    max-height: 80vh; 
    width: 100%; 
    overflow: auto; 
    box-sizing: border-box; 
  }
  .confirm-modal-content > * + *{
    margin: 0.5rem 0;
  }
  .confirm-modal-content button {
    margin: 0.25rem 0 0 auto;
    border: 1px solid;
    border-radius: 0.25rem;
    border-style: initial;
    background-color: #007bff;
    color: white;
  }
  .dark .confirm-modal-content {
    background: #000;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: .5rem;
    margin-bottom: -.5rem;
  }

  .buttons button {
    margin: 0;
  }

  /* Media query for mobile devices */
  @media (max-width: 768px) {
    .confirm-modal {
      padding: 0; 
      width: 100%; 
    }
    .confirm-modal-content {
      max-width: 90%;
      max-height: 90vh;
      border-radius: 0.25rem; 
    }
    .confirm-modal-content p {
      font-size: 0.875rem;
    }
    .confirm-modal-content h1 {
      font-size: 1rem;
    }
    .vic-pd {
      height: 100px;
    }
  }
  </style>