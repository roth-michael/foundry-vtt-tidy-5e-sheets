## To Do

- [x] Create form application class
- [x] Hook in template
- [x] Create svelte sheet component and hook into activate listeners
- [x] Curate sheet for Svelte mode
  - [x] store store
  - [x] stats store
  - [x] etc. the works
- [x] Scaffold the tabs and their requisite components
  - [x] "attributes" : "Attributes"
  - [x] "cargo" : "Cargo & Crew"
  - [x] "biography" : "Description"
- [x] Add "allow-edit" lock
- [x] Implement the Header
  - [x] Profile
  - [x] Name
  - [x] Origin Summary section
  - [x] Movement
  - [x] AC Shield and Abilities
    - [x] AC Shield is a little different; it has AC while motionless and AC while in motion.
    - [x] Allow for ability check/save single click like with PCs and NPCs
    - [x] the rest
- [x] Implement sheet body sections
  - [x] Attributes
  - [x] Cargo & Crew
  - [x] Effects
  - [x] Description
- [x] Identify problems with the current sheet that make it difficult to understand/use and fix them.
  - [x] Problem: There aren't dedicated buttons for Ability Check and Saving Throw; I don't care if the vehicle cannot be proficient, we want buttons!
- [x] Research the following and note them here:
  - [x] Actions : Ghosts of Saltmarsh
  - [x] Action Stations : Descent into Avernus
  - [x] Action Thresholds : Ghosts of Saltmarsh
  - [x] Mishap
- [x] Resolve SaltyJ Issues
  - [x] Effects tab missing
  - [x] Adding Crew and passengers
  - [x] Headers are not inline with columns
  - [x] Spacing inconsistent and sad

### Action Thresholds

From "Galley" in GoS:

> On its turn, the galley can take **3 actions**, choosing from the options below. It can take only **2 actions if it has fewer than forty crew** and only **1 action if it has fewer than twenty**. It can't take these actions if it has **fewer than three crew**.

So that is

`< 40 < 20 < 3`

It translates to

3 actions when >= 40 : the full crew complement
2 actions when < 40 : mid crew complement
1 action when < 20 : minimum crew complement
0 actions when < 3 : insufficient crew

There has to be a better way to visualize this. Maybe there are some clever paper vehicle sheets out there in the wild?

A ship can have 1-3 actions, and certain sample vehicles will always put the highest number on the far right field, even when there are only 1 or 2 actions.

## SaltyJ's Issue List for Vehicles

Issue #1: Effects tab is missing in Tidy Sheet where it exists in default sheet.

Issue #2: Adding Crew and passengers is varied levels of broken, as of the version i am using, add button does nothing, in previous versions, it let me add them, but did not save changes. (Would love to be able to drop Actors here, but just filling out the lines sould be pretty nice)

Issue #3: Headers are not inline with columns...everywhere.
(KGar Note: it looks like the classic controls spacing in the header row is not being included with classic controls. Should resolve itself with the standard implementation.)

Issue #4: Spacing can be inconsistant and sad.
(KGar Note: This is in reference to the Creature Capacity, Cargo Capacity, etc. section on the Attributes tab on the left side)

Feature Request: AC has a value for when moving, and when stationary. A toggle here so you can swap between the two would be great, not in system, but figured while i have you, see if its an easy implementation. Feel free to ignore this for a future enhancement post release
(KGar Note: dnd5e system should have a vehicle checkbox / data field for 'moving', because in some systems, knowing whether the vehicle is in motion or not is important; in any case, we can have an option to do screwy stuff like swap ACs when a flag-based version of "movement" is turned on, and that can be an opt-in feature.)

Side Rant: There is one thing i have been struggling with, and this is not sheet specific, sort of a side rant.
In my naval system, The crew can do actions on the ships turn, with trained skills etc using ship stats.
But on the players turn, they can get on stations like Decent into Avernus style.
Unfortunately there is no way that i know of to automate using their bonuses with vehicle sheet weapons in an automated fasion.
Again, not for you to even really think about, but its my current roadblock. ATM we switch to full zero automation for player turns during naval combat..
And considering the ships have sheets, the crew on deck have sheets, even the mines have sheets.....
(KGar Note: This will take some thought about where Tidy 5e fits into the mix with this particular issue. Of course, there's a great deal that could be done to provide functionality like this, but veering too far from the core data into homebrew territory may multiply complexity of maintaining the sheet. Perhaps a separate module that leverages the API?)

## Refine and Bonus To Do's

- [ ] Add vehicular exhaustion in the style of NPC exhaustion. It will need certain adjustments to the exhaustion level text that will require some localization.
- [ ] Consider restoring Cargo tab item quantity and removing the quantity column for items without an editablename. It breaks too much with Tidy's style, and wouldn't it be nice to keep the column space open?
- [ ] Use HP bars on the HP column for the vehicle Attributes Tab, and add the juice when adjusting HP amount; make HP tab longer to compensate for Current/Max values (double the current width); consider compressing Threshold tab by making it an icon column with a title that says the actual title, to provide the space needed
- [ ] Update all HP bars to use color severity like the group sheet in a branch and float it to the commission
- [ ] Add vehicular movement in the style of DMspiration, a simple checkbox charm at the top right of the vehicle sheet.
- [ ] Consider embedding Action calculation into the Action Threshold tooltip
  - [ ] For 0 / null / undefined actions -> Full Complement: 0 Actions, Mid Complement: 0 Actions, Minimum Complement: 0 Actions
  - [ ] For 1 action -> Full Complement: 1 Action, Mid Complement: 0 Actions, Minimum Complement: 0 Actions
  - [ ] For 2 actions -> Full Complement: 2 Actions, Mid Complement: 1 Action, Minimum Complement: 0 Actions
  - [ ] For 3 actions -> Full Complement: 3 Actions, Mid Complement: 2 Actions, Minimum Complement: 1 Action
  - [ ] etc., it should be dynamic
- [ ] Show current crew count and number of available actions below the threshold settings as the visual
  > Crew Action(s)
  > 42 3 (pretty icon when full complement) (title that reads "Full Complement", "Mid Complement", or "Minimum Complement" when hovering over the label/value container)
- [ ] Ensure the action threshold calculations can safely coalesce to 0 when data is not available
- [ ] Remove margin top from ItemTableHeaderRow and require calling components to provide their own gap / spacing between tables.
- [ ] Incapacitated calculation for NPCs and PCs: is it taking temp HP into account?
- [ ] Inventory-Grid: Equipped Background is not showing for KGar edition. Fixit.
- [ ] Submit dnd5e system request (and quite possibly, a PR) for vehicular exhaustion to be added to vehicle data and to the vehicle sheet.
  - https://github.com/foundryvtt/dnd5e/blob/7ab8cc38e0a7a21969dcb4bb19a1816d99d5e19a/CONTRIBUTING.md
- [ ] Ditto dnd5e system vehicle data field for "isMoving", "moving", "movement", "inMotion", or some other more appropriate name
- [ ] Evolve HP column
  - [ ] Should show current / max
  - [ ] Have HP Bar that transition animates width
  - [ ] Allow current and max to be edited as inline inputs