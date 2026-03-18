import { subscribe } from '../../rules/index.js';
import { createOptimizedPicture } from '../../../../scripts/aem.js';

/**
 * Custom cards component
 * Based on: Radio Group
 */

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 *   Refer to the documentation for its structure for each component.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent element of the field.
 * @param {string} formId - The unique identifier of the form.
 */


function createCard(element, enums) {
  element.querySelectorAll('.radio-wrapper').forEach((radioWrapper, index) => {
    if (enums[index]?.name) {
      let label = radioWrapper.querySelector('label');

      if (!label) {
        label = document.createElement('label');
        radioWrapper.appendChild(label);
      }

      label.textContent = enums[index]?.name;
    }

    const image = createOptimizedPicture(
      enums[index]?.image || 'https://main--afb--jalagari.hlx.page/lab/images/card.png',
      'card-image'
    );

    radioWrapper.appendChild(image);
  });
}

export default async function decorate(fieldDiv, fieldJson, parentElement, formId) {
  console.log('⚙️ Decorating cards component:', fieldDiv, fieldJson, parentElement, formId);

  // TODO: Implement your custom component logic here
  // You can access the field properties via fieldJson.properties

  subscribe(fieldDiv, formId, (el, fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;

      payload?.changes?.forEach((change) => {
        // console.log('🔄 Value changed:', change.currentValue);
        // if (change.currentValue === '0') {
        //   console.log('🔄 Item 1');
        // } else if (change.currentValue === '1') {
        //   console.log('🔄 Item 2');
        // }
        if (change?.propertyName === 'enum') {
          createCard(element, change.currentValue);
        }
      });
    });
  
    element.addEventListener('change', (e) => {
      e.stopPropagation();
      const value = fieldModel.enum?.[parseInt(e.target.dataset.index, 10)];
      fieldModel.value = value.name;
    });
  });

  return fieldDiv;
}
