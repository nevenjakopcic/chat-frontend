<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card>
            <q-card-section>
                <div class="text-h6"> {{ user.username }} </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pt-none">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Rerum repellendus sit voluptate voluptas eveniet porro.
                Rerum blanditiis perferendis totam, ea at omnis vel numquam
                exercitationem aut, natus minima, porro labore.
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { Member } from "src/models/chat";
import { PropType } from "vue";

const props = defineProps({
    user: {
        type: Object as PropType<Member>,
        required: true
    }
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
