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

'use strict';

/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/

/**
 * Create assets for the demo 
 * @param {net.nus.com.cs6203.setups.SetupDemo} setupDemo
 * @transaction
 */
function setupDemo(setupDemo) {
    var factory = getFactory();
    var NS = 'net.nus.com.cs6203';

    var persons = [
        factory.newResource(NS, 'Person', 'PERSON_1'),
        factory.newResource(NS, 'Person', 'PERSON_2')
    ];
    persons[0].firstName = "Nicolas";
    persons[0].lastName = "D";
    persons[1].firstName = "Soufiane";
    persons[1].lastName = "E;"

    var landTitles = [
        factory.newResource(NS, 'LandTitle', 'LAND_1')
    ];
    landTitles[0].owner = persons[0];
    landTitles[0].information = "Nic's first property";


    return getParticipantRegistry(NS + '.Person')
  .then(function(personRegistry) {
      return personRegistry.addAll(persons);
  })
  .then(function() {
      return getAssetRegistry(NS + '.LandTitle');
  })
  .then(function(landRegistry) {
      return landRegistry.addAll(landTitles);
  });
}

/**
 * Create assets for the demo 
 * @param {net.nus.com.cs6203.setups.RemoveAll} remove all assets and participants
 * @transaction
 */
function removeAll() {
    var NS = 'net.nus.com.cs6203';
    
    return getParticipantRegistry(NS + '.Person')
    .then(function(registry) {
        return registry.getAll()
        .then(function(allEntries) {
            registry.removeAll(allEntries)
        });
    })
    .then(function() {
        return getAssetRegistry(NS + '.LandTitle');
    })
    .then(function(registry) {
        return registry.getAll()
        .then(function(allEntries) {
            registry.removeAll(allEntries)
        });
    })
    .then(function() {
        return getAssetRegistry(NS + '.SalesAgreement');
    })
    .then(function(registry) {
        return registry.getAll()
        .then(function(allEntries) {
            registry.removeAll(allEntries)
        });
    });
}

/*eslint-enable no-unused-vars*/
/*eslint-enable no-undef*/
