<template>
    <div>
        <b-form-input type="text" 
            v-model="search"
            @input="onChange"
            v-on:keyup.enter="bringIt()"
        />
        <ul v-show="isOpen" class="autocomplete-results">
            <li v-for="(result,i) in results" :key="i"
                @click="setResult(result)"
                v-on:keyup.enter="setResult(result)"
                class="autocomplete-result">
                {{ result }}
            </li>
        </ul>
        </div>
</template>

<script>
    export default {
        name: "Autocomplete",
        props: {
            items: {
                type: Array,
                required: false,
                default: () => [],
            },
        },
        data() {
            return {
                search: '',
                results: [],
                isOpen: false,
            };
        },
        methods: {
            onChange() {
                this.isOpen = true;
                this.filterResults();
            },
            filterResults() {
                if (this.search == ""){
                    this.isOpen = false;
                }
                else {
                    this.isOpen = true;
                }
                this.results = this.items.filter(item => item.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
            },
            setResult(result) {
                this.search = result;
                this.isOpen = false;
            },
            bringIt(){
                let currGene = this.search;
                this.$emit("finished", currGene);
            }
        },
  }
</script>

<style scoped>
  /* .autocomplete {
    position: relative;
    width: 130px;
  } */

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }
</style>