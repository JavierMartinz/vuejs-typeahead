if (typeof require === 'function') {
  var Vue = require('vue');
}

/* Usage Example

<typeahead query="{{newAppointment.client.name}}" src="api/v1/clientes" on-hit="{{selectUtenteHit}}" limit="20" min="2" prepare-data="{{selectTransformUtenteData}}" inline-template debounce="400" class="open">
  <typeahead-input class="form-control"></typeahead-input>
  <ul class="dropdown-menu" v-show="show">
      <li v-repeat="items" v-class="active: isActive($index)" v-on="mousedown: hit, mousemove: setActive($index)">
        <a>
          <span v-html="name"></span>
          <span v-html="contact"></span>
        </a>
      </li>
  </ul>
</typeahead>

*/

export default {
  replace : false, // importent so I can attach a click event listener
  props: {
    data: {
      type: Object
    },
    min: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    },
    onHit: {
      type: Function,
      required: true
    },
    prepareData: {
      type: Function
    },
    src: {
      type: String,
      required: true
    },
    query :{
      type : null,
    },
    debounce : {
      type : Number,
      default : 0
    }
  },
  attached : function() {
    this.$el.addEventListener('click', this.clickRoot);
  },
  beforeDestroy : function() {
    this.$el.removeEventListener('click', this.clickRoot);
  },

  data: function () {
    return {
      items: [],
      //query: '',
      current: -1,
      loading: false,
      show: false,
      error : false
    };
  },

  components: {
    typeaheadInput: {
      inherit: true,
      template: `
        <input type="search" autocomplete="off" v-model="query"
          v-on="
            input: update | debounce debounce,
            keydown: down|key \'down\',
            keydown: up|key \'up\',
            keydown: hit|key \'enter\',
            keydown: hit|key \'tab\',
            keydown: onReset|key \'esc\',
            focus : focus
          "
        />`
    }
  },
  watch : {
    show : function (v, o) {
      if (this.show) {
          window.document.addEventListener('click', this.outSideClickEvent);
      } else {
          window.document.removeEventListener('click', this.outSideClickEvent);
      }
    }
  },
  computed: {
    hasItems: function () {
      return this.items.length > 0;
    },

    isEmpty: function () {
      return !this.query && !this.loading;
    },

    isDirty: function () {
      return !!this.query && !this.loading;
    }
  },
  methods: {
    update: function () {
      if (!this.query) {
        this.onReset();
        return;
      }

      if (this.query && this.query.length <= this.min)
        return;

      this.loading = true;

      this.$http.get(this.src, Object.assign({q:this.query}, this.data))
        .success(function (data) {
          this.error = false;
          if (this.query) {
            this.loading = false;
            data = this.prepareData ? this.prepareData(data) : data;
            if (Array.isArray(data)){
              this.current = -1;
              this.items = !!this.limit ? data.slice(0, this.limit) : data;
              this.show = (data.length > 0);
            }
          }
        }.bind(this))
        .error(function(){
            this.onReset();
            this.error = true;
        }.bind(this));
    },

    onReset: function() {
      this.reset();
      this.onHit(null);
    },

    reset: function () {
      //this.query = '';
      this.items = [];
      this.loading = false;
      this.show = false;
    },

    setActive: function (index) {
      this.current = index;
    },

    isActive: function (index) {
      return this.current == index;
    },

    focus: function(e){
      if (this.items.length > 0)
        this.show = true;
    },

    hit: function (e) {
      if (this.current < 0){
        this.reset();
        return;
      }
      if (this.show)
        e.preventDefault();
      var resp = this.onHit(this.items[this.current]);
      this.show = false;
      if (resp === false){
        this.reset();
      }
    },

    up: function (e) {
      if (this.show)
        e.preventDefault();
      if (this.current > 0) this.current--;
    },

    down: function (e) {
      if (this.show)
        e.preventDefault();
      if (this.current < this.items.length-1) this.current++;
    },

    clickRoot : function(e){
      if (this.show)
        e.stopPropagation();
    },

    outSideClickEvent : function(event) {
      this.show = false;
    }

  }
};