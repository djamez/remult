<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { FieldUIInfo } from '../../../../core/server/remult-admin'
  import SelectDialog from './SelectDialog.svelte'
  import { godStore } from '../../stores/GodStore.js'
  import LoadingSkeleton from './LoadingSkeleton.svelte'

  export let value: any
  export let info: FieldUIInfo

  let displayValue = undefined
  let dialogOpen = false

  const dispatch = createEventDispatcher()

  function dispatchChange(_data) {
    dispatch('change', { _data })
  }

  $: {
    ;(async () => {
      const val = await $godStore.displayValueFor(info, value)
      displayValue = val
    })()
  }

  const getWidth = () => {
    const r = Math.random()

    if (r > 0.6) {
      return 120
    }
    if (r > 0.3) {
      return 100
    }
    return 70
  }
</script>

<div>
  <button class="naked-button" on:click={() => (dialogOpen = true)}>
    <span>🔎</span>
    {#if displayValue === undefined}
      <LoadingSkeleton width={getWidth()} />
    {:else}
      {displayValue}
    {/if}
  </button>
  {#if dialogOpen}
    <SelectDialog
      relation={info.relationToOne}
      on:close={() => (dialogOpen = false)}
      on:select={(e) => {
        value = e.detail._data
        dispatchChange(value)
      }}
    />
  {/if}
</div>
