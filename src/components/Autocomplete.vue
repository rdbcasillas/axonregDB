<template>
    <div>
        <b-row>
            <b-col cols="10">
                <b-form-input type="text" 
                    v-model="search"
                    :placeholder="getPlaceholder(type)" 
                    @input="onChange"
                    @keydown.down="onArrowDown"
                    @keydown.up="onArrowUp"
                    @keydown.enter="onEnter"
                    autocomplete="off"
                />
                <ul v-show="isOpen" class="autocomplete-results">
                    <li v-for="(result,i) in results" :key="i"
                        @click="setResult(result)"
                        v-on:keyup.enter="setResult(result); "
                        class="autocomplete-result"
                        :class="{'is-active': i===arrowCounter}">
                        {{ result }}
                    </li>
                </ul>
                <button v-if="type=='multiple'" type="button" 
                class="btn btn-link try" 
                style="font-size:16px"
                @click="callParentForTest">Try an example</button>
            </b-col>
            <b-col>
                <b-button :disabled="buttonstate" @click="callParentForChart" variant="primary">
                    Plot
                </b-button>
            </b-col>
        </b-row>
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
            type: {
                type: String,
                default: () => ''
            },
            buttonstate: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                search: '',
                results: [],
                arrowCounter: -1,
                isOpen: false,
                testGenes: "Dcx,Tubb2b,Gap43"
            };
        },
        methods: {
            getPlaceholder(type){
                if (type=='multiple') {
                    return "Search for a gene or paste a comma separated list of genes (Eg: Dcx,Klf6)"
                }
                else if (type=='TF') {
                    return "Search for a Transcription Factor (Eg: FOXA1)"
                }
                else {
                    return "Search for a gene (Eg: Klf6)"
                }
            },
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
                    this.search = this.search.replace(/\s+/g, '');
                    let commaloc = this.search.lastIndexOf(",")
                    if (this.results[this.arrowCounter]) {
                        this.search = this.search.slice(0,commaloc+1) 
                                    + this.results[this.arrowCounter]
                    }
                    else {
                        this.search = this.search.slice(0,commaloc+1) 
                                    + this.capitalFirstLetter(this.search.slice(commaloc+1,));
                    }
                }
                else {
                    console.log(this.search)
                    if (this.results[this.arrowCounter]) {
                        this.search = this.results[this.arrowCounter];
                    }
                    else {
                        this.search = this.capitalFirstLetter(this.search);
                    }
                }
                this.isOpen = false;
                this.arrowCounter = -1;
                this.callParentForChart();
            }, 
            onChange() {
                this.isOpen = true;
                this.filterResults();
            },
            capitalFirstLetter(genename) {
                return genename.charAt(0).toUpperCase() + genename.slice(1);
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
                console.log(currGene, typeof(currGene))
                this.$emit("finished", currGene);
            },
            callParentForTest(){
                this.$emit("finished", this.testGenes);
            },
            checkClickOutside(evt){
                if (!this.$el.contains(evt.target)) {
                    this.isOpen = false;
                    this.arrowCounter = -1;
                }
            }
        },
        mounted(){
            document.addEventListener('click', this.checkClickOutside)
        }
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
  .try {
      float: left;
      font-size: 13px;
  }
</style>