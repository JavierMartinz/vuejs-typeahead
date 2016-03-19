<template>
  <input class="form-control" type="search" autocomplete="off" v-model="query"
      @input="update | debounce debounce"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.tab="hit"
      @keydown.esc="onReset"
      @focus="focus"
  />
  <ul class="dropdown-menu" v-show="show">
      <li v-for="(index, item) in items" :class="{'active': isActive(index)}" @mousedown="hit" @mousemove="setActive(index)" >
        <partial :name="templateName"></partial>
      </li>
  </ul>
</template>

<script>
export default {
  replace : false, // false : importent so I can attach a click event listener
  partials: {
     'default': '<a><span v-html="item | highlight query"></span></a>',
  },
  props: {
    min: {
      type: Number,
      default: 0
    },
    query :{
      type : null,
    },
    debounce : {
      type : Number,
      default : 0
    }
  },
  init(){
    this.$options.partials.alternative = this.$options.el.innerHTML.trim();
  },
  ready(){
    if (this.$options.partials.alternative){
      this.templateName = 'alternative'; // this.$el.localName
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
      current: -1,
      loading: false,
      show: false,
      error : false,
      templateName : 'default'
    };
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

      this.$dispatch('on-query', this.query, (data)=>{
        if (!data){
          this.onReset();
          this.error = true;
        } else {
          this.error = false;
          if (this.query) {
            this.loading = false;
            if (Array.isArray(data)){
              this.current = -1;
              this.items = data;
              this.show = (data.length > 0);
            }
          }
        }
      });
    },

    onReset: function() {
      this.reset();
      this.$dispatch('on-select', null);
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
      var resp = this.$dispatch('on-select', this.items[this.current]);
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

  },
  filters: {
    highlight(value, phrase) {
      if (typeof value == 'string')
        return value.replace(new RegExp('('+phrase+')', 'gi'), '<strong>$1</strong>')
      else
        return value;
    }
  }
};
</script>
