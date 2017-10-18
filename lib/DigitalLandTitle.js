/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry */
/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/

'use strict';
/**
 * Register a property for sale
 * @param {net.nus.com.cs6203.RegisterPropertyForSale} propertyForSale the property to be sold
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onRegisterPropertyForSale(params) {
    console.log('### onRegisterPropertyForSale ' + params.toString());    
    params.title.forSale = true;
    params.title.price = params.price;

    return getAssetRegistry('net.nus.com.cs6203.LandTitle').then(function(result) {
        return result.update(params.title);
    }
    );
}


/**
 * Creates a salesagreement between the buyer and the owner
 * @param {net.nus.com.cs6203.BuyProperty} BuyProperty create a sale agreement between the property owner and the buyer
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onBuyProperty(params) {
    console.log('### onBuyProperty ' + params.toString());
    var factory = getFactory();    
    var NS = 'net.nus.com.cs6203';    
    
    var salesAgreement = factory.newResource(NS, 'SalesAgreement', 'AGREEMENT_'+params.title.titleId.split('_')[1]);//Here we assume one property cannot have multiple sales agreements (whichc is not always true for property splitting) TODO : fix
    salesAgreement.buyer = params.buyer;
    salesAgreement.seller = params.title.owner;
    salesAgreement.title = params.title;
    salesAgreement.price = params.title.price;
    

    return getAssetRegistry('net.nus.com.cs6203.SalesAgreement').then(function(result) {
        return result.add(salesAgreement);
    }
    );
}


/**
 * Process the sale agreement and changes the owner of the property
 * @param {net.nus.com.cs6203.ValidateSaleAgreement} ValidateSaleAgreement
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onValidateSalesAgreement(params) {
    console.log('### onValidateSaleAgreement ' + params.toString());
    params.agreement.title.owner = params.agreement.buyer;
    params.agreement.title.forSale = false;
    params.agreement.title.price = 0;

    return getAssetRegistry('net.nus.com.cs6203.LandTitle')
    .then(function(result) {
        return result.update(params.agreement.title)
    })
    .then(function() {
        return getAssetRegistry('net.nus.com.cs6203..SalesAgreement');
    })
    .then(function(result) {
        return result.remove(params.agreement);
    });
}
