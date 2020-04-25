<template>
    <div>
        <b-row>
            <b-col cols="10">
                <b-form-input type="text" 
                    v-model="search"
                    placeholder="Type a gene name and press Enter"
                    @input="onChange"
                    @keydown.down="onArrowDown"
                    @keydown.up="onArrowUp"
                    @keydown.enter="onEnter"
                    
                />
                <ul v-show="isOpen" class="autocomplete-results">
                    <li v-for="(result,i) in results" :key="i"
                        @click="setResult(result)"
                        v-on:keyup.enter="setResult(result)"
                        class="autocomplete-result"
                        :class="{'is-active': i===arrowCounter}">
                        {{ result }}
                    </li>
                </ul>
            </b-col>
            <b-col>
                <b-button @click="callParentForChart" variant="outline-primary">
                    Plot
                </b-button>
            </b-col>
        </b-row>

        <br>
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
                arrowCounter: -1,
                isOpen: false,
            };
        },
        methods: {
            onArrowDown(){
                if (this.arrowCounter < this.results.length) {
                    this.arrowCounter += 1
                }
            },
            onArrowUp(){
                if (this.arrowCounter > 0) {
                    this.arrowCounter -= 1
                }
            },
            onEnter(){
                if (this.search.includes(",")){
                        let commaloc = this.search.lastIndexOf(",")
                        this.search = this.search.slice(0,commaloc+1) 
                                     + this.results[this.arrowCounter]
                }
                else {
                    this.search = this.results[this.arrowCounter];
                }
                this.isOpen = false;
                this.arrowCounter = -1;
            }, 
            onChange() {
                this.isOpen = true;
                this.filterResults();
            },
            filterResults() {
                if (this.search == "" || this.search == ","){
                    this.isOpen = false;
                }
                else {
                    this.isOpen = true;
                }

                let currSearch = this.extractGene();
                if (currSearch != '') {
                    this.results = this.items
                    .filter(item => item.toLowerCase()
                    .indexOf(currSearch.toLowerCase()) > -1);
                }
            },
            extractGene(){
                //if (this.search.includes(",")){
                // if (/^([a-za-z0-9]{3,},[a-za-z0-9]{1,})$/.test(this.search)){
                //    let currvalue = this.search.slice(this.search.indexof(",")+1,);
                //    return currvalue;
                // }
                if (this.search.includes(",")){
                   let commaloc = this.search.lastIndexOf(",")
                   let currValue = this.search.slice(commaloc+1,);
                   return currValue;
                }
                else {
                   return this.search;
                }
            },
            setResult(result) {
                if (this.search.includes(",")){
                    let commaloc = this.search.lastIndexOf(",")
                    this.search = this.search.slice(0,commaloc+1) + result
                }
                else {
                    this.search = result;
                }
                this.isOpen = false;
            },
            callParentForChart(){
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

  .autocomplete-result:hover, .is-active{
    background-color: #4AAE9B;
    color: white;
  }
</style>