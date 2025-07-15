import { LightningElement, api, track } from 'lwc';

import getCustomFilters from '@salesforce/apex/ECommerceProductListContainerController.getCustomFilters';

export default class ProductFilterCustomFilters extends LightningElement {
    @api families;

    @track customFilters = [];

    customFiltersValues = [];

    connectedCallback(){
        this._getCustomFilters();
    }

    _getCustomFilters(){
        getCustomFilters({
            families: this.families
        })
        .then(results=>{
            this.customFilters = results;
        })
        .catch(error=>{
            console.error('ProductFilterCustomFilters _getCustomFilters error', error.errorMessage, error.stack);
        })
    }

    handleFilterChange(event){
        try{
            const filterData = event.detail.filterData;
            const indexOfFilter = this.customFiltersValues.findIndex(x => x.customFilterId == filterData.customFilterId);

            if(indexOfFilter >= 0){
                this.customFiltersValues[indexOfFilter].values = event.detail.values;
                this.customFiltersValues[indexOfFilter].searchTerm = event.detail.searchTerm;
            }else{
                this.customFiltersValues = [
                    ...this.customFiltersValues,
                    {
                        customFilterId: filterData.customFilterId,
                        values: event.detail.values,
                        searchTerm: event.detail.searchTerm
                    }
                ]
            }

            const custEvent = new CustomEvent('customfilterschange', {
                detail: this.customFiltersValues
            });

            this.dispatchEvent(custEvent);
        }catch(error){
            console.error('ProductFilterCustomFilters handleFilterChange error', error.errorMessage, error.stack);
        }
    }
}
// cdsvcfdvdfvfdf
// dddscdsc