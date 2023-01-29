<script lang="ts">
    export let books: Book[];
</script>

<div>
    <ul>
        {#each books as book}
            <li>
                <a href={`/livres/achat/${book.id}`}>{book.title}</a>
            </li>
        {/each}
    </ul>
</div>
