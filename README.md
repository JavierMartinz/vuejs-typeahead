# Simple VueJs Typeahead

## Install
```shell
npm install vuejs-typeahead
```

## Usage
```js
import typeahead from 'vuejs-typeahead';

export default {
  data(){
    return {
      items : [],
      selected : null
    };
  },
  components : {
    typeahead
  },
  methods : {
    getInfoData(query){
      this.$http.get('api/search', {q : query}).then(
        ({data})=>{
          this.items = data; // data expected to be an array
        },
        (err)=>{
          this.items = []
        }
      );
    },
    selectInfoData(selectedObj, selectedIdx){
      this.selected = selectedObj;
      //this.selected = this.items[selectedIdx];
    }
  }
}
```

## In templates
You can do this:
```html
<typeahead
  class="dropdown open"
  placeholder="Enter query here"
  :items="items"
  :query="query"
  @on-query="getInfoData"
  @on-select="selectInfoData"
  :min="2"
  :debounce="400">
    <a><span v-html="(item.info1 + ' : ' +  item.info2) | highlight query"></span></a>
</typeahead>
```
> You must specify the `on-query` and `on-select` events.

> Elements and variables are in component scope.

> highlight filter is used to highlight the matched string in each li

## Attributes

**query:** The query string.

**min** The minimum characters before firing on-select

**debounce** Milisseconds before firing on-select

## Events

**on-query:** This is called when data is needed.

**on-select:** Triggered when the user hits on an item.

## Notes
There are breaking changes from version 1.1.x to 1.2.x, the callback from on-query was removed, and the item attribute is required.

## License
VueJs Typeahead is released under the MIT Licence. See the bundled LICENSE file for details.
