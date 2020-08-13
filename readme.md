# sanity-plugin-color-picker

Color picker with eyedropper tool input for [Sanity](https://sanity.io/) that stores a selected color.

## Installing

In your Sanity studio folder, run:

```
sanity install color-picker 
```


## Usage

Use it in your schema types:

```js
// [...]
{
  fields: [
    // [...]
    {
      name: 'color',
      title: 'Color',
      type: 'colorPicker'
    }
  ]
}
```

Note that the above only works if you import and use the `all:part:@sanity/base/schema-type` part in your schema.

## License

MIT-licensed. See LICENSE.
