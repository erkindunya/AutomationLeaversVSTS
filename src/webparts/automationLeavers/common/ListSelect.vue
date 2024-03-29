<template>
<div>
    <vue-select :label="label"
                :class="mainClass"
                :filterable="!lazyLoad"
                :searchable="true"
                :options="items"
                v-bind:value="value"
                v-on:input="$emit('input', $event)"
                @search="searchList"
                :filter-by="filterList"
                :multiple="multiple"
                :disabled="disabled"
                >
        <template slot="no-options">
            <div @mousedown.stop="">
                {{noOptionsText}}
            </div>
        </template>
        <template slot="option" slot-scope="option">
            <slot name="option" v-bind="option">{{option[label]}}</slot>
        </template>
    </vue-select>
</div>
</template>
<style scoped></style>
<script lang="ts">
import Vue from 'vue';
import { sp } from '@pnp/sp';
import { VueSelect } from 'vue-select';
import { debounce } from 'lodash';

export default Vue.extend({
    name: 'list-select',
    props: {
        value: {
            type: Object
        },
        class: {
            type: String,
            default: ''
        },
        label: {
            default: 'Title',
            type: String
        },
        listName: {
            type: String
        },
        isRootLevel: {
            type: Boolean,
            default: false
        },
        lazyLoad: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        noOptionsText: {
            default: 'Begin typing to search..',
            type: String
        },
    },
    data: () => ({
        items: <any[]>[],
        spWeb: {
            type: Object
        }
    }),
    computed: {
        mainClass() {
            return this.class || {};
        }
    },
    methods: {
        searchList: debounce(function (search, loading) {
            this.spWeb = this.isRootLevel ? sp.site.rootWeb : sp.web;
            if(this.lazyLoad) {
                loading(true);
                this.spWeb.lists.getByTitle(this.listName).items.filter(`substringof('${encodeURI(search)}',${this.label})`).get().then((items: any[]) => {
                    this.items = items;
                    loading(false);
                });
            }
        }, 1000),
        filterList (option, label, search) {
            if(typeof option === 'object') {
                for (var key in option) {
                    var value = option[key];

                    if(typeof value === 'string' && value.toLowerCase().indexOf(search.toLowerCase()) > -1)
                        return true;
                }
                return false;
            } else {
                return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1;
            }
        }
    },
    created() {
        this.spWeb = this.isRootLevel ? sp.site.rootWeb : sp.web;
        if(!this.lazyLoad) {
            this.spWeb.lists.getByTitle(this.listName).items.top(2000).get().then((items: any[]) => {
                this.items = items;
            });
        }
    },
    components: {
        VueSelect
    }
});
</script>