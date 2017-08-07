<template>
    <div class="typeahead" @click="clickRoot">
        <input
            class="form-control"
            type="search"
            autocomplete="off"
            v-model="query"
            :placeholder="placeholder"
            ref="mainInput"
            @input="update"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.tab="hit"
            @keydown.esc="onReset"
            @focus="focus"
        />
        <ul class="dropdown-menu" v-show="show && hasItems">
            <li
                v-for="(item, index) in items"
                :class="{'active': isActive(index)}"
                @mousedown="hit"
                @mousemove="setActive(index)"
            >
                <component :is="templateComp" :item="item"></component>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            min: { type: Number, default: 0 },
            debounce: { type: Number, default: 0 },
            items: { type: Array, required: true },
            placeholder: {},
            onQuery: { type: Function, required: true },
            onSelect: { type: Function, required: true },
            template: { type: String }
        },

        data() {
            return {
                current: -1,
                loading: false,
                show: false,
                query: null
            };
        },
        watch: {
            show() {
                if (this.show) {
                    window.document.addEventListener('click', this.outSideClickEvent);
                } else {
                    window.document.removeEventListener('click', this.outSideClickEvent);
                }
            },
            items() {
                this.current = -1;
                if (this.loading)
                    this.loading = false;
                // Ensures that only opens the dropdown if input has focus
                if (window.document.activeElement === this.$refs.mainInput) {
                    this.show = true;
                }
            }
        },
        computed: {
            templateComp () {
                return {
                    template: typeof this.template === 'string' ? this.template : '<a><span v-html="item"></span></a>',
                    props: { item: { default: null } }
                }
            },

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
            update() {
                if (!this.query) {
                    this.onReset();
                    return;
                }

                if (this.query && this.query.length <= this.min) {
                    return;
                }

                this.loading = true;
                _.debounce(this.onQuery, this.debounce)(this.query)
            },

            onReset() {
                this.reset();
                this.onSelect(null, -1);
            },

            reset() {
                this.query = null;
                this.loading = false;
                this.show = false;
                this.current = -1;
            },

            setActive(index) {
                this.current = index;
            },

            isActive(index) {
                return this.current === index;
            },

            focus(e) {
                if (this.items.length > 0) {
                    this.show = true;
                }
            },

            hit(e) {
                if (this.current < 0) {
                    this.reset();
                    return;
                }
                if (this.hasItems && this.current >= 0) {
                    e.preventDefault();
                }

                this.onSelect(this.items[this.current], this.current);
                this.reset();
            },

            up(e) {
                if (this.show)
                    e.preventDefault();
                if (this.current > 0) this.current--;
            },

            down(e) {
                if (this.show)
                    e.preventDefault();
                if (this.current < this.items.length - 1) this.current++;
            },

            clickRoot(e) {
                if (this.show)
                    e.stopPropagation();
            },

            outSideClickEvent() {
                this.show = false;
            }

        },
        filters: {
            highlight(value, phrase) {
                if (typeof value === 'string' && phrase && phrase.length > 0) {
                    phrase = phrase.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    phrase = phrase.replace(/\s+/g, '|');
                    return value.replace(new RegExp('(' + phrase + ')', 'gi'), '<strong>$1</strong>')
                } else {
                    return value;
                }
            }
        }
    };
</script>
