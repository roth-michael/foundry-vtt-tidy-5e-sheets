<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ListContainer from '../../../components/layout/ListContainer.svelte';
  import type { CharacterSheetContext, ItemLayoutMode } from 'src/types/types';
  import ItemFilterSearch from '../../../components/item-list/ItemFilterSearch.svelte';
  import ItemFilters from '../../../components/item-list/ItemFilters.svelte';
  import ItemFilterOption from '../../../components/item-list/ItemFilterOption.svelte';
  import ItemFilterLayoutToggle from '../../../components/item-list/ItemFilterLayoutToggle.svelte';
  import SpellbookList from '../../../components/spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../../../components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../../../components/spellbook/SpellbookGrid.svelte';
  import SpellbookClassFilter from '../../../components/spellbook/SpellbookClassFilter.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from 'src/sheets/actor/NoSpells.svelte';
  import Notice from '../../../components/notice/Notice.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($context.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag($context.actor, 'spellbook-grid', true);
  }

  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($context.actor, 'classFilter') ?? '';

  function tryFilterByClass(spells: any[]) {
    if (!$settingStore.spellClassFilterSelect || selectedClassFilter === '') {
      return spells;
    }

    return spells.filter(
      (spell) =>
        FoundryAdapter.tryGetFlag(spell, 'parentClass') === selectedClassFilter
    );
  }

  $: noSpellLevels = !$context.spellbook.length;

  $: noSpells =
    $context.spellbook.reduce(
      (count: number, section: any) => count + section.spells.length,
      0
    ) === 0;
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={$context.actor}
    searchFlag="spell-search"
    cssClass="align-self-flex-end"
    placeholder={localize('T5EK.SearchSpell')}
  />
  {#if $settingStore.spellClassFilterSelect}
    <li class="spellbook-class-filter">
      <SpellbookClassFilter />
    </li>
  {/if}
  <ItemFilterOption setName="spellbook" filterName="action">
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="bonus">
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="reaction">
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="concentration">
    {localize('DND5E.AbbreviationConc')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="ritual">
    {localize('DND5E.Ritual')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="prepared">
    {localize('DND5E.Prepared')}
    {#if $context.preparedSpells > 0}
      ({$context.preparedSpells})
    {/if}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer cssClass="flex-column small-gap">
  {#if noSpellLevels}
    <NoSpells editable={$context.editable} />
  {:else}
    {#each $context.spellbook as section (section.label)}
      {@const filteredSpells = tryFilterByClass(
        FoundryAdapter.getFilteredItems(searchCriteria, section.spells)
      )}
      {#if (searchCriteria.trim() === '' && $context.editable) || filteredSpells.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList
            spells={filteredSpells}
            {section}
          />
        {:else}
          <SpellbookGrid spells={filteredSpells} {section} />
        {/if}
      {/if}
    {/each}
  {/if}

  {#if noSpells && !$context.editable}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {/if}
</ListContainer>

<SpellbookFooter />

<style lang="scss">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    align-self: center;
  }
</style>