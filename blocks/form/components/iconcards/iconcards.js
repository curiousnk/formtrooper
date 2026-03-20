/**
 * Custom iconcards component
 * Based on: Radio Group
 */
import { createOptimizedPicture } from '../../../../scripts/aem.js';
import { subscribe } from '../../rules/index.js';

/** Default images by option order (red, green). Enum `image` overrides. */
const DEFAULT_CARD_IMAGES = ['/icons/individual.png', '/icons/business.png'];

function defaultCardImage(index) {
  return DEFAULT_CARD_IMAGES[index % DEFAULT_CARD_IMAGES.length] || DEFAULT_CARD_IMAGES[0];
}

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

    // Attach index to input element for later reference
    radioWrapper.querySelector('input').dataset.index = index;

    const imageSrc = enums[index]?.image || defaultCardImage(index);
    const image = createOptimizedPicture(imageSrc, 'card-image');

    radioWrapper.appendChild(image);
  });
}

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 *     Refer to the documentation for its structure for each component.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent element of the field.
 * @param {string} formId - The unique identifier of the form.
 */
export default async function decorate(fieldDiv, fieldJson, parentElement, formId) {
  fieldDiv.classList.add('iconcards');
  createCard(fieldDiv, fieldJson.enum);

  subscribe(fieldDiv, formId, (_fieldDiv,fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;
      payload?.changes?.forEach((change) => {
        if (change?.propertyName === 'enum') {
          createCard(fieldDiv, change.currentValue);
        }
      });
    });

    fieldDiv.addEventListener('change', (e) => {
      e.stopPropagation();
      const idx = parseInt(e.target.dataset.index, 10);
      const enumEntry = fieldModel.enum?.[idx];
      const submissionValue = typeof enumEntry === 'object' ? enumEntry.value : enumEntry;
      fieldModel.value = submissionValue;
    });
  });

  return fieldDiv;
}
