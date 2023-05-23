# ColorfulOptionsetGrid

The family of ColorfulOptionset Controls has a new member: ColorfulOptionsetGrid. Using this control, you can show the OptionsSets using the colors customized using the standard experience.
The Grid is not limited to showing the color "with a dot". You can choose from different possibities: with/no icon of your choice, whowing a border or a filled box.
Starting with the release 8, the ColorfulOptionsetGrid works also for Boolean/TwoOptions and for MultiSelectOptionset/MultiSelectPicklist.

![ColorfulOptionsetGrid](./Docs/img/ColorfulOptionsetGrid.png)
![ColorfulOptionsetGrid](./Docs/img/ColorfulOptionsetGrid.gif)

For now the control is only for ModelDriven apps, but as soon the CanvasAPps geht more stable, I intend to extend the control.

## Customizing
The most important parameters are:
-  **Display text type** - here you can choose if you would lile top have the text displayed 
    - "Colorful Border": as a colorful border 
    - "Colorful background": with colorful background
    - "No decoration": a text should have no styles
![Display Type](./Docs/img/config/TextDecorationConfig.png)
    - "No text" : the text won't be shown. If this option is set, the Icon-definition will be forced on "Icon name or JSON"

- **Icon definition** - here you can choose how the icon should be displayed
    - "No icon" : the icon won't be displayed
    - "Icon name or JSON": the content can be the fiendly name of an icon from FluentUI Icons. You nay choose from here: https://developer.microsoft.com/en-us/fluentui#/styles/web/icons (scroll down until you find the available icons)
    Another possibility for this paramerter is having JSON objects containing "icon" and/or "color" for each option. For mor details see the section "JSON definition" below.
    To be able to use this parameter, you havce to configure the columns you want to have displayed. See the configuration possibilities below.
![Display Type](./Docs/img/config/IconTypes.png)

- **Default icon name** - The name of an Icon from FluentUI which will be used when nothing else was defined (or when there is a special definition (JSON), but the icon for the value is missing). The default value is "the dot": "CircleShapeSolid".

If you need more control, you can define up to 3 columns which should be displayed "colorful" (optionset1, optionset2, optionset3 ). For each of them you can specify the values "iconConfig1", "iconConfig2", "iconConfig3" (the number of the config is corresponding to the optionset number)

## Customizing possibilities:

### Default  - all OptionSets as Icons
The default is showing the "Dots" for all the columns that are of type "OptionSet".
![Default](./Docs/img/Default.png)
To achieve this you only have to attach the PCF to your view.
If you want to change the icon, just change the "Default Icon name" parameter to another icon.
![DefaultConfig](./Docs/img/config/Default.png)

### Colorful border and icon
![ColorfulBorderAndIcon](./Docs/img/Icon_And_TextBorder.png)
To have a colorful border and an icon you need the parameter combination:
- displayTypeText = "Colorful border"
- displayIconType = "Icon name or JSON"
The icon will be the "defaultIcon", unless you need more special config.
![TextBorderIcon](./Docs/img/config/TextBorder_Icon.png)

### Colorul background and icon
![ColorfulBorderAndIcon](./Docs/img/Icon_And_TextBox.png)
To have a colorful border and an icon you need the parameter combination:
- displayTypeText = "Colorful background"
- displayIconType = "Icon name or JSON"
The icon will be the "defaultIcon", unless you need more special config.
![TextBorderIcon](./Docs/img/config/TextBackground_Icon.png)

### Only Icon
![ColorfulBorderAndIcon](./Docs/img/Icon_And_TextSimple.png)
For this option, choose "Display text type": "No decoration"

### No Icon
Here you have two possibilities: the text with border, or the text with background. Similar to above, but choose "Icon definition" to "No icon"
![ColorfulBorderAndIcon](./Docs/img/NoIcon_TextBorder.png)
![ColorfulBorderAndIcon](./Docs/img/NoIcon_TextBox.png) 

### No Text
In this case only the icon will be shown, while the text will be visible only in the tooltip. In this case, the width of the column defined in the customizing will be overridden, because we don't need that much space. But the remaining space will be distributed to all columns, so it can happend that the column is still wider.
![NoText](./Docs/img/TextDisplayOption_NoText.png)
Unfortunatelly there is no possibility to set this option on each optionset (would get too complicated to customize). In case you choose this option, it will apply to all optionset columns.

## Screenshots for all data types: optionset/multiple optionset/boolean

![Border](./Docs/img/NewDataTypes/Border.png)

![Border](./Docs/img/NewDataTypes/OnlyThreeSelectedColumns.png)

![All data types](./Docs/img/NewDataTypes/ColumnConfig_AllDataTypes.png)

![Dot](./Docs/img/NewDataTypes/Dot.png)

![Dor Border](./Docs/img/NewDataTypes/Dot_Border.png)

![Background](./Docs/img/NewDataTypes/Background.png)


## Icons configuration
When the default icon is not enough, and you have to specify another icon per column, or in case you want to specify an icon per Optionset value, you need to define first the columns. You can specify up to 3 columns. Then the other columns will be ignored, and shown without colors.
![DefineColumns](./Docs/img/config/ChooseColumns.png)

After you defined the column for "Optionset 1", the you can use the "iconConfig1" in order to define the icons. This can be the name of the icon, or you can use a JSON configuration for this.
![DefineColumns](./Docs/img/config/iconConfig_Name.png)
If each value needs another icon, the you can paste a JSON in this field containing : "value" : {icon, color}. 
```javascript
{"434350002": {"icon": "Sad"}, "434350001": {"icon": "EmojiNeutral"}, "434350000":{"icon":"Emoji2"}, "434350003":{ "color": "black"}}
```
Icon and color doesn't have to be both defined. You can specify only the icon or only the color. 
Actually the color shouldn't be necessary at this point. I intend to have it more for CanvasApps later on. 

If you want to define the configuration for a boolean (two option) column, you need to define for values "0" - false and "1" - true.
So boolean configurations could look like this:
```javascript
{"0": {"icon": "Sad"}, "1":{"icon":"Emoji2"}}
```



&#10071; The input length is limited to 100 char for now. So only a short JSON will pass. The next step will be to introduce the 3rd possibility for "Icon definition": "Environment variables". There the place is not limited, while they are solution aware.


If you need more columns, you can define "Optionset 2" and "iconConfig2" parameters. Proceed with the 3rs attribute, if needed.

&#10071; If only "Optionset x" is defined, but not the "iconConfig x", then the "Default icon name" will be used.


## Editable version

Starting with the release 9, you can make the boolean (two option) columns editable. To do that, just choose the "Editable" option in the PCF customizing. 
The default will be "Read only"
![ConfigEditable](./Docs/img/config/Editable_Config.png)
The user will get a visual feedback for the cells which are editable.
![Editable](./Docs/img/Release/ColorfulOptionsetGrid_Editable.gif)


## Open isses:
- Translations
- Extend the icon definition to "Environment variables"
- Show lookups as hyperlinks
- Responsive UI (cards)
- CanvasApp


