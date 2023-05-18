<script lang="ts">
    import schedule from "$lib/stores/schedule";
    import dayjs from "dayjs";
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
    <label data-error={$errors.name}>
        Nom de l'évènement

        <input type="text" name="name" value={$form.name} readonly={$delayed} />

        {#if $errors.name}
            <span>{$errors.name[0]}</span>
        {/if}
    </label>

    <label data-error={$errors.date}>
        Date

        <input name="date" type="date" value={$form.date} readonly={$delayed} />

        {#if $errors.date}
            <span>{$errors.date[0]}</span>
        {/if}
    </label>

    <label data-error={$errors.startTime}>
        Début

        <input
            name="startTime"
            type="time"
            value={$form.startTime.format("HH:00")}
            readonly={$delayed}
        />

        {#if $errors.startTime}
            <span>{$errors.startTime[0]}</span>
        {/if}
    </label>

    <label data-error={$errors.endTime}>
        Fin

        <input
            name="endTime"
            type="time"
            value={$form.endTime.format("HH:00")}
            readonly={$delayed}
        />

        {#if $errors.endTime}
            <span>{$errors.endTime[0]}</span>
        {/if}
    </label>

    <button type="submit" class="filled mt-4 self-center"> Ajouter à l'horaire </button>
</form>
