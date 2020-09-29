import type {
  OptionTypeBase,
  OptionsList,
} from './types';

export const reduceGroupedOptions = <OptionType extends OptionTypeBase>(
  prevOptions: OptionsList<OptionType>,
  loadedOptions: OptionsList<OptionType>,
): OptionsList<OptionType> => {
  const res = prevOptions.slice();

  const mapLabelToIndex = {};
  let prevOptionsIndex = 0;
  const prevOptionsLength = prevOptions.length;

  loadedOptions.forEach((group) => {
    const {
      label,
    } = group;

    let groupIndex = mapLabelToIndex[label];
    if (typeof groupIndex !== 'number') {
      for (;
        prevOptionsIndex < prevOptionsLength && typeof mapLabelToIndex[label] !== 'number';
        ++prevOptionsIndex
      ) {
        const prevGroup = prevOptions[prevOptionsIndex];
        mapLabelToIndex[prevGroup.label as string] = prevOptionsIndex;
      }

      groupIndex = mapLabelToIndex[label];
    }

    if (typeof groupIndex !== 'number') {
      mapLabelToIndex[label] = res.length;
      res.push(group);
      return;
    }

    res[groupIndex] = {
      ...res[groupIndex],
      options: res[groupIndex].options.concat(group.options),
    };
  });

  return res;
};
