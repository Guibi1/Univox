<script lang="ts">
    import { page } from '$app/stores';
    let vendre: boolean = true;
    page.subscribe((page) => vendre = page.url.pathname.endsWith("/achat"));

</script>

<a href={vendre ? "mes-livres" : "achat"}>
    <button> 
        {#if vendre}
            <box-icon name='book-add'></box-icon>
            Vendre
    
            {:else}
            <box-icon name='book-add'></box-icon>
            Acheter
        {/if}
    </button>
</a>


<slot />




<style> 
    button {
        @apply absolute rounded-full;
        @apply right-12 bottom-10;

        @apply gap-3 p-5;
        @apply text-2xl w-44 h-14;

        @apply text-black;
        


    }

    box-icon {
            @apply h-10 w-10;

        }
</style>
