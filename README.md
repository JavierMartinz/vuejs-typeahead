# Simple VueJs Typeahead

## Usage

### NPM
Available through npm as `vuejs-typeahead`.
```js
import typeahead from 'vuejs-typeahead';

export default {
  ...
  components : {
    typeahead
  },
  methods : {
    getInfoData(query, cb){
      this.$http.get('api/search', {q : query}).then(
        ({data})=>{
          cb(data); // data expected to be an array
        },
        (err)=>{
          cb(); // empty for error
        }
      );
    },
    selectInfoData(selected){
      ...
    }
  }
}
```

## Use in templates
You can do this:
```html
<typeahead
  class="open"
  :query.sync="query"
  @on-query="getInfoData"
  @on-select="selectInfoData"
  :min="2"
  :debounce="400">
    <a><span v-html="(item.info1 + ' : ' +  item.info2) | highlight query"></span></a>
</typeahead>
```
> You must specify the `on-query` and `on-select` events.

## Attributes

**query:** The query string.

**min** The minimum characters before quering the server

**debounce** Milisseconds before quering the server

## Events

**on-query:** This is called when data is needed, here you can perform your fetch logic.

**on-select:** Is triggered when the user hits on an item.

## License
VueJs Typeahead is released under the MIT Licence. See the bundled LICENSE file for details.
