(function($, Vue){
  'use strict';

  /* global Vue
   */

  /* Example Data node
   * `window.gridData` is an array of objects of the following structure
   * {
   *  "title": "See how 3 top ten lenders achieved average portfolio increases up to 25%",
   *  "imagePath": "../../images/articles/related/TU_RelatedArticle_03.jpg",
   *  "description": "Aliquip feugiat in eos, suscipit corrumpit in pro. Nam vocent animal in, mucius officiis recteque ex sit, ad sed iudicabit expetendis constituam.",
   *  "url": "#",
   *  "industries": [
   *    "government",
   *    "capitalMarkets"
   *  ],
   *  "categories": [
   *    "customerCreditReporting",
   *    "identityVerification&Authentication"
   *  ],
   *  "topics": [
   *    "topic5",
   *    "topic6"
   *  ],
   *  "type": "infographic",
   *  "authors": [
   *    {
   *      "name": "Elaine Benes",
   *      "highlight": true
   *    },
   *    {
   *      "name": "George Costanza",
   *      "highlight": false
   *    }
   *  ]
   *  }
   */

  /* Filter Configuration
   * Any number of filters can be applied to the grid
   * An Array of config objects in the following format
   * are assigned to `window.gridFilters`.
   * {
   *   type: "topics",
   *   filters: [
   *     {title: 'Topic 1', type: 'topic1'},
   *     {title: 'Topic 2', type: 'topic2'},
   *     {title: 'Topic 3', type: 'topic3'}
   *   ]
   * }
   * 
   * `type` must match the property on a grid item to filter on
   * `filters`:
   *    `title` for display
   *    `type` property to match
   */

  $(document).ready(function() {

    // Each page's grid should have a unique ID
    // so filter info can be stored
    var gridId;
    // Check if a grid is on page
    if( $('.grid-filter__container').length > 0 ) {
      gridId = $('.grid-filter__container')[0].id;
    }


    if(gridId && window.gridData && window.gridFilters) {
      initGrid(gridId, window.gridData, window.gridFilters);
    }

    if( $('#past-event-grid') && window.eventData && window.eventFilters) {
      initGrid('past-event-grid', window.eventData, window.eventFilters);
    }

  });

  /* Setup Vue Instance
   * @param {string} el Selector for Vue Instance
   * @param {Array<object>} data JSON data for component
   * @param {Array<object>} filters configuration for the filters
   */
  function initGrid(el, data, filters) {


    var defaultType = {title: 'All', type: 'all'};

    // Convert categories to array and sort by title
    //var topics = byAlpha( topicTypes, 'title' );
    //var ind = byAlpha( indTypes, 'title' );
    //var cats = byAlpha( catTypes, 'title' );

    // For passing filters to component
    var groups = {};

    // Currently selected filter for each groups
    // is stored in sessionStorage
    var storedFilters = Storage.get(el) || {};
    
    for (var i = 0; i < filters.length; i++) {
      // Set All filter at beginning of list
      //filters[i].filters.unshift(defaultType);

      groups[filters[i].type] = filters[i].filters;
      
      // If no stored filter set it to default
      if (!storedFilters[ filters[i].type ]) {
        storedFilters[ filters[i].type ] = defaultType.type;
      }
    }

    // eslint-disable-next-line no-unused-vars
    var filterGrid = new GridComponent({
      el: "#" + el,
      data: {
        defaultFilter: {title: 'All', type: 'all'},
        filterGroups: groups,
        // Copy for mobile
        //mobile: JSON.parse( JSON.stringify( groups )), 
        gridItems: data,
        filters: storedFilters,
      }
    });
  }

  var GridComponent = Vue.extend({
    props: ['moreCount'],
    data: function(){
      return {
        count: 9,
        countMax: 9,
        countAvailable: 0,
        // default for mobile select v-model
        mobile: {},
      }
    },
    methods: {
      /* Dispatched from filter-nav-item on select
       * @param {string} filterId subType property from list provided to nav-items
       */
      handleFilter: function(filterItem) {
        if (this.filters.hasOwnProperty(filterItem.type) && filterItem.type !== 'subfilter') {
          // Set the property from the nav on the corresponding filter property
          this.countMax = this.count;
          this.$set(this.mobile, filterItem.type, filterItem.value );
          this.$set(this.filters, filterItem.type, filterItem.value );
          this.checkForSubfilters();
        }

        if(filterItem.type === 'subfilter') {
          this.$set(this.filters, 'subfilter', filterItem.value );
          this.$set(this.mobile, 'subfilter', filterItem.value );
        } 
      },

      /* Turn on subfilters if needed
       * @param {string} type - Property on filter object, ex 'industries'
       * @param {string} val - Value of filter, ex 'Health Care'
       */
      checkForSubfilters: function() {

        /* See if only 1 filter is set and
         * set that items subfilters as
         * the components subfilter property
         * in filterGroups
         */
        var setCount = 0;
        var singleFilterType = null;
        var singleFilterValue = null;
        for(var f in this.filters) {
          if(this.filters[f] !== 'all' && f !== 'subfilter') {
            // filter is set
            setCount++;
            // ex industry, category
            singleFilterType = f;
            // ex auto, lending, healthcare
            singleFilterValue = this.filters[f];
          }
        }

        // If one filter is set show subfilters
        if( setCount === 1 ) {
          // Get the specific filter config
          var singleFilter = this.filterGroups[singleFilterType]
                                 .filter(function(item) {
                                   return item.type === singleFilterValue;
                                 })[0];
          if (singleFilter) {
            //singleFilter.subfilters.unshift({title: 'All', type: 'all'});
            this.$set(this.filters, 'subfilter', 'all');
            this.$set(this.mobile, 'subfilter', 'all');
            this.$set(this.filterGroups, 'subfilter', singleFilter.subfilters );              
          }
        } else {
          this.$delete(this.filterGroups, 'subfilter');
        }
      },

      /* Handle event from mobile select
       * @param {string} key - industries, categories, subfilter, etc
       * @param {object} event - Vue change event
       */
      selectChange: function(key, event) {
        this.handleFilter({type: key, value: this.mobile[key]});
      },

      /* Get all "type" properties of an object filter group
       * or return group if a string based group
       */
      typeForFilter: function(filterGroup) {
        return filterGroup.map(function(item){
          /* ex, {title: 'Topic 1', type: 'topic1', subfilters: []}
           */
          return (typeof item === 'string') ? item : item.type;
        });
      },

      handleLoadMore: function(count) {
        if(count === 'all') {
          count = this.gridItems.length;
        }
        this.countMax += Number(count) || this.count;
      }

    },
    watch: {
      filters: {
        handler: function(newFilter) {
          //console.log('save filter:', newFilter);
          Storage.set(this.$options.el, newFilter);
        },
        deep: true
      }
    },
    computed: {
      filteredGridItems: function() {

       /* Set Filters
        *
        */

        /* See if only 1 filter is set and
         * set that items subfilters as
         * the components subfilter property
         * in filterGroups
         */
        var setCount = 0;
        var singleFilterType = null;
        var singleFilterValue = null;
        for(var f in this.filters) {
          if(this.filters[f] !== 'all' && f !== 'subfilter') {
            // filter is set
            setCount++
            // ex industry, category
            singleFilterType = f;
            // ex auto, lending, healthcare
            singleFilterValue = this.filters[f];
          }
        }

        // If one filter is set show subfilters
        if( setCount === 1 && !this.filterGroups.subfilter ) {
          // Get the specific filter config
          var singleFilter = this.filterGroups[singleFilterType]
                                 .filter(function(item) {
                                   return item.type === singleFilterValue;
                                 })[0];
          if (singleFilter) {
            //singleFilter.subfilters.unshift({title: 'All', type: 'all'});
            // TODO: This is where persisting a subtopic would happen
            this.$set(this.filters, 'subfilter', 'all');
            this.$set(this.mobile, 'subfilter', 'all');
            this.$set(this.filterGroups, 'subfilter', singleFilter.subfilters );              
          }
        }



       /* Filter Items
        *
        */ 


        var that = this;
        this.countAvailable = 0;
        return this.gridItems.filter(function(item){
          var setFilters = 0;
          var hasMatches = 0;
          var currentMatch;

          for(var f in that.filters) {


            /* If filter value is not default or a subfilter,
             * increase required match count.
             */
            if(that.filters[f] !== 'all' && f !== 'subfilter') {
              setFilters++;
            }
            
            /* Item should have a property to match 
             * filter type, like topics
             */
            if( setFilters > 0 && f !== 'subfilter'){

              // Is this item an array?
              if(item[f].length) {
                /* item is each item in the grid contains properties for filtering on,
                 * likely industries or categories.Those propertie contain an array of
                 * strings or an array of objects. typeForFilter returns either as an 
                 * array of strings for comparing
                 */
                var filterGroup = that.typeForFilter( item[f] );
                
                /* Check if the current items properties to filter on,
                 * match the current filter in the loop.
                 * If so increment that there is a match.
                 * Assign the filter that matches so its subfilters
                 * can be searched on
                 */
                if( filterGroup.indexOf( that.filters[f] ) > -1 ) {
                  hasMatches++;
                  currentMatch = item[f].filter(function(k){
                    return k.type === that.filters[f];
                  })[0];
                }
              } else {
                // Its an object with type and title, like content Type
                if(item[f].type === that.filters[f]) {
                  hasMatches++;
                }
              }
              
            }
          }

          if( setFilters === 1 && that.filters.subfilter !== 'all' && currentMatch ){
            setFilters++;
            var subfilters = that.typeForFilter( currentMatch.subfilters );
            if( subfilters.indexOf( that.filters.subfilter ) > -1 ) {
              hasMatches++;
            }
          }
          if ( setFilters === hasMatches ) {
            that.countAvailable ++;
          }

          return ( setFilters === hasMatches );
        }).slice(0, this.countMax);
      },
      showLoadMore: function() {
        if(this.countMax < this.countAvailable) {
          return true;
        } else {
          return false;
        }
      },

    }
  });
 /*
  var SubfilterGridComponent = GridComponent.extend({

  });*/
  /* List item for filter navigation
   */
  Vue.component('filter-nav-item', {
    /* @prop Object item {type: string, type: string}
     * @prop string active Currently selected filter t o set active state
     */
    props: ['item', 'active', 'type'],
    template: '<li class="filter-nav__item"> \
                <button v-bind:class="activeClass" v-on:click="filterClick" class="btn btn-filter"> \
                  {{ item.title }} \
                </button> \
              </li>',
    methods: {
      filterClick: function (event) {
        this.$emit('grid-filter', {type: this.type, value: this.item.type});
      }
    },
    computed: {
      /* Apply a class of  `active` if the selected filter is this's type
       */
      activeClass: function() {
        return { active: this.active === this.item.type };
      }
    }
  });

  Vue.component('filter-mobile-nav', {
    props: ['type', 'filter', 'filters', 'defaultoption'],
    data: function() {
      return {
        selectModel: null
      }
    },
    computed: {
      titleForValue: function() {
        var that = this;
        if(!this.selected || this.selected === this.defaultoption.type) {
          return this.defaultoption.title;
        }
        return this.filters.filter(function(item){
          return item.type === that.selected;
        }).map(function(item){
          return item.title;
        })[0]
      },
      selected: {
        get: function() {
          return this.selectModel || this.filter;
        },
        set: function(val) {
          this.selectModel = val;
        }
      }
    },
    methods: {
      selectChange: function() {
        this.$emit('mobile-filter', {type: this.type, value: this.selected});
      }
    },
    template: '<div class="filter-nav-mobile select-filter"> \
                 <select aria-label="select a category" v-model="selected" \
                         v-on:change="selectChange($event)"> \
                   <option v-bind:value="defaultoption.type"> \
                    {{ defaultoption.title }} \
                   </option> \
                   <option v-for="item in filters" \
                           :key="item.type" \
                           v-bind:value="item.type"> \
                           {{ item.title }} \
                   </option> \
                 </select> \
                 <div class="select-filter__label">{{ titleForValue }} <i class="fa tufa-caret-down"></i></div> \
               </div>'
  });
  /* An single cell in 1.1.1 Content grid
   * @prop {object} item - An single item from the source JSON
   * @prop {boolean} debug - Show item filter properties to verify filtering
   */
  Vue.component('grid-list-item', {
    props: ['item', 'debug'],
    template: '<li class="grid-list__item col-md-4 col-sm-6"> \
                  <div class="block-grid "> \
                    <a :href="item.url" class="link--block"> \
                      <div class="block-grid__media"> \
                        <img :src="item.imagePath" alt="Landscape Image" /> \
                      </div> <!-- block-grid__media --> \
                      <p class="block-grid__headline" v-html="item.title"></p> \
                    </a> \
                    <span class="block__meta ">{{ item.format.title }}</span> \
                    <grid-item-debug v-if="debug" v-bind:item="item"></grid-item-debug> \
                  </div><!-- end block-media --> \
               </li>'
  });
  
  Vue.component('grid-list-item-video', {
    props: ['item', 'debug'],
    template: '<li class="grid-list__item col-md-4 col-sm-6"> \
                  <div class="block-grid "> \
                    <a href="" class="link--block img-play" data-toggle="modal" v-bind:data-target="\'#\' + item.id"> \
                      <div class="block-grid__media"> \
                        <img :src="item.imagePath" alt="Landscape Image" /> \
                      </div> <!-- block-grid__media --> \
                    </a> \
					<p v-html="item.title"></p> \
					<div class="modal fade modal-xl" :id="item.id" tabindex="-1" role="dialog" aria-labelledby="hiringModal"> \
						<div class="modal-dialog" role="document"> \
							<div class="modal-content"> \
								<button type="button" class="close" data-dismiss="modal" aria-label="Close"> \
									<span aria-hidden="true"> \
										<i class="fa fa-times" aria-hidden="true"></i> \
									</span> \
								</button> \
								<div class="modal-body"> \
									<div class="responsive-iframe-wrapper"> \
										<iframe :src="item.url" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen \
											allowfullscreen></iframe> \
									</div> \
								</div> \
							</div> \
						</div> \
					</div> \
                    <grid-item-debug v-if="debug" v-bind:item="item"></grid-item-debug> \
                  </div><!-- end block-media --> \
               </li>'
  });

  Vue.component('grid-list-item-video-single', {
    props: ['item', 'debug'],
    template: '<li class="grid-list__item col-xs-12 col-sm-12 col-md-8"> \
                  <div class="block-grid row"> \
                    <a href="" class="link--block img-play" data-toggle="modal" v-bind:data-target="\'#\' + item.id"> \
                      <div class="block-grid__media col-sm-6"> \
                        <img :src="item.imagePath" alt="Landscape Image" /> \
                      </div> <!-- block-grid__media --> \
					</a> \
					  <div class="col-sm-6"> \
                        <h4 v-html="item.title"></h4> \
                        <p v-html="item.description"></p> \
					<div class="modal fade modal-xl" :id="item.id" tabindex="-1" role="dialog" aria-labelledby="hiringModal"> \
						<div class="modal-dialog" role="document"> \
							<div class="modal-content"> \
								<button type="button" class="close" data-dismiss="modal" aria-label="Close"> \
									<span aria-hidden="true"> \
										<i class="fa fa-times" aria-hidden="true"></i> \
									</span> \
								</button> \
								<div class="modal-body"> \
									<div class="responsive-iframe-wrapper"> \
										<iframe :src="item.url" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen \
											allowfullscreen></iframe> \
									</div> \
								</div> \
							</div> \
						</div> \
					</div> \
                    <grid-item-debug v-if="debug" v-bind:item="item"></grid-item-debug> \
                      </div> \
                  </div><!-- end block-media --> \
               </li>'
  });
  
  Vue.component('grid-list-item-single', {
    props: ['item', 'debug'],
    template: '<li class="grid-list__item col-xs-12 col-sm-12 col-md-8"> \
                  <div class="block-grid row"> \
                    <a :href="item.url" class="link--block"> \
                      <div class="block-grid__media col-sm-6"> \
                        <img :src="item.imagePath" alt="Landscape Image" /> \
                      </div> <!-- block-grid__media --> \
                      <div class="col-sm-6"> \
                        <h4 v-html="item.title"></h4> \
                        <p class="block-grid__headline" v-html="item.description"></p> \
                        <span class="block__meta">{{ item.format.title }}</span> \
                        <grid-item-debug v-if="debug" v-bind:item="item"></grid-item-debug> \
                      </div> \
                    </a> \
                  </div><!-- end block-media --> \
               </li>'
  });

  Vue.component('grid-item-debug', {
    props: ['item'],
    methods: {
      tidy: function(title, list) {
        var out = '';
        if(list) {
          var out = title + '<br>';
          for(var i=0; i<list.length; i++) {
            out += "&nbsp;&nbsp;" + list[i].title + "<br>";
            if(list[i].subfilters) {
              for(var k=0; k<list[i].subfilters.length; k++) {
                out += "&nbsp;&nbsp;&nbsp;&nbsp;" + list[i].subfilters[k].title + "<br>";
              }
            }
          }
        }
        
        
        return out;
      }
    },
    template: '<div class="grid-item-debug"> \
                <i class="fa fa-cog"></i> \
                <ul class="list-unstyled"> \
                  <li v-html="tidy( \'categories\', item.categories )"></li> \
                  <li v-html="tidy( \'industries\', item.industries )"></li> \
                  <li v-html="tidy( \'topics\',     item.topics )"></li> \
                </ul> \
              </div>'
  });

  Vue.component('load-more-button', {
    props: ['count'],
    methods: {
      handleLoadMore: function() {
        this.$emit('load-more', this.count);
      }
    },
    template: '<button class="btn btn-primary btn-primary--reverse" \
               v-on:click="handleLoadMore"><slot></slot> \
               </button>'
  });


  /*------------------------------------*\
    #Event Grid
  \*------------------------------------*/
  Vue.component('event-card', {
    props: ['item', 'debug'],
    template: '<div class="grid-event-card"> \
                <span class="grid-event-card__date">{{ item.date }}</span> \
                <div class="grid-event-card__header"> \
                  <template v-if="item.imagePath"> \
                    <img class="grid-event-card__logo" :src="item.imagePath" /> \
                  </template> \
                  <template v-else> \
                    <h4 class="grid-event-card__title"> \
                      {{ item.title }} \
                    </h4> \
                  </template> \
                </div> <!-- /header --> \
                <div class="grid-event-card__body"> \
                  <p class="grid-event-card__sub-title"> \
                    {{ item.subtitle }} \
                  </p> \
                  <p class="grid-event-card__desc"> \
                    {{ item.description }} \
                  </p> \
                </div> \
                <template v-if="item.action"> \
                  <div class="grid-event-card__footer"> \
                    <a :href="item.action.url" class="btn btn-action">{{ item.action.text }}</a> \
                  </div> \
                </template> \
              </div>'
  });


  /*------------------------------------*\
    #HELPER FUNCTIONS 
  \*------------------------------------*/

  /* Get the values from object and return as array
   * @param {Object} obj An Object literal
   * @returns {Array} Each objects value
   */
  function toArray(obj) { // eslint-disable-line no-unused-vars
    var arr = [];
    for(var o in obj) {
      arr.push(obj[o]);
    }

    return arr;
  }

  /* Filter and array of objects alphabetically by key
   * @param {array} arr Array of objects of same type
   * @param {string} prop Key for property on each object to compare
   * @return {array} Sorted array
   */
  function byAlpha(arr, prop) {
    return arr.sort(function(a, b){
      var A = a[prop].toUpperCase();
      var B = b[prop].toUpperCase();

      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      // titles must be equal
      return 0;
    });
  }

  /* Wrapper for sessionStorage
   */
  var Storage = {
    set: function (key, data) {
      sessionStorage.setItem(key, JSON.stringify( data ) );
    },
    get: function (key) {
      return JSON.parse( sessionStorage.getItem(key) );
    }
  };


})(jQuery, Vue);

// open in new window 

document.addEventListener("DOMContentLoaded", function() {
  var anchors = document.querySelectorAll('.block-grid a');
  for (i in anchors){
    var url = anchors[i].getAttribute("href");
    if ( url.startsWith('http')){
      anchors[i].setAttribute('target', '_blank');
    }
  }
});
