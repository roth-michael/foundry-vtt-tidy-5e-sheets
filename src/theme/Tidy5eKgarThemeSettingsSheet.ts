import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import ThemeSettingsSheet from './ThemeSettingsSheet.svelte';

declare var FormApplication: any;

export class Tidy5eKgarThemeSettingsSheet extends FormApplication {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: FoundryAdapter.localize('T5EK.ThemeSettings.SheetMenu.title'),
      width: 750,
      classes: ['tidy5e-kgar', 'settings'],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    const node = html.get(0);

    this.component = new ThemeSettingsSheet({
      target: node,
      props: {},
      context: new Map<any, any>([['appId', this.appId]]),
    });
  }
}
