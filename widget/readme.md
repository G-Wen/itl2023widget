Please DM GWen#2607 on discord if you run into issues. 

## ITL 2023 Online Stream Stats Widget

You can also view the widget from the ITL 2023 Online website at:

`https://itl2023.groovestats.com/stats?entrantId={entrantId}&theme={theme}`

where `{entrantId}` is replaced with your `entrantId` and `{theme}` is one of `Dark`, `DarkVertical`, `Light`, or `LightVertical`.

## Running the Stream Stats Widget locally:
1. Set the `entrantId` in `widget.js` to your own `entrantId`. Save.
2. Set `index.html` as a browser source for your stream.

You can find your `entrantId` under Preferences on the ITL 2023 website.

## Customizations:

To use a different theme themes change the stylesheet in `index.html` from `themes/dark/style.css` to:
* Dark: `themes/dark/style.css`
* Dark Vertical: `themes/darkvertical/style.css`

* Light: `themes/light/style.css`
* Light Vertical: `themes/lightvertical/style.css`

If you want to change the profile picture replace Avatar.png with the picture you want. 
 - If you want to use an alternative file format/file name specify the source inside of `widget.js`.

If you want to change the background picture replace bg.png with the picture you want. 
 - If you want to use an alternative file format/file name specify the source inside of `style.css`.

If your name is too long you can override the name it shows by providing an override name at the start of `widget.js`. 