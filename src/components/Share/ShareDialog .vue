<template>
  <VDialog v-model="appStore.shareDialog" width="500">
    <VCard>
      <VCardTitle class="text-h5 bg-grey-lighten-2"> Поделиться </VCardTitle>

      <VCardText>
        <ShareComponent
          v-if="!!oralStore.detailItem"
          :item="oralStore.detailItem"
        />
      </VCardText>

      <VDivider></VDivider>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn
          color="primary"
          variant="text"
          @click="appStore.setShareDialog(false)"
        >
          Закрыть
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VDivider,
  VSpacer,
} from 'vuetify/components';

import { useAppStore } from '../../store/modules/app';
import { useOralStore } from '../../store/modules/oral';

import ShareComponent from './ShareComponent.vue';

const appStore = useAppStore();
const oralStore = useOralStore();
</script>

<style scoped lang="scss"></style>
