import { FoundryAdapter } from '../foundry/foundry-adapter';
import Tidy5eCharacterSheetContent from './Tidy5eCharacterSheetContent.svelte';
import { error, log } from 'src/utils/logging';
import { SheetParameter } from 'src/utils/sheet-parameter';
import { SettingsProvider } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import type { Actor5e } from 'src/types/actor';

const ActorSheet5eCharacter = FoundryAdapter.getActorSheetClass();

export class Tidy5eCharacterSheet extends ActorSheet5eCharacter {
  currentTabParam: SheetParameter<string>;

  constructor(...args: any[]) {
    super(...args);

    this.currentTabParam = new SheetParameter<string>(
      SettingsProvider.settings.defaultActionsTab.get() !== 'default'
        ? SettingsProvider.settings.defaultActionsTab.get()
        : 'attributes'
    );

    // TODO: Expose an API that will allow for including more tabs and content, and then generically handle missing default tabs through a data-driven manner.
    if (
      !game.modules.get('character-actions-list-5e')?.active &&
      SettingsProvider.settings.defaultActionsTab.get() === 'actions'
    ) {
      this.currentTabParam.set('attributes');
    }
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', 'character'],
      height: 840,
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    new Tidy5eCharacterSheetContent({
      target: node,
      props: {
        sheetFunctions: {
          activateListeners: () => super.activateListeners(html),
          submit: this.submit.bind(this),
          render: this.render.bind(this),
          onShortRest: this._onShortRest.bind(this),
          onLongRest: this._onLongRest.bind(this),
          onEditImage: this._onEditImage.bind(this),
          onToggleAbilityProficiency:
            this._onToggleAbilityProficiency.bind(this),
          onToggleFilter: this.onToggleFilter.bind(this),
          isFilterActive: this.isFilterActive.bind(this),
        },
        currentTabParam: this.currentTabParam,
        isEditable: this.isEditable,
        context: {
          ...(await super.getData(this.options)),
          actorClassesToImages: getActorClassesToImages(this.actor),
          appId: this.appId,
        },
      },
    });

    initTidy5eContextMenu.call(this, html);
  }

  close(options: unknown = {}) {
    log('closing the sheet; wanna do something here?', this.sheet);
    this.#saveViewState();
    return super.close(options);
  }

  override submit(): void {
    this.#saveViewState();
    super.submit();
  }

  #saveViewState() {
    /*
      TODO: Save any state that needs to be restored to this sheet instance for rehydration on refresh.
      - Currently Selected Tab
      - Scroll Top of all scrollable areas + the tab they represent
      - Expanded entity IDs
      - Focused input element

      To do this save operation, use query selectors and data-attributes to target the appropriate things to save.
      Can it be made general-purpose? Or should it be more bespoke?
    */
  }

  onToggleFilter(setName: string, filterName: string) {
    const set = this._filters[setName];
    if (!set) {
      error(`Unable to find filter set for '${setName}'. Filtering failed.`);
      return;
    }
    if (set.has(filterName)) {
      set.delete(filterName);
    } else {
      set.add(filterName);
    }

    return this.render();
  }

  isFilterActive(setName: string, filterName: string): boolean {
    return this._filters[setName]?.has(filterName) === true;
  }
}

// TODO: Find a better home for this.
function getActorClassesToImages(actor: Actor5e) {
  let actorClassesToImages: Record<string, string> = {};
  for (let item of actor.items) {
    if (item.type == 'class') {
      let className = item.name.toLowerCase();
      let classImg = item.img;
      actorClassesToImages[className] = classImg;
    }
  }
  return actorClassesToImages;
}