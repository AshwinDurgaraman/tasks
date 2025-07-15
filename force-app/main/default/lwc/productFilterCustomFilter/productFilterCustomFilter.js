import { LightningElement, api, track } from 'lwc';

import getCustomFilter from "@salesforce/apex/ECommerceProductListContainerController.getCustomFilter";
import getAvailableCustomFilterOptions from "@salesforce/apex/ECommerceProductListContainerController.getAvailableCustomFilterOptions";

export default class ProductFilterCustomFilter extends LightningElement {
    @api families;
    @api filterData;

    @track isLoading = false;

    _filterData;

    _availableData = [];

    searchTerm;
    values = [];

    get avaliableData(){
        return this._availableData;
    }

    get enableSearchBoxInput(){
        return this._filterData?.enableSearchBox;
    }

    get hasHelpText(){
        return this._filterData?.help.length > 0;
    }

    connectedCallback(){
        if(this.filterData){
            this._getCustomFilter();
        }
    }

    _getCustomFilter(){
        this.isLoading = true;

        getCustomFilter({recordId: this.filterData.customFilterId})
        .then(result => {
            this._filterData = result;
            this._getAvailableCustomFilterOptions();
        })
        .catch(error=>{
            this.isLoading = false;
            console.error('ProductFilterCustomFilter error', error.errorMessage, error.stack);
        })
    }

    _getAvailableCustomFilterOptions(){
        getAvailableCustomFilterOptions({
            recordId: this.filterData.customFilterId
        })
        .then(results=>{
            this._availableData = results; // testdscsdcs
        })
        .catch(error=>{
            console.error('ProductFilterCustomFilter error', error.errorMessage, error.stack);
        })
        .finally(()=>{
            this.isLoading = false;
        })
    }

    _dispatchEvent(){
        const custEvent = new CustomEvent('customfilterchange', {
            detail: {
                filterData: this.filterData,
                values: this.values,
                searchTerm: this.searchTerm
            }
        });

        this.dispatchEvent(custEvent);
    }

    handleChangeSearchTerm(event){
        this.searchTerm = event.target.value;

        this._dispatchEvent();
    }

    handleChange(){
        let checboxes = this.template.querySelectorAll('[data-type="customFilter"]');

        this.values = [];
        if(checboxes){
            for(const checkbox of checboxes){
                if(checkbox.checked){
                    this.values = [
                        ...this.values,
                        checkbox.value
                    ]
                }
            }
        }

        this._dispatchEvent();
    }
}