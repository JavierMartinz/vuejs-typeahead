# VueJs Typeahead

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
    prepareDataFn(server){
      return server.data;
    },
    selectedFn(selected){
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
  src="api/search"
  :on-hit="selectedFn"
  :limit="20"
  :min="2"
  :prepare-data="prepareDataFn"
  :debounce="400">
    <a><span v-html="(item.info1 + ' : ' +  item.info2) | highlight query"></span></a>
</typeahead>
```
> You must specify the `src` and `on-hit` attributes

## Attributes

**src:** The source url.

**on-hit:** The callback function which is triggered when the user hits on an item.

**query:** The query string.

**data** The data that would be send by request.

**limit:** Limit the number of items which is shown at the list.

**prepare-data** The callback function which is triggered when the response data are received.

**min** The minimum characters before quering the server

**debounce** Milisseconds before quering the server

## License
VueJs Typeahead is released under the MIT Licence. See the bundled LICENSE file for details.
