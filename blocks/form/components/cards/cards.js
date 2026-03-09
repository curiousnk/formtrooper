import { subscribe } from '../../rules/index.js';

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
export default async function decorate(fieldDiv, fieldJson, parentElement, formId) {
  console.log('⚙️ Decorating cards component:', fieldDiv, fieldJson, parentElement, formId);

  // TODO: Implement your custom component logic here
  // You can access the field properties via fieldJson.properties

  subscribe(fieldDiv, formId, (el, fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;

      payload?.changes?.forEach((change) => {
         console.log('🔄 Enum changed:', change.currentValue);
         if (change.currentValue === '0') {
          console.log('🔄 Item 1');
         } else if (change.currentValue === '1') {
          console.log('🔄 Item 2');
         }
      });
    });
  });

  return fieldDiv;
}
