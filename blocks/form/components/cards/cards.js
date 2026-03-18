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

export default function decorate(element, fieldJson, container, formId) {
  element.classList.add('card');
  createCard(element, fieldJson.enum);

  subscribe(element, formId, (fieldDiv, fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;

      payload?.changes?.forEach((change) => {
        if (change?.propertyName === 'enum') {
          createCard(element, change.currentValue);
        }
      });
    });

    element.addEventListener('change', (e) => {
      e.stopPropagation();
      const idx = parseInt(e.target.dataset.index, 10);
      console.log('fieldModel.enum', fieldModel.enum);
      const enumEntry = fieldModel.enum?.[idx];
      const submissionValue = typeof enumEntry === 'object' ? enumEntry.value : enumEntry;
      fieldModel.value = submissionValue;
    });
  });

  return element;
}
