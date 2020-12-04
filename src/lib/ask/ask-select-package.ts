import getPackages from '../helpers/get-packages';
import { isEmpty } from '../helpers/utils';
import askSelectMultiple from './ask-select-multiple';
import askSelect from './ask-select';

/**
 * Asks user to select one or more packages from the list of packages that match the filter argument.
 * @param filter Filter string or filter directive
 * @param sid The device serial id
 */
const askSelectPackage = async (filter: string, sid?: string): Promise<string[]> => {
  const packages = await getPackages(filter, sid);
  let pkgs: string[] = [];
  if (!isEmpty(packages)) {
    if (packages.length > 1) {
      // Select multiple
      pkgs = await askSelectMultiple('package', 'Select package', packages);
    } else {
      // Select single
      pkgs.push(await askSelect('package', 'Select package', packages));
    }
  }
  return pkgs;
};

export default askSelectPackage;
