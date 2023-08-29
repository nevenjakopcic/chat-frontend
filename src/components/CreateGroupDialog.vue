<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-pa-md" style="min-width: 400px">
            <div class="text-h6 q-pb-sm">Create a new group</div>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input
                    filled
                    v-model="name"
                    label="Group name"
                    lazy-rules
                    :rules="[
                        (val) => (val && val.length > 0) || 'Please type something'
                    ]"
                />

                <div>
                    <q-btn label="Submit" type="submit" color="primary" />
                    <q-btn
                        label="Reset"
                        type="reset"
                        color="primary"
                        flat
                        class="q-ml-sm"
                    />
                </div>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";

function onSubmit() {
    onDialogHide();
}

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
