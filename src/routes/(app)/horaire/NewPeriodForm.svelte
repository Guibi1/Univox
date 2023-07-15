<script lang="ts">
    import schedule from "$lib/stores/schedule";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    export let data: PageData;

    const { form, errors, delayed, enhance } = superForm(data.form, {
        taintedMessage: null,
        onResult: ({ result }) => {
            if (result.type === "success") {
                schedule.refresh();
            }
        },
    });
</script>

<form use:enhance class="flex flex-col gap-2" method="post" action="/horaire?/addPeriod">
    <label class="label" data-error={$errors.name}>
        Nom de l'évènement

        <input type="text" name="name" class="input" value={$form.name} readonly={$delayed} />

        {#if $errors.name}
            <span>{$errors.name[0]}</span>
        {/if}
    </label>

    <label class="label" data-error={$errors.date}>
        Date

        <input name="date" type="date" class="input" value={$form.date} readonly={$delayed} />

        {#if $errors.date}
            <span>{$errors.date[0]}</span>
        {/if}
    </label>

    <label class="label" data-error={$errors.startTime}>
        Début

        <input
            name="startTime"
            type="time"
            class="input"
            value={$form.startTime}
            readonly={$delayed}
        />

        {#if $errors.startTime}
            <span>{$errors.startTime[0]}</span>
        {/if}
    </label>

    <label class="label" data-error={$errors.endTime}>
        Fin

        <input name="endTime" type="time" class="input" value={$form.endTime} readonly={$delayed} />

        {#if $errors.endTime}
            <span>{$errors.endTime[0]}</span>
        {/if}
    </label>

    <button type="submit" class="btn variant-filled-primary mt-4"> Ajouter à l'horaire </button>
</form>
