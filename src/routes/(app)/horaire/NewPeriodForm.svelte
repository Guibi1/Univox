<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import schedule from "$lib/stores/schedule";
    import dayjs from "dayjs";
    import type { ActionData } from "./$types";

    export let form: ActionData = null;

    let loading = false;

    const handleSubmit = (() => {
        loading = true;
        return async ({ result, update }) => {
            if (result.type === "success") {
                await schedule.refresh();
            }
            loading = false;
            update({ reset: true });
        };
    }) satisfies SubmitFunction;
</script>

<form
    use:enhance={handleSubmit}
    class="flex flex-col gap-2"
    method="post"
    action="/horaire?/addPeriod"
>
    <label data-error={form?.invalidName}>
        Nom de l'évènement

        <input
            type="text"
            name="name"
            value={form?.name ?? ""}
            required
            placeholder=" "
            readonly={loading}
        />

        {#if form?.invalidName}
            <span>Nom invalide</span>
        {/if}
    </label>

    <label data-error={form?.invalidDate}>
        Date

        <input
            name="date"
            type="date"
            required
            value={form?.date ?? dayjs().format("YYYY-MM-DD")}
            on:input={() => form && (form.invalidDate = false)}
            readonly={loading}
        />

        {#if form?.invalidDate}
            <span>Date invalide</span>
        {/if}
    </label>

    <label data-error={form?.invalidStartTime}>
        Début

        <input
            name="startTime"
            type="time"
            required
            value={form?.startTime ?? dayjs().add(1, "hour").format("HH:00")}
            on:input={() => form && (form.invalidStartTime = false)}
            readonly={loading}
        />

        {#if form?.invalidStartTime}
            <span>Temps de début invalide</span>
        {/if}
    </label>

    <label data-error={form?.invalidEndTime}>
        Fin

        <input
            name="endTime"
            type="time"
            required
            value={form?.endTime ?? dayjs().add(2, "hour").format("HH:00")}
            readonly={loading}
        />
        <!-- on:input={() => form && (form.invalidEndTime = false)} -->

        {#if form?.invalidEndTime}
            <span>Temps de fin invalide</span>
        {/if}
    </label>

    <button type="submit" class="filled mt-4 self-center"> Ajouter à l'horaire </button>
</form>
