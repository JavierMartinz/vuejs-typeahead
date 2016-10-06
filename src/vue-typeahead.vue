<template>
  <input class="form-control"
      type="search"
      autocomplete="off"
      v-model="query"
      :placeholder="placeholder"
      v-el:main-input
      @input="update | debounce debounce"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.tab="hit"
      @keydown.esc="onReset"
      @focus="focus"
  />
  <ul class="dropdown-menu" v-show="show && hasItems">
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
      required : true
    },
    debounce : {
      type : Number,
      default : 0
    },
    items: {
      type: Array,
      required : true
    },
    placeholder: {
      required : false
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
      current: -1,
      loading: false,
      show: false,
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
    },
    items(){
      this.current = -1;
      if (this.loading)
        this.loading = false;
      // Ensures that only opens the dropdown if input has focus
      if (window.document.activeElement == this.$els.mainInput){
        this.show = true;
      }
    }
  },
  computed: {
    hasItems() {
      return Array.isArray(this.items) && this.items.length > 0
    },

    isEmpty() {
      return !this.query && !this.loading;
    },

    isDirty() {
      return !!this.query && !this.loading;
    },
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

      this.$dispatch('on-query', this.query);
    },

    onReset: function() {
      this.reset();
      this.$dispatch('on-select', null, -1);
    },

    reset: function () {
      this.loading = false;
      this.show = false;
      this.current = -1;
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
      if (this.hasItems && this.current >= 0)
        e.preventDefault();

      this.$dispatch('on-select', this.items[this.current], this.current);
      this.reset();
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
      if (typeof value == 'string' && phrase && phrase.length > 0){
        phrase = phrase.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        phrase = phrase.replace(/\s+/g, '|');
        return value.replace(new RegExp('('+phrase+')', 'gi'), '<strong>$1</strong>')
      }else{
        return value;
      }
    }
  }
};
</script>
